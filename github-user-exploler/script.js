async function getUser() {
  const username = document.getElementById("username").value.trim();
  if (!username) return alert("Please enter a GitHub username");

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    const user = await response.json();

    if (user.message === "Not Found") {
      alert("User not found!");
      return;
    }

    // Update user details in your existing layout
    document.getElementById("character").src = user.avatar_url;
    document.getElementById("c-name").textContent = user.name || user.login;
    document.getElementById("c-description").textContent = user.bio || "No bio available.";
    document.getElementById("followers").textContent = `${user.followers} Followers |`;
    document.getElementById("following").textContent = `${user.following} Following |`;
    document.getElementById("repos").textContent = `${user.public_repos} Repository`;

    // (Optional) show location if available
    if (user.location) {
      document.getElementById("c-description").textContent += ` 🌍 ${user.location}`;
    }

    // Fetch and show top 5 repositories
    const repoResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    const repos = await repoResponse.json();

    const repoList = document.getElementById("repo-list");
    repoList.innerHTML = "<h3>Top Repositories</h3>";

    repos.forEach(repo => {
      repoList.innerHTML += `
        <div class="repo-card">
          <a href="${repo.html_url}" target="_blank"><strong>${repo.name}</strong></a>
          <p>${repo.description || "No description available"}</p>
          <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count}</p>
        </div>
      `;
    });

  } catch (error) {
    console.error("Error fetching GitHub user:", error);
    alert("Failed to fetch data. Please try again later.");
  }
}
