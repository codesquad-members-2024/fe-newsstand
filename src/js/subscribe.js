let subscribeArray = [];
export function handleSubscribe(){
    const buttonSubscribe = document.querySelectorAll('.swiper-item .button-subscribe');
    buttonSubscribe.forEach((button, index) => {
        button.addEventListener('click', function(){
            const pressName = this.closest('.swiper-item').querySelector('img').alt;
            const pressImgSrc = this.closest('.swiper-item').querySelector('img').src;

            const subscribeList = {
                id: `${index}`,
                alt: pressName,
                src: pressImgSrc,
                isSubscribe: true,
            };
            let isSubscribed = false;
            subscribeArray.forEach(data => {
                if (data.alt === subscribeList.alt) {
                    alert('이미 구독한 언론사입니다.');
                    isSubscribed = true;
                    return;
                }
            });
            if (!isSubscribed) { 
                handleSubmit(subscribeList);
                subscribeArray.push(subscribeList); 
            }   
    });
});
}

function snackBar() {
    const alertSnack = document.createElement('div');
    alertSnack.className = 'subscribe-success';
    alertSnack.textContent = '내가 구독한 언론사에 추가되었습니다.';
    document.body.appendChild(alertSnack); 
    setTimeout(() => {
        alertSnack.remove();
    }, 5000);
}


function handleSubmit(subscribeList){
    fetch('http://localhost:3000/subscription', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscribeList)
    })
    .then(response => response.json())
    .then(()=> {
        snackBar();
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
