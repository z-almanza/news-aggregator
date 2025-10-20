//News Aggregator Project edited by Zamantha Almanza

// Singleton Pattern: ConfigManager
const ConfigManager = (function() {
    let instance;

    function createInstance() {
        return {
            theme: 'dark',
            apiUrl: 'https://newsapi.org/v2/top-headlines',
            apiKey: 'acbae0e882464082b1aa42fbc053b550' // My NewsAPI key
        };
    }

    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };

})();

// Module Pattern: NewsFetcher
const NewsFetcher = (function () {
    const config = ConfigManager.getInstance();
    
    //Fetching data and returning just articles
    async function fetchArticles() {
        const response = await fetch(`${config.apiUrl}?country=us&apiKey=${config.apiKey}`);
        const data = await response.json();
        const articles = data.articles;
        return articles;
    }
    return {
        getArticles: fetchArticles
    };
})();

// Observer Pattern: NewsFeed
function NewsFeed() {
    this.observers = [];
    this.articles = [];
}

//NewsFeed prototype
NewsFeed.prototype = {
    subscribe: function(fn) {
        this.observers.push(fn);
    },
    unsubscribe: function(fn) {
        this.observers = this.observers.filter(observer => observer !== fn);
    },
    addArticle: function(article) {
        this.articles.push(article);
        this.notify(article);
    },
    notify: function(article) {
        this.observers.forEach(observer => observer(article));
    }
}

// Instantiate the NewsFeed
const newsFeed = new NewsFeed();

// Observer 1: Update Headline
function updateHeadline(article) {
    const headlineElement = document.getElementById('headline').querySelector('p');
    headlineElement.textContent = article.title;
}

// Observer 2: Update Article List
function updateArticleList(article) {
    const articleListElement = document.getElementById('articles');
    const listItem = document.createElement('li');
    listItem.textContent = article.title;
    articleListElement.appendChild(listItem);
}

//Subscribing Observers
newsFeed.subscribe(updateHeadline);
newsFeed.subscribe(updateArticleList);

// Fetch and display articles
NewsFetcher.getArticles().then(articles => {
    articles.forEach(article => {
        newsFeed.addArticle(article);
    });
});

// Display Config Info
const configInfo = ConfigManager.getInstance();
document.getElementById('configInfo').textContent = `Theme: ${configInfo.theme}`;