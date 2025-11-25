
const OFFLINE_PLAYERS = {
  "cristiano ronaldo": {
    name: "Cristiano Ronaldo",
    img: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Cristiano_Ronaldo_2018.jpg",
    age: 39,
    nationality: "Portugal",
    position: "Forward",
    clubs: [
      { club: "Sporting CP", from: 2002, to: 2003, goals: 5, assists: 2 },
      { club: "Manchester United", from: 2003, to: 2009, goals: 84, assists: 34 },
      { club: "Real Madrid", from: 2009, to: 2018, goals: 450, assists: 120 },
      { club: "Juventus", from: 2018, to: 2021, goals: 101, assists: 22 },
      { club: "Al Nassr", from: 2023, to: 2025, goals: 30, assists: 8 }
    ],
    trophies: ["5× UEFA Champions League", "UEFA European Championship 2016", "Multiple domestic titles", "5× Ballon d'Or"]
  },

  "lionel messi": {
    name: "Lionel Messi",
    img: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Lionel_Messi_20180626.jpg",
    age: 37,
    nationality: "Argentina",
    position: "Forward",
    clubs: [
      { club: "Barcelona", from: 2004, to: 2021, goals: 672, assists: 268 },
      { club: "Paris Saint-Germain", from: 2021, to: 2023, goals: 32, assists: 22 },
      { club: "Inter Miami", from: 2023, to: 2025, goals: 40, assists: 18 }
    ],
    trophies: ["World Cup 2022", "8× Ballon d'Or", "4× UEFA Champions League", "Many domestic titles"]
  },

  "mohamed salah": {
    name: "Mohamed Salah",
    img: "https://upload.wikimedia.org/wikipedia/commons/7/74/Mohamed_Salah_2018.jpg",
    age: 31,
    nationality: "Egypt",
    position: "Forward",
    clubs: [
      { club: "Basel", from: 2012, to: 2014, goals: 20, assists: 8 },
      { club: "Chelsea", from: 2014, to: 2016, goals: 2, assists: 1 },
      { club: "Roma", from: 2016, to: 2017, goals: 19, assists: 6 },
      { club: "Liverpool", from: 2017, to: 2025, goals: 170, assists: 60 }
    ],
    trophies: ["Premier League 2019/20", "UEFA Champions League 2019", "Multiple domestic cups"]
  },

  "kylian mbappe": {
    name: "Kylian Mbappé",
    img: "https://upload.wikimedia.org/wikipedia/commons/1/12/Kylian_Mbapp%C3%A9_2019.jpg",
    age: 25,
    nationality: "France",
    position: "Forward",
    clubs: [
      { club: "Monaco", from: 2015, to: 2017, goals: 27, assists: 13 },
      { club: "Paris Saint-Germain", from: 2017, to: 2025, goals: 250, assists: 90 }
    ],
    trophies: ["World Cup 2018", "Multiple Ligue 1 titles"]
  },

  "erling haaland": {
    name: "Erling Haaland",
    img: "https://upload.wikimedia.org/wikipedia/commons/0/00/Erling_Haaland_2019.jpg",
    age: 23,
    nationality: "Norway",
    position: "Forward",
    clubs: [
      { club: "Molde", from: 2017, to: 2019, goals: 20, assists: 5 },
      { club: "RB Salzburg", from: 2019, to: 2020, goals: 29, assists: 15 },
      { club: "Borussia Dortmund", from: 2020, to: 2022, goals: 86, assists: 20 },
      { club: "Manchester City", from: 2022, to: 2025, goals: 80, assists: 20 }
    ],
    trophies: ["Premier League 2023/24", "Champions League 2022/23"]
  },

  "neymar": {
    name: "Neymar Jr.",
    img: "https://upload.wikimedia.org/wikipedia/commons/7/72/Neymar_2018.jpg",
    age: 32,
    nationality: "Brazil",
    position: "Forward",
    clubs: [
      { club: "Santos", from: 2009, to: 2013, goals: 136, assists: 68 },
      { club: "Barcelona", from: 2013, to: 2017, goals: 105, assists: 70 },
      { club: "Paris Saint-Germain", from: 2017, to: 2025, goals: 150, assists: 90 }
    ],
    trophies: ["Champions League 2015", "Domestic titles", "Olympic Gold 2016"]
  },

  "luka modric": {
    name: "Luka Modrić",
    img: "https://upload.wikimedia.org/wikipedia/commons/6/6f/Luka_Modri%C4%87_2018.jpg",
    age: 39,
    nationality: "Croatia",
    position: "Midfielder",
    clubs: [
      { club: "Dinamo Zagreb", from: 2003, to: 2008, goals: 10, assists: 12 },
      { club: "Tottenham", from: 2008, to: 2012, goals: 6, assists: 12 },
      { club: "Real Madrid", from: 2012, to: 2025, goals: 50, assists: 120 }
    ],
    trophies: ["Ballon d'Or 2018", "Multiple UCL titles", "Domestic titles"]
  },

  "karim benzema": {
    name: "Karim Benzema",
    img: "https://upload.wikimedia.org/wikipedia/commons/9/92/Karim_Benzema_2018.jpg",
    age: 36,
    nationality: "France",
    position: "Forward",
    clubs: [
      { club: "Lyon", from: 2004, to: 2009, goals: 66, assists: 20 },
      { club: "Real Madrid", from: 2009, to: 2023, goals: 300, assists: 120 }
    ],
    trophies: ["Champions League 4×", "Ballon d'Or 2022"]
  },

  "kevin de bruyne": {
    name: "Kevin De Bruyne",
    img: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Kevin_De_Bruyne_2018.jpg",
    age: 32,
    nationality: "Belgium",
    position: "Midfielder",
    clubs: [
      { club: "Genk", from: 2008, to: 2012, goals: 20, assists: 30 },
      { club: "Chelsea", from: 2012, to: 2014, goals: 2, assists: 1 },
      { club: "Wolfsburg", from: 2014, to: 2015, goals: 16, assists: 28 },
      { club: "Manchester City", from: 2015, to: 2025, goals: 100, assists: 180 }
    ],
    trophies: ["Premier League multiple", "Cup titles"]
  },

  "robert lewandowski": {
    name: "Robert Lewandowski",
    img: "https://upload.wikimedia.org/wikipedia/commons/0/0f/Robert_Lewandowski_2019.jpg",
    age: 36,
    nationality: "Poland",
    position: "Forward",
    clubs: [
      { club: "Lech Poznań", from: 2006, to: 2008, goals: 32, assists: 10 },
      { club: "Bayern Munich", from: 2014, to: 2022, goals: 238, assists: 60 },
      { club: "Barcelona", from: 2022, to: 2025, goals: 60, assists: 10 }
    ],
    trophies: ["Multiple Bundesliga titles", "UEFA Super Cup", "FIFA Club World Cup"]
  }
};

// Export for usage when included in browser via <script src="players.js"></script>
window.OFFLINE_PLAYERS = OFFLINE_PLAYERS;
