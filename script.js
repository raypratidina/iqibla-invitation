document.addEventListener('DOMContentLoaded', () => {
    // SPA Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page-section');

    // Function to show specific page
    function showPage(pageId) {
        // Hide all pages
        pages.forEach(page => page.classList.add('hidden'));

        // Show target page
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.remove('hidden');
            window.scrollTo(0, 0);
        }

        // Update Nav Active State
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.target === pageId) {
                item.classList.add('active');
            }
        });
    }

    // Event Listeners for Nav
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.dataset.target;
            showPage(targetId);
        });
    });

    // Default to Video Page
    showPage('page-video');

    // RSVP Form Handling
    const rsvpForm = document.getElementById('rsvp-form');
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('rsvp-name').value;
        const status = document.getElementById('rsvp-status').value;
        const guests = document.getElementById('rsvp-guests').value;
        const messageDoa = document.getElementById('rsvp-doa').value;

        // 1. Process Doa (if not empty)
        if (messageDoa.trim()) {
            const timestamp = new Date().toLocaleString('id-ID');
            const doa = { name, message: messageDoa, timestamp };
            saveDoa(doa);
            // We use setTimeout to ensure it's added after page transition if needed, 
            // but adding immediately to DOM is fine since we are SPA.
            addDoaToDOM(doa, true);
        }

        // 2. Format WhatsApp Message
        // User requested: Output kehadiran direct ke WA
        const waMessage = `Halo, saya *${name}* ingin konfirmasi kehadiran untuk Grand Opening.\n\nStatus: ${status}\nJumlah Tamu: ${guests} orang\n\nTerima kasih.`;

        // Encode URL
        const whatsappUrl = `https://wa.me/6282215159061?text=${encodeURIComponent(waMessage)}`;

        // 3. Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');

        rsvpForm.reset();

        // 4. Navigate to Doa page to see the result
        showPage('page-doa');
    });

    // Doa (Guestbook) Handling
    const doaForm = document.getElementById('doa-form');
    const doaList = document.getElementById('doa-list');
    const modalDoa = document.getElementById('modal-doa');
    const btnOpenDoa = document.getElementById('btn-open-doa');
    const spanClose = document.getElementsByClassName("close-modal")[0];

    // Modal Logic
    if (btnOpenDoa) {
        btnOpenDoa.onclick = function () {
            modalDoa.classList.remove('hidden');
        }
    }

    if (spanClose) {
        spanClose.onclick = function () {
            modalDoa.classList.add('hidden');
        }
    }

    // Close on click outside
    window.onclick = function (event) {
        if (event.target == modalDoa) {
            modalDoa.classList.add('hidden');
        }
    }

    // Load existing doas
    loadDoas();

    doaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('doa-name').value;
        const message = document.getElementById('doa-message').value;
        const timestamp = new Date().toLocaleString('id-ID');

        const doa = { name, message, timestamp };
        saveDoa(doa);
        addDoaToDOM(doa, true); // Add to top
        doaForm.reset();

        // Close modal after submit
        modalDoa.classList.add('hidden');
    });

    function saveDoa(doa) {
        let doas = JSON.parse(localStorage.getItem('grand_opening_doas_live')) || [];
        doas.unshift(doa); // Add to beginning
        localStorage.setItem('grand_opening_doas_live', JSON.stringify(doas));
    }

    function loadDoas() {
        let doas = JSON.parse(localStorage.getItem('grand_opening_doas_live')) || [];


        doaList.innerHTML = '';
        doas.forEach(doa => addDoaToDOM(doa));

        // Also update recent list
        updateRecentDoas(doas);
    }

    function updateRecentDoas(doas) {
        const recentList = document.getElementById('recent-doa-list');
        if (!recentList) return;

        recentList.innerHTML = '';
        // Take top 3
        const top3 = doas.slice(0, 3);

        top3.forEach(doa => {
            const item = document.createElement('div');
            item.className = 'doa-item';
            item.style.fontSize = '0.9rem'; // Slightly smaller
            item.innerHTML = `
                <strong style="color:var(--primary-dark)">${escapeHtml(doa.name)}</strong>
                <p style="margin: 5px 0; font-style:italic">"${escapeHtml(doa.message)}"</p>
                <span class="time" style="font-size:0.7rem">${doa.timestamp}</span>
            `;
            recentList.appendChild(item);
        });
    }

    function addDoaToDOM(doa, animate = false) {
        const item = document.createElement('div');
        item.className = 'doa-item';
        if (animate) {
            item.style.animation = 'fadeIn 0.5s ease-out';
        }

        item.innerHTML = `
            <strong>${escapeHtml(doa.name)}</strong>
            <p>${escapeHtml(doa.message)}</p>
            <span class="time">${doa.timestamp}</span>
        `;

        doaList.prepend(item);
    }

    function escapeHtml(text) {
        return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    // Slideshow Logic
    // Slideshow Logic (Manual Tap)
    let slideIndex = 1;
    showSlides(slideIndex);

    const gallery = document.querySelector('.invitation-gallery');

    // Create Tap Hint
    const tapHint = document.createElement('div');
    tapHint.className = 'tap-hint';
    tapHint.innerHTML = 'Ketuk untuk lanjut &raquo;';
    gallery.appendChild(tapHint);

    gallery.addEventListener('click', (e) => {
        // Prevent trigger if clicking button or hint
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('a') || e.target.classList.contains('tap-hint')) return;

        let slides = document.getElementsByClassName("invitation-slide");

        if (slideIndex < slides.length) {
            transitionSlide(slideIndex, slideIndex + 1);
            slideIndex++;
        } else {
            // If at last slide, go to RSVP page
            showPage('page-rsvp');
        }
    });

    function showSlides(n) {
        // Initial setup only
        let slides = document.getElementsByClassName("invitation-slide");
        for (let i = 0; i < slides.length; i++) {
            slides[i].classList.remove('active-slide', 'slide-exit', 'slide-enter');
            slides[i].style.display = "none";
        }
        slides[n - 1].style.display = "block";
        slides[n - 1].classList.add('active-slide');
    }

    function transitionSlide(currentIndex, nextIndex) {
        let slides = document.getElementsByClassName("invitation-slide");
        let current = slides[currentIndex - 1];
        let next = slides[nextIndex - 1];

        // Prepare Next Slide (Start state)
        next.classList.remove('active-slide', 'slide-exit');
        next.classList.add('slide-enter');
        next.style.display = "block"; // Make visible to animate

        // Animate Current Slide Out
        current.classList.remove('active-slide', 'slide-enter');
        current.classList.add('slide-exit');

        // Trigger Reflow
        void next.offsetWidth;

        // Animate Next Slide In
        next.classList.remove('slide-enter');
        next.classList.add('active-slide');

        // Clean up after transition matches CSS duration
        setTimeout(() => {
            current.style.display = "none";
            current.classList.remove('slide-exit');
        }, 800); // 0.8s matches CSS
    }
}); // End of DOMContentLoaded

// YouTube Player Logic
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '2VLqZtded_0',
        playerVars: {
            'autoplay': 1,
            'controls': 0,
            'loop': 1,
            'playlist': '2VLqZtded_0', // Required for loop to work
            'playsinline': 1,
            'start': 20
        },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    // Attempt auto-play
    event.target.playVideo();

    // Fallback for autoplay policy
    document.body.addEventListener('click', function () {
        if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
            player.playVideo();
        }
    }, { once: true });
}

function onPlayerStateChange(event) {
    const musicBtn = document.getElementById('music-control');
    if (event.data == YT.PlayerState.PLAYING) {
        musicBtn.classList.add('playing');
        musicBtn.classList.remove('paused');
    } else {
        musicBtn.classList.remove('playing');
        musicBtn.classList.add('paused');
    }
}

// Load YouTube IFrame API asynchronously
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Music Button Control
document.getElementById('music-control').addEventListener('click', function () {
    if (player) {
        const state = player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            player.pauseVideo();
        } else {
            player.playVideo();
        }
    }
});
