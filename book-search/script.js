lucide.createIcons();

const searchInput = document.querySelector(".search-text");
const posterImg = document.querySelector(".poster-img");
const titleEl = document.querySelector(".book-desc h2");
const descEl = document.querySelector(".book-desc p");
const rows = document.querySelectorAll(".row-p"); 

const authorRow = rows[0].querySelector("#p-p");
const pagesRow = rows[1].querySelector("#p-p");
const languageRow = rows[2].querySelector("#p-p");
const isbn10Row = rows[3].querySelector("#p-p");
const isbn13Row = rows[4].querySelector("#p-p");
const categoryRow = rows[5].querySelector("#p-p");
const ratingRow = rows[6].querySelector("#p-p");

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") searchBook();
});

async function searchBook() {
  const query = searchInput.value.trim();
  if (!query) return;

  const url = `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    titleEl.textContent = "No book found";
    descEl.textContent = "";
    return;
  }

  const info = data.items[0].volumeInfo;

  posterImg.src =
    info.imageLinks?.thumbnail ||
    "https://via.placeholder.com/200x300?text=No+Image";

  titleEl.textContent = info.title || "No Title";

  descEl.textContent =
    info.description
      ? info.description.substring(0, 300) + "..."
      : "No description available.";

  authorRow.textContent = info.authors ? info.authors.join(", ") : "Unknown";

  pagesRow.textContent = info.pageCount
    ? `${info.pageCount} pages`
    : "N/A";

  languageRow.textContent = info.language
    ? info.language.toUpperCase()
    : "N/A";

  let isbn10 = "N/A";
  let isbn13 = "N/A";

  if (info.industryIdentifiers) {
    info.industryIdentifiers.forEach((id) => {
      if (id.type === "ISBN_10") isbn10 = id.identifier;
      if (id.type === "ISBN_13") isbn13 = id.identifier;
    });
  }

  isbn10Row.textContent = isbn10;
  isbn13Row.textContent = isbn13;

  categoryRow.textContent = info.categories
    ? info.categories.join(", ")
    : "N/A";

  ratingRow.textContent = info.averageRating
    ? info.averageRating + " ⭐"
    : "No rating";
}
