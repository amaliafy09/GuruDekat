// ==========================================
// BookGuru - Main Application Logic
// ==========================================

// --- Mock Data ---
const SUBJECTS = {
    Matematika: { icon: 'fa-ruler-combined', color: '#ec4899' },
    Fisika: { icon: 'fa-microscope', color: '#6366f1' },
    'B. Inggris': { icon: 'fa-comments', color: '#a855f7' },
    Kimia: { icon: 'fa-flask', color: '#10b981' }
};

const TUTORS = [
    {
        id: 'rina',
        name: 'Bu Rina, S.Pd',
        subject: 'Matematika',
        rating: 4.9,
        rate: 100000,
        experience: '8 Tahun',
        location: 'Batang, Jawa Tengah',
        distance: '1,8 km',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
        bio: 'Dosen Matematika dengan pengalaman mengajar 8 tahun. Ahli dalam membimbing siswa untuk persiapan ujian nasional, olimpiade matematika, kalkulus, dan aljabar tingkat lanjut. Gaya mengajar santai, logis, dan mudah dipahami.',
        reviews: 42
    },
    {
        id: 'andi',
        name: 'Pak Andi, M.Si',
        subject: 'Fisika',
        rating: 4.8,
        rate: 120000,
        experience: '6 Tahun',
        location: 'Pekalongan, Jawa Tengah',
        distance: '1,5 km',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
        bio: 'Guru Fisika SMA Unggulan. Spesialisasi dalam Mekanika, Termodinamika, Fisika Kuantum, dan persiapan UTBK. Menyukai metode eksperimen sederhana agar siswa bisa memvisualisasikan teori fisika di dunia nyata.',
        reviews: 35
    },
    {
        id: 'sarah',
        name: 'Miss Sarah, M.Hum',
        subject: 'B. Inggris',
        rating: 4.7,
        rate: 90000,
        experience: '5 Tahun',
        location: 'Semarang, Jawa Tengah',
        distance: '3,5 km',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
        bio: 'Lulusan Sastra Inggris UGM dengan sertifikasi TOEFL/IELTS tingkat lanjut. Berpengalaman 5 tahun mengajar conversation, grammar, dan penulisan akademik. Sangat ramah dan interaktif dengan murid sekolah.',
        reviews: 29
    },
    {
        id: 'kevin',
        name: 'dr. Kevin, Sp.Kim',
        subject: 'Kimia',
        rating: 4.9,
        rate: 110000,
        experience: '7 Tahun',
        location: 'Batang, Jawa Tengah',
        distance: '2,0 km',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
        bio: 'Pakar Kimia Organik dan pelatih Olimpiade Sains Nasional (OSN). Memiliki cara jitu menghafal tabel periodik dan memahami reaksi kimia yang kompleks secara visual dan menyenangkan. Cocok untuk semua tingkatan sekolah.',
        reviews: 38
    }
];

// Default Initial State
const DEFAULT_STATE = {
    userProfile: {
        name: 'Aisyah Putri',
        bio: 'Pelajar SMA | Suka Matematika & Fisika',
        email: 'aisyah.putri@email.com',
        phone: '081234567890',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    bookings: [
        {
            id: 'TX-BG-89100',
            teacherId: 'rina',
            teacherName: 'Bu Rina, S.Pd',
            teacherAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300',
            subject: 'Matematika',
            date: new Date().toISOString().split('T')[0], // Today
            time: '15:00',
            duration: 1,
            package: 'Paket Eceran (1 Sesi)',
            amount: 100000,
            status: 'Menunggu', // "Menunggu" matches user reference, "Lunas", "Selesai"
            payMethod: 'QRIS',
            txId: 'TX-BG-89100'
        }
    ],
    chatHistory: {
        rina: [
            { sender: 'teacher', text: 'Halo Aisyah, ada yang bisa Ibu bantu untuk materi Matematika hari ini?', time: '12:30' }
        ],
        andi: [
            { sender: 'teacher', text: 'Halo Aisyah! Jangan lupa persiapkan modul Fisika untuk sesi kita selanjutnya ya.', time: 'Kemarin' }
        ],
        sarah: [],
        kevin: []
    }
};

// Global App State
let appState = {};

// Active navigation status
let currentActiveTab = 'beranda';
let selectedTeacher = null;
let currentWizardStep = 1;
let currentBookingData = {
    teacher: null,
    packageMultiplier: 1,
    packageName: 'Paket Eceran (1 Sesi)',
    date: '',
    time: '15:00',
    duration: 1,
    paymentMethod: 'qris',
    totalPrice: 0
};

// --- Local Storage Helpers ---
function loadState() {
    const saved = localStorage.getItem('bookguru_state_v1');
    if (saved) {
        try {
            appState = JSON.parse(saved);
        } catch (e) {
            appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        }
    } else {
        appState = JSON.parse(JSON.stringify(DEFAULT_STATE));
        saveState();
    }
}

function saveState() {
    localStorage.setItem('bookguru_state_v1', JSON.stringify(appState));
}

// --- App Initializer ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    initClock();
    initNavbar();
    initViewToggler();
    initHomeView();
    initCatalogFilters();
    initBookingWizard();
    initChatSystem();
    initAccountDashboard();
    initCustomRipples();
    
    // Default: update all view templates
    renderRecommendations();
    renderCatalog();
    updateBerandaActiveBooking();
    renderChatRooms();
    updateDashboardStats();
    
    // Input Date restriction (min: today)
    const todayStr = new Date().toISOString().split('T')[0];
    document.getElementById('booking-date').setAttribute('min', todayStr);
    document.getElementById('booking-date').value = todayStr;
    currentBookingData.date = todayStr;
});

