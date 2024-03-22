export function ImageGridItem (image) {
    return `<div class="swiper-item">
        <a href="#">
            <img src="${image.src}" alt="${image.alt}">
        </a>
        <span class="subscribe">
            <button class="${image.isSubscribe === false ? 'button-subscribe' : 'button-unsubscribe'}">${image.isSubscribe === false ? '+ 구독하기' : '해지하기'}</button>
        </span>
        </div>`;
}
