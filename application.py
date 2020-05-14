from newsapi import NewsApiClient
from flask import Flask, request, jsonify
from collections import Counter
from random import randint
import json
import ast
import re


def frequency_counter(jsonvalues):
    articles = jsonvalues['articles']
    # List of Titles
    titles = []
    for i in range(len(articles)):
        titles += articles[i]['title'].split()
    # x ==> STOPWORDS
    x = ["-", 'not', 'according', 'accordingly', 'across', 'actually', 'after', 'afterwards', 'again', 'against',
         "ain't", 'all', 'allow', 'allows', 'almost', 'alone', 'along', 'already', 'also', 'although', 'always', 'am',
         'among', 'amongst', 'an', 'and', 'another', 'any', 'anybody', 'anyhow', 'anyone', 'anything', 'anyway',
         'anyways', 'anywhere', 'apart', 'appear', 'appreciate', 'appropriate', 'are', "aren't", 'around', 'as',
         'aside', 'ask', 'asking', 'associated', 'at', 'available', 'away', 'awfully', 'b', 'be', 'became', 'because',
         'become', 'becomes', 'becoming', 'been', 'before', 'beforehand', 'behind', 'being', 'believe', 'below',
         'beside', 'besides', 'best', 'better', 'between', 'beyond', 'both', 'brief', 'but', 'by', 'c', "c'mon", "c's",
         'came', 'can', "can't", 'cannot', 'cant', 'cause', 'causes', 'certain', 'certainly', 'changes', 'clearly',
         'co', 'com', 'come', 'comes', 'concerning', 'consequently', 'consider', 'considering', 'contain', 'containing',
         'contains', 'corresponding', 'could', "couldn't", 'course', 'currently', 'd', 'definitely', 'described',
         'despite', 'did', "didn't", 'different', 'do', 'does', "doesn't", 'doing', "don't", 'done', 'down',
         'downwards', 'during', 'e', 'each', 'edu', 'eg', 'eight', 'either', 'else', 'elsewhere', 'enough', 'entirely',
         'especially', 'et', 'etc', 'even', 'ever', 'every', 'everybody', 'everyone', 'everything', 'everywhere', 'ex',
         'exactly', 'example', 'except', 'f', 'far', 'few', 'fifth', 'first', 'five', 'followed', 'following',
         'follows', 'for', 'former', 'formerly', 'forth', 'four', 'from', 'further', 'furthermore', 'g', 'get', 'gets',
         'getting', 'given', 'gives', 'go', 'goes', 'going', 'gone', 'got', 'gotten', 'greetings', 'h', 'had', "hadn't",
         'happens', 'hardly', 'has', "hasn't", 'have', "haven't", 'having', 'he', "he's", 'hello', 'help', 'hence',
         'her', 'here', "here's", 'hereafter', 'hereby', 'herein', 'hereupon', 'hers', 'herself', 'hi', 'him',
         'himself', 'his', 'hither', 'hopefully', 'how', 'howbeit', 'however', 'i', "i'd", "i'll", "i'm", "i've", 'ie',
         'if', 'ignored', 'immediate', 'in', 'inasmuch', 'inc', 'indeed', 'indicate', 'indicated', 'indicates', 'inner',
         'insofar', 'instead', 'into', 'inward', 'is', "isn't", 'it', "it'd", "it'll", "it's", 'its', 'itself', 'j',
         'just', 'k', 'keep', 'keeps', 'kept', 'know', 'knows', 'known', 'l', 'last', 'lately', 'later', 'latter',
         'latterly', 'least', 'less', 'lest', 'let', "let's", 'like', 'liked', 'likely', 'little', 'look', 'looking',
         'looks', 'ltd', 'm', 'mainly', 'many', 'may', 'maybe', 'me', 'mean', 'meanwhile', 'merely', 'might', 'more',
         'moreover', 'most', 'mostly', 'much', 'must', 'my', 'myself', 'n', 'name', 'namely', 'nd', 'near', 'nearly',
         'necessary', 'need', 'needs', 'neither', 'never', 'nevertheless', 'new', 'next', 'nine', 'no', 'nobody', 'non',
         'none', 'no one', 'nor', 'normally', 'not', 'nothing', 'novel', 'now', 'nowhere', 'o', 'obviously', 'of', 'off',
         'often', 'oh', 'ok', 'okay', 'old', 'on', 'once', 'one', 'ones', 'only', 'onto', 'or', 'other', 'others',
         'otherwise', 'ought', 'our', 'ours', 'ourselves', 'out', 'outside', 'over', 'overall', 'own', 'p',
         'particular', 'particularly', 'per', 'perhaps', 'placed', 'please', 'plus', 'possible', 'presumably',
         'probably', 'provides', 'q', 'que', 'quite', 'qv', 'r', 'rather', 'rd', 're', 'really', 'reasonably',
         'regarding', 'regardless', 'regards', 'relatively', 'respectively', 'right', 's', 'said', 'same', 'saw', 'say',
         'saying', 'says', 'second', 'secondly', 'see', 'seeing', 'seem', 'seemed', 'seeming', 'seems', 'seen', 'self',
         'selves', 'sensible', 'sent', 'serious', 'seriously', 'seven', 'several', 'shall', 'she', 'should',
         "shouldn't", 'since', 'six', 'so', 'some', 'somebody', 'somehow', 'someone', 'something', 'sometime',
         'sometimes', 'somewhat', 'somewhere', 'soon', 'sorry', 'specified', 'specify', 'specifying', 'still', 'sub',
         'such', 'sup', 'sure', 't', "t's", 'take', 'taken', 'tell', 'tends', 'th', 'than', 'thank', 'thanks', 'thanx',
         'that', "that's", 'thats', 'the', 'their', 'theirs', 'them', 'themselves', 'then', 'thence', 'there',
         "there's", 'thereafter', 'thereby', 'therefore', 'therein', 'theres', 'thereupon', 'these', 'they', "they'd",
         "they'll", "they're", "they've", 'think', 'third', 'this', 'thorough', 'thoroughly', 'those', 'though',
         'three', 'through', 'throughout', 'thru', 'thus', 'to', 'together', 'too', 'took', 'toward', 'towards',
         'tried', 'tries', 'truly', 'try', 'trying', 'twice', 'two', 'u', 'un', 'under', 'unfortunately', 'unless',
         'unlikely', 'until', 'unto', 'up', 'upon', 'us', 'use', 'used', 'useful', 'uses', 'using', 'usually', 'uucp',
         'v', 'value', 'various', 'very', 'via', 'viz', 'vs', 'w', 'want', 'wants', 'was', "wasn't", 'way', 'we',
         "we'd", "we'll", "we're", "we've", 'welcome', 'well', 'went', 'were', "weren't", 'what', "what's", 'whatever',
         'when', 'whence', 'whenever', 'where', "where's", 'whereafter', 'whereas', 'whereby', 'wherein', 'whereupon',
         'wherever', 'whether', 'which', 'while', 'whither', 'who', "who's", 'whoever', 'whole', 'whom', 'whose', 'why',
         'will', 'willing', 'wish', 'with', 'within', 'without', "won't", 'wonder', 'would', 'would', "wouldn't", 'x',
         'y', 'yes', 'yet', 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves',
         'z', 'zero', '-', '=', '!', '@', '#', '$', '%', '^', '^', '&', '*', '[', ']', '{', '}', '|', '>', '<', '?',
         ':', ';', '_','a','A']
    # Removing stop words from the list
    frequent_words_final = []
    count = 0
    for word in titles:
        if word == "-" or word == "_":
            continue
        elif word.lower() in x:
            continue
        elif word.upper() in x:
            continue
        elif word.capitalize() in x:
            continue
        elif word.strip().isdigit():
            continue
        elif len(word) <= 2:
            continue
        elif word.capitalize() in frequent_words_final or word.lower() in frequent_words_final or word.capitalize() in frequent_words_final:
            continue
        elif word.isalpha():
            count += 1
            word = re.sub(r'[^\w\s]', '', word)
            word = word.capitalize()
            frequent_words_final.append(word)
    # Counter of frequent words
    frequent_words_counter = (Counter(frequent_words_final))
    # Using most common method to fetch top 30 words
    if len(frequent_words_counter) < 30:
        frequent_30_words = frequent_words_counter.most_common(len(frequent_words_counter))
    else:
        frequent_30_words = frequent_words_counter.most_common(30)
    # Convert from tuple to list
    frequent_30_words_list = []
    for i, j in frequent_30_words:
        frequent_30_words_list.append(i)
    # Most frequent words
    return frequent_30_words_list


