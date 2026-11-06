import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    TransformWrapper,
    TransformComponent,
    useTransformComponent,
} from 'react-zoom-pan-pinch';
import { Minus, Move, Plus } from 'lucide-react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 2.5;
const CARD_WIDTH = 280;
const CARD_HEIGHT = 240;
const DEFAULT_COLS = 4;
const COL_WIDTH = 340;
const ROW_HEIGHT = 300;
const PADDING = 48;

function defaultPosition(index) {
    const col = index % DEFAULT_COLS;
    const row = Math.floor(index / DEFAULT_COLS);
    return {
        x: col * COL_WIDTH + PADDING,
        y: row * ROW_HEIGHT + PADDING,
    };
}

/**
 * Ensures the dropped card is accessible and does not totally bury an existing card.
 */
function ensureAccessiblePosition(candidate, otherPositions) {
    let x = Math.max(16, candidate.x);
    let y = Math.max(16, candidate.y);

    const isDirectlyStacked = Object.values(otherPositions).some((pos) => {
        if (!pos) return false;
        return Math.abs(pos.x - x) < 50 && Math.abs(pos.y - y) < 50;
    });

    if (isDirectlyStacked) {
        x += 60;
        y += 60;
    }

    return { x: Math.round(x), y: Math.round(y) };
}

