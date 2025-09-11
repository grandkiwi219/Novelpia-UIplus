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
            'wt-after-ep': {
                desc: '다음화로 가기 (뷰어)',
                type: {
                    option: 'mapping'
                },
            },
            'wt-before-ep': {
                desc: '이전화로 가기 (뷰어)',
                type: {
                    option: 'mapping'
                },
            },
            'wt-ep-home': {
                desc: '웹툰 목록으로 이동 (뷰어)',
                type: {
                    option: 'mapping'
                },
            },
            'wt-ep-scroll': {
                desc: '자동 스크롤 (뷰어)',
                type: {
                    option: 'mapping'
                },
            },
            'wt-ep-list': {
                desc: '웹툰 목록 열기 (뷰어)',
                type: {
                    option: 'mapping'
                },
            },
            'wt-move-mb': {
                desc: '내서재로 이동',
                type: {
                    option: 'mapping'
                },
            },
        },
        setups: {
            length: 2
        }
    },

    ...npup.options,
}