// --- Dynamic Clock simulation ---
function initClock() {
    const timeDisplay = document.getElementById('status-bar-time');
    const updateTime = () => {
        const now = new Date();
        let hours = now.getHours().toString().padStart(2, '0');
        let minutes = now.getMinutes().toString().padStart(2, '0');
        timeDisplay.textContent = `${hours}:${minutes}`;
    };
    updateTime();
    setInterval(updateTime, 1000 * 30); // update every 30 seconds
}

// --- View Toggler (Phone frame simulation) ---
function initViewToggler() {
    const btnPhone = document.getElementById('btn-phone-mode');
    const btnFull = document.getElementById('btn-fullscreen-mode');
    const frame = document.getElementById('phone-frame');

    btnPhone.addEventListener('click', () => {
        btnPhone.classList.add('active');
        btnFull.classList.remove('active');
        frame.classList.remove('full-screen');
    });

    btnFull.addEventListener('click', () => {
        btnFull.classList.add('active');
        btnPhone.classList.remove('active');
        frame.classList.add('full-screen');
    });
}

// --- Custom Ripple Effect ---
function initCustomRipples() {
    document.body.addEventListener('click', function(e) {
        const target = e.target.closest('button, .category-btn, .nav-item, .pay-card-option, .package-card-option, .teacher-card, .catalog-card, .filter-pill');
        if (!target) return;
        
        // Skip slider overlay to prevent scrolling issues
        if (target.closest('.detail-modal-sheet')) return;

        const circle = document.createElement('div');
        const rect = target.getBoundingClientRect();
        
        const size = Math.max(rect.width, rect.height);
        circle.style.width = circle.style.height = `${size}px`;
        
        // Calculate coordinates relative to target element
        const x = e.clientX - rect.left - size/2;
        const y = e.clientY - rect.top - size/2;
        
        circle.style.left = `${x}px`;
        circle.style.top = `${y}px`;
        circle.classList.add('ripple');
        
        target.style.position = 'relative';
        target.style.overflow = 'hidden';
        
        // Remove existing ripples
        const existing = target.querySelectorAll('.ripple');
        existing.forEach(r => r.remove());
        
        target.appendChild(circle);
        
        setTimeout(() => circle.remove(), 600);
    });
}

// --- Custom Alert Banner ---
function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('custom-alert');
    const alertText = document.getElementById('alert-text');
    const alertIcon = document.getElementById('alert-icon');
    
    alertText.textContent = message;
    
    // Class configuration
    alertIcon.className = 'fa-solid';
    if (type === 'success') {
        alertIcon.classList.add('fa-circle-check');
        alertIcon.style.color = '#10b981';
    } else if (type === 'error') {
        alertIcon.classList.add('fa-circle-exclamation');
        alertIcon.style.color = '#ef4444';
    } else {
        alertIcon.classList.add('fa-circle-info');
        alertIcon.style.color = '#1A56DB';
    }
    
    alertBox.classList.add('active');
    
    // Auto collapse after 3.5 seconds
    setTimeout(() => {
        alertBox.classList.remove('active');
    }, 3500);
}

// --- SPA Router / Navigation ---
function initNavbar() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetTab = item.getAttribute('data-tab');
            goToTab(targetTab);
        });
    });
    
    // Profile button redirect
    document.getElementById('btn-go-profile').addEventListener('click', () => {
        goToTab('akun');
    });
}

function goToTab(tabName) {
    currentActiveTab = tabName;
    
    // Update bottom nav active status
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('data-tab') === tabName) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // Update screen views
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        if (screen.id === `screen-${tabName}`) {
            screen.classList.add('active');
        } else {
            screen.classList.remove('active');
        }
    });

    // Header context color adjustment
    const statusBar = document.getElementById('status-bar');
    if (tabName === 'beranda' || tabName === 'akun') {
        statusBar.classList.remove('dark-status');
    } else {
        statusBar.classList.add('dark-status');
    }
    
    // Reset wizard view if selecting Booking tab empty
    if (tabName === 'booking') {
        if (!selectedTeacher) {
            // Default selected to first teacher
            selectTeacherForBooking(TUTORS[0].id);
        }
        resetBookingWizard();
    }
    
    // Dynamic island text update
    updateDynamicIsland(tabName);
    
    // Scroll viewport to top
    document.getElementById('screen-views').scrollTop = 0;
}

function updateDynamicIsland(tabName) {
    const textSpan = document.getElementById('island-text');
    const island = document.getElementById('dynamic-island');
    
    island.classList.remove('expanded');
    
    let label = 'BookGuru';
    if (tabName === 'cari') label = 'Katalog Guru';
    if (tabName === 'booking') label = 'Pesan Privat';
    if (tabName === 'chat') label = 'Chat Guru';
    if (tabName === 'akun') label = 'Dashboard';
    
    textSpan.textContent = label;
}

// --- Home (Beranda) Section Logic ---
function initHomeView() {
    // Search redirects to Search Screen
    const homeSearch = document.getElementById('home-search-input');
    homeSearch.addEventListener('click', () => {
        goToTab('cari');
        document.getElementById('catalog-search-input').focus();
    });
    
    // Subject Categories click handler
    const catBtns = document.querySelectorAll('.category-btn');
    catBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const subject = btn.getAttribute('data-subject');
            
            // Switch to catalog
            goToTab('cari');
            
            // Select appropriate pill in catalog
            const pills = document.querySelectorAll('#catalog-filter-pills .filter-pill');
            pills.forEach(p => {
                if (p.getAttribute('data-subject') === subject) {
                    p.classList.add('active');
                } else {
                    p.classList.remove('active');
                }
            });
            
            // Execute filter
            renderCatalog(subject);
        });
    });

    // Welcome user name display
    document.getElementById('header-user-name').textContent = appState.userProfile.name;
    document.getElementById('header-user-avatar').src = appState.userProfile.avatar;
}

