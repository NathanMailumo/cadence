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

    const handleCardPointerDown = (itemId, index, e) => {
        if (e.pointerType === 'mouse' && e.button !== 0) return;
        if (e.target.closest('button, input, textarea, select')) {
            return;
        }

        suppressClickRef.current = false;

        if (!transformRef.current) return;

        const contentPoint = transformRef.current.clientToContent(
            e.clientX,
            e.clientY,
        );
        const itemPos = positions[itemId] || defaultPosition(index);

        const grabOffsetX = contentPoint.x - itemPos.x;
        const grabOffsetY = contentPoint.y - itemPos.y;

        const dragInfo = {
            itemId,
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            grabOffsetX,
            grabOffsetY,
            startPos: { ...itemPos },
            isDragging: false,
        };

        cardDragRef.current = dragInfo;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handleCardPointerMove = (e) => {
        const dragInfo = cardDragRef.current;
        if (!dragInfo || e.pointerId !== dragInfo.pointerId) return;

        const distance = Math.hypot(
            e.clientX - dragInfo.startX,
            e.clientY - dragInfo.startY,
        );

        if (!dragInfo.isDragging) {
            if (distance < 6) return;

            dragInfo.isDragging = true;
            setActiveDragId(dragInfo.itemId);
            e.preventDefault();
        }

        if (!transformRef.current) return;

        const currentPoint = transformRef.current.clientToContent(
            e.clientX,
            e.clientY,
        );

        const newPosition = {
            x: Math.round(currentPoint.x - dragInfo.grabOffsetX),
            y: Math.round(currentPoint.y - dragInfo.grabOffsetY),
        };

        setPositions((prev) => ({
            ...prev,
            [dragInfo.itemId]: newPosition,
        }));
    };

    const finishCardPointer = (e, cancelled = false) => {
        const dragInfo = cardDragRef.current;
        if (!dragInfo || e.pointerId !== dragInfo.pointerId) return;

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        if (dragInfo.isDragging) {
            suppressClickRef.current = !cancelled;

            if (cancelled) {
                setPositions((prev) => ({
                    ...prev,
                    [dragInfo.itemId]: dragInfo.startPos,
                }));
            } else {
                setPositions((prev) => {
                    const next = {
                        ...prev,
                        [dragInfo.itemId]:
                            prev[dragInfo.itemId] || dragInfo.startPos,
                    };
                    persistPositions(next);
                    return next;
                });
            }
        }

        cardDragRef.current = null;
        setActiveDragId(null);
    };

    const handleCardClick = (item, e) => {
        if (suppressClickRef.current) {
            suppressClickRef.current = false;
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (e.target.closest('button, input, textarea, select')) {
            return;
        }
        if (onCardClick) {
            onCardClick(item);
        }
    };

    // Dynamic canvas bounds allowing wide movement anywhere across the workspace
    const allX = Object.values(positions).map((p) => p?.x || 0);
    const allY = Object.values(positions).map((p) => p?.y || 0);
    const maxX = allX.length > 0 ? Math.max(...allX) : 0;
    const maxY = allY.length > 0 ? Math.max(...allY) : 0;
    const contentWidth = Math.max(5000, maxX + CARD_WIDTH + 1000);
    const contentHeight = Math.max(4000, maxY + CARD_HEIGHT + 1000);

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
                                        onPointerMove={handleCardPointerMove}
                                        onPointerUp={finishCardPointer}
                                        onPointerCancel={(e) =>
                                            finishCardPointer(e, true)
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
