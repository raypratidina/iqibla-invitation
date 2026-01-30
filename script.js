// Import Firebase SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// --- KONFIGURASI FIREBASE ---
// 1. Buka console.firebase.google.com
// 2. Buat project baru
// 3. Masuk ke Project Settings > General > Your Apps (Web)
// 4. Salin configSDK dan ganti kode di bawah ini:
const firebaseConfig = {
    apiKey: "AIzaSyAG_UtEEjArsOW9rcDW470_8EQNltEo33E",
    authDomain: "real-time-comment-acb8f.firebaseapp.com",
    databaseURL: "https://real-time-comment-acb8f-default-rtdb.firebaseio.com",
    projectId: "real-time-comment-acb8f",
    storageBucket: "real-time-comment-acb8f.firebasestorage.app",
    messagingSenderId: "808939789359",
    appId: "1:808939789359:web:f2c41e6dfea70c89457ada",
};

// Initialize Firebase
let app, db;
try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
} catch (e) {
    console.warn("Firebase belum dikonfigurasi. Harap isi data firebaseConfig di script.js");
}

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

        // Handle Nav Visibility
        const bottomNav = document.querySelector('.bottom-nav');
        if (pageId === 'page-cover') {
            if (bottomNav) bottomNav.style.display = 'none';
        } else {
            if (bottomNav) bottomNav.style.display = 'flex';
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

    // Handle Opening
    const btnOpen = document.getElementById('btn-open-invitation');
    if (btnOpen) {
        btnOpen.addEventListener('click', () => {
            // Play Music
            if (window.player && window.player.getPlayerState() !== YT.PlayerState.PLAYING) {
                window.player.playVideo();
            }
            // Go to Main Invitation
            showPage('page-video');
        });
    }

    // Default to Cover Page
    showPage('page-cover');

    // RSVP Form Handling
    const rsvpForm = document.getElementById('rsvp-form');
    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('rsvp-name').value;
        const status = document.getElementById('rsvp-status').value;
        const guests = document.getElementById('rsvp-guests').value;
        const vehicle = document.getElementById('rsvp-vehicle').value;
        const messageDoa = document.getElementById('rsvp-doa').value;

        // 1. Process Doa (Save to Public Guestbook if not empty)
        const timestamp = new Date().toLocaleString('id-ID');
        if (messageDoa.trim()) {
            const doa = { name, message: messageDoa, timestamp };
            saveDoa(doa);
        }

        // 2. Save FULL RSVP Data to 'reservasi' (For Admin Dashboard)
        if (db) {
            const rsvpData = {
                timestamp: timestamp,
                timestamp_sys: Date.now(), // For sorting
                name: name,
                status: status,
                guests: guests,
                vehicle: vehicle,
                doa: messageDoa // Also save message here for Admin context
            };

            push(ref(db, 'reservasi'), rsvpData)
                .then(() => {
                    // Success Feedback
                    alert("Terima kasih! Konfirmasi kehadiran Anda berhasil disimpan.");
                    rsvpForm.reset();
                    showPage('page-doa');
                })
                .catch((err) => {
                    console.error("Error saving RSVP:", err);
                    alert("Maaf, terjadi kesalahan. Silakan coba lagi.");
                });
        }
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

    // Listen to Firebase Data (Realtime)
    if (db) {
        const doasRef = ref(db, 'doas');
        onValue(doasRef, (snapshot) => {
            const data = snapshot.val();
            const doas = [];

            if (data) {
                // Convert object to array
                Object.keys(data).forEach(key => {
                    doas.push(data[key]);
                });
                // doas.reverse(); // Keep chronological for prepend logic
            }

            // Update UI
            updateDoaListUI(doas);
            // Reverse for recent list to get newest first
            updateRecentDoas([...doas].reverse());
        });
    } else {
        // Fallback or warning
        updateDoaListUI([{ name: "Admin", message: "Mohon konfigurasi Firebase untuk melihat ucapan.", timestamp: "-" }]);
    }

    doaForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('doa-name').value;
        const message = document.getElementById('doa-message').value;
        const timestamp = new Date().toLocaleString('id-ID');

        const doa = { name, message, timestamp };
        saveDoa(doa);
        doaForm.reset();

        // Close modal after submit
        modalDoa.classList.add('hidden');
    });

    function saveDoa(doa) {
        if (db) {
            push(ref(db, 'doas'), doa);
        } else {
            alert("Database belum terkoneksi. Cek script.js");
        }
    }

    function updateDoaListUI(doas) {
        doaList.innerHTML = '';
        doas.forEach(doa => addDoaToDOM(doa));
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
        item.className = 'doa-list-item-redesign';
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

    if (gallery) {
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
    }

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
window.onYouTubeIframeAPIReady = function () {
    window.player = new YT.Player('youtube-player', {
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
        if (window.player && window.player.getPlayerState() !== YT.PlayerState.PLAYING) {
            window.player.playVideo();
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
    if (window.player) {
        const state = window.player.getPlayerState();
        if (state === YT.PlayerState.PLAYING) {
            window.player.pauseVideo();
        } else {
            window.player.playVideo();
        }
    }
});
