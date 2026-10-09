/* ==========================================================================
   1. TAILWIND CONFIGURATION INITIALIZATION
   ========================================================================== */
if (typeof tailwind !== 'undefined') {
    tailwind.config = {
        darkMode: 'class',
        theme: {
            extend: {
                colors: {
                    space: {
                        dark: '#050714',
                        card: '#0a0f26',
                        border: '#1b2345',
                        accent: '#2563eb',
                        glow: '#3b82f6'
                    }
                },
                fontFamily: {
                    sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif']
                }
            }
        }
    };
}

/* ==========================================================================
   2. SPACE CANVAS STARFIELD SYSTEM
   ========================================================================== */
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}

function initStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 3000);
    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.005
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        star.alpha += star.speed;
        if (star.alpha > 1 || star.alpha < 0) {
            star.speed = -star.speed;
        }
    });
    requestAnimationFrame(drawStars);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawStars();

/* ==========================================================================
   3. INTERSECTION OBSERVER FOR SCROLL REVEAL & NAV TRACKING
   ========================================================================== */
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        const el = entry.target;
        const delay = el.getAttribute('data-delay') || 0;

        if (entry.isIntersecting) {
            setTimeout(() => {
                el.classList.add('reveal-visible');
            }, parseInt(delay));
        } else {
            el.classList.remove('reveal-visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal-item').forEach(el => {
    revealObserver.observe(el);
});

const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let currentSec = 'home';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            currentSec = section.getAttribute('id');
        }
    });

    const targetNavBtn = document.getElementById(`nav-${currentSec}`);
    if (targetNavBtn && !targetNavBtn.classList.contains('active')) {
        setActiveNav(targetNavBtn);
    }
});

/* ==========================================================================
   4. LOADING SCREEN TIMELINE
   ========================================================================== */
let progress = 0;
const progressBar = document.getElementById('loading-progress');
const progressText = document.getElementById('loading-text');
const loadingScreen = document.getElementById('loading-screen');

const interval = setInterval(() => {
    progress += Math.floor(Math.random() * 8) + 2;
    if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
            if (loadingScreen) {
                loadingScreen.classList.add('opacity-0', 'pointer-events-none');
            }
        }, 400);
    }
    if (progressBar) progressBar.style.width = progress + '%';
    if (progressText) progressText.textContent = progress + '%';
}, 50);

/* ==========================================================================
   5. NAVIGATION & MASCOT CONTROLLER
   ========================================================================== */
function setActiveNav(element) {
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600/60', 'text-white', 'border', 'border-blue-400/30');
        btn.classList.add('text-slate-300');
    });

    element.classList.add('active', 'bg-blue-600/60', 'text-white', 'border', 'border-blue-400/30');
    element.classList.remove('text-slate-300');

    const mascot = document.getElementById('nav-mascot');
    if (mascot && element.parentElement) {
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.getBoundingClientRect();
        const offsetLeft = rect.left - parentRect.left + (rect.width / 2);
        mascot.style.left = offsetLeft + 'px';
    }
}

/* ==========================================================================
   6. PORTFOLIO TABS & GALLERY FILTERING
   ========================================================================== */
function switchPortoTab(tabKey) {
    document.querySelectorAll('.porto-tab').forEach(tab => {
        tab.classList.remove('active', 'bg-blue-600', 'text-white', 'shadow-lg');
        tab.classList.add('text-slate-400');
    });

    const activeBtn = document.getElementById(`tab-${tabKey}`);
    if (activeBtn) {
        activeBtn.classList.add('active', 'bg-blue-600', 'text-white', 'shadow-lg');
        activeBtn.classList.remove('text-slate-400');
    }

    const views = ['projects', 'certificates', 'creative', 'tech'];
    views.forEach(view => {
        const el = document.getElementById(`porto-${view}-view`);
        if (el) {
            if (view === tabKey) {
                el.classList.remove('hidden');
            } else {
                el.classList.add('hidden');
            }
        }
    });
}