export default function ResourceCanvas({
    items = [],
    renderCard,
    emptyState,
    workspaceId,
    onCardClick,
}) {
    const transformRef = useRef(null);
    const [activeDragId, setActiveDragId] = useState(null);

    const [positions, setPositions] = useState(() => {
        if (!workspaceId || typeof window === 'undefined') return {};
        try {
            return (
                JSON.parse(
                    window.localStorage.getItem(
                        `cadence:positions:v2:${workspaceId}`,
                    ),
                ) || {}
            );
        } catch {
            return {};
        }
    });

    const cardDragRef = useRef(null);
    const suppressClickRef = useRef(false);

    // Prevent iOS Safari page-level zoom gestures
    useEffect(() => {
        const preventSafariGesture = (e) => {
            e.preventDefault();
        };

        window.addEventListener('gesturestart', preventSafariGesture, {
            passive: false,
        });
        window.addEventListener('gesturechange', preventSafariGesture, {
            passive: false,
        });
        window.addEventListener('gestureend', preventSafariGesture, {
            passive: false,
        });

        return () => {
            window.removeEventListener('gesturestart', preventSafariGesture);
            window.removeEventListener('gesturechange', preventSafariGesture);
            window.removeEventListener('gestureend', preventSafariGesture);
        };
    }, []);

    const persistPositions = useCallback(
        (newPositions) => {
            if (!workspaceId || typeof window === 'undefined') return;
            try {
                window.localStorage.setItem(
                    `cadence:positions:v2:${workspaceId}`,
                    JSON.stringify(newPositions),
                );
            } catch {
                // Ignore quota errors
            }
        },
        [workspaceId],
    );

    // Reset when switching workspace
    useEffect(() => {
        if (transformRef.current) {
            transformRef.current.resetTransform(0);
        }

        if (!workspaceId || typeof window === 'undefined') {
            setPositions({});
            return;
        }

        try {
            const saved =
                JSON.parse(
                    window.localStorage.getItem(
                        `cadence:positions:v2:${workspaceId}`,
                    ),
                ) || {};
            setPositions(saved);
        } catch {
            setPositions({});
        }
    }, [workspaceId]);

    // Ensure all items have a valid initial position
    useEffect(() => {
        if (!items || items.length === 0) return;

        setPositions((prev) => {
            let changed = false;
            const next = { ...prev };

            items.forEach((item, index) => {
                if (!next[item.id]) {
                    let slot = index;
                    while (
                        Object.entries(next).some(([id, pos]) => {
                            if (!pos || id === item.id) return false;
                            const candidate = defaultPosition(slot);
                            return (
                                Math.abs(pos.x - candidate.x) < 200 &&
                                Math.abs(pos.y - candidate.y) < 200
                            );
                        })
                    ) {
                        slot += 1;
                    }
                    next[item.id] = defaultPosition(slot);
                    changed = true;
                }
            });

            if (changed) {
                persistPositions(next);
            }
            return changed ? next : prev;
        });
    }, [items, persistPositions]);

    // Card drag handlers (works smoothly at any zoom level using clientToContent)
    const handleCardPointerDown = (itemId, index, e) => {
        if (e.button !== 0) return;
        if (
            e.target.closest(
                'button, a, input, textarea, select, [data-no-card-drag]',
            )
        ) {
            return;
        }

        // If multi-touch gesture is starting, do not initiate card drag
        if (
            e.pointerType === 'touch' &&
            (e.nativeEvent?.touches?.length || 0) > 1
        ) {
            return;
        }

        if (!transformRef.current) return;
        const contentPoint = transformRef.current.clientToContent(
            e.clientX,
            e.clientY,
        );
        const itemPos = positions[itemId] || defaultPosition(index);

        const grabOffsetX = contentPoint.x - itemPos.x;
        const grabOffsetY = contentPoint.y - itemPos.y;

        cardDragRef.current = {
            itemId,
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            grabOffsetX,
            grabOffsetY,
            startPos: { ...itemPos },
            hasMoved: false,
        };

        try {
            e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
            // Ignore capture error
        }
    };

    const handleCardPointerMove = (itemId, e) => {
        const drag = cardDragRef.current;
        if (!drag || drag.pointerId !== e.pointerId || drag.itemId !== itemId)
            return;

        // Cancel card drag if multiple touches appear (e.g. user began pinch)
        if (
            e.pointerType === 'touch' &&
            (e.nativeEvent?.touches?.length || 0) > 1
        ) {
            cardDragRef.current = null;
            setActiveDragId(null);
            return;
        }

        const dist = Math.hypot(
            e.clientX - drag.startX,
            e.clientY - drag.startY,
        );
        if (!drag.hasMoved) {
            if (dist > 4) {
                drag.hasMoved = true;
                setActiveDragId(itemId);
            } else {
                return;
            }
        }

        if (!transformRef.current) return;
        const contentPoint = transformRef.current.clientToContent(
            e.clientX,
            e.clientY,
        );

        const newX = Math.max(16, contentPoint.x - drag.grabOffsetX);
        const newY = Math.max(16, contentPoint.y - drag.grabOffsetY);

        setPositions((prev) => ({
            ...prev,
            [itemId]: { x: Math.round(newX), y: Math.round(newY) },
        }));
    };

    const handleCardPointerUp = (itemId, e) => {
        const drag = cardDragRef.current;
        if (!drag || drag.pointerId !== e.pointerId || drag.itemId !== itemId)
            return;

        try {
            if (e.currentTarget.hasPointerCapture?.(e.pointerId)) {
                e.currentTarget.releasePointerCapture(e.pointerId);
            }
        } catch {
            // Ignore
        }

        if (drag.hasMoved) {
            suppressClickRef.current = true;
            setTimeout(() => {
                suppressClickRef.current = false;
            }, 150);

            setPositions((prev) => {
                const currentPos = prev[itemId] || drag.startPos;
                const otherPositions = { ...prev };
                delete otherPositions[itemId];
                const accessiblePos = ensureAccessiblePosition(
                    currentPos,
                    otherPositions,
                );
                const next = { ...prev, [itemId]: accessiblePos };
                persistPositions(next);
                return next;
            });
        }

        cardDragRef.current = null;
        setActiveDragId(null);
    };

    const handleCardClick = (item, e) => {
        if (suppressClickRef.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (e.target.closest('button, a, input, textarea, select')) {
            return;
        }
        if (onCardClick) {
            onCardClick(item);
        }
    };

    // Calculate dynamic canvas bounds so dragged cards don't clip
    const contentWidth = Math.max(
        2000,
        ...Object.values(positions).map((p) => (p?.x || 0) + CARD_WIDTH + 200),
    );
    const contentHeight = Math.max(
        1400,
        ...Object.values(positions).map((p) => (p?.y || 0) + CARD_HEIGHT + 200),
    );

    if (items.length === 0) {
        return <div className="h-full w-full">{emptyState}</div>;
    }

    return (
        <div
            className="relative h-full min-h-0 w-full select-none overflow-hidden"
            style={{ touchAction: 'none', overscrollBehavior: 'none' }}
        >
            <TransformWrapper
                ref={transformRef}
                initialScale={1}
                minScale={MIN_ZOOM}
                maxScale={MAX_ZOOM}
                limitToBounds={false}
                centerOnInit={false}
                smooth={false}
                panning={{
                    disabled: false,
                    velocityDisabled: true,
                    excluded: [
                        'card-draggable',
                        'button',
                        'a',
                        'input',
                        'textarea',
                        'select',
                    ],
                }}
                pinch={{
                    disabled: false,
                    step: 5,
                }}
                wheel={{
                    step: 0.1,
                }}
                doubleClick={{
                    disabled: true,
                }}
            >
                {({ zoomIn, zoomOut }) => (
                    <>
                        <TransformComponent
                            wrapperClass="!w-full !h-full relative overflow-hidden"
                            contentClass="relative"
                            wrapperStyle={{
                                width: '100%',
                                height: '100%',
                                overflow: 'hidden',
                                touchAction: 'none',
                            }}
                            contentStyle={{
                                width: `${contentWidth}px`,
                                height: `${contentHeight}px`,
                                position: 'relative',
                                touchAction: 'none',
                            }}
                        >
                            {items.map((item, index) => {
                                const pos =
                                    positions[item.id] ||
                                    defaultPosition(index);
                                const isDragging = activeDragId === item.id;

                                return (
                                    <div
                                        key={item.id}
                                        data-card
                                        data-card-id={item.id}
                                        className={`card-draggable absolute select-none transition-shadow duration-150 ${
                                            isDragging
                                                ? 'z-50 scale-[1.02] cursor-grabbing shadow-2xl'
                                                : 'z-10 cursor-grab hover:shadow-md'
                                        }`}
                                        style={{
                                            left: `${pos.x}px`,
                                            top: `${pos.y}px`,
                                            width: `${CARD_WIDTH}px`,
                                            touchAction: 'none',
                                            userSelect: 'none',
                                            WebkitUserSelect: 'none',
                                        }}
                                        onPointerDown={(e) =>
                                            handleCardPointerDown(
                                                item.id,
                                                index,
                                                e,
                                            )
                                        }
                                        onPointerMove={(e) =>
                                            handleCardPointerMove(item.id, e)
                                        }
                                        onPointerUp={(e) =>
                                            handleCardPointerUp(item.id, e)
                                        }
                                        onPointerCancel={(e) =>
                                            handleCardPointerUp(item.id, e)
                                        }
                                        onClick={(e) =>
                                            handleCardClick(item, e)
                                        }
                                    >
                                        {renderCard(item)}
                                    </div>
                                );
                            })}
                        </TransformComponent>

                        <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} />
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}

function ZoomControls({ zoomIn, zoomOut }) {
    const scale = useTransformComponent(({ state }) => state.scale);
    const percentage = Math.round((scale || 1) * 100);

    return (
        <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 rounded-xl border border-[#D8DDD5] bg-white/95 p-2 shadow-lg backdrop-blur">
            <button
                type="button"
                onClick={() => zoomOut(0.15)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#73736C] hover:bg-[#F0F0E9] hover:text-[#762F50]"
                aria-label="Zoom out"
            >
                <Minus size={15} />
            </button>
            <span className="min-w-12 text-center text-xs font-bold text-[#30302D]">
                {percentage}%
            </span>
            <button
                type="button"
                onClick={() => zoomIn(0.15)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-[#73736C] hover:bg-[#F0F0E9] hover:text-[#762F50]"
                aria-label="Zoom in"
            >
                <Plus size={15} />
            </button>
            <span className="hidden items-center gap-2 rounded-lg bg-[#F7F7F2] px-3 py-2 text-[11px] text-[#73736C] sm:flex">
                <Move size={14} />
                Drag canvas to pan · Pinch to zoom
            </span>
        </div>
    );
}
