function pad(n) {
    return (n < 10 ? "0" : "") + n;
}

function date_lastmodified() {
    const d = new Date(document.lastModified);

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
}

document.write(date_lastmodified());
