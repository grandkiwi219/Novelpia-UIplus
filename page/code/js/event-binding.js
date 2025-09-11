// 세팅 셀렉터 스크립트
    // 세팅 셀럭터 창 열림
document.addEventListener('click', (event) => {
    document.querySelectorAll('.selector-value').forEach(r => {
        let is_click = r.contains(event.target);

        if (!is_click) return r.parentElement.classList.remove('selector-active');

        r.parentElement.classList.toggle('selector-active');
    }); 
});