function updateBerandaActiveBooking() {
    const container = document.getElementById('active-booking-container');
    
    // Filter bookings that are pending or active (excluding completed/cancelled logs)
    const activeBk = appState.bookings.filter(b => b.status === 'Menunggu' || b.status === 'Lunas');
    
    if (activeBk.length === 0) {
        container.innerHTML = `
            <div style="background: #ffffff; border-radius: var(--radius-md); padding: 20px; text-align: center; border: 1px solid var(--border-color); color: var(--text-muted); font-size: 0.8rem;">
                <i class="fa-solid fa-graduation-cap" style="font-size: 1.8rem; color: #cbd5e1; margin-bottom: 8px; display:block;"></i>
                Belum ada sesi belajar aktif.<br>Yuk, booking guru privat favoritmu sekarang!
            </div>
        `;
        return;
    }
    
    // Take the newest active booking
    const booking = activeBk[activeBk.length - 1];
    
    let statusClass = '';
    let statusText = booking.status;
    
    if (booking.status === 'Lunas') {
        statusClass = 'active-class';
        statusText = 'Aktif';
    }
    
    // Time relative calculations (mocking date string)
    let timeLabel = `${booking.date === new Date().toISOString().split('T')[0] ? 'Hari ini' : booking.date}, ${booking.time} WIB`;
    
    container.innerHTML = `
        <div class="active-booking-card" id="home-active-booking-card">
            <div class="booking-card-left">
                <div class="booking-icon-wrapper" style="color: ${booking.status === 'Lunas' ? 'var(--success)' : 'var(--primary)'}; background: ${booking.status === 'Lunas' ? '#d1fae5' : 'var(--primary-light)'}">
                    <i class="fa-solid fa-calendar-days"></i>
                </div>
                <div class="booking-text-details">
                    <h4>${booking.subject} - ${booking.teacherName}</h4>
                    <p>${timeLabel} (${booking.duration} Jam)</p>
                </div>
            </div>
            <span class="booking-status-badge ${statusClass}" id="home-booking-badge-btn" data-txid="${booking.txId}">
                ${statusText}
            </span>
        </div>
    `;
    
    // Hook click action to the status badge
    document.getElementById('home-booking-badge-btn').addEventListener('click', (e) => {
        const txid = e.currentTarget.getAttribute('data-txid');
        const bInfo = appState.bookings.find(bk => bk.txId === txid);
        
        if (bInfo.status === 'Menunggu') {
            // Redirect to step 4 payment checkout
            selectedTeacher = TUTORS.find(t => t.id === bInfo.teacherId);
            currentBookingData = {
                teacher: selectedTeacher,
                packageMultiplier: bInfo.package.includes('1 Sesi') ? 1 : (bInfo.package.includes('5 Sesi') ? 4.5 : 8),
                packageName: bInfo.package,
                date: bInfo.date,
                time: bInfo.time,
                duration: bInfo.duration,
                paymentMethod: bInfo.payMethod.toLowerCase(),
                totalPrice: bInfo.amount,
                txId: bInfo.txId
            };
            
            goToTab('booking');
            showWizardStep(4);
        } else {
            // If already active/Lunas, redirect to consultation chat
            openChatWindow(bInfo.teacherId);
        }
    });
}

function renderRecommendations() {
    const container = document.getElementById('recommendations-container');
    container.innerHTML = '';
    
    TUTORS.slice(0, 3).forEach(t => {
        const card = document.createElement('div');
        card.className = 'teacher-card';
        card.innerHTML = `
            <div class="teacher-avatar-frame">
                <img src="${t.avatar}" alt="${t.name}">
            </div>
            <h3>${t.name}</h3>
            <span class="subject-label">${t.subject}</span>
            <div class="teacher-rating-price">
                <span class="rating-star-span">
                    <i class="fa-solid fa-star"></i> ${t.rating}
                </span>
                <span class="price-tag">${formatIDR(t.rate)}/jam</span>
            </div>
        `;
        card.addEventListener('click', () => openTeacherDetailModal(t));
        container.appendChild(card);
    });
}

// --- Search / Teacher Catalog Section Logic ---
function initCatalogFilters() {
    // Subject filter pills
    const pills = document.querySelectorAll('#catalog-filter-pills .filter-pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            
            const subject = pill.getAttribute('data-subject');
            const searchVal = document.getElementById('catalog-search-input').value;
            renderCatalog(subject, searchVal);
        });
    });

    // Search bar input filter
    const searchInput = document.getElementById('catalog-search-input');
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const activePill = document.querySelector('#catalog-filter-pills .filter-pill.active');
        const subject = activePill ? activePill.getAttribute('data-subject') : 'semua';
        renderCatalog(subject, query);
    });
}

