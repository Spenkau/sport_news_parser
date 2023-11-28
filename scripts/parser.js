// const url = 'https://www.google.com/search?q=%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B5+%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8&sca_esv=585680499&bih=931&biw=1920&hl=ru&tbm=nws&sxsrf=AM9HkKncbemEBmQ3aKdmTnEj4FxE54N7iA%3A1701111439215&ei=j-ZkZbPODO3i7_UPwOS5UA&ved=0ahUKEwjz0br47eSCAxVt8bsIHUByDgoQ4dUDCA0&uact=5&oq=%D1%81%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D0%B2%D0%BD%D1%8B%D0%B5+%D0%BD%D0%BE%D0%B2%D0%BE%D1%81%D1%82%D0%B8&gs_lp=Egxnd3Mtd2l6LW5ld3MiI9GB0L_QvtGA0YLQuNCy0L3Ri9C1INC90L7QstC-0YHRgtC4MgsQABiABBixAxiDATIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABDIFEAAYgAQyBRAAGIAEMgUQABiABEjEHVAAWKMccAR4AJABAJgBfqAB8ROqAQQwLjIyuAEDyAEA-AEBqAIAwgIOEAAYgAQYigUYsQMYgwHCAggQABiABBixA8ICDxAAGIAEGLEDGIMBGAoYKsICChAAGIAEGLEDGArCAgkQABgBGIAEGArCAgQQABgDwgINEAAYgAQYigUYsQMYQ8ICEBAAGIAEGIoFGLEDGIMBGEPCAgsQABiABBiKBRixA4gGAQ&sclient=gws-wiz-news'
// const url = 'https://news.sportbox.ru/Vidy_sporta/Volejbol/spbnews_NI1986015_Chempiona_operativno_vernuli_na_rabotu_posle_otstranenija_Ne_proshlo_i_troh_dnej'
const url = 'https://sportrbc.ru/';

const express = require('express');
const cors = require('cors');
const rp = require('request-promise');
const cheerio = require("cheerio");

const app = express();

app.use(cors())
app.use(express.json())

app.get('/all_news', (req, res) => {
    parseNews(req, res);
});

app.post('/news_by_category', (req, res) => {
    let reqUrl;
    req.body ? reqUrl = req.body.link : reqUrl = url;

    parseNews(req, res, reqUrl)
})

const port = 3000;
app.listen(port, () => console.log(`Сервер запущен на порту ${port}`));

function parseNews(req, res, body) {
    let newsUrl = url;
    if (body) {
        newsUrl = body
    }

    rp(newsUrl)
        .then(function(html){
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

                items.push({ link, image, title, category, categoryLink, date });
            });
            res.json(items);
        })
        .catch(function(err){
            // Обработка ошибки
            console.error(err);
            res.status(500).send('Произошла ошибка при парсинге страницы');
        });
}
