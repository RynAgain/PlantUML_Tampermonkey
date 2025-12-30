// PlantUML Helper - Utility Functions Module
// This module provides shared helper functions used across the application

(function() {
    'use strict';

    console.log('[PlantUML Helpers] Module loaded');

    // Make helper functions globally accessible for other modules
    window.PlantUMLHelpers = {
        escapeHtml: escapeHtml,
        unescapeHtml: unescapeHtml,
        copyToClipboard: copyToClipboard,
        makeDraggable: makeDraggable
    };

    /**
     * Escape HTML special characters to prevent XSS
     * @param {string} text - Text to escape
     * @returns {string} Escaped HTML
     */
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Unescape HTML entities back to text
     * @param {string} html - HTML to unescape
     * @returns {string} Unescaped text
     */
    function unescapeHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent;
    }

    /**
     * Copy text to clipboard using legacy execCommand
     * @param {string} text - Text to copy
     */
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    /**
     * Make an element draggable by a handle
     * @param {HTMLElement} element - Element to make draggable
     * @param {HTMLElement} handle - Handle element to drag by
     */
    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            element.style.top = (element.offsetTop - pos2) + "px";
            element.style.left = (element.offsetLeft - pos1) + "px";
            element.style.right = "auto";
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // Export for testing
    try {
        module.exports = { escapeHtml, unescapeHtml, copyToClipboard, makeDraggable };
    } catch (e) {
        // Browser environment - module.exports doesn't exist
    }
})();