function renderCatalog(subjectFilter = 'semua', query = '') {
    const container = document.getElementById('catalog-list-container');
    container.innerHTML = '';
    
    // Filter logic
    const filtered = TUTORS.filter(t => {
        const matchesSubject = (subjectFilter === 'semua' || t.subject.toLowerCase() === subjectFilter.toLowerCase());
        const matchesQuery = (t.name.toLowerCase().includes(query.toLowerCase()) || t.subject.toLowerCase().includes(query.toLowerCase()));
        return matchesSubject && matchesQuery;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 0.85rem;">
                <i class="fa-solid fa-user-slash" style="font-size: 2.2rem; margin-bottom: 12px; color: #cbd5e1; display:block;"></i>
                Tidak menemukan guru yang cocok.<br>Coba ubah kata kunci pencarian Anda.
            </div>
        `;
        return;
    }

    filtered.forEach(t => {
        const card = document.createElement('div');
        card.className = 'catalog-card';
        card.innerHTML = `
            <div class="catalog-avatar-box">
                <img src="${t.avatar}" alt="${t.name}">
            </div>
            <div class="catalog-info">
                <div>
                    <h3>${t.name}</h3>
                    <span class="subject-name">${t.subject}</span>
                </div>
                <div class="catalog-stats">
                    <span class="rating-star-span">
                        <i class="fa-solid fa-star" style="color:var(--accent);"></i> ${t.rating} (${t.reviews} ulasan)
                    </span>
                    <span class="price-tag">${formatIDR(t.rate)}/jam</span>
                </div>
            </div>
        `;
        card.addEventListener('click', () => openTeacherDetailModal(t));
        container.appendChild(card);
    });
}

// --- Slide-Up Teacher Detail Modal Sheet ---
function openTeacherDetailModal(teacher) {
    selectedTeacher = teacher;
    
    document.getElementById('detail-teacher-avatar').src = teacher.avatar;
    document.getElementById('detail-teacher-name').textContent = teacher.name;
    document.getElementById('detail-teacher-subject').textContent = teacher.subject;
    document.getElementById('detail-teacher-location').textContent =
    teacher.location;
    document.getElementById('detail-teacher-distance').textContent =
        "Jarak dari Anda : " + teacher.distance;
    document.getElementById('detail-teacher-rating').innerHTML = `<i class="fa-solid fa-star" style="color:var(--accent);"></i> ${teacher.rating}`;
    document.getElementById('detail-teacher-price').textContent = `${formatIDR(teacher.rate)}/jam`;
    document.getElementById('detail-teacher-exp').textContent = teacher.experience;
    document.getElementById('detail-teacher-bio').textContent = teacher.bio;
    
    // Set overlay transitions active
    const overlay = document.getElementById('detail-modal-overlay');
    const sheet = document.getElementById('detail-modal-sheet');
    
    overlay.classList.add('active');
    sheet.classList.add('active');
    
    // Close overlay triggers
    const closeModal = () => {
        overlay.classList.remove('active');
        sheet.classList.remove('active');
    };
    
    overlay.onclick = (e) => {
        if (e.target === overlay) closeModal();
    };

    // Chat Trigger button inside Detail Modal
    document.getElementById('btn-detail-chat-trigger').onclick = () => {
        closeModal();
        openChatWindow(teacher.id);
    };

    // Booking Trigger button inside Detail Modal
    document.getElementById('btn-detail-booking-trigger').onclick = () => {
        closeModal();
        selectTeacherForBooking(teacher.id);
        goToTab('booking');
    };
}

// --- Booking Wizard Section Logic ---
function selectTeacherForBooking(teacherId) {
    selectedTeacher = TUTORS.find(t => t.id === teacherId);
    currentBookingData.teacher = selectedTeacher;
    
    document.getElementById('booking-teacher-name-disabled').value = selectedTeacher.name;
    document.getElementById('summary-teacher-rate').textContent = `${formatIDR(selectedTeacher.rate)} / jam`;
    
    calculateBookingTotal();
}

function calculateBookingTotal() {
    if (!currentBookingData.teacher) return;
    
    const rate = currentBookingData.teacher.rate;
    const hours = currentBookingData.duration;
    const multiplier = currentBookingData.packageMultiplier;
    
    const total = rate * hours * multiplier;
    currentBookingData.totalPrice = total;
    
    // Render calculations to Step 2
    document.getElementById('summary-duration').textContent = `${hours} Jam`;
    document.getElementById('summary-package-multiplier').textContent = `${currentBookingData.packageName.split('(')[0]}`;
    document.getElementById('summary-grand-total').textContent = formatIDR(total);
    
    // Render to Step 3 summaries
    document.getElementById('payment-summary-total').textContent = formatIDR(total);
}

function initBookingWizard() {
    // Step 1: Package Click Listener
    const pkgCards = document.querySelectorAll('.package-card-option');
    pkgCards.forEach(card => {
        card.addEventListener('click', () => {
            pkgCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const mult = parseFloat(card.getAttribute('data-multiplier'));
            const name = card.getAttribute('data-pkg-name');
            
            currentBookingData.packageMultiplier = mult;
            currentBookingData.packageName = name;
            calculateBookingTotal();
        });
    });

    // Step 2: Date & Hours Listener
    document.getElementById('booking-date').addEventListener('change', (e) => {
        currentBookingData.date = e.target.value;
    });

    document.getElementById('booking-time').addEventListener('change', (e) => {
        currentBookingData.time = e.target.value;
    });

    const durationChips = document.querySelectorAll('.duration-chip');
    durationChips.forEach(chip => {
        chip.addEventListener('click', () => {
            durationChips.forEach(c => c.classList.remove('selected'));
            chip.classList.add('selected');
            
            const hours = parseFloat(chip.getAttribute('data-hours'));
            currentBookingData.duration = hours;
            calculateBookingTotal();
        });
    });

    // Step 3: Payment method selected
    const payCards = document.querySelectorAll('.pay-card-option');
    payCards.forEach(card => {
        card.addEventListener('click', () => {
            payCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            
            const method = card.getAttribute('data-method');
            currentBookingData.paymentMethod = method;
        });
    });

    // Footer button navigation triggers
    const btnPrev = document.getElementById('btn-wizard-prev');
    const btnNext = document.getElementById('btn-wizard-next');

    btnPrev.addEventListener('click', () => {
        if (currentWizardStep > 1) {
            showWizardStep(currentWizardStep - 1);
        }
    });

    btnNext.addEventListener('click', () => {
        if (currentWizardStep === 1) {
            showWizardStep(2);
        } else if (currentWizardStep === 2) {
            if (!currentBookingData.date) {
                showAlert('Harap pilih tanggal belajar terlebih dahulu!', 'error');
                return;
            }
            showWizardStep(3);
        } else if (currentWizardStep === 3) {
            // Confirm transaction and show step 4 Checkout instruction
            confirmBookingDraftTransaction();
            showWizardStep(4);
        } else if (currentWizardStep === 4) {
            // Trigger payment completion simulator
            simulatePaymentSuccess();
        } else if (currentWizardStep === 5) {
            // Finish and redirect
            goToTab('beranda');
        }
    });
}

function resetBookingWizard() {
    currentWizardStep = 1;
    showWizardStep(1);
    
    // Clear checkouts fields
    document.getElementById('checkout-bank-area').style.display = 'none';
    document.getElementById('checkout-qris-area').style.display = 'flex';
}

function showWizardStep(step) {
    currentWizardStep = step;
    
    // Toggling panel display active state
    const panels = document.querySelectorAll('.wizard-step-panel');
    panels.forEach((panel, index) => {
        if (index === step - 1) {
            panel.classList.add('active');
        } else {
            panel.classList.remove('active');
        }
    });
    
    // Success step (Panel index 4 / step 5)
    const successPanel = document.getElementById('wizard-panel-success');
    if (step === 5) {
        successPanel.classList.add('active');
    } else {
        successPanel.classList.remove('active');
    }

    // Update Progress Step circles active colors
    const progressNavs = document.querySelectorAll('.booking-step-item');
    progressNavs.forEach((nav, idx) => {
        nav.classList.remove('active', 'completed');
        if (idx + 1 < step) {
            nav.classList.add('completed');
        } else if (idx + 1 === step) {
            nav.classList.add('active');
        }
    });

    // Progress Bar Line percentage widths
    const linePercent = ((step - 1) / 2) * 100;
    document.getElementById('booking-progress-bar').style.width = `${Math.min(linePercent, 100)}%`;

    // Configure Button names dynamically
    const btnPrev = document.getElementById('btn-wizard-prev');
    const btnNext = document.getElementById('btn-wizard-next');
    const btnContainer = document.getElementById('wizard-btn-container');
    
    btnContainer.style.display = 'flex';
    btnPrev.style.display = 'block';
    
    if (step === 1) {
        btnPrev.style.display = 'none';
        btnNext.textContent = 'Lanjutkan';
    } else if (step === 2) {
        btnNext.textContent = 'Lanjutkan';
    } else if (step === 3) {
        btnNext.textContent = 'Konfirmasi & Bayar';
    } else if (step === 4) {
        btnPrev.style.display = 'none';
        btnNext.textContent = 'Simulasikan Bayar Lunas';
        btnNext.style.backgroundColor = 'var(--success)';
        
        // Show proper payment target (QRIS vs VA)
        if (currentBookingData.paymentMethod === 'qris') {
            document.getElementById('checkout-bank-area').style.display = 'none';
            document.getElementById('checkout-qris-area').style.display = 'flex';
            document.getElementById('checkout-panel-title').textContent = 'Scan QRIS untuk Bayar';
        } else {
            document.getElementById('checkout-qris-area').style.display = 'none';
            document.getElementById('checkout-bank-area').style.display = 'flex';
            document.getElementById('checkout-panel-title').textContent = 'Transfer ke Virtual Account';
            
            // Randomize VA Code based on bank selection
            const randomVaCode = `8273 0812 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
            document.getElementById('va-number-lbl').textContent = randomVaCode;
        }
    } else if (step === 5) {
        // Success view, hide Prev, Next text changes to Done
        btnPrev.style.display = 'none';
        btnNext.textContent = 'Kembali ke Beranda';
        btnNext.style.backgroundColor = 'var(--primary)';
    }
}

