const URL = 'http://localhost:3000';
const searchBtn = document.getElementById('search_btn')
const newsBlock = document.getElementById('news');

document.addEventListener('DOMContentLoaded', function () {
    fetch(URL + '/all_news')
        .then(response => response.text())
        .then(data => {
            getNewsData(data)
        })
        .catch(err => console.error(err));
})

document.addEventListener('click', (event) => {
    console.log('click')
    if (event.target.matches('.news_category')) {
        event.preventDefault();

        const data = event.target.getAttribute('data-link');

        console.log(data)

        fetch(URL + '/news_by_category',
        {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ link: data })
            }
        )
            .then(response => response.text())
            .then(data => {
                getNewsData(data)
            })
    }
})

function getNewsData(data) {
    console.log(JSON.parse(data))
    newsBlock.innerHTML = '';
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
                    <a class="position-absolute m-0" style="background-color: #FFFFFF; padding: 5px; z-index: 100; bottom: 50px" href="${item.link}">Оригинальный источник</a>
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
