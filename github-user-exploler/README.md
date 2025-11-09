link of the project - 
https://github-user-explorer-me.netlify.app/

GitHub User Explorer:

GitHub User Explorer is a simple JavaScript project that allows users to explore real GitHub profiles using the public GitHub API. You can search for any GitHub username and instantly view their profile picture, name, bio, followers, following, and public repositories.

Features:

Search for any GitHub user by username
Display the user’s avatar, name, and bio
Show total followers, following, and public repositories
Fetch and list the of the user
Works directly with the GitHub REST API (no authentication required)

Technologies Used:

HTML
CSS
JavaScript
GitHub REST API

How It Works:

Enter a GitHub username in the search box.
Click the search button.
The app fetches the user’s details and displays them in a clean card layout.
It also loads and displays repositories, including stars and forks count.

Project Structure:

index.html – Contains the main layout and HTML structure.
style.css – Handles the design and styling of the profile and repository cards.
script.js – Includes all JavaScript logic for fetching and displaying data.

API Reference:
This project uses the GitHub public API.
Get user details: https://api.github.com/users/{username}

Get repositories: https://api.github.com/users/{username}/repos?sort=updated&per_page=5

How to Run:

Clone or download the project files.
Open index.html in your browser.
Type any GitHub username in the search input and press the “Search” button.

Example:

Search for the username torvalds and you’ll see Linus Torvalds’s GitHub profile, bio, followers, and some of his repositories.