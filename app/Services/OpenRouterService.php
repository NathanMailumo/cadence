<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenRouterService
{
    protected string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.api_key');
        $this->model  = config('services.openrouter.model');
    }

    public function generateStudyNotes(string $focusPrompt, string $content): ?array
    {
        // Explicitly enforce double line-breaks, spacing, and structured layouts
        $systemPrompt = <<<EOT
You are Cadence, an elite AI study assistant. Produce high-yield, structured study notes.

FORMATTING RULES:
1. Always insert two full line breaks (\n\n) between every heading, paragraph, bullet list, and mathematical block to ensure clean vertical spacing.
2. Structure concepts into distinct segments:
   - Use Markdown headings (## Topic, ### Subtopic) for major transitions.
   - Keep paragraphs short (maximum 2-3 sentences per paragraph).
   - Never collapse ideas into wall-of-text blocks.
3. For lists and takeaways, use bullet points (-) with a space, and place each item on a new line.
4. Format mathematical equations using standard LaTeX ($...$ for inline math, $$...$$ on its own line for block math).
5. Focus directly on high-yield study notes, core explanations, key takeaways, and definitions. Be concise, direct, and efficient. Do NOT generate interactive flashcards, Q&A question-and-answer lists, or duplicate practice questions.
EOT;

        // Cap raw content length to prevent model context choking and timeouts
        $trimmedContent = mb_substr($content, 0, 15000);
        $userPrompt = "FOCUS AREA / USER INSTRUCTION:\n{$focusPrompt}\n\nSTUDY MATERIAL / CONTENT:\n{$trimmedContent}";

        $candidateModels = array_values(array_unique(array_filter([
            $this->model,
            'liquid/lfm-2.5-2.6b:free',
            'openrouter/free',
        ])));

        foreach ($candidateModels as $model) {
            try {
                $response = Http::withHeaders([
                    'Authorization' => "Bearer {$this->apiKey}",
                    'Content-Type'  => 'application/json',
                    'HTTP-Referer'  => config('app.url', 'http://localhost'),
                    'X-Title'       => 'Cadence',
                ])
                    ->connectTimeout(10)
                    ->timeout(60)
                    ->post('https://openrouter.ai/api/v1/chat/completions', [
                        'model'       => $model,
                        'messages'    => [
                            [
                                'role'    => 'system',
                                'content' => $systemPrompt,
                            ],
                            [
                                'role'    => 'user',
                                'content' => $userPrompt,
                            ],
                        ],
                        'temperature' => 0.3,
                        'max_tokens'  => 2048,
                    ]);

                if ($response->successful()) {
                    $data = $response->json();
                    $responseText = trim($data['choices'][0]['message']['content'] ?? '');
                    $tokenCount   = $data['usage']['total_tokens'] ?? 0;

                    if (!empty($responseText)) {
                        return [
                            'content'       => $responseText,
                            'model_used'    => $data['model'] ?? $model,
                            'prompt_tokens' => $tokenCount,
                        ];
                    }
                }

                Log::warning("OpenRouter model {$model} returned unsuccessful status ({$response->status()}): " . substr($response->body(), 0, 200));
            } catch (\Exception $e) {
                Log::warning("OpenRouter model {$model} failed: " . $e->getMessage());
            }
        }

        Log::error("All OpenRouter candidate models failed.");
        return null;
    }
}
