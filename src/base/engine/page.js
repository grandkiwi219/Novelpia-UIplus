// --- Page Engine ---
STRUCTURE.SYSTEM.ENGINE.name = '페이지';

STRUCTURE.SYSTEM.ENGINE.setAdditionalExecution(() => {
    // For Search System
    scriptInjection('src/base/file/pc-search.js');
});
