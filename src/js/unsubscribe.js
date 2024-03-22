import { updateAndLoadSwipers, loadSwipers } from '../main.js';

export function getSubscribeList(){
    fetch('http://localhost:3000/subscription')
    .then(response => response.json())
    .then((data) => {
        handleUnsubscribe(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}
export function handleUnsubscribe(data){
    const buttonUnsubscribe = document.querySelectorAll('.swiper-item .button-unsubscribe');
    buttonUnsubscribe.forEach((button) => {
        button.addEventListener('click', function(){
            const targetPressName = this.closest('.swiper-item').querySelector('img').alt;
            const targetItem = data.find(item => item.alt === targetPressName);
            if(targetItem){
                handleDelete(targetItem.id);
            }
        })
    });
}

function handleDelete(id){
    fetch(`http://localhost:3000/subscription/${id}`, {
        method: 'DELETE',
    })
    .then(response => response.json())
    .then((data) => {
        loadSwipers(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}