<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inspiration Hub</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
      text-align: center;
    }
    .container {
      max-width: 700px;
      margin: auto;
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    #bgImage {
      width: 100%;
      max-height: 400px;
      object-fit: cover;
      border-radius: 10px;
      margin: 15px 0;
    }
    .quote {
      font-size: 1.4em;
      margin: 15px 0;
      font-weight: bold;
    }
    .author {
      font-style: italic;
      color: #555;
      margin-bottom: 15px;
    }
    #wikiFact {
      font-size: 1em;
      margin: 10px 0;
      color: #333;
    }
    button {
      margin: 6px;
      padding: 10px 18px;
      border: none;
      border-radius: 5px;
      background: #007bff;
      color: white;
      font-size: 1em;
      cursor: pointer;
    }
    button:hover { background: #0056b3; }
    #favoritesList {
      margin-top: 15px;
      padding: 10px;
      background: #f9f9f9;
      border-radius: 8px;
      text-align: left;
    }
    .fav-item {
      margin-bottom: 8px;
      padding: 6px;
      border-bottom: 1px solid #ddd;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🌟 Inspiration Hub</h1>
    <p>Type a mood or topic (like *happiness*, *success*, *life*)</p>
    <input type="text" id="moodInput" placeholder="Enter a topic..." />
    <button id="inspireBtn">Inspire Me</button>

    <img id="bgImage" src="" alt="Inspiration Image">

    <div class="quote" id="quoteText"></div>
    <div class="author" id="quoteAuthor"></div>
    <div id="wikiFact"></div>

    <button id="copyQuote">📋 Copy Quote</button>
    <button id="saveFav">⭐ Save Favorite</button>
    <button id="showFavs">📂 Show Favorites</button>
    <button id="clearFavs">🗑 Clear Favorites</button>

    <div id="favoritesList"></div>
  </div>

  <script>
    const moodInput = document.getElementById('moodInput');
    const inspireBtn = document.getElementById('inspireBtn');
    const quoteText = document.getElementById('quoteText');
    const quoteAuthor = document.getElementById('quoteAuthor');
    const wikiFact = document.getElementById('wikiFact');
    const bgImage = document.getElementById('bgImage');
    const saveFav = document.getElementById('saveFav');
    const showFavs = document.getElementById('showFavs');
    const clearFavs = document.getElementById('clearFavs');
    const favoritesList = document.getElementById('favoritesList');
    const copyBtn = document.getElementById("copyQuote");

    let cache = {};
    let favorites = [];

    async function fetchQuote(topic){
      try{
        const res = await fetch('https://api.quotable.io/random' + (topic ? '?tags=' + encodeURIComponent(topic) : ''));
        const data = await res.json();
        return { content: data.content, author: data.author };
      }catch(e){ return { content: 'Could not load quote.', author: '' }; }
    }

    async function fetchImage(topic){
      const q = topic ? topic : 'inspiration';
      return `https://source.unsplash.com/800x400/?${encodeURIComponent(q)}&sig=${Math.random()}`;
    }

    async function fetchWikiSnippet(topic){
      if(!topic) return '';
      try{
        const s = await (await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`)).json();
        const first = s?.query?.search?.[0];
        if(!first) return '';
        const title = first.title;
        const p = await (await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)).json();
        return p.extract || '';
      }catch(e){return ''}
    }

    async function generateInspiration(){
      const topic = moodInput.value.trim();
      const [quote, imageUrl, wiki] = await Promise.all([
        fetchQuote(topic),
        fetchImage(topic),
        fetchWikiSnippet(topic)
      ]);
      cache = {quote, imageUrl, wiki};
      quoteText.textContent = quote.content;
      quoteAuthor.textContent = quote.author ? '— ' + quote.author : '';
      wikiFact.textContent = wiki ? '💡 Fact: ' + wiki : '';
      bgImage.src = imageUrl;
    }

    function addFavorite(){
      if(!cache.quote) return;
      favorites.push(cache);
      alert('Saved to Favorites!');
    }

    function showFavorites(){
      favoritesList.innerHTML = '';
      if(favorites.length === 0){
        favoritesList.textContent = 'No favorites yet.';
        return;
      }
      favorites.forEach(f => {
        const div = document.createElement('div');
        div.className = 'fav-item';
        div.textContent = `${f.quote.content} — ${f.quote.author}`;
        favoritesList.appendChild(div);
      });
    }

    // Copy current quote
    copyBtn.addEventListener("click", () => {
      if(!cache.quote) return;
      const text = `${cache.quote.content} — ${cache.quote.author}`;
      navigator.clipboard.writeText(text).then(() => {
        alert("Quote copied to clipboard!");
      });
    });

    inspireBtn.addEventListener('click', generateInspiration);
    saveFav.addEventListener('click', addFavorite);
    showFavs.addEventListener('click', showFavorites);
    clearFavs.addEventListener('click', ()=>{favorites=[];favoritesList.innerHTML='';});

    // Load one quote on start
    generateInspiration();