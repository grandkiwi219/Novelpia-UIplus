const keyMappingCa = npup.options.mapping.options;




keyMappingCa['wt-after-ep'].system = keyMappingBase(r => {
    document.querySelector('#bottomMenu > * > * > *:nth-child(2) > *:nth-child(3)').click(); 
},
{
    condition: () => { return engineChecker('뷰어'); }
});

keyMappingCa['wt-before-ep'].system = keyMappingBase(r => {
    document.querySelector('#bottomMenu > * > * > *:nth-child(2) > *:nth-child(1)').click(); 
},
{
    condition: () => { return engineChecker('뷰어'); }
});

keyMappingCa['wt-ep-home'].system = keyMappingBase(r => {
    document.querySelector('#topMenu > * > a').click(); 
},
{
    condition: () => { return engineChecker('뷰어'); }
});

keyMappingCa['wt-ep-scroll'].system = keyMappingBase(r => {
    document.getElementById('autoScrollButton').click();
},
{
    condition: () => { return engineChecker('뷰어'); }
});

keyMappingCa['wt-ep-list'].system = keyMappingBase(r => {
    if (document.getElementById('episodeListMenu').classList.contains('menu-hidden')) {

        document.getElementById('episodeListButton').click();
    }
    else {
        document.getElementById('closeEpisodeListButton').click();
    }

},
{
    condition: () => { return engineChecker('뷰어'); }
});

keyMappingCa['wt-move-mb'].system = keyMappingBase(async r => {
    location.href ='/main/library';
});
