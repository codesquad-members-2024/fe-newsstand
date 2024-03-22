export function activeTab (buttonTab, tabContent) {
    buttonTab.forEach((tab, index) => {
        tab.addEventListener('click', function(){
            showTabContent(tabContent,index);
            buttonTab.forEach((tab) => {
                tab.classList.remove('active');
            });
            tab.classList.add('active');
        });
    });
}

function showTabContent(tabContent = [],index) {
    if(tabContent.length === 0) return;
    for(let i=0; i<tabContent.length; i++){
        if(i === index){
            tabContent[i].classList.remove('none');
        } else {
            tabContent[i].classList.add('none');
        }
    }
}
