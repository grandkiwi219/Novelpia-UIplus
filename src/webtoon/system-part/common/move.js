const moveCa = npup.options.move.options;


moveCa['move-base'].system = keyMappingBase(r => {
    location.href = '//novelpia.com/';
});

moveCa['move-books'].system = keyMappingBase(r => {
    location.href = '//book.novelpia.com/';
});

moveCa['move-webtoon'].system = keyMappingBase(r => {
    if (confirm('주의) 웹툰으로 이동하시겠습니까?'))
        location.href = '//toptoon.novelpia.com/';
});
