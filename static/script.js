// Set background images from data-bg attribute
var slides = document.querySelectorAll(".slide");
slides.forEach(function(slide) {
    var bg = slide.getAttribute("data-bg");
    if (bg && bgUrls[bg]) {
        slide.style.backgroundImage = "url('" + bgUrls[bg] + "')";
    }
});

// SLIDESHOW
var current = 0;
var DEFAULT_DURATION = 5000;

function getDuration(slide) {
    var d = slide.getAttribute("data-duration");
    return d ? parseInt(d) : DEFAULT_DURATION;
}

function showSlide(index) {
    slides.forEach(function(s) { s.classList.remove("active"); });
    var slide = slides[index];
    slide.classList.add("active");

    // Zoom animation on love slide
    if (slide.classList.contains("love-slide")) {
        var lt = slide.querySelector(".love-text");
        if (lt) {
            lt.classList.remove("zoom-in");
            void lt.offsetWidth;
            lt.classList.add("zoom-in");
        }
    }

    // Pulse animation for countdown
    if (slide.classList.contains("countdown-slide")) {
        var ct = slide.querySelector(".countdown-text");
        if (ct) {
            ct.classList.remove("pulse-in");
            void ct.offsetWidth;
            ct.classList.add("pulse-in");
        }
    }

    var duration = getDuration(slide);
    setTimeout(function() {
        current++;
        if (current >= slides.length) {
            document.getElementById("slideshow").style.display = "none";
            document.getElementById("proposalSection").classList.remove("hidden");
        } else {
            showSlide(current);
        }
    }, duration);
}

showSlide(0);

// BUTTONS
var yesBtn = document.getElementById("yesBtn");
var noBtn  = document.getElementById("noBtn");
var noResponse = document.getElementById("noResponse");

var noClickCount = 0;
var noMessages = [
    "Are you sure? 🥺",
    "Think carefully 😭",
    "I'll be sad...",
    "No option removed 😂"
];

function sendChoice(choice) {
    fetch('/choice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choice: choice })
    }).catch(function(){});
}

function runNoBtn() {
    noClickCount++;
    noResponse.textContent = noMessages[Math.min(noClickCount - 1, noMessages.length - 1)];

    if (noClickCount >= 4) {
        noBtn.style.display = "none";
        sendChoice("no");
        return;
    }

    var bottom = document.querySelector(".proposal-bottom");
    var rect = bottom.getBoundingClientRect();
    var btnW = noBtn.offsetWidth  || 100;
    var btnH = noBtn.offsetHeight || 50;
    var maxX = rect.width  - btnW - 10;
    var maxY = rect.height - btnH - 10;
    var rx = Math.max(10, Math.random() * maxX);
    var ry = Math.max(10, Math.random() * maxY);

    noBtn.style.left = rx + "px";
    noBtn.style.top  = ry + "px";

    sendChoice("no");
}

noBtn.addEventListener("mouseenter", runNoBtn);
noBtn.addEventListener("touchstart", function(e) {
    e.preventDefault();
    runNoBtn();
}, { passive: false });

yesBtn.addEventListener("click", function() {
    sendChoice("yes");
    document.body.innerHTML =
        '<div class="yes-screen">' +
            '<h1>YAYYYYY ❤️</h1>' +
            '<p>Since 31 Aug 2023, 2:45 PM&hellip;<br>my life accidentally started updating itself 😂✨</p>' +
            '<p style="margin-top:16px">And now you officially unlocked unlimited care,<br>random affection, and future food dates 🍕💕</p>' +
        '</div>';
});