// Generate new unique booking object pending payment
function confirmBookingDraftTransaction() {
    const txId = `TX-BG-${Math.floor(10000 + Math.random() * 90000)}`;
    currentBookingData.txId = txId;

    // Check if we have an incomplete version of this draft already in system
    const existingIdx = appState.bookings.findIndex(b => b.teacherId === currentBookingData.teacher.id && b.status === 'Menunggu');
    if (existingIdx !== -1) {
        // Overwrite existing booking draft details
        appState.bookings[existingIdx].amount = currentBookingData.totalPrice;
        appState.bookings[existingIdx].date = currentBookingData.date;
        appState.bookings[existingIdx].time = currentBookingData.time;
        appState.bookings[existingIdx].duration = currentBookingData.duration;
        appState.bookings[existingIdx].package = currentBookingData.packageName;
        appState.bookings[existingIdx].payMethod = currentBookingData.paymentMethod.toUpperCase();
        appState.bookings[existingIdx].txId = txId;
    } else {
        // Push new draft booking to state
        appState.bookings.push({
            id: txId,
            teacherId: currentBookingData.teacher.id,
            teacherName: currentBookingData.teacher.name,
            teacherAvatar: currentBookingData.teacher.avatar,
            subject: currentBookingData.teacher.subject,
            date: currentBookingData.date,
            time: currentBookingData.time,
            duration: currentBookingData.duration,
            package: currentBookingData.packageName,
            amount: currentBookingData.totalPrice,
            status: 'Menunggu',
            payMethod: currentBookingData.paymentMethod.toUpperCase(),
            txId: txId
        });
    }
    
    saveState();
    updateBerandaActiveBooking();
    updateDashboardStats();
}

