const url = 'https://sportrbc.ru/';

const express = require('express');
const cors = require('cors');
const rp = require('request-promise');
const cheerio = require("cheerio");

const app = express();

const corsOptions = {
    origin: 'http://localhost:63342',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions))
app.use(express.json())

app.get('/all_news', (req, res) => {
    parseNews(req, res);
});

app.post('/news_by_category', (req, res) => {
    let reqUrl;
    req.body ? reqUrl = req.body.link : reqUrl = url;

    parseNews(req, res, reqUrl)
})

function parseNews(req, res, body) {
    let newsUrl = url;
    if (body) newsUrl = body

    rp(newsUrl)
        .then(function (html) {
            const $ = cheerio.load(html);
            const items = [];
            $('.item').each((i, elem) => {
                let title = $(elem).find('.item__title').text();
                title = title.trim()

                const link = $(elem).find('.item__link').attr('href');
                const image = $(elem).find('img').attr('src');

                const date = $(elem).find('span.item__category').text();

                let category = $(elem).find('a.item__category').text();
                let categoryLink = $(elem).find('a.item__category').attr('href');
                category = category.split(',')[0].trim();

                items.push({link, image, title, category, categoryLink, date});
            });
            res.json(items);
        })
        .catch(function (err) {
            // Обработка ошибки
            res.status(500).send('Произошла ошибка при парсинге страницы');
        });
}

app.post('/news_details', (req, res) => {
    try {
        const link = req.body.link;
        parseDetailedNews(req, res, link)
    } catch (err) {
        res.status(500).send('Произошла ошибка при парсинге страницы');
    }
})

function parseDetailedNews(req, res, tempUrl) {
    rp(tempUrl)
        .then(function (html) {
            const $ = cheerio.load(html)
            const items = [];

            const header = $('.article__header__title-in').text()
            items.push(header.trim())

            let text = ''
            $('.article__text').each((i, elem) => {
                const p = $(elem).find('p').text();

                text += p
            })
            items.push(text)

            const image = $('.smart-image__img').attr('src');
            items.push(image)

            console.log(items)
            res.json(items);
        })
        .catch(function (err) {
            res.status(500).send('Произошла ошибка при парсинге страницы')
        })
}

const port = 3000;
app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));
