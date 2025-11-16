Link of the Project - 
https://book-search-mp.netlify.app/

Books Search API:

This project is a simple and clean book search interface built using the Google Books API. The goal of the app is to let users search for any book and instantly see detailed information inside a modern, minimal UI.
The design focuses on clarity, fast results, and easy reading of book details.

Features:

Search for any book using the Google Books API.
Shows:
Book title
Full description
Author name
Total number of pages
Language of the book
ISBN-10
ISBN-13
Categories / Genre
Average rating
Book cover image
Search triggers when you press Enter.
Smooth loading animation that appears while fetching the book.
Clean layout matching the design of the main book preview section.
Automatic update of all text fields and poster image based on the search result.

How It Works:

The user types a book name in the search bar, presses Enter, and the app sends a request to:
https://www.googleapis.com/books/v1/volumes?q=yourQuery&maxResults=1
The API returns book data, which is then displayed inside the template:
The poster image updates
The title changes
The description is added
All information rows update automatically
The loading animation appears during the API fetch and disappears when the data is ready.

Technologies Used:

HTML for structure
CSS for design and layout
JavaScript for API calls and interactive logic
Google Books API for book information
Lucide icons for UI styling

How to Use:

Open the project in any browser.
Type a book name into the search bar at the top.
Press Enter.
The book information will load and replace the default content immediately.

File Structure:

index.html – Page layout and structure
style.css – All styling for the header, main section, book details, and loader animation
script.js – Handles API requests, search functionality, and updates the UI

API Source:

This project uses the Google Books API.
More info: https://developers.google.com/books