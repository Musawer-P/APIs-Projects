Link of the Project - 
https://recipes-finder-mp.netlify.app/


Recipe Finder:

A simple and fast recipe search tool that allows users to find real recipes by typing any food name. The app displays the recipe title, a short description, calories, and cooking time, fetched directly from the Spoonacular API.

Features:

Instant Recipe Search — type a food name and press Enter
Real Recipe Title & Description
Calories Display
Cooking Time (Ready in Minutes)
Clean UI that auto-updates when you search
Minimal and lightweight JavaScript
Lucide icons included

How It Works:

The user enters a recipe name (example: “pizza”).
The app sends a request to:
https://api.spoonacular.com/recipes/complexSearch

API Setup:

This project uses the Spoonacular API.
Get your free API key:
https://spoonacular.com/food-api
Then paste your API key inside script.js:
const API_KEY = "YOUR_API_KEY_HERE";

Technologies Used:

HTML5
CSS3
JavaScript (ES6)
Spoonacular API
Lucide Icons

How to Use:

Open the project in a browser
Type a food name in the search bar
Press Enter
Instantly see:
✔ Title
✔ Description
✔ Calories
✔ Cooking time

Example Search:

Searching "Pizza" might return:
Title: Homemade Pizza
Description: A crispy and flavorful Italian classic…
Time: 30 Min
Calories: 250 Calories