const QUERY = `https://newsapi.org/v2/top-headlines?country=ru&apiKey=42fc555c30e8428bb50e7dd653dea37d&category=sports`;
const REGEX = /^(\d{4}-\d{2}-\d{2}).*/;
const RECORDS_PER_PAGE = 3;

const container = document.getElementById('tranding_content');
const trandingNews = [];

function fetchNews() {
    fetch(QUERY)
        .then(response => response.json())
        .then(data => {
            trandingNews.push(...data.articles);
            changePage(1);
        })
        .catch(error => {
            console.error(error);
        });
}

fetchNews();

let current_page = 1;

function prevPage() {
    if (current_page > 1) {
        current_page--;
        changePage(current_page);
    }
}

function nextPage() {
    if (current_page < numPages()) {
        current_page++;
        changePage(current_page);
    }
}

function changePage(page) {
    const btn_next = document.getElementById("btn_next");
    const btn_prev = document.getElementById("btn_prev");
    const news = document.getElementById("tranding_content");
    const page_span = document.getElementById("page");

    // Validate page
    if (page < 1) page = 1;
    if (page > numPages()) page = numPages();

    news.innerHTML = "";


    for (var i = (page - 1) * RECORDS_PER_PAGE; i < (page * RECORDS_PER_PAGE); i++) {
        const item = trandingNews[i];
        item.publishedAt = item.publishedAt.substring(0, 10);
        const viewNumber = generateRandomViews();

        news.innerHTML += `
      <div id="tranding_content" class="position-relative mb-3">
        <img class="img-fluid w-100" src="img/news-700x435-1.jpg" style="object-fit: cover;">
        <div class="bg-white border border-top-0 p-4">
          <div class="mb-3 d-flex">
            <p class="badge badge-primary text-uppercase font-weight-semi-bold p-2 mr-2" >${item.source.name}</p>
            <p class="text-body mt-1" >${item.publishedAt}</p>
          </div>
          <h3 class="mb-3 text-secondary text-uppercase font-weight-bold">${item.title}</h3>
          <p>${item.description ?? ''}</p>
          <p>${item.content ?? ''}</p>
          <a href="${item.url}">Оригинальный источник</a>
        </div>
        <div class="d-flex justify-content-between bg-white border border-top-0 p-4">
          <div class="d-flex align-items-center">
            <span>АВТОР: ${item.author}</span>
          </div>
          <div class="d-flex align-items-center">
            <span class="ml-3"><i class="far fa-eye mr-2"></i>${viewNumber}</span>
          </div>
        </div>
      </div>
    `;
    }
    page_span.innerHTML = page;

    if (page === 1) {
        btn_prev.style.visibility = "hidden";
    } else {
        btn_prev.style.visibility = "visible";
    }

    if (page === numPages()) {
        btn_next.style.visibility = "hidden";
    } else {
        btn_next.style.visibility = "visible";
    }
}

function numPages() {
    return Math.ceil(trandingNews.length / RECORDS_PER_PAGE);
}

function generateRandomViews() {
    return (Math.random() * 100).toFixed(0);
}
