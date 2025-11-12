const modal = document.getElementById("Modal");
const showFavsBtn = document.getElementById("showFavs");
const closeBtn = document.querySelector(".close");

showFavsBtn.onclick = () => {
  modal.style.display = "block";
  showFavorites();
};

// Close modal
closeBtn.onclick = () => {
  modal.style.display = "none";
};

// Close modal if click outside
window.onclick = (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
};

const inspireBtn = document.getElementById('inspireBtn');
const quoteText = document.getElementById('quote');
const quoteAuthor = document.getElementById('quote-author');
const saveBtn = document.getElementById('save');
const favoritesContainer = document.querySelector('.main-fav-row');

let cache = null; // store current quote
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

async function fetchRandomQuote() {
  try {
    const res = await fetch('https://quoteslate.vercel.app/api/quotes/random');
    const data = await res.json();

    if (Array.isArray(data) && data.length > 0) {
      return { content: data[0].quote, author: data[0].author };
    }
    if (data.quote) {
      return { content: data.quote, author: data.author };
    }
    return { content: "No quote found.", author: "" };
  } catch (e) {
    return { content: "Could not load quote.", author: "" };
  }
}

async function showQuoteOnClick() {
  const quote = await fetchRandomQuote();
  cache = quote; // store current quote
  quoteText.textContent = quote.content;
  quoteAuthor.textContent = quote.author ? `— ${quote.author}` : '';
}

function addFavorite() {
  if (!cache) return;
  const exists = favorites.some(f => f.content === cache.content && f.author === cache.author);
  if (exists) {
    alert('This quote is already in favorites!');
    return;
  }
  favorites.push(cache);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  alert('Saved to Favorites!');
  showFavorites();
}

function showFavorites() {
  favoritesContainer.innerHTML = '';
  if (favorites.length === 0) {
    favoritesContainer.innerHTML = '<p id = "no-favorites">No favorites yet.</p>';
    return;
  }

  favorites.forEach((f, index) => {
    const div = document.createElement('div');
    div.className = 'fav-row';
    div.innerHTML = `
      <p>${f.content}</p>
      <p>— ${f.author}</p>
      <button class="deleteFav" data-index="${index}">Delete</button>
    `;
    favoritesContainer.appendChild(div);
  });

  document.querySelectorAll('.deleteFav').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.getAttribute('data-index');
      deleteFavorite(index);
    });
  });
}

function deleteFavorite(index) {
  favorites.splice(index, 1);
  localStorage.setItem('favorites', JSON.stringify(favorites));
  showFavorites();
}

inspireBtn.addEventListener('click', showQuoteOnClick);
saveBtn.addEventListener('click', addFavorite);

showQuoteOnClick();
