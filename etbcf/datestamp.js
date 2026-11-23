/*
 * Displays the last modification commit date for the current page.
 * Requires a public GitHub repository.
 */
(() => {
    "use strict";

    const owner = "etbcf";
    const repo = "etbcf.github.io";

    // Identify the HTML file currently being viewed.
    const pathname = window.location.pathname.replace(/\/+$/, "");

    const pagePath = pathname.endsWith("/etbcf/etbcf.html")
        ? "etbcf/etbcf.html"
        : "index.html";

    // Find the script element that loaded this file.
    const scriptElement = document.currentScript;

    if (!scriptElement) {
        console.error("Could not locate the date-stamp script.");
        return;
    }

    // Create the timestamp where the script is located.
    const dateElement = document.createElement("span");
    dateElement.textContent = "Loading update date…";
    scriptElement.replaceWith(dateElement);

    // Ask GitHub for the latest commit affecting this specific file.
    const apiUrl =
        `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(pagePath)}&per_page=1`;

    fetch(apiUrl, {
        headers: {
            Accept: "application/vnd.github+json"
        },
        cache: "no-store"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
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
                throw new Error("Commit date unavailable.");
            }

            const date = new Date(commitDate);

            dateElement.textContent = date.toLocaleString(undefined, {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            });

            dateElement.setAttribute(
                "datetime",
                date.toISOString()
            );

            dateElement.title = `Last update: ${pagePath}`;
        })
        .catch(error => {
            console.error("Date stamp error:", error);
            dateElement.textContent = "Update date unavailable";
        });
})();
