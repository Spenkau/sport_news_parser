// import auth from './common';

const URL = 'http://localhost:3000';
const newsBlock = document.getElementById('news');
const reset = document.getElementById('reset');
let news = [];

document.addEventListener('DOMContentLoaded', getDataFromAPI)
reset.addEventListener('click', () => {
    getDataFromAPI();
    reset.style.display = "none";
});

function getDataFromAPI() {
    newsBlock.innerHTML =
        `<li style="display:flex; margin-left: auto;"><h1>Загрузка...</h1></li><li style="display:flex; margin-left: auto;"><h1>Загрузка...</h1></li><li style="display:flex; margin-left: auto;"><h1>Загрузка...</h1></li>`

    fetch(URL + '/all_news')
        .then(response => response.text())
        .then(data => {
            newsBlock.innerHTML = '';
            getNewsData(data)
            news = JSON.parse(data);
        })
        .catch(err => console.error(err));
}

document.addEventListener('click', (event) => {
    if (event.target.matches('.news_category')) {
        event.preventDefault();
        newsBlock.innerHTML =
            `<li style="display:flex; margin-left: auto;"><h1>Загрузка...</h1></li><li style="display:flex; margin-left: auto;"><h1>Загрузка...</h1></li><li style="display:flex; margin-left: auto;"><h1>Загрузка...</h1></li>`

        const data = event.target.getAttribute('data-link');

        fetch(URL + '/news_by_category',
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({link: data})
            }
        )
            .then(response => response.text())
            .then(data => {
                newsBlock.innerHTML = ''
                getNewsData(data)
            })
    }
})

function getNewsData(data) {
    JSON.parse(data).forEach(item => {
        const listItem = renderHtml(item)
        newsBlock.appendChild(listItem);
    })
}

function renderHtml(item) {
    const htmlString = `
            ${item.image ?
        `<img class="news_image" src="${item.image}" style="object-fit: cover;" alt="">`
        : ''
    }
            <div class="news_content position-relative">
                <div class="mt-auto position-relative p-4" style="height: 100%">
                    <div class="mb-2">
                        <button class="news_category border-0 badge badge-primary text-uppercase font-weight-semi-bold p-2"
                            data-link="${item.categoryLink}"
                        >
                            ${item.category}
                        </button>
                        <p class="text-body"><small>${item.date}</small></p>
                    </div>
                    <p class="h4 d-block mb-3 text-secondary text-uppercase font-weight-bold" style="text-align: start">${item.title}</p>
                    <a class="position-absolute m-0" style="background-color: #FFFFFF; padding: 5px; bottom: 50px" href="/diana/news_info.html?link=${item.link}">Подробнее</a>
                </div>
                <div class="position-absolute w-100 d-flex justify-content-between bg-white border-top mt-auto p-2" style="bottom: 0">
                    <small class="d-flex align-items-center">
                        Автор:&nbsp;<a href="https://sportrbc.ru">sportrbc.ru</a>
                    </small>
                    <div class="d-flex align-items-center">
                        <small class="ml-3"><i class="far fa-eye mr-2"></i>${Math.floor(Math.random() * 10)}</small>
                    </div>
                </div>
            </div>
    `

    const block = document.createElement('li');
    block.classList.add("news_item");

    block.innerHTML = htmlString;

    return block;
}

const searchInput = document.getElementById('search_input');
const searchBtn = document.getElementById('search_btn');

searchBtn.addEventListener('click', searchByTitle)
searchInput.addEventListener('keydown', (event) => event.key === 'Enter' && searchByTitle())

function searchByTitle () {
    const title = searchInput.value;
    reset.style.display = "block";
    newsBlock.innerHTML =
        `<li style="display:flex; margin-left: auto;"><h1>Загрузка...</h1></li><li style="display:flex; margin-left: auto;"><h1>Загрузка...</h1></li><li style="display:flex; margin-left: auto;"><h1>Загрузка...</h1></li>`


    fetch(URL + '/all_news')
        .then(response => response.text())
        .then(data => {
            const news = [];
            newsBlock.innerHTML = '';
            JSON.parse(data).forEach(item => {
                if (item.title.toLowerCase().includes(title.toLowerCase())) {
                    news.push(item);
                    const listItem = renderHtml(item)
                    newsBlock.appendChild(listItem);
                }
            })
            if (news.length === 0) newsBlock.innerHTML =
                `<li style="display:flex; margin-left: auto;"><h1>Новости с таким названием не найдены!</h1></li>`


        })
        .catch(err => console.error(err));
}

// const modal = document.getElementById('modal-wrapper');
//
// const modalContent = document.querySelector('.modal-content .content');
//
// const closeBtn = document.getElementById('close-modal');
//
// const openBtn = document.getElementById('open-modal');
//
// const login = document.querySelector('.login');
// const register = document.querySelector('.register');
//
// openBtn.addEventListener('click', () => {
//     console.log('lcik')
//     modal.style.display = "block"
// })
//
// closeBtn.addEventListener('click', () => modal.style.display = "none")
//
// document.addEventListener('click', (event) => {
//     if (event.target === modal) modal.style.display = "none";
// })
//
// login.addEventListener('click', () => {
//     modalContent.innerHTML = `
//         <h1 class="title">Войти</h1>
//         <form action="#" class="modal-form">
//             <label for="name">
//                 <input id="name" name="name" type="text" placeholder="Имя">
//             </label>
//             <label for="email">
//                 <input id="email" name="email" type="text" placeholder="Почта">
//             </label>
//             <label for="password">
//                 <input id="password" name="password" type="password" placeholder="Пароль">
//             </label>
//             <button type="submit" class="btn btn-primary">Применить</button>
//         </form>
//     `
// });
//
// register.addEventListener('click', () => {
//     modalContent.innerHTML = `
//         <h1 class="title">Зарегистрироваться</h1>
//         <form action="#" class="modal-form">
//             <label for="email">
//                 <input id="email" name="email" type="text" placeholder="Почта">
//             </label>
//             <label for="password">
//                 <input id="password" name="password" type="password" placeholder="Пароль">
//             </label>
//             <button type="submit" class="btn btn-primary">Применить</button>
//         </form>
//     `
// })


// let isLogged = false;
// const authBlock = document.getElementById('auth-btn');
//
// function insertModalContent(isLogged) {
//     return isLogged ? `<button class="modal-open nav-link text-body small" style="background-color: transparent; outline: none">Зарегистрироваться</button>`
//         : `<button class="logout">Выйти</button>`
// }
//
// authBlock.innerHTML = '';


