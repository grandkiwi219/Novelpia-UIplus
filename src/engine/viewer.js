// --- Viewer Engine ---
STRUCTURE.SYSTEM.ENGINE.name = '뷰어';

STRUCTURE.SYSTEM.ENGINE.setAdditionalExecution(() => {
    window.addEventListener("DOMContentLoaded", () => {
        // save last episode history
        scriptInjection('src/file/save-last-episode.js');
    });
});
