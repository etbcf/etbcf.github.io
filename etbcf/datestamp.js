function pad(n) {
    return (n < 10 ? "0" : "") + n;
}

(async function () {
    "use strict";

    const owner = "etbcf";
    const repo = "etbcf.github.io";

    const pathname = window.location.pathname;

    const file = pathname.endsWith("/etbcf/etbcf.html")
        ? "etbcf/etbcf.html"
        : "index.html";

    // Locate the table cell containing this script.
    const script = document.currentScript;
    const cell = script.parentElement;

    // Display a temporary message without replacing the page.
    const timestamp = document.createElement("span");
    timestamp.textContent = "Loading date...";
    script.replaceWith(timestamp);

    try {
        const url =
            `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(file)}&per_page=1`;

        const response = await fetch(url, {
            headers: {
                Accept: "application/vnd.github+json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("GitHub API error: " + response.status);
        }

        const commits = await response.json();

        if (!commits.length) {
            throw new Error("No commits found.");
        }

        const commitDate =
            commits[0].commit.committer.date;

        const d = new Date(commitDate);

        if (isNaN(d.getTime())) {
            throw new Error("Invalid date.");
        }

        const offset = -d.getTimezoneOffset();
        const sign = offset >= 0 ? "+" : "-";

        timestamp.textContent =
            d.getFullYear() + "-" +
            pad(d.getMonth() + 1) + "-" +
            pad(d.getDate()) + " " +
            pad(d.getHours()) + ":" +
            pad(d.getMinutes()) +
            " UTC" + sign +
            pad(Math.floor(Math.abs(offset) / 60)) + ":" +
            pad(Math.abs(offset) % 60);

    } catch (error) {
        console.error("Timestamp error:", error);
        timestamp.textContent = "Date unavailable";
    }
})();
