
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
      return `https://source.unsplash.com/600x400/?${encodeURIComponent(q)}&sig=${Math.random()}`;
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
      wikiFact.textContent = wiki ? 'Fact: ' + wiki : '';
      bgImage.src = imageUrl;
    }

    function addFavorite(){
      if(!cache.quote) return;
      favorites.push(cache);
      alert('Saved!');
    }

    function showFavorites(){
      favoritesList.innerHTML = '';
      favorites.forEach(f => {
        const div = document.createElement('div');
        div.textContent = `${f.quote.content} — ${f.quote.author}`;
        favoritesList.appendChild(div);
      });
    }

    inspireBtn.addEventListener('click', generateInspiration);
    saveFav.addEventListener('click', addFavorite);
    showFavs.addEventListener('click', showFavorites);
    clearFavs.addEventListener('click', ()=>{favorites=[];favoritesList.innerHTML='';});




      const quoteEl = document.getElementById("quote");
    const authorEl = document.getElementById("author");
    const newQuoteBtn = document.getElementById("newQuote");
    const copyBtn = document.getElementById("copyQuote");

    async function getQuote() {
      try {
        const res = await fetch("https://api.quotable.io/random");
        const data = await res.json();
        quoteEl.textContent = `"${data.content}"`;
        authorEl.textContent = `- ${data.author}`;
      } catch (error) {
        quoteEl.textContent = "Oops! Couldn't load a quote.";
        authorEl.textContent = "";
      }
    }

    // Copy quote to clipboard
    copyBtn.addEventListener("click", () => {
      const text = `${quoteEl.textContent} ${authorEl.textContent}`;
      navigator.clipboard.writeText(text).then(() => {
        alert("Quote copied to clipboard!");
      });
    });

    // Load first quote + button action
    newQuoteBtn.addEventListener("click", getQuote);
    getQuote();