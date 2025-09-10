  lucide.createIcons();


   const results = document.getElementById("results");
    const favList = document.getElementById("favList");

    async function searchBooks() {
      const query = document.getElementById("searchBox").value.trim();
      const category = document.getElementById("categoryFilter").value;
      if (!query) return;

      results.innerHTML = "<p>Loading...</p>";

      const url = `https://www.googleapis.com/books/v1/volumes?q=${query}${category ? "+subject:" + category : ""}&maxResults=10`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.items) {
        results.innerHTML = "<p>No results found.</p>";
        return;
      }

      results.innerHTML = "";
      data.items.forEach(book => {
        const info = book.volumeInfo;
        const card = document.createElement("div");
        card.className = "book-card";

        card.innerHTML = `
          <img src="${info.imageLinks ? info.imageLinks.thumbnail : 'https://via.placeholder.com/100x150'}" alt="${info.title}">
          <div class="info">
            <h3>${info.title}</h3>
            <p><strong>Author:</strong> ${info.authors ? info.authors.join(", ") : "Unknown"}</p>
            <p><strong>Category:</strong> ${info.categories ? info.categories.join(", ") : "N/A"}</p>
            <p><strong>Rating:</strong> ⭐ ${info.averageRating || "N/A"}</p>
            <p>${info.description ? info.description.substring(0, 120) + "..." : "No description."}</p>
            <button class="save-btn" onclick="saveBook('${info.title}')">❤️ Save</button>
          </div>
        `;
        results.appendChild(card);
      });
    }

    function saveBook(title) {
      let saved = JSON.parse(localStorage.getItem("favorites")) || [];
      if (!saved.includes(title)) {
        saved.push(title);
        localStorage.setItem("favorites", JSON.stringify(saved));
      }
      renderFavorites();
    }

    function renderFavorites() {
      let saved = JSON.parse(localStorage.getItem("favorites")) || [];
      favList.innerHTML = "";
      saved.forEach(title => {
        const li = document.createElement("li");
        li.textContent = title;
        favList.appendChild(li);
      });
    }

    // Load saved list on page load
    renderFavorites();