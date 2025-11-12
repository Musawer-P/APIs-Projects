Link of the Project - 
https://quotes-api-mp.netlify.app/

Random Quotes App:

A simple web application that fetches random quotes from the QuoteSlate API and allows users to save their favorite quotes. Users can view and delete favorites in a modal.

Features:

Fetch a random quote on page load or on clicking "Inspire Me".
Save quotes to favorites.
View all favorites in a modal window.
Delete favorites individually.
Persistent storage using localStorage so favorites remain after refreshing the page.
No backend required, fully client-side.

Technologies Used:

HTML
CSS
JavaScript
QuoteSlate API

How It Works:

The app fetches a random quote from the QuoteSlate API using fetch().
Clicking "Inspire Me" fetches a new random quote.
Clicking "Save" stores the currently displayed quote in the favorites array and saves it in localStorage.
Clicking "Show Favorites" opens a modal displaying all saved quotes.
Each favorite can be deleted by clicking the Delete button in the modal.