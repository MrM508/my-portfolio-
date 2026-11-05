const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2});
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('open');
        menuToggle.classList.toggle('open');
        menuToggle.setAttribute('aria-expanded', isOpen);
    });

    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('open');
            menuToggle.classList.remove('open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

document.querySelectorAll('.project-gallery').forEach(gallery => {
    const track = gallery.querySelector('.gallery-track');
    const images = Array.from(track.children);
    const dotsWrap = gallery.querySelector('.gallery-dots');
    const prevBtn = gallery.querySelector('.gallery-arrow.prev');
    const nextBtn = gallery.querySelector('.gallery-arrow.next');
    let index = 0;

    if (images.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
        return;
    }

    images.forEach((_, i) => {
        const dot = document.createElement('span');
        dot.className = 'dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.children);

    function goTo(i){
        index = (i + images.length) % images.length;
        track.style.transform = `translateX(-${index * 100}%)`;
        dots.forEach((d, di) => d.classList.toggle('active', di === index));
    }

    prevBtn.addEventListener('click', () => goTo(index - 1));
    nextBtn.addEventListener('click', () => goTo(index + 1));

    let startX = 0;
    track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - startX;
        if (Math.abs(diff) > 40) goTo(diff < 0 ? index + 1 : index - 1);
    }, { passive: true });
});

const projCon = document.getElementById('projectsCon');
const projPrev = document.getElementById('projPrev');
const projNext = document.getElementById('projNext');

if (projCon && projPrev && projNext) {
    const step = () => {
        const card = projCon.querySelector('.project-card');
        return card ? card.offsetWidth + parseFloat(getComputedStyle(projCon).gap || 0) : 300;
    };
    const updateNav = () => {
        projPrev.disabled = projCon.scrollLeft <= 2;
        projNext.disabled = projCon.scrollLeft + projCon.clientWidth >= projCon.scrollWidth - 2;
    };
    projPrev.addEventListener('click', () => projCon.scrollBy({ left: -step(), behavior: 'smooth' }));
    projNext.addEventListener('click', () => projCon.scrollBy({ left: step(), behavior: 'smooth' }));
    projCon.addEventListener('scroll', updateNav, { passive: true });
    window.addEventListener('resize', updateNav);
    updateNav();
}