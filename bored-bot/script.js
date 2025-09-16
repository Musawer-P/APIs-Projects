function getActivityIdea() {
    fetch("https://apis.scrimba.com/bored/api/activity")
        .then(res => res.json())
        .then(data => {
            document.getElementById("idea").textContent = data.activity
            document.body.classList.add("fun")
            document.getElementById("title").textContent = "🦾 HappyBot🦿"
        })
}

document.getElementById("bored-button").addEventListener("click", getActivityIdea)


// Category Filter (Pick the type of activity)

function getActivityByType(type) {
    fetch(`https://apis.scrimba.com/bored/api/activity?type=${type}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById("idea").textContent = data.activity
        })
}

document.getElementById("category").addEventListener("change", (e) => {
    getActivityByType(e.target.value)
})


// Activity Saver (Favorite List)


function saveIdea() {
    let idea = document.getElementById("idea").textContent
    if (!idea) return
    let saved = JSON.parse(localStorage.getItem("ideas")) || []
    saved.push(idea)
    localStorage.setItem("ideas", JSON.stringify(saved))
    alert("Idea saved! 🎉")
}
document.getElementById("save-button").addEventListener("click", saveIdea)


// Dark/Light Fun Mode

document.getElementById("mode-toggle").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode")
})
