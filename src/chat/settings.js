npup.options = {

    custom_css: {
        icon_svg: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg',
        icon: '✒️',
        name: '커스텀 CSS',
        engine: 'all',
        options: {
            'chat-custom-css': {
                system() {
                    return this.key
                },
                type: {
                    option: 'textarea',
                    structure: ['custom']
                },
                desc: ``,
                settings: {
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
            'chat-quick-mapping-menu': {
                tag: {
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
                    'chat-quick-mapping-menu-viewer': {
                        desc: '채팅에서 사용하지 않음',
                        type: {
                            option: 'switch',
                            structure: ['common']
                        },
                        settings: {
                            storage: 'local'
                        }
                    },
                    'chat-quick-mapping-menu-page': {
                        desc: '채팅 이외의 곳에서 사용하지 않음',
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
                    storage: 'local',
                },
                setups: {
                    invisible: true,
                },
            }, // 지원 X

            'chat-home': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '홈으로 가기',
                type: {
                    option: 'mapping'
                },
            },
            'chat-chat': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '채팅 내역으로 가기',
                type: {
                    option: 'mapping'
                },
            },
            'chat-favorite': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '즐겨찾기로 가기',
                type: {
                    option: 'mapping'
                },
            },
            'chat-ranking': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '랭킹으로 가기',
                type: {
                    option: 'mapping'
                },
            }
        },
        /* setups: {
            length: 2
        } */
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
                setups: {
                    invisible: true,
                },
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
            },
            'move-chat': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '(공통) Chat으로 이동',
                type: {
                    option: 'mapping'
                },
            },
        },
    },

    ...npup.options,
}
