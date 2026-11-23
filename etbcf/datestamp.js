function pad(n) {
    return (n < 10 ? "0" : "") + n;
}

async function date_lastmodified() {
    // GitHub repository information
    const owner = "etbcf";
    const repo = "etbcf.github.io";

    // Identify the current HTML page
    const pathname = window.location.pathname;

    const file = pathname.endsWith("/etbcf/etbcf.html")
        ? "etbcf/etbcf.html"
        : "index.html";

    // Request the latest commit affecting this particular file
    const url =
        `https://api.github.com/repos/${owner}/${repo}/commits?path=${encodeURIComponent(file)}&per_page=1`;

    try {
        const response = await fetch(url, {
            headers: {
                "Accept": "application/vnd.github+json"
            },
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("GitHub API error: " + response.status);
        }

        const commits = await response.json();

        if (!commits.length) {
            return "Unknown";
        }

        const commitDate = commits[0].commit.committer.date;
        const d = new Date(commitDate);

        if (isNaN(d.getTime())) {
            return "Unknown";
        }

        const offset = -d.getTimezoneOffset();
        const sign = offset >= 0 ? "+" : "-";
        const hours = pad(Math.floor(Math.abs(offset) / 60));
        const minutes = pad(Math.abs(offset) % 60);

        return (
            d.getFullYear() + "-" +
            pad(d.getMonth() + 1) + "-" +
            pad(d.getDate()) + " " +
            pad(d.getHours()) + ":" +
            pad(d.getMinutes()) +
            " UTC" + sign + hours + ":" + minutes
        );

    } catch (error) {
        console.error("Could not retrieve modification date:", error);
        return "Unknown";
    }
}

// Display the date where the script is called
date_lastmodified().then(date => {
    document.write(date);
});
