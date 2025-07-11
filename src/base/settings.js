npup.options = { ...npup.options,
    header: {
        icon: '🚩',
        name: '헤더',
        engine: '페이지',                              // 기본적으로 실행할 시스템 엔진 이름
        options: {
            adult: {
                desc: '성인 버튼을 헤더에 옮김',        // 옵션 설명
                type: {
                    option: 'switch',                 // 옵션 유형      
                    structure: ['switch', 'system']   // 스크립트 유형
                }
            },

            'b-w': {
                desc: '"북스 | 웹툰" 제거',
                type: {
                    option: 'selector',    
                    structure: ['selector']
                },
                values: [                              // 옵션 유형, selector의 선택지 
                    { name: '그대로', value: 'normal' },
                    { name: '"북스"만 제거', value: 'books' },
                    { name: '"웹툰"만 제거', value: 'webtoon' },
                    { name: '모두 제거', value: 'true' },
                ]
            },

            search: {
                desc: '검색바 최소화 & 반응형',
                type: {
                    option: 'switch',    
                    structure: ['switch', 'system']
                },
                addons: [                               // 스크립트 실행 시 필요 키 값
                    { type: 'all', keys: ['nav'] }
                ]
            },

            'search-result': {
                desc: '최근 검색 결과 표시',
                type: {
                    option: 'switch',     
                    structure: ['system']
                }
            },

            alarm: {
                desc: '알림 위치 변경',
                type: {
                    option: 'selector',    
                    structure: ['system']
                },
                values: [
                    { name: '댓글 알림', value: 'normal' },
                    { name: '구독 알림', value: 'novel' },
                    { name: '만화 구독 알림', value: 'comic' },
                    { name: '시스템 알림', value: 'system' },
                    { name: '이벤트 알림', value: 'event' },
                ]
            },
        }
    },

    nav: {
        icon: '⏩',
        name: '내비게이션 바',
        engine: '페이지',
        options: {
            'nav-align': {
                desc: '내비게이션 메뉴 정렬 방식',
                type: {
                    option: 'selector',
                    structure: ['selector']
                },
                values: [
                    { name: '왼쪽 정렬', value: 'normal' },
                    { name: '덜 왼쪽 정렬', value: 'left-less' },
                    { name: '가운데 정렬', value: 'center' },
                    { name: '오른쪽 정렬', value: 'right' },
                    { name: '덜 오른쪽 정렬', value: 'right-less' },
                ]
            },

            'nav-mybook': {
                desc: '내서재 위치 변경 (모바일에서는 최근기록 부분 포함)',
                type: {
                    option: 'selector',
                    structure: ['system']
                },
                values: [
                    { name: '설정 안 함', value: 'normal' },
                    { name: '선호작', value: 'like' },
                    { name: '최근 본 작품', value: 'last' },
                    { name: '구독 알림', value: 'alarm' },
                    { name: '소장함', value: 'collect' },
                ]
            },

            nav: {
                desc: '내비게이션 메뉴 헤더로 (기본적으로 검색바 최소화)',
                type: {
                    option: 'switch',
                    structure: ['switch', 'system']
                },
                addons: [
                    { type: 'system', keys: ['nav-align'] }
                ]
            },
        }
    },

    novel: {
        icon: '📕',
        name: '소설 페이지',
        engine: '페이지',
        options: {
            'novel-page': {
                desc: '페이지 이동 상단 추가',
                type: {
                    option: 'switch',
                    structure: ['system']
                },
            },
        }
    },

    viewer: {
        icon: '📜',
        name: '뷰어',
        engine: '뷰어',
        options: {
            'old-icon': {
                desc: '옛 뷰어 아이콘 및 배치',
                type: {
                    option: 'switch',
                    structure: ['switch', 'system']
                },
            },
            'click-alert': {
                desc: '우클릭 알림 삭제',
                type: {
                    option: 'switch',
                    structure: ['system']
                },
            },
        }
    },

    mobile: {
        icon: '📱',
        name: '모바일 UI',
        engine: '페이지',
        options: {
            'top-ep': {
                desc: '이어보기 버튼 상단 추가',
                type: {
                    option: 'switch',
                    structure: ['system']
                }
            },
            'bottom-heart-alarm': {
                desc: '선호작, 구독알람 아이콘 하단 추가',
                type: {
                    option: 'switch',
                    structure: ['switch', 'system']
                },
                addons: [
                    { type: 'system', keys: ['bottom-nav'] }
                ]
            },
            'origin-header': {
                desc: '기존 헤더로 변경 (기본적으로 아이콘 하단 추가)',
                type: {
                    option: 'switch',
                    structure: ['switch', 'system']
                },
                addons: [
                    { type: 'system', keys: ['bottom-nav'] }
                ]
            },
            'bottom-nav': {
                desc: '하단 내비게이션 삭제 (기본적으로 기존 헤더로 변경)',
                type: {
                    option: 'switch',
                    structure: ['switch']
                },
            },
        },
        settings: {
            id: 'mobile-ui-setting'                       // 옵션 카테고리 UI 설정
        }
    },

    other: {
        icon: '🛠️',
        name: '기타',
        engine: '페이지',
        options: {
            notice: {
                desc: '메인 페이지 공지 상단 추가',
                type: {
                    option: 'switch',
                    structure: ['system']
                },
            },

            'web-title': {
                desc: '페이지 이름 변경',
                type: {
                    option: 'selector',
                    structure: ['pre-common']
                },
                engine: 'all',                                                              // 개별적으로 적용될 엔진 선택 (모든 엔진서 작동하고 싶을 때 all로)
                values: [
                    { name: '노벨피아 - 웹소설로 꿈꾸는 세상! - (page)', value: 'normal' },
                    { name: '노벨피아 - (page)', value: 'short' },
                    { name: '(page) - 노벨피아', value: 'reverse-short' },
                    { name: '(page)', value: 'single' },
                    { name: '(page) - 노벨피아 - 웹소설로 꿈꾸는 세상!', value: 'reverse-normal' },
                ],
                settings: {
                    type: 'long'
                }
            },

            'last-ep': {
                desc: '마지막으로 읽었던 회차로 이동 알림',
                type: {
                    option: 'switch',
                    structure: ['system']
                },
                options: {
                    'last-ep-home': {
                        desc: '메인화면에서만 알림',
                        type: {
                            option: 'switch',
                            structure: ['system']
                        },
                    },
                    'last-ep-cooltime': {
                        desc: '알림 제거 후 다시 보기',
                        type: {
                            option: 'selector',
                            structure: ['system']
                        },
                        values: [
                            { name: '30분', value: 30 },
                            { name: '1시간', value: 60 },
                            { name: '1시간 30분', value: 90 },
                            { name: '2시간', value: 120 },
                            { name: '3시간', value: 180 },
                            { name: '4시간', value: 240 },
                            { name: '6시간', value: 360 },
                            { name: '8시간', value: 480 },
                            { name: '10시간', value: 600 },
                            { name: '12시간', value: 720 },
                            { name: '14시간', value: 840 },
                            { name: '16시간', value: 960 },
                            { name: '18시간', value: 1080 },
                            { name: '20시간', value: 1200 },
                            { name: '22시간', value: 1320 },
                            { name: '24시간', value: 1440 },
                        ]
                    },
                }
            },

            'quick-mybook': {
                desc: '빠른 내서재 (확장프로그램 아이콘 클릭 시)',
                type: {
                    option: 'switch',
                    structure: ['system']
                },
            }
        },
        setups: {                                         // 옵션 카테고리 UI '특수' 설정
            length: 2
        }
    },

    custom_css: {
        icon_svg: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg',
        icon: '✒️',
        name: '커스텀 CSS',
        engine: 'all',
        options: {
            'custom-css': {
                system() {
                    return this.key
                },
                type: {
                    option: 'textarea',
                    structure: ['custom']
                },
                desc: 
`@media screen and (min-width: 892px) {
    header.mobile_hidden  {
        border-bottom: 1px solid #E6E6E6;
    }
}

.header-search { transition: border .24s; }

.header-search:has(#search_input:focus) {
    border-bottom: 1px solid var(--novelpia-color) !important;
}

::selection {
    background-color: rgba(40, 40, 40, 0.12);
}`,
                settings: {                                 // 옵션 UI 설정
                    placeholder: 
`/* 외부 폰트 불러오기 예시 */
@font-face {
    font-family: 'NoonnuBasicGothicRegular';
    src: url('https://fastly.jsdelivr.net/gh/projectnoonnu/noon-2410@1.0/NoonnuBasicGothicRegular.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
}

/* 뷰어 폰트 설정 변경 예시 */
#novel_box {
    font-family: 'NoonnuBasicGothicRegular', sans-serif !important;
    color: #030f05 !important;
}

/* 뷰어 배경색 변경 예시 */
#novel_box, #list_box, #comment_box, #header_bar, #footer_bar, #theme_box {
    background-color: #c1e3ca !important;
}

* {
    font-family: 'NoonnuBasicGothicRegular', sans-serif !important;
}

body, header, main, section, #main_curation_7, .md_btn, .game-all-wrapper, #payment, .menubar, .list_box, .mile-top-wrapper, .npup-notice, .npup-search-box, .npup-search-result {
    background-color: #e8e8e8 !important;
}

.loads {
    background-color: rgba(255, 255, 255, 0);
}

.rand-wrapper {
    background-color: silver !important;
}

.card, .card-header, .card-body {
    background-color: silver !important;
}

.agit-back {
    background-color: silver !important;
}

.calendar-body-wrapper {
    background-color: #f6ebff !important;
}

.sidemenu-wrapper-upper, .sidemenu-wrapper-lower, #m-sidemenu {
    background-color: #e8e8e8 !important;;
}

.mybook-sub-nav, .mybook-tab-container-m, .s_menubar {
    background-color: silver !important;
} · · ·`
                }
            }
        }
    },

    extension: {
        icon: '🪡',
        name: '확장프로그램',
        engine: 'null',
        options: {
            'extension-sync': {
                desc: '이 장치에서의 설정 동기화',
                type: 'switch',
                settings: {
                    storage: 'local'
                }
            },
        }
    }
}




function keyBinding() {
    for (const categoryKey in npup.options) {
        const category = npup.options[categoryKey];

        if (!category.options) continue;

        for (const optionKey in category.options) {
            const option = category.options[optionKey];

            if (typeof option === 'object' && option !== null) {
                option.key = optionKey;

                if (option.options) {
                    for (const subKey in option.options) {
                        const subOption = option.options[subKey];
                        if (typeof subOption === 'object' && subOption !== null) {
                            subOption.key = subKey;
                        }
                    }
                }
            }
        }
    }
}
keyBinding();
