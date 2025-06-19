// --- Page Engine ---
STRUCTURE.SYSTEM.ENGINE.name = '페이지';

STRUCTURE.SYSTEM.ENGINE.setAdditionalExecution(() => {
    // For Search System
    window.addEventListener("DOMContentLoaded", () => {
        const searchForm = document.getElementById(`${project_prefix}search-form`);
        
        if (!searchForm) return;

        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            pc_search();
        });
    });

    // Novelpia Functions
    function pc_search() {
        let value = document.getElementById('search_input').value.replace(/[\/%?,]/g, '');

        location.href = '/search/all//1/'
            + encodeURIComponent(value)
            + '?page=1&rows=30&novel_type=&start_count_book=&end_count_book=&novel_age=&start_days=&sort_col=last_viewdate&novel_genre=&block_out=0&block_stop=0&is_contest=0&list_display=list';
    }
});