function simulatePaymentSuccess() {
    // Show beautiful loaders in the Dynamic Island
    const island = document.getElementById('dynamic-island');
    const islandText = document.getElementById('island-text');
    
    island.classList.add('expanded');
    islandText.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Verifikasi Pembayaran...`;
    
    setTimeout(() => {
        // Update booking state status to paid ("Lunas")
        const txId = currentBookingData.txId;
        const bk = appState.bookings.find(b => b.txId === txId);
        if (bk) {
            bk.status = 'Lunas';
        }
        
        saveState();
        updateBerandaActiveBooking();
        updateDashboardStats();
        
        // Fill receipt data in step 5 success screen
        document.getElementById('receipt-tx-id').textContent = txId;
        document.getElementById('receipt-teacher-name').textContent = currentBookingData.teacher.name;
        document.getElementById('receipt-session-schedule').textContent = `${currentBookingData.date}, ${currentBookingData.time} WIB`;
        document.getElementById('receipt-total-amount').textContent = formatIDR(currentBookingData.totalPrice);
        
        // Collapse dynamic island loader
        island.classList.remove('expanded');
        islandText.textContent = 'BookGuru';
        
        // Redirect to Step 5
        showWizardStep(5);
        showAlert('Pembayaran Berhasil Dikonfirmasi!', 'success');
        
        // Notify chat rooms listing to register room if new
        initiateChatRoom(currentBookingData.teacher.id);
        
    }, 2000);
}

function copyVaNumber() {
    const code = document.getElementById('va-number-lbl').textContent;
    navigator.clipboard.writeText(code.replace(/\s/g, ''));
    
    // Visual text swap feedback
    const btn = document.getElementById('btn-copy-va');
    btn.innerHTML = `<i class="fa-solid fa-check"></i> Tersalin`;
    setTimeout(() => {
        btn.innerHTML = `<i class="fa-regular fa-copy"></i> Salin`;
    }, 2000);
    
    showAlert('Nomor Virtual Account berhasil disalin!', 'success');
}

// --- Chat & Consultation System Logic ---
let activeChatTeacherId = null;

function initChatSystem() {
    // Input action listeners
    const btnSend = document.getElementById('btn-chat-send');
    const inputMsg = document.getElementById('chat-message-input');
    const btnBack = document.getElementById('btn-back-to-rooms');
    const btnUpload = document.getElementById('btn-trigger-upload');
    const fileUploader = document.getElementById('chat-file-uploader');

    btnSend.addEventListener('click', () => {
        sendMessageFromUser();
    });

    inputMsg.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessageFromUser();
        }
    });

    btnBack.addEventListener('click', () => {
        document.getElementById('chat-conversation-window').classList.remove('active');
        activeChatTeacherId = null;
        renderChatRooms();
    });

    btnUpload.addEventListener('click', () => {
        fileUploader.click();
    });

    fileUploader.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            sendDocumentFromUser(file.name, (file.size / 1024).toFixed(1) + ' KB');
        }
    });

    document.getElementById('btn-call-teacher').addEventListener('click', () => {
        showAlert('Fitur panggilan video/audio akan tersedia pada jadwal les aktif.', 'info');
    });
}

function initiateChatRoom(teacherId) {
    if (!appState.chatHistory[teacherId]) {
        appState.chatHistory[teacherId] = [
            { sender: 'teacher', text: `Halo Aisyah! Sesi belajar kita sudah dikonfirmasi. Ada materi yang mau dipersiapkan terlebih dahulu?`, time: getFormattedTime() }
        ];
        saveState();
    }
}

function renderChatRooms() {
    const container = document.getElementById('chat-rooms-container');
    container.innerHTML = '';
    
    let totalUnread = 0;
    
    // We only show rooms where a booking has been made or chat history is not empty
    const availableRooms = TUTORS.filter(t => {
        const hasHistory = appState.chatHistory[t.id] && appState.chatHistory[t.id].length > 0;
        const hasBooking = appState.bookings.some(b => b.teacherId === t.id);
        return hasHistory || hasBooking;
    });

    if (availableRooms.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 0.85rem;">
                <i class="fa-solid fa-comment-slash" style="font-size: 2.2rem; margin-bottom: 12px; color: #cbd5e1; display:block;"></i>
                Belum ada obrolan aktif.<br>Silakan pesan guru privat terlebih dahulu.
            </div>
        `;
        return;
    }

    availableRooms.forEach(t => {
        initiateChatRoom(t.id); // make sure array exists
        
        const history = appState.chatHistory[t.id];
        const lastMsgObj = history[history.length - 1];
        
        let lastMsg = 'Mulai konsultasi...';
        let lastTime = '12:00';
        
        if (lastMsgObj) {
            lastMsg = lastMsgObj.text || (lastMsgObj.attachment ? `📄 ${lastMsgObj.attachment.name}` : 'Mulai konsultasi...');
            lastTime = lastMsgObj.time;
        }

        // Mocking unread status
        const isUnread = (t.id === 'rina' && history.length === 1);
        if (isUnread) totalUnread++;

        const roomCard = document.createElement('div');
        roomCard.className = 'chat-room-card';
        roomCard.innerHTML = `
            <div class="chat-room-avatar">
                <img src="${t.avatar}" alt="${t.name}">
                <div class="chat-online-indicator"></div>
            </div>
            <div class="chat-room-info">
                <div class="chat-room-header-row">
                    <span class="chat-room-name">${t.name}</span>
                    <span class="chat-room-time">${lastTime}</span>
                </div>
                <div class="chat-room-preview-row">
                    <span class="chat-room-message-preview">${lastMsg}</span>
                    ${isUnread ? '<span class="chat-unread-badge">1</span>' : ''}
                </div>
            </div>
        `;
        
        roomCard.addEventListener('click', () => {
            openChatWindow(t.id);
        });
        
        container.appendChild(roomCard);
    });

    // Update bottom nav badge indicator
    const badge = document.getElementById('chat-notification-badge');
    if (totalUnread > 0) {
        badge.style.display = 'block';
    } else {
        badge.style.display = 'none';
    }
}

