import React, { useRef, useState } from 'react';
import { Minus, Move, Plus } from 'lucide-react';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 1.5;

function distance(first, second) {
    return Math.hypot(first.clientX - second.clientX, first.clientY - second.clientY);
}

export default function ResourceCanvas({ items, renderCard, emptyState }) {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const pointers = useRef(new Map());
    const drag = useRef(null);
    const pinch = useRef(null);

    const updateZoom = (value) => setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value)));

    const handlePointerDown = (event) => {
        if (event.target.closest('button, a, input, textarea, select')) {
            return;
        }

        event.currentTarget.setPointerCapture(event.pointerId);
        pointers.current.set(event.pointerId, event);

        if (pointers.current.size === 2) {
            const [first, second] = [...pointers.current.values()];
            pinch.current = { distance: distance(first, second), zoom };
            drag.current = null;
            return;
        }

        drag.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            panX: pan.x,
            panY: pan.y,
        };
    };

    const handlePointerMove = (event) => {
        if (!pointers.current.has(event.pointerId)) return;
        pointers.current.set(event.pointerId, event);

        if (pointers.current.size === 2 && pinch.current) {
            const [first, second] = [...pointers.current.values()];
            updateZoom(pinch.current.zoom * (distance(first, second) / pinch.current.distance));
            return;
        }

        if (!drag.current || drag.current.pointerId !== event.pointerId) return;
        setPan({
            x: drag.current.panX + event.clientX - drag.current.startX,
            y: drag.current.panY + event.clientY - drag.current.startY,
        });
    };

    const handlePointerUp = (event) => {
        pointers.current.delete(event.pointerId);
        if (pointers.current.size < 2) pinch.current = null;
        if (drag.current?.pointerId === event.pointerId) drag.current = null;
    };

    const handleWheel = (event) => {
        if (!event.ctrlKey) return;
        event.preventDefault();
        updateZoom(zoom - event.deltaY * 0.002);
    };

    return (
        <div
            className="relative h-full min-h-0 overflow-hidden touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onWheel={handleWheel}
        >
            {items.length === 0 ? (
                emptyState
            ) : (
                <div
                    className="absolute left-0 top-0 h-[1100px] w-[1600px] origin-top-left"
                    style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
                >
                    {items.map((item, index) => (
                        <div
                            key={item.id}
                            className="absolute w-[280px]"
                            style={{
                                top: `${(index * 140) % 560 + 48}px`,
                                left: `${(index * 260) % 1080 + 48}px`,
                            }}
                        >
                            {renderCard(item)}
                        </div>
                    ))}
                </div>
            )}

            <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 rounded-xl border border-[#D8DDD5] bg-white/95 p-2 shadow-lg backdrop-blur">
                <button type="button" onClick={() => updateZoom(zoom - 0.1)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#73736C] hover:bg-[#F0F0E9] hover:text-[#762F50]" aria-label="Zoom out">
                    <Minus size={15} />
                </button>
                <span className="min-w-12 text-center text-xs font-bold text-[#30302D]">{Math.round(zoom * 100)}%</span>
                <button type="button" onClick={() => updateZoom(zoom + 0.1)} className="flex h-8 w-8 items-center justify-center rounded-lg text-[#73736C] hover:bg-[#F0F0E9] hover:text-[#762F50]" aria-label="Zoom in">
                    <Plus size={15} />
                </button>
                <span className="hidden items-center gap-2 rounded-lg bg-[#F7F7F2] px-3 py-2 text-[11px] text-[#73736C] sm:flex">
                    <Move size={14} />
                    Drag canvas to pan · Pinch to zoom
                </span>
            </div>
        </div>
    );
}
