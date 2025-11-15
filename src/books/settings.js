npup.options = {
    other: {
        icon: '🛠️',
        name: '기타',
        engine: '페이지',
        options: {
            'books-web-title': {
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
                },
                structure: {
                    router: true,
                },
            },
        },
    },

    custom_css: {
        icon_svg: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg',
        icon: '✒️',
        name: '커스텀 CSS',
        engine: 'all',
        options: {
            'books-custom-css': {
                system() {
                    return this.key
                },
                type: {
                    option: 'textarea',
                    structure: ['custom']
                },
                desc: 
`div.flex.w-\\[420px\\] { transition: border .24s; }

div.flex.w-\\[420px\\]:has(input:focus) {
    border-bottom: 1px solid var(--primary);
}

::selection {
    background-color: rgba(40, 40, 40, 0.12);
}`,
                settings: {                                 // 옵션 UI 설정
                    placeholder: `설정 필요`
                }
            }
        }
    },

    mapping: {
        icon: '⌨️',
        name: '조작',
        engine: 'all',
        options: {
            'books-quick-mapping-menu': {
                tag: {                                // 다른 함수들에 쓰일지 말지 자율적으로 
                    quick_mapping_menu: false
                },
                desc: '조작 퀵 메뉴',
                type: {
                    option: 'selector',    
                    structure: ['selector', 'common']
                },
                values: [
                    { name: '사용 안함', value: 'normal' },
                    { name: '오른쪽 위', value: 'right-top' },
                    { name: '오른쪽 중앙', value: 'right-center' },
                    { name: '오른쪽 아래', value: 'right-bottom' },
                    { name: '왼쪽 위', value: 'left-top' },
                    { name: '왼쪽 중앙', value: 'left-center' },
                    { name: '왼쪽 아래', value: 'left-bottom' },
                ],
                options: {
                    'books-quick-mapping-menu-viewer': {
                        desc: '뷰어에서 사용하지 않음',
                        type: {
                            option: 'switch',
                            structure: ['common']
                        },
                        settings: {
                            storage: 'local'
                        }
                    },
                    'books-quick-mapping-menu-page': {
                        desc: '뷰어 이외의 곳에서 사용하지 않음',
                        type: {
                            option: 'switch',
                            structure: ['common']
                        },
                        settings: {
                            storage: 'local'
                        }
                    },
                },
                settings: {
                    storage: 'local'
                }
            },
            'books-after-ep': {
                tag: {
                    quick_mapping_menu: false
                },
                desc: '(뷰어) 다음화로 가기',
                type: {
                    option: 'mapping'
                },
            },
            'books-before-ep': {
                tag: {
                    quick_mapping_menu: false
                },
                desc: '(뷰어) 이전화로 가기',
                type: {
                    option: 'mapping'
                },
            },
            'books-ep-home': {
                tag: {
                    quick_mapping_menu: false
                },
                desc: '(뷰어) 소설 페이지로 이동',
                type: {
                    option: 'mapping'
                },
            },
            'books-page-dark': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '노벨피아 \'다크모드\' 사용',
                type: {
                    option: 'mapping'
                },
            },
            'books-viewer-dark': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '노벨피아 \'뷰어 다크모드\' 사용',
                type: {
                    option: 'mapping'
                },
            },
            'books-move-mb': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '내서재로 이동',
                type: {
                    option: 'mapping'
                },
            },
            'books-move-search': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '검색창으로 이동',
                type: {
                    option: 'mapping'
                },
            },
        },
        setups: {
            length: 2
        }
    },

    move: {
        icon: '🧭',
        name: '이동',
        engine: 'all',
        options: {
            'move-use-qmm': {
                desc: '(공통) 조작 퀵 메뉴에서 사용',
                type: {
                    option: 'switch',
                },
                engine: 'null', 
            },

            'move-base': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '(공통) 노벨파아 홈으로 이동',
                type: {
                    option: 'mapping'
                },
            },
            'move-books': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '(공통) 북스로 이동',
                type: {
                    option: 'mapping'
                },
            },
            'move-webtoon': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '(공통) 웹툰으로 이동',
                type: {
                    option: 'mapping'
                },
            }
        },
    },

    ...npup.options,
}
