<?php

namespace App\Http\Controllers;

use App\Models\Session_File;
use App\Models\Study_Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Smalot\PdfParser\Parser as PdfParser;
use PhpOffice\PhpWord\IOFactory as WordFactory;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use PhpOffice\PhpPresentation\IOFactory as PresentationFactory;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use App\Services\OpenRouterService;
use App\Models\Session_Output;
use App\Jobs\ProcessStudySession;
use App\Models\Resource;

class SessionController extends Controller
{
    private function accessibleResource(?string $resourceId): ?Resource
    {
        if (!$resourceId) {
            return null;
        }

        $resource = Resource::findOrFail($resourceId);
        abort_unless($resource->status === 'active', 404);
        $hasAccess = $resource->clerk_id === Auth::user()->clerk_id
            || $resource->collaborators()
                ->where('users.clerk_id', Auth::user()->clerk_id)
                ->exists();

        abort_unless($hasAccess, 403, 'You do not have access to this workspace.');

        return $resource;
    }

    private function extractTextFromFile(UploadedFile $file): string
    {
        $extension = strtolower($file->getClientOriginalExtension());
        $path = $file->getRealPath();

        try {
            // 1. Plain Text Files (.txt)
            if ($extension === 'txt') {
                return file_get_contents($path) ?: '';
            }

            // 2. PDF Documents (.pdf)
            if ($extension === 'pdf') {
                $parser = new PdfParser();
                $pdf = $parser->parseFile($path);
                return $pdf->getText();
            }

            // 3. Word Documents (.docx)
            if ($extension === 'docx') {
                $phpWord = WordFactory::load($path);
                $extractedText = '';

                foreach ($phpWord->getSections() as $section) {
                    foreach ($section->getElements() as $element) {
                        // Extract text from standard paragraph elements
                        if (method_exists($element, 'getText')) {
                            $extractedText .= $element->getText() . " ";
                        }
                        // Extract text from nested elements (e.g., text runs, tables)
                        elseif (method_exists($element, 'getElements')) {
                            foreach ($element->getElements() as $childElement) {
                                if (method_exists($childElement, 'getText')) {
                                    $extractedText .= $childElement->getText() . " ";
                                }
                            }
                        }
                    }
                }

                return trim($extractedText);
            }
            // 4. PowerPoint Presentations (.pptx)
            if ($extension === 'pptx') {
                $presentation = PresentationFactory::load($path);
                $extractedText = '';

                // Iterate through every slide in the presentation
                foreach ($presentation->getAllSlides() as $slide) {
                    // Iterate through every shape/object on the slide
                    foreach ($slide->getShapeCollection() as $shape) {
                        // Check if the shape contains text paragraphs (e.g., text boxes, titles)
                        if (method_exists($shape, 'getParagraphs')) {
                            foreach ($shape->getParagraphs() as $paragraph) {
                                // Extract individual text runs within each paragraph
                                foreach ($paragraph->getRichTextElements() as $element) {
                                    $extractedText .= $element->getText() . " ";
                                }
                            }
                        }
                    }
                }

                return trim($extractedText);
            }
        } catch (\Exception $e) {
            // Log extraction errors without crashing session creation
            Log::error("Failed to extract text from file {$file->getClientOriginalName()}: " . $e->getMessage());
            return '';
        }

        return '';
    }


    public function studycreate(Request $request)
    {
        $incomingFields = $request->validate([
            'course_title' => 'required|string|max:255',
            'course_code' => 'nullable|string',
            'input_option' => 'required|in:text,file',
            'raw_notes' => 'nullable|string',
            'focus_prompt' => 'required|string',
            'resource_id' => 'nullable|uuid|exists:resources,id',
            // Update validation rule to allow pptx
            'file' => 'required_if:input_option,file|nullable|file|mimes:pdf,docx,txt,pptx|max:5120',
        ]);

        $incomingFields['clerk_id'] = Auth::user()->clerk_id;
        $resource = $this->accessibleResource($incomingFields['resource_id'] ?? null);

        $sessionData = Arr::except($incomingFields, ['file']);

        $session = DB::transaction(fn () => Study_Session::create($sessionData));

        $extractedText = '';

        if ($incomingFields['input_option'] === 'file' && $request->hasFile('file')) {
            $file = $request->file('file');

            $path = $file->store('sessions');

            $extractedText = $this->extractTextFromFile($file);

            $fileData = [
                'study_session_id' => $session->id,
                'file_name' => $file->getClientOriginalName(),
                'file_path' => $path,
                'file_type' => $file->getClientOriginalExtension(),
                'file_size' => $file->getSize(),
                'extracted_text' => $extractedText,
            ];

            Session_File::create($fileData);
        }
        $content = ($incomingFields['input_option'] === 'file') ? $extractedText : ($incomingFields['raw_notes'] ?? '');

        ProcessStudySession::dispatch($session, $content);

        // 7. Redirect to show page
        return redirect()->route('sessions.show', $session->id);
    }

    public function session_show($id)
    {
        $session = Study_Session::with([
            'sessionFile',
            'sessionOutput',
            'resource',
        ])->findOrFail($id);

        abort_unless($session->status === 'active', 404);
        abort_unless($session->clerk_id === Auth::user()->clerk_id, 403);
        $this->accessibleResource($session->resource_id);

        return Inertia::render('Sessions/SessionShow', compact('session'));
    }
}
