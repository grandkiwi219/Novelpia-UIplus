npup.options = {
    image: {
        icon: '📕',
        name: '이미지',
        engine: '페이지',
        options: {
            'wt-thumb-msc': {
                desc: '웹툰 표지 모자이크 처리',
                type: {
                    option: 'switch',
                    structure: ['switch']
                },
                options: {
                    'wt-thumb-msc-hover': {
                        desc: '웹툰 표지에 마우스 올릴 시 보이기',
                        type: {
                            option: 'switch',
                            structure: ['switch']
                        },
                    },
                }
            },

            'wt-banner-msc': {
                desc: '배너 모자이크 처리',
                type: {
                    option: 'switch',
                    structure: ['switch']
                },
                options: {
                    'wt-banner-msc-hover': {
                        desc: '배너에 마우스 올릴 시 보이기',
                        type: {
                            option: 'switch',
                            structure: ['switch']
                        },
                    },
                }
            },
        },
    },

    custom_css: {
        icon_svg: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/CSS3_logo_and_wordmark.svg',
        icon: '✒️',
        name: '커스텀 CSS',
        engine: 'all',
        options: {
            'wt-custom-css': {
                system() {
                    return this.key
                },
                type: {
                    option: 'textarea',
                    structure: ['custom']
                },
                desc: ``,
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
            'wt-quick-mapping-menu': {
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
                    'wt-quick-mapping-menu-viewer': {
                        desc: '뷰어에서 사용하지 않음',
                        type: {
                            option: 'switch',
                            structure: ['common']
                        },
                        settings: {
                            storage: 'local'
                        }
                    },
                    'wt-quick-mapping-menu-page': {
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
            'wt-after-ep': {
                tag: {
                    quick_mapping_menu: false
                },
                desc: '다음화로 가기 (뷰어)',
                type: {
                    option: 'mapping'
                },
            },
            'wt-before-ep': {
                tag: {
                    quick_mapping_menu: false
                },
                desc: '이전화로 가기 (뷰어)',
                type: {
                    option: 'mapping'
                },
            },
            'wt-ep-home': {
                tag: {
                    quick_mapping_menu: false
                },
                desc: '웹툰 목록으로 이동 (뷰어)',
                type: {
                    option: 'mapping'
                },
            },
            'wt-ep-scroll': {
                tag: {
                    quick_mapping_menu: false
                },
                desc: '자동 스크롤 (뷰어)',
                type: {
                    option: 'mapping'
                },
            },
            'wt-ep-list': {
                tag: {
                    quick_mapping_menu: false
                },
                desc: '웹툰 목록 열기 (뷰어)',
                type: {
                    option: 'mapping'
                },
            },
            'wt-move-mb': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '내서재로 이동',
                type: {
                    option: 'mapping'
                },
            },
            'wt-move-search': {
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
                desc: '조작 퀵 메뉴에서 사용',
                type: {
                    option: 'switch',
                },
                engine: 'null', 
            },

            'move-base': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '노벨파아 홈으로 이동',
                type: {
                    option: 'mapping'
                },
            },
            'move-books': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '북스로 이동',
                type: {
                    option: 'mapping'
                },
            },
            'move-webtoon': {
                tag: {
                    quick_mapping_menu: true
                },
                desc: '웹툰으로 이동',
                type: {
                    option: 'mapping'
                },
            }
        },
    },

    ...npup.options,
}
