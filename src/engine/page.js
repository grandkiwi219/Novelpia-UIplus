// --- Page Engine ---
STRUCTURE.SYSTEM.ENGINE.name = '페이지';

STRUCTURE.SYSTEM.ENGINE.setAdditionalExecution(() => {
    // For Search System
    scriptInjection('/src/file/pc-search.js');
});