function openChatWindow(teacherId) {
    activeChatTeacherId = teacherId;
    
    const teacher = TUTORS.find(t => t.id === teacherId);
    if (!teacher) return;
    
    document.getElementById('chat-current-avatar').src = teacher.avatar;
    document.getElementById('chat-current-name').textContent = teacher.name;
    
    // If it was unread, make it read
    renderChatMessages();
    
    const windowPane = document.getElementById('chat-conversation-window');
    windowPane.classList.add('active');
}

function renderChatMessages() {
    const container = document.getElementById('chat-messages-container');
    container.innerHTML = '';
    
    const history = appState.chatHistory[activeChatTeacherId] || [];
    
    history.forEach(msg => {
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${msg.sender === 'user' ? 'outgoing' : 'incoming'}`;
        
        if (msg.attachment) {
            bubble.innerHTML = `
                <div class="document-attachment-card">
                    <span class="attachment-icon"><i class="fa-solid fa-file-pdf" style="color: ${msg.sender === 'user' ? '#ffffff' : 'var(--primary)'}"></i></span>
                    <div class="attachment-details">
                        <span class="attachment-name">${msg.attachment.name}</span>
                        <span class="attachment-size">${msg.attachment.size}</span>
                    </div>
                </div>
                <p style="margin-top:8px;">${msg.text}</p>
                <span class="message-time">${msg.time}</span>
            `;
        } else {
            bubble.innerHTML = `
                <p>${msg.text}</p>
                <span class="message-time">${msg.time}</span>
            `;
        }
        container.appendChild(bubble);
    });
    
    // Auto-scroll messages view container to bottom
    container.scrollTop = container.scrollHeight;
}

function sendMessageFromUser() {
    const input = document.getElementById('chat-message-input');
    const text = input.value.trim();
    if (!text) return;
    
    const newMsg = {
        sender: 'user',
        text: text,
        time: getFormattedTime()
    };
    
    appState.chatHistory[activeChatTeacherId].push(newMsg);
    saveState();
    input.value = '';
    
    renderChatMessages();
    triggerTeacherAutoReply(text);
}

function sendDocumentFromUser(fileName, fileSize) {
    const newMsg = {
        sender: 'user',
        text: 'Saya mengirim lampiran dokumen pelajaran untuk dibahas.',
        time: getFormattedTime(),
        attachment: {
            name: fileName,
            size: fileSize
        }
    };
    
    appState.chatHistory[activeChatTeacherId].push(newMsg);
    saveState();
    
    renderChatMessages();
    triggerTeacherAutoReply('[ATTACHMENT_UPLOADED]');
}

// Teacher automated response generator
function triggerTeacherAutoReply(userMessage) {
    const teacher = TUTORS.find(t => t.id === activeChatTeacherId);
    const container = document.getElementById('chat-messages-container');
    
    // 1. Show Typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator-bubble';
    typingIndicator.id = 'chat-typing-indicator';
    typingIndicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    container.appendChild(typingIndicator);
    container.scrollTop = container.scrollHeight;

    // Response messages database
    let replyText = 'Baik Aisyah, pertanyaan kamu sudah Ibu terima. Mari kita diskusikan lebih detail di sesi belajar nanti ya!';
    
    if (userMessage === '[ATTACHMENT_UPLOADED]') {
        replyText = `Terima kasih dokumen tugasnya sudah terunggah. Saya akan pelajari materi ini terlebih dahulu agar pembahasan nanti sore berjalan efektif.`;
    } else {
        const norm = userMessage.toLowerCase();
        if (norm.includes('halo') || norm.includes('pagi') || norm.includes('siang') || norm.includes('sore')) {
            replyText = `Halo Aisyah! Selamat belajar, senang mendengarnya. Ada bagian spesifik yang belum dipahami untuk sesi les hari ini?`;
        } else if (norm.includes('tugas') || norm.includes('pr') || norm.includes('soal')) {
            replyText = `Tentu! Kamu bisa upload foto soal atau dokumen materinya di sini agar bisa Ibu persiapkan solusinya terlebih dahulu.`;
        } else if (norm.includes('terima kasih') || norm.includes('makasih')) {
            replyText = `Sama-sama Aisyah! Tetap semangat belajarnya ya, sampai jumpa di ruang kelas online.`;
        } else if (norm.includes('kapan') || norm.includes('jadwal')) {
            replyText = `Les privat kita sudah terjadwal sesuai dengan yang tertera di menu pemesanan kamu ya. Harap masuk link kelas 5 menit sebelumnya.`;
        }
    }

    // 2. Delayed reply execution (simulate thinking time)
    setTimeout(() => {
        // Remove typing indicators
        const indicator = document.getElementById('chat-typing-indicator');
        if (indicator) indicator.remove();

        const replyObj = {
            sender: 'teacher',
            text: replyText,
            time: getFormattedTime()
        };

        appState.chatHistory[activeChatTeacherId].push(replyObj);
        saveState();
        renderChatMessages();
        
    }, 2000);
}

// --- Account / Dashboard Section Logic ---
function initAccountDashboard() {
    // Menu links sliding pane actions
    document.getElementById('btn-menu-edit-profile').addEventListener('click', () => {
        document.getElementById('pane-edit-profile').classList.add('active');
        // Fill form fields
        document.getElementById('input-prof-name').value = appState.userProfile.name;
        document.getElementById('input-prof-bio').value = appState.userProfile.bio;
        document.getElementById('input-prof-email').value = appState.userProfile.email;
        document.getElementById('input-prof-phone').value = appState.userProfile.phone;
    });

    document.getElementById('btn-menu-history').addEventListener('click', () => {
        document.getElementById('pane-booking-history').classList.add('active');
        renderBookingHistoryPane();
    });

    document.getElementById('btn-menu-payments').addEventListener('click', () => {
        document.getElementById('pane-transaction-status').classList.add('active');
        renderTransactionHistoryPane();
    });

    // Handle back button on panes
    const paneCloseBtns = document.querySelectorAll('.pane-close-btn');
    paneCloseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.dashboard-detail-pane').classList.remove('active');
        });
    });

    // Profile edit form submit
    document.getElementById('btn-save-profile').addEventListener('click', () => {
        const name = document.getElementById('input-prof-name').value.trim();
        const bio = document.getElementById('input-prof-bio').value.trim();
        const email = document.getElementById('input-prof-email').value.trim();
        const phone = document.getElementById('input-prof-phone').value.trim();

        if (!name || !email) {
            showAlert('Nama dan Email harus diisi!', 'error');
            return;
        }

        // Save profile
        appState.userProfile.name = name;
        appState.userProfile.bio = bio;
        appState.userProfile.email = email;
        appState.userProfile.phone = phone;
        saveState();

        // Update view texts
        document.getElementById('header-user-name').textContent = name;
        document.getElementById('dashboard-user-name').textContent = name;
        document.getElementById('dashboard-user-bio').textContent = bio;

        document.getElementById('pane-edit-profile').classList.remove('active');
        showAlert('Profil berhasil disimpan!', 'success');
    });

    // Change avatar simulation
    document.getElementById('btn-change-avatar').addEventListener('click', () => {
        const avatars = [
            'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
            'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150'
        ];
        
        // Pick next or random
        const currentAvatar = appState.userProfile.avatar;
        let next = avatars[0];
        if (currentAvatar === avatars[0]) next = avatars[1];
        else if (currentAvatar === avatars[1]) next = avatars[2];
        else if (currentAvatar === avatars[2]) next = avatars[3];
        
        appState.userProfile.avatar = next;
        saveState();
        
        document.getElementById('header-user-avatar').src = next;
        document.getElementById('dashboard-user-avatar').src = next;
        showAlert('Foto profil berhasil diubah!', 'success');
    });

    // Init dashboard view values
    document.getElementById('dashboard-user-name').textContent = appState.userProfile.name;
    document.getElementById('dashboard-user-bio').textContent = appState.userProfile.bio;
    document.getElementById('dashboard-user-avatar').src = appState.userProfile.avatar;
}

function updateDashboardStats() {
    // Total hours studied (only for Paid/Lunas status)
    const paidBookings = appState.bookings.filter(b => b.status === 'Lunas');
    const totalHours = paidBookings.reduce((sum, b) => sum + b.duration, 0) + 10; // pre-fill basic hours
    document.getElementById('stats-total-hours').textContent = `${totalHours} Jam`;
    
    // Total bookings count
    document.getElementById('stats-total-bookings').textContent = appState.bookings.length;
}

function renderBookingHistoryPane() {
    const container = document.getElementById('booking-history-list');
    container.innerHTML = '';
    
    if (appState.bookings.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 0.85rem;">
                Belum ada riwayat pesanan.
            </div>
        `;
        return;
    }

    // Sort showing newest first
    const sorted = [...appState.bookings].reverse();

    sorted.forEach(b => {
        let tagClass = 'pending-tag';
        if (b.status === 'Lunas') tagClass = 'success-tag';
        if (b.status === 'Selesai') tagClass = 'success-tag';
        
        const card = document.createElement('div');
        card.className = 'history-item-card';
        card.innerHTML = `
            <div class="history-card-header">
                <span class="subject-lbl">${b.subject}</span>
                <span class="status-indicator-tag ${tagClass}">${b.status}</span>
            </div>
            <div class="history-card-details">
                <img src="${b.teacherAvatar}" alt="${b.teacherName}">
                <div class="history-card-meta">
                    <h4>${b.teacherName}</h4>
                    <p><i class="fa-regular fa-calendar-days"></i> ${b.date} | ${b.time} WIB</p>
                </div>
            </div>
            <div class="history-card-footer">
                <span>Durasi: <strong>${b.duration} Jam</strong> (${b.package.split('(')[0]})</span>
                <span class="price">${formatIDR(b.amount)}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function renderTransactionHistoryPane() {
    const container = document.getElementById('transaction-history-list');
    container.innerHTML = '';
    
    if (appState.bookings.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-muted); font-size: 0.85rem;">
                Belum ada riwayat transaksi.
            </div>
        `;
        return;
    }

    const sorted = [...appState.bookings].reverse();

    sorted.forEach(b => {
        const card = document.createElement('div');
        card.className = 'history-item-card';
        
        let statusStyle = 'color: var(--accent); font-weight:700;';
        if (b.status === 'Lunas') statusStyle = 'color: var(--success); font-weight:700;';
        
        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--text-muted); border-bottom:1px solid var(--border-color); padding-bottom:8px;">
                <span>ID: ${b.txId}</span>
                <span>${b.date}</span>
            </div>
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:4px;">
                <div>
                    <h4 style="font-size:0.85rem; font-weight:700;">Les Privat ${b.subject}</h4>
                    <p style="font-size:0.75rem; color:var(--text-muted); margin-top:2px;">Metode: ${b.payMethod}</p>
                </div>
                <div style="text-align:right;">
                    <span style="font-size:0.95rem; font-weight:800; color:var(--primary); display:block;">${formatIDR(b.amount)}</span>
                    <span style="${statusStyle}">${b.status === 'Lunas' ? 'LUNAS' : 'PENDING'}</span>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// --- General Utility Helpers ---
function formatIDR(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

function getFormattedTime() {
    const now = new Date();
    return now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}
