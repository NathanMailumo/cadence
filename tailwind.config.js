import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    // darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['"DM Sans"', ...defaultTheme.fontFamily.sans],
                display: ['"Manrope"', ...defaultTheme.fontFamily.sans],
                heading: ['"Manrope"', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                cadence: {
                    mulberry: '#AD5266',
                    'mulberry-dark': '#762F50',
                    'mulberry-light': '#F8EDF1',
                    'mulberry-tint': '#FAF2F5',
                    sage: '#C5C9BE',
                    'sage-light': '#D8DDD5',
                    mineral: '#F0F0E9',
                    'mineral-light': '#F7F7F2',
                    slate: '#30302D',
                    'slate-muted': '#73736C',
                    'slate-subtle': '#8E9088',
                    border: '#D8D8D0',
                },
            },
        },
    },

    plugins: [forms],
};
