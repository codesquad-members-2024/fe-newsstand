import { getTodayDate, refreshPage } from './js/util.js';
import { activeTab } from './js/tab.js';
import { PressListSwiper, ArticleListSwiper, MoveSlideByTab } from './js/swiper.js'; 
import { getHeadlines } from './js/rolling-headlines.js';
import { handleSubscribe } from './js/subscribe.js';
import { getSubscribeList } from './js/unsubscribe.js';


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#current-date').textContent = getTodayDate();
    refreshPage();
    updateAndLoadSwipers('images');
    loadTabSwipers();
    getHeadlines();
});

activeTab(document.querySelectorAll('.tab-view-type .button-tab'), document.querySelectorAll('#tabViewType > .tab-content'));
activeTab(document.querySelectorAll('.tab-press-list .button-tab'));

function loadImageData() {
    return fetch('./data/images.json')
            .then(response => response.json())
}
function loadSubscription() {
    return fetch('http://localhost:3000/subscription')
    .then(response => response.json());
}
function loadArticles() {
    return fetch('./data/articles.json')
            .then(response => response.json());
}

export function updateAndLoadSwipers(dataType) {
    Promise.all([loadImageData(), loadSubscription()]).then(data => {
        let [images, subscription] = data;
        images = updateSubscribeState(images, subscription);
        if(dataType === 'subscription') {
            loadSwipers(subscription);
        } else if (dataType === 'images') {
            loadSwipers(images);
        }
        
    }).catch(error => console.error(error));
}
export function loadSwipers(dataArray) {
    const pressSwiper = new PressListSwiper('.swiper-wrapper1', '.swiper.grid .button.prev', '.swiper.grid .button.next');
    pressSwiper.createSlidesFromData(dataArray, 24);
    

    handleSubscribe();
    getSubscribeList();
}
function loadTabSwipers(){
    loadArticles().then(articles => {
        const articleSwiper = new ArticleListSwiper('.swiper-wrapper2', '.swiper.type2 .button.prev', '.swiper.type2 .button.next');
        articleSwiper.createSlidesByArticles(articles);
        articleSwiper.startAutoSlideChange();
        MoveSlideByTab();
    });
}
document.querySelector('#pressSubscribe').addEventListener('click', function() {
    updateAndLoadSwipers('subscription');
});

document.querySelector('#pressAll').addEventListener('click', function() {
    updateAndLoadSwipers('images');
});


function updateSubscribeState(images, subscription){
    images.forEach(img => {
        const isSubscribed = subscription.some(list => list.alt === img.alt);
        img.isSubscribe = isSubscribed;
    })
    return images;
}