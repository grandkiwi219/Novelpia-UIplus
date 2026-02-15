viewerCa['click-alert'].system = function(r) {
    if (!engineChecker('뷰어')) return;

    npup.log('우클릭 제거 준비가 완료되었습니다.');

    scriptInjection('src/base/file/delete-click-alert.js');

    // route detector?
}
