function npupNoticeToggle() {
    const btn = document.getElementsByClassName('notice_toggle_btn')[0];

    btn.style.userSelect = 'none';

    const btn_text = btn.children[0];

    if (btn_text.textContent.includes('더보기')) {
        setNoticeBtn('더보기', '접기', 'down', 'up', '');
    }
    else {
        setNoticeBtn('접기', '더보기', 'up', 'down', 'none');
    }

    function setNoticeBtn(re_tar, re_con, re_tar2, re_con2, display) {
        btn_text.innerHTML = btn_text.innerHTML.replace(re_tar, re_con).replace(re_tar2, re_con2);
        btn.parentElement.querySelectorAll('tr.ep_style4').forEach((e, n) => {
            if (n > 2) e.style.display = display;
        }); 
    }
}

let npup_notice_tot_hei = 0;

function npupNoticeToggleLong() {
    if (!npup_notice_tot_hei)
        document.querySelectorAll('.notice_table > tbody > tr.ep_style4').forEach((e, n) => {
            if (n > 2) npup_notice_tot_hei += e.offsetHeight;
        }); 

    window.scrollBy({ top: -npup_notice_tot_hei });

    npupNoticeToggle();
}