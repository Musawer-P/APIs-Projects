async function getUser() {
  const username = document.getElementById("username").value;
  if (!username) return alert("Please enter a username");

  const profileRes = await fetch(`https://api.github.com/users/${username}`);
  const profile = await profileRes.json();

  const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
  const repos = await reposRes.json();

  document.getElementById("profile").innerHTML = `
    <h2>${profile.name || profile.login}</h2>
    <img src="${profile.avatar_url}" width="120" style="border-radius:50%">
    <p>${profile.bio || "No bio available"}</p>
    <p>Followers: ${profile.followers} | Following: ${profile.following}</p>
    <p>Public Repos: ${profile.public_repos}</p>
  `;

  document.getElementById("repos").innerHTML = `
    <h3>Repositories</h3>
    <ul>
      ${repos.map(repo => `
        <li>
          <a href="${repo.html_url}" target="_blank">${repo.name}</a> ⭐ ${repo.stargazers_count}
        </li>
      `).join("")}
    </ul>
  `;
}





// Top Repository Feature


 async function getUser() {
      const username = document.getElementById("username").value;
      if (!username) return alert("Please enter a username");

      // Fetch profile
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      const userData = await userRes.json();

      if (userData.message === "Not Found") {
        document.getElementById("profile").innerHTML = "<p>User not found</p>";
        document.getElementById("repos").innerHTML = "";
        return;
      }

      document.getElementById("profile").innerHTML = `
        <img src="${userData.avatar_url}" alt="Avatar">
        <h2>${userData.name || userData.login}</h2>
        <p>${userData.bio || "No bio available"}</p>
        <p>Followers: ${userData.followers} | Following: ${userData.following}</p>
        <p>Public Repos: ${userData.public_repos}</p>
        <a href="${userData.html_url}" target="_blank">View Profile</a>
      `;

      // Fetch repos
      const repoRes = await fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`);
      const reposData = await repoRes.json();

      let reposHTML = "<h3>Top Repositories</h3>";
      reposData.forEach(repo => {
        reposHTML += `
          <div class="repo">
            <a href="${repo.html_url}" target="_blank"><strong>${repo.name}</strong></a>
            <p>${repo.description || "No description"}</p>
            <p>⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | 🛠️ ${repo.language || "N/A"}</p>
          </div>
        `;
      });

      document.getElementById("repos").innerHTML = reposHTML;
    }