function filterGallery(category) {
    document.querySelectorAll('.gallery-filter').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white');
        btn.classList.add('text-slate-400');
    });

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active', 'bg-blue-600', 'text-white');
        event.currentTarget.classList.remove('text-slate-400');
    }

    const cards = document.querySelectorAll('.gallery-card');
    cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (category === 'all' || cat === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

/* ==========================================================================
   7. MODAL PREVIEW & LIGHTBOX ZOOM CONTROLLER
   ========================================================================== */
const modal = document.getElementById('project-modal');
const modalBox = document.getElementById('modal-box');
let currentScale = 1;

function openItemDetailModal(title, desc, badge, tech, img) {
    document.getElementById('modal-title').textContent = title;
    document.getElementById('modal-desc').textContent = desc;
    document.getElementById('modal-badge').textContent = badge || "Detail";
    document.getElementById('modal-tech').textContent = tech || "Portfolio";
    
    const modalImg = document.getElementById('modal-img');
    modalImg.src = img || "https://placehold.co/600x400/0a0f26/ffffff?text=Preview";

    if (modal) {
        modal.classList.remove('opacity-0', 'pointer-events-none');
    }
    if (modalBox) {
        modalBox.classList.remove('scale-95');
        modalBox.classList.add('scale-100');
    }
}

function closeItemDetailModal() {
    if (modal) {
        modal.classList.add('opacity-0', 'pointer-events-none');
    }
    if (modalBox) {
        modalBox.classList.remove('scale-100');
        modalBox.classList.add('scale-95');
    }
}

function showDownloadCVModal() {
    openItemDetailModal(
        "Desi Wulansari — Profile Resume", 
        "Ringkasan latar belakang keahlian dalam bidang Teknik Komputer & Jaringan (TKJ), studi Manajemen, pengalaman administrasi, serta kemampuan komunikasi & customer service.", 
        "Resume Summary", 
        "IT & Business Administration", 
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=600"
    );
}

function openLightboxFromModal() {
    const imgSrc = document.getElementById('modal-img').src;
    const title = document.getElementById('modal-title').textContent;
    
    document.getElementById('lightboxTitle').textContent = title + ' - Preview Gambar';
    document.getElementById('lightboxImage').src = imgSrc;
    
    const lightbox = document.getElementById('fullScreenLightbox');
    lightbox.classList.remove('hidden');
    lightbox.classList.add('flex');
    resetZoom();
}

function closeLightbox() {
    const lightbox = document.getElementById('fullScreenLightbox');
    if (lightbox) {
        lightbox.classList.add('hidden');
        lightbox.classList.remove('flex');
    }
    resetZoom();
}

const lightboxImg = document.getElementById('lightboxImage');

function updateZoom() {
    if (lightboxImg) {
        lightboxImg.style.transform = `scale(${currentScale})`;
    }
    const resetBtn = document.getElementById('resetZoomBtn');
    if (resetBtn) {
        resetBtn.innerText = `${Math.round(currentScale * 100)}%`;
    }
}

function resetZoom() {
    currentScale = 1;
    updateZoom();
}

document.getElementById('zoomInBtn')?.addEventListener('click', () => {
    if (currentScale < 3.5) {
        currentScale += 0.25;
        updateZoom();
    }
});

document.getElementById('zoomOutBtn')?.addEventListener('click', () => {
    if (currentScale > 0.5) {
        currentScale -= 0.25;
        updateZoom();
    }
});

document.getElementById('resetZoomBtn')?.addEventListener('click', resetZoom);

document.getElementById('fullScreenLightbox')?.addEventListener('click', (e) => {
    if (e.target.id === 'fullScreenLightbox' || e.target.id === 'lightboxImageArea') {
        closeLightbox();
    }
});

/* ==========================================================================
   8. CERTIFICATES DATASET (DEDUPLICATED)
   ========================================================================== */
const certificatesData = [
    {
        id: "cert-1",
        title: "Top Graduate in Computer & Network Engineering",
        type: "Achievements",
        year: "2026",
        subtitle: "SMKN 1 Subang · Academic Year 2025/2026",
        image: "assets/certificates/Peraih Nilai Tertinggi Jurusan Teknik Komputer dan Jaringan  (1).jpg",
        description: "Graduating as the highest-achieving student in Computer & Network Engineering, reflecting consistency, effort, and determination.",
        tags: ["Academic Achievement", "Top Graduate", "Computer & Network Engineering"]
    },
    {
        id: "cert-2",
        title: "National Gold Medalist – Indonesian Language",
        type: "Achievements",
        year: "2024",
        subtitle: "National Smart Student Olympiad 2024",
        image: "assets/certificates/Peraih Medali Emas Tingkat Nasional Olimpiade  Bahasa Indonesia (1).jpg",
        description: "Earned a Gold Medal in the national competition, testing deep understanding and analytical skills in Indonesian language.",
        tags: ["National Competition", "Gold Medalist", "Indonesian Language"]
    },
    {
        id: "cert-3",
        title: "Best Graduate – SMPN 3 Ciemas",
        type: "Achievements",
        year: "2023",
        subtitle: "Academic Year 2022/2023",
        image: "assets/certificates/Peringkat 1 Lulusan Terbaik Tahun Ajaran 2022_2023 .jpg",
        description: "Graduated as the overall best student at SMPN 3 Ciemas, laying the foundation for future vocational studies.",
        tags: ["Academic Achievement", "Best Graduate", "SMPN 3 Ciemas"]
    },
    {
        id: "cert-4",
        title: "1st Place – Mathematics Olympiad",
        type: "Achievements",
        year: "2019",
        subtitle: "District Level · Academic Year 2018/2019",
        image: "assets/certificates/Peringkat 1 Olimpiade MTK Tingkat Kecamatan 2018_2019.jpg",
        description: "Achieved 1st place in the district-level mathematics competition, demonstrating logical problem-solving abilities.",
        tags: ["Academic Competition", "Mathematics", "1st Place"]
    },
    {
        id: "cert-5",
        title: "1st Place – Da’wah Competition",
        type: "Achievements",
        year: "2022",
        subtitle: "Isra Mi’raj · SMPN 3 Ciemas",
        image: "assets/certificates/Peringkat 1 Lomba Dakwa Dalam Lomba Isra Mi'raj.jpg",
        description: "Delivered an impactful public speech, combining confidence, communication skills, and structured message delivery.",
        tags: ["Public Speaking", "Da’wah", "1st Place"]
    },
    {
        id: "cert-6",
        title: "2nd Place – Da’wah Competition",
        type: "Achievements",
        year: "2022",
        subtitle: "Maulid Nabi · SMPN 3 Ciemas",
        image: "assets/certificates/Peringkat 2 Juara Dakwah Dalam Lomba Maulid Nabi.jpg",
        description: "Earned 2nd place in public speaking and narrative communication during religious event celebrations.",
        tags: ["Public Speaking", "Da’wah", "2nd Place"]
    },
    {
        id: "cert-7",
        title: "1st Rank – Grade 9",
        type: "Achievements",
        year: "2022",
        subtitle: "Semester 1 · SMPN 3 Ciemas",
        image: "assets/certificates/Peringkat 1 Kelas 9 Semester 1 Tahun 2022_2023.jpg",
        description: "Maintained top academic standing during the first semester of Grade 9 through consistent academic performance.",
        tags: ["Academic Achievement", "1st Rank", "Grade 9"]
    },
    {
        id: "cert-8",
        title: "1st Rank – Grade 9",
        type: "Achievements",
        year: "2023",
        subtitle: "Semester 2 · SMPN 3 Ciemas",
        image: "assets/certificates/Peringkat 1 Kelas 9 Semester Genap Tahun 2022_2023.jpg",
        description: "Maintained the 1st rank throughout the final semester of junior high school.",
        tags: ["Academic Achievement", "1st Rank", "Grade 9"]
    },
    {
        id: "cert-9",
        title: "1st Rank – Grade 7",
        type: "Achievements",
        year: "2021",
        subtitle: "Semester 2 · SMPN 3 Ciemas",
        image: "assets/certificates/Peringkat 1 Kelas VII A.jpg",
        description: "Achieved 1st rank in Grade 7, Semester 2, reflecting an early foundation of academic consistency.",
        tags: ["Academic Achievement", "1st Rank", "Grade 7"]
    },
    {
        id: "cert-10",
        title: "Internship Certificate – BPJS Kesehatan",
        type: "Certifications",
        year: "2025",
        subtitle: "Administration & Mobile JKN Services · 6 Months",
        image: "assets/certificates/Sertifikat PKL.jpg",
        description: "Six-month practical internship experience in participant administration, Mobile JKN support, and data management.",
        tags: ["Internship", "Administration", "Customer Service", "Mobile JKN"]
    },
    {
        id: "cert-11",
        title: "Competency Assessment – Computer & Network Engineering",
        type: "Certifications",
        year: "2026",
        subtitle: "UKK · SMKN 1 Subang",
        image: "assets/certificates/Sertifikat Ujikom.jpg",
        description: "Practical assessment covering network topology, MikroTik configuration, Linux administration, and hardware assembly.",
        tags: ["Networking", "MikroTik", "Linux", "PC Assembly", "Network Administration"]
    }
];

const categoryIconMap = {
    'Achievements': 'fas fa-trophy text-amber-400 bg-amber-950/80 border-amber-800/60',
    'Certifications': 'fas fa-certificate text-blue-400 bg-blue-950/80 border-blue-800/60',
    'Webinars': 'fas fa-chalkboard-user text-emerald-400 bg-emerald-950/80 border-emerald-800/60',
    'Training': 'fas fa-graduation-cap text-purple-400 bg-purple-950/80 border-purple-800/60'
};

const categoryFullNameMap = {
    'Achievements': 'Achievement & Competition',
    'Certifications': 'Professional Certification',
    'Webinars': 'Webinar & Seminar',
    'Training': 'Training & Workshop'
};

let currentCertCategory = 'All';
let selectedCertData = null;

/* ==========================================================================
   9. CERTIFICATE RENDERER & MODAL HANDLERS
   ========================================================================== */
function renderCertificates(category = 'All') {
    const grid = document.getElementById('certificates-grid');
    if (!grid) return;

    const filteredData = category === 'All' 
        ? certificatesData 
        : certificatesData.filter(cert => cert.type === category);

    if (filteredData.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-12 text-center text-slate-400 glass-panel rounded-2xl border border-slate-800">
                <i class="fas fa-certificate text-3xl text-slate-600 mb-2 block"></i>
                <p class="text-sm">Belum ada sertifikat untuk kategori ini.</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = filteredData.map((cert) => {
        const iconClasses = categoryIconMap[cert.type] || 'fas fa-award text-sky-400 bg-blue-950/80 border-blue-800/60';

        return `
            <div onclick="openCertificateModal('${cert.id}')" 
                 onkeydown="if(event.key === 'Enter' || event.key === ' ') openCertificateModal('${cert.id}')"
                 tabindex="0"
                 role="button"
                 aria-label="View details for ${cert.title}"
                 class="cert-card glass-panel p-5 rounded-2xl border border-slate-800 hover:border-blue-500/60 transition-all flex items-start space-x-4 cursor-pointer group shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400">
                
                <div class="w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 text-xl font-bold group-hover:scale-110 transition-transform ${iconClasses}">
                    <i class="${iconClasses.split(' ')[0]} ${iconClasses.split(' ')[1]}"></i>
                </div>

                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-2 mb-1">
                        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950/80 text-sky-400 border border-blue-800/80">
                            ${cert.type}
                        </span>
                        <span class="text-xs font-mono text-slate-400">${cert.year}</span>
                    </div>

                    <h4 class="text-sm sm:text-base font-bold text-white group-hover:text-sky-400 transition-colors truncate">
                        ${cert.title}
                    </h4>
                    
                    <p class="text-xs text-slate-400 mt-0.5 truncate">${cert.subtitle}</p>

                    <div class="mt-3 text-[11px] font-semibold text-sky-400 group-hover:text-sky-300 flex items-center space-x-1">
                        <span>Click to preview certificate</span>
                        <i class="fas fa-arrow-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterCertificates(category, event) {
    if (event) event.preventDefault();

    currentCertCategory = category;

    document.querySelectorAll('.cert-filter-btn').forEach(btn => {
        btn.classList.remove('active', 'bg-blue-600', 'text-white');
        btn.classList.add('text-slate-400');
    });

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active', 'bg-blue-600', 'text-white');
        event.currentTarget.classList.remove('text-slate-400');
    }

    renderCertificates(category);
}

function openCertificateModal(certId) {
    const cert = certificatesData.find(c => c.id === certId);
    if (!cert) return;

    selectedCertData = cert;

    const certModal = document.getElementById('certificate-modal');
    const certModalBox = document.getElementById('cert-modal-box');
    const modalImg = document.getElementById('cert-modal-img');

    if (document.getElementById('cert-modal-title')) document.getElementById('cert-modal-title').textContent = cert.title;
    if (document.getElementById('cert-modal-subtitle')) document.getElementById('cert-modal-subtitle').textContent = cert.subtitle;
    if (document.getElementById('cert-modal-year')) document.getElementById('cert-modal-year').textContent = cert.year;
    if (document.getElementById('cert-modal-desc')) document.getElementById('cert-modal-desc').textContent = cert.description;
    if (document.getElementById('cert-modal-category')) document.getElementById('cert-modal-category').textContent = categoryFullNameMap[cert.type] || cert.type;

    if (modalImg) {
        modalImg.src = cert.image;
        modalImg.onerror = function() {
            this.src = `https://placehold.co/800x600/0a0f26/38bdf8?text=${encodeURIComponent(cert.title)}`;
        };
    }

    const tagsContainer = document.getElementById('cert-modal-tags');
    if (tagsContainer && cert.tags) {
        tagsContainer.innerHTML = cert.tags.map(tag => 
            `<span class="px-2 py-0.5 rounded-md text-[10px] font-mono text-slate-300 bg-slate-900 border border-slate-800">${tag}</span>`
        ).join('');
    }

    if (certModal) {
        certModal.classList.remove('opacity-0', 'pointer-events-none');
        certModal.classList.add('opacity-100', 'pointer-events-auto');
    }

    if (certModalBox) {
        certModalBox.classList.remove('scale-95');
        certModalBox.classList.add('scale-100');
    }

    document.body.style.overflow = 'hidden';
}

function closeCertificateModal() {
    const certModal = document.getElementById('certificate-modal');
    const certModalBox = document.getElementById('cert-modal-box');
    
    if (certModal) {
        certModal.classList.remove('opacity-100', 'pointer-events-auto');
        certModal.classList.add('opacity-0', 'pointer-events-none');
    }

    if (certModalBox) {
        certModalBox.classList.remove('scale-100');
        certModalBox.classList.add('scale-95');
    }

    document.body.style.overflow = 'auto';
}

function openCertLightboxFromModal() {
    if (!selectedCertData) return;

    const lightbox = document.getElementById('fullScreenLightbox');
    if (lightbox) {
        const titleEl = document.getElementById('lightboxTitle');
        if (titleEl) titleEl.textContent = selectedCertData.title + ' - Full Certificate';

        const lightboxImg = document.getElementById('lightboxImage');
        if (lightboxImg) {
            lightboxImg.src = selectedCertData.image;
            lightboxImg.onerror = function() {
                this.src = `https://placehold.co/1000x700/0a0f26/38bdf8?text=${encodeURIComponent(selectedCertData.title)}`;
            };
        }

        lightbox.style.zIndex = '100';
        lightbox.classList.remove('hidden');
        lightbox.classList.add('flex');

        resetZoom();
    }
}

/* ==========================================================================
   10. GUESTBOOK FORM & GLOBAL EVENT LISTENERS
   ========================================================================== */
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const nameInput = document.getElementById('form-name');
    const msgInput = document.getElementById('form-message');
    
    if (!nameInput || !msgInput) return;

    const name = nameInput.value;
    const message = msgInput.value;

    const guestbookList = document.getElementById('guestbook-list');
    if (guestbookList) {
        const newComment = document.createElement('div');
        newComment.className = "bg-slate-900/80 p-3 rounded-xl border border-blue-500/40 animate-pulse";
        newComment.innerHTML = `
            <div class="flex justify-between items-center text-slate-400 text-[10px] mb-1">
                <span class="font-bold text-sky-400">${name}</span>
                <span>Just now</span>
            </div>
            <p class="text-slate-300">${message}</p>
        `;

        guestbookList.prepend(newComment);
        this.reset();

        setTimeout(() => {
            newComment.classList.remove('animate-pulse');
        }, 1000);
    }
});

document.addEventListener('click', function(e) {
    const certModal = document.getElementById('certificate-modal');
    if (e.target === certModal) {
        closeCertificateModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const lightbox = document.getElementById('fullScreenLightbox');
        if (lightbox && !lightbox.classList.contains('hidden')) {
            closeLightbox();
            return;
        }

        const certModal = document.getElementById('certificate-modal');
        if (certModal && !certModal.classList.contains('opacity-0')) {
            closeCertificateModal();
            return;
        }

        if (modal && !modal.classList.contains('opacity-0')) {
            closeItemDetailModal();
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
    renderCertificates('All');
});
