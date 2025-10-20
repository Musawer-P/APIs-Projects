  
  
const modal = document.getElementById("Modal");
const btn = document.getElementById("showFavs");
const closeBtn = document.querySelector(".close");

btn.onclick = () => {
  modal.style.display = "block";
};

closeBtn.onclick = () => {
  modal.style.display = "none";
};

window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

  
  
  
  
  
  
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