application = Flask(__name__)


@application.route('/newshome', methods=['GET'])
def index():
    return application.send_static_file("html/index.html")


@application.route('/getnews', methods=['GET'])
def fetchnews():
    print("===================Fetching from here========================")
    empty = ['null', 'Null', 'None', 'none', ' ', '', None]
    newsapi = NewsApiClient(api_key="[API-KEY]")
    top_headlines = newsapi.get_top_headlines(language='en', country='us', page_size=30)
    top_headlines_sources = newsapi.get_top_headlines(sources='cnn,fox-news', language='en')
    # Get even sources, to populate the initial select tag
    initial_sources = []
    sources_json = newsapi.get_sources(language='en', country='us')
    for source in sources_json['sources']:
        source_id = source['id']
        initial_sources.append(source_id.strip())
    # Process the data, and send the JSON data
    """ 
    Can be done in 2 ways,
    Method 1: Process the data backend and send only necessary JSON.
    Method 2: Send the entire data and handle it as Javascript Object.
    """
    # Slider Data
    slider_images = []
    slider_descriptions = []
    slider_titles = []
    slider_urls = []
    slider_authors = []
    count = 0
    for headline in top_headlines['articles']:
        count += 1
        try:
            if (headline['urlToImage'] not in empty) and (headline['description'] not in empty) and (
                    headline['title'] not in empty) and (headline['url'] not in empty) and (
                    headline['author'] not in empty):
                slider_images.append(headline['urlToImage'])
                slider_descriptions.append(headline['description'].strip("..."))
                slider_titles.append(headline['title'])
                slider_urls.append(headline['url'])
                slider_authors.append(headline['author'])
        except KeyError:
            continue

    frequent_words = frequency_counter(top_headlines)
    words_list = []
    word = "word"
    size = "size"
    for word_i, words in enumerate(frequent_words):
        if word_i == 4 or word_i == 8 or word_i == 12:
            words = words.replace(",", "")
            hashset = dict()
            # if word not in hashset:
            hashset[word] = words
            hashset[size] = str(randint(20, 27))
            words_list.append(hashset)
        elif word_i == 1 or word_i == 3 or word_i == 6 or word_i == 9:
            words = words.replace(",", "")
            hashset = dict()
            # if word not in hashset:
            hashset[word] = words
            hashset[size] = str(randint(10, 15))
            words_list.append(hashset)
        else:
            words = words.replace(",", "")
            hashset = dict()
            # if word not in hashset:
            hashset[word] = words
            hashset[size] = str(randint(5, 11))
            words_list.append(hashset)

    # CNN
    cnn_images = []
    cnn_descriptions = []
    cnn_titles = []
    cnn_urls = []
    cnn_authors = []

    # Fox-news
    fox_images = []
    fox_descriptions = []
    fox_titles = []
    fox_urls = []
    fox_authors = []
    for article in top_headlines_sources['articles']:
        source = article['source']
        source_id = source['id'].strip()
        if source_id == 'cnn':
            try:
                if (article['urlToImage'] not in empty) and (article['description'] not in empty) and (
                        article['title'] not in empty) and (article['url'] not in empty) and (
                        article['author'] not in empty):
                    cnn_images.append(article['urlToImage'])
                    cnn_descriptions.append(article['description'])
                    cnn_titles.append(article['title'])
                    cnn_urls.append(article['url'])
                    cnn_authors.append(article['author'])
            except KeyError:
                continue
        if source_id == 'fox-news':
            try:
                if (article['urlToImage'] not in empty) and (article['description'] not in empty) and (
                        article['title'] not in empty) and (article['url'] not in empty) and (
                        article['author'] not in empty):
                    fox_images.append(article['urlToImage'])
                    fox_descriptions.append(article['description'])
                    fox_titles.append(article['title'])
                    fox_urls.append(article['url'])
                    fox_authors.append(article['author'])
            except KeyError:
                continue
    return_data = jsonify(cnn_authors=cnn_authors, cnn_urls=cnn_urls, cnn_titles=cnn_titles,
                          cnn_descriptions=cnn_descriptions, cnn_images=cnn_images,
                          fox_authors=fox_authors, fox_urls=fox_urls, fox_titles=fox_titles,
                          fox_descriptions=fox_descriptions, fox_images=fox_images,
                          slider_authors=slider_authors, slider_urls=slider_urls, slider_titles=slider_titles,
                          slider_descriptions=slider_descriptions, slider_images=slider_images,
                          words_list=words_list, initial_sources=initial_sources
                          )

    return return_data


@application.route('/fetchsearch', methods=['GET'])
def get_sources():
    page = request.args.get('page')
    empty = ['null', 'Null', 'None', 'none', ' ', '', None]
    newsapi = NewsApiClient(api_key="[API-KEY]")
    # Search Page
    if page == "searchpage":
        q = request.args.get('q')
        todate = request.args.get('Tdate')
        fromdate = request.args.get('Fdate')
        category = request.args.get('category')
        source = request.args.get('source')
        try:
            if source == "all":
                all_articles = newsapi.get_everything(q=q, from_param=fromdate, to=todate, language='en')
            else:
                all_articles = newsapi.get_everything(q=q, sources=source, from_param=fromdate, to=todate, language='en')
            # List Data
            list_images = []
            list_authors = []
            list_descriptions = []
            list_titles = []
            list_sources = []
            list_links = []
            list_dates = []

            for news in all_articles['articles']:
                try:
                    if (news['urlToImage'] not in empty) and (news['description'] not in empty) and (news['title'] not in empty) and (news['url'] not in empty) and (news['author'] not in empty) and (news['source'] not in empty) and (news['publishedAt'] not in empty):
                        list_images.append(news['urlToImage'])
                        list_descriptions.append(news['description'])
                        list_titles.append(news['title'])
                        list_links.append(news['url'])
                        list_authors.append(news['author'])
                        source = news['source']
                        source_name = source['name'].strip()
                        list_sources.append(source_name)
                        pub_date = news['publishedAt']
                        published_date_list = pub_date[:10].split("-")
                        published_date = published_date_list[1] + "/" + published_date_list[2] + "/" + published_date_list[0]
                        list_dates.append(published_date)
                except KeyError:
                    continue
            data = jsonify(list_images=list_images, list_descriptions=list_descriptions, list_titles=list_titles, list_links=list_links, list_authors=list_authors, list_sources=list_sources, list_dates=list_dates, length=len(list_sources), message="success")
        except Exception as e:
            error = str(e)
            error_message = ast.literal_eval(error)
            message = error_message['message']
            data = jsonify(message=message)
        return data

    elif page == "sources":
        category = request.args.get('category')
        if category != 'all':
            sources = []
            sources_json = newsapi.get_sources(category=category, language='en', country='us')
            for source in sources_json['sources']:
                source_id = source['id']
                sources.append(source_id.strip())
            return jsonify(sources=sources, lenght=len(sources))
        else:
            sources = []
            sources_json = newsapi.get_sources(language='en', country='us')
            for source in sources_json['sources']:
                source_id = source['id']
                sources.append(source_id.strip())
            return jsonify(sources=sources, lenght=len(sources))


if __name__ == '__main__':
    application.run(debug=False)
