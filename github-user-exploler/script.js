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
