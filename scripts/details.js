const URL = 'http://localhost:3000';
const detailsBlock = document.getElementById('news_details');

const urlParams = new URLSearchParams(window.location.search);
const link = urlParams.get('link');


document.addEventListener('DOMContentLoaded', function () {
    fetch(URL + '/news_details', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ link: link })
    })
        .then(response => response.text())
        .then(data => {
            detailsBlock.innerHTML = '';
            data = JSON.parse(data);
            console.log(data)
            const header = document.createElement('h1');
            header.textContent = data[0];

            const image = document.createElement('img');
            image.src = data[2];
            image.style.float = 'left';
            image.style.marginBottom = '10px';

            const text = document.createElement('p');
            text.textContent = data[1];

            // const container = document.createElement('div');
            detailsBlock.appendChild(header);
            detailsBlock.appendChild(image);
            detailsBlock.appendChild(text);

        })
})
