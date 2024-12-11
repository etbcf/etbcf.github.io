function toggleTheme() {
    var body = document.body;
    var paragraphs = document.querySelectorAll("p");
    var lightIcon = document.getElementById("light-icon");
    var darkIcon = document.getElementById("dark-icon");
    
    // Toggle body background color between #212121 and #ffffff
    if (body.style.backgroundColor === "rgb(33, 33, 33)") {
        body.style.backgroundColor = "#ffffff";
        // Set text color of paragraphs to #212121
        for (var i = 0; i < paragraphs.length; i++) {
            paragraphs[i].style.color = "#212121";
        }
        // Change icon to dark theme
        lightIcon.style.display = "none";
        darkIcon.style.display = "inline-block";
    } else {
        body.style.backgroundColor = "#212121";
        // Set text color of paragraphs to #a39d9d
        for (var i = 0; i < paragraphs.length; i++) {
            paragraphs[i].style.color = "#a39d9d";
        }
        // Change icon to light theme
        lightIcon.style.display = "inline-block";
        darkIcon.style.display = "none";
    }
}

