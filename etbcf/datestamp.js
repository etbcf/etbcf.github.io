/*
 * Displays the last Git commit date for the current HTML page.
 * Requires the GitHub repository to be public.
 */
(() => {
  "use strict";

  const owner = "etbcf";
  const repo = "etbcf.github.io";

  const pathname = window.location.pathname.replace(/\/+$/, "");
  const pagePath = pathname.endsWith("/etbcf/etbcf.html")
    ? "etbcf/etbcf.html"
    : "index.html";

  const dateElement =
    document.getElementById("lastModified") ||
    document.getElementById("datestamp") ||
    document.querySelector("[data-datestamp]");

  if (!dateElement) {
    console.warn("Date stamp element not found.");
    return;
  }

  const apiUrl =
    `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(pagePath)}&per_page=1`;

  fetch(apiUrl, {
    headers: { Accept: "application/vnd.github+json" },
    cache: "no-store"
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`GitHub API returned HTTP ${response.status}`);
      }
      return response.json();
    })
    .then(commits => {
      if (!Array.isArray(commits) || commits.length === 0) {
        throw new Error(`No commits found for ${pagePath}`);
      }

      const commitDate =
        commits[0].commit.committer?.date ||
        commits[0].commit.author?.date;

      if (!commitDate) {
        throw new Error("The latest commit has no date.");
      }

      const date = new Date(commitDate);

      dateElement.textContent = date.toLocaleString(undefined, {
        dateStyle: "long",
        timeStyle: "short"
      });

      dateElement.setAttribute("datetime", date.toISOString());
    })
    .catch(error => {
      console.error("Could not load the page's last-modified date:", error);
      dateElement.textContent = "Date unavailable";
    });
})();
