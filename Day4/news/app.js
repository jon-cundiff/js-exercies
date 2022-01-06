const newsItems = document.getElementById("newsItems");
const sourcesDropdown = document.getElementById("sourcesDropdown");

// Called on 404 error from image elements
function removeImage(event) {
    const img = event.target;
    img.parentElement.removeChild(img);
}

function createArticleItem(article) {
    const articleAuthor = article.name ? article.name : "Unknown Author";
    const descriptionPara = article.description
        ? `<p>${article.description}</p>`
        : "";

    const imageTag = article.urlToImage
        ? `<img src=${article.urlToImage} onerror="removeImage(event)"/>`
        : "";

    const publishedTime = new Date(article.publishedAt).toLocaleString();
    return `<li class="article">
            <b>${article.title}</b>
            <i>${articleAuthor}</i>
            ${descriptionPara}
            <a href="${article.url}">Link to Article</a>
            ${imageTag}
            <i>Published at ${publishedTime}</i>
        </li>`;
}

function createArticleItems(sourceId) {
    let articles = news.articles;
    if (sourceId) {
        articles = news.articles.filter(function (article) {
            return article.source.id === sourceId;
        });
    }

    const articleItems = articles.map(function (article) {
        return createArticleItem(article);
    });

    newsItems.innerHTML =
        articleItems.length > 0 ? articleItems.join("") : "No news found";
}

function getSourcesThatHaveNewsItems() {
    return sources.sources.filter(function (source) {
        return news.articles.find(function (article) {
            return article.source.id === source.id;
        });
    });
}

function createSourceOptions() {
    const sourcesThatHaveNewsItems = getSourcesThatHaveNewsItems();
    const sourceOptions = sourcesThatHaveNewsItems.map(function (source) {
        return `<option value=${source.id}>
            ${source.name}
        </option>`;
    });

    // Add all sources option at the start
    sourceOptions.unshift('<option value="">All Sources</option>');
    sourcesDropdown.innerHTML = sourceOptions.join("");
}

sourcesDropdown.addEventListener("change", function () {
    createArticleItems(this.value);
});

createSourceOptions();
createArticleItems();
