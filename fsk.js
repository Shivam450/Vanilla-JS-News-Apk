const API_KEY = "a08d61a020c647619a95134901486c96";
const url = "https://newsapi.org/v2/everything?q=";
let currentPage = 1;
let totalResults = 0;
const pageSize = 20; // Number of articles per page

window.addEventListener('load', () => fetchNews("India", currentPage));

function reload() {
  window.location.reload();
}

async function fetchNews(query, page = 1) {
  const res = await fetch(`${url}${query}&page=${page}&pageSize=${pageSize}&apiKey=${API_KEY}`);
  const data = await res.json();
  totalResults = data.totalResults;
  bindData(data.articles);
  updatePaginationControls();
}

function bindData(articles) {
  const cardsContainer = document.getElementById('cards-container');
  const newsCardTemplate = document.getElementById('template-news-card');

  cardsContainer.innerHTML = '';

  articles.forEach(article => {
    if (!article.urlToImage) return;
    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector('#news-image');
  const newsTitle = cardClone.querySelector('#news-title');
  const newsSource = cardClone.querySelector('#news-source');
  const newsDescription = cardClone.querySelector('#news-desc');

  newsImg.src = article.urlToImage;
  newsTitle.innerHTML = article.title;
  newsDescription.innerHTML = article.description;

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta"
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

function onNavItemClick(id) {
  currentPage = 1;
  fetchNews(id, currentPage);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove('active');
  curSelectedNav = navItem;
  curSelectedNav.classList.add('active');
}

const searchButton = document.getElementById('search-button');
const searchText = document.getElementById('search-text');

searchButton.addEventListener('click', () => {
  const query = searchText.value;
  if (!query) return;
  currentPage = 1;
  fetchNews(query, currentPage);
  curSelectedNav?.classList.remove('active');
  curSelectedNav = null;
});

const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');

prevPageButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchNews(searchText.value || 'India', currentPage);
  }
});

nextPageButton.addEventListener('click', () => {
  if (currentPage < Math.ceil(totalResults / pageSize)) {
    currentPage++;
    fetchNews(searchText.value || 'India', currentPage);
  }
});

function updatePaginationControls() {
  document.getElementById('page-number').textContent = currentPage;
  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = currentPage >= Math.ceil(totalResults / pageSize);
}
