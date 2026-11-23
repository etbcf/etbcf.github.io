function pad(n) {
    return (n < 10 ? "0" : "") + n;
}

(function () {
    "use strict";

    const owner = "etbcf";
    const repo = "etbcf.github.io";

    // Identify the current HTML page.
    const pathname = window.location.pathname;

    const file = pathname.endsWith("/etbcf/etbcf.html")
        ? "etbcf/etbcf.html"
        : "index.html";

    // Create the timestamp element at the script's original position.
    const script = document.currentScript;
    const timestamp = document.createElement("span");

    timestamp.textContent = "Loading date...";
    script.parentNode.replaceChild(timestamp, script);

    // Retrieve the latest commit for this specific HTML file.
    const url =
        `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(file)}&per_page=1`;

    fetch(url, {
        headers: {
            "Accept": "application/vnd.github+json"
        },
        cache: "no-store"
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("GitHub API error: " + response.status);
            }

            return response.json();
        })
        .then(commits => {
            if (!commits.length) {
                throw new Error("No commit found.");
            }

            const commitDate =
                commits[0].commit.committer.date;

            const d = new Date(commitDate);

            if (isNaN(d.getTime())) {
                throw new Error("Invalid date.");
            }

            const offset = -d.getTimezoneOffset();
            const sign = offset >= 0 ? "+" : "-";

            const hours = pad(Math.floor(Math.abs(offset) / 60));
            const minutes = pad(Math.abs(offset) % 60);

            timestamp.textContent =
                d.getFullYear() + "-" +
                pad(d.getMonth() + 1) + "-" +
                pad(d.getDate()) + " " +
                pad(d.getHours()) + ":" +
                pad(d.getMinutes()) +
                " UTC" + sign + hours + ":" + minutes;
        })
        .catch(error => {
            console.error("Date error:", error);
            timestamp.textContent = "Unknown";
        });
})();
