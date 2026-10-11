import React from 'react';
import CadenceMark from './CadenceMark';

export default function CadenceLogo({
    className = 'h-7',
    textClassName = 'text-xl',
    showText = true,
    ...props
}) {
    return (
        <div
            className={`inline-flex items-center gap-2.5 font-display select-none ${props.className || ''}`}
        >
            <CadenceMark className={className} />
            {showText && (
                <span
                    className={`font-extrabold tracking-tight text-[#762F50] ${textClassName}`}
                    style={{ fontFamily: '"Manrope", sans-serif' }}
                >
                    Cadence
                </span>
            )}
        </div>
    );
}
