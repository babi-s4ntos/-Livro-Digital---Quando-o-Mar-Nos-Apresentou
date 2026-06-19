document.addEventListener('DOMContentLoaded', () => {

    // =========================
    // ELEMENTOS
    // =========================
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnDownload = document.getElementById('btn-download');

    const htmlElement = document.getElementById('book');

    const bgMusic = document.getElementById('bg-music');
    const flipSound = document.getElementById('flip-sound');
    const playBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress');

    // =========================
    // PAGEFLIP
    // =========================
    const pageFlip = new St.PageFlip(htmlElement, {
        width: 400,
        height: 600,
        size: "stretch",
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 420,
        maxHeight: 1350,

        maxShadowOpacity: 0.3,
        showCover: true,
        mobileScrollSupport: true,
        usePortrait: true,

        flippingTime: 500,
        clickEventForward: true
    });

    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // =========================
    // BOTÕES DE PÁGINA
    // =========================
    btnPrev.addEventListener('click', () => pageFlip.flipPrev());
    btnNext.addEventListener('click', () => pageFlip.flipNext());

    // =========================
    // DOWNLOAD DA PÁGINA ATUAL
    // =========================
    btnDownload.addEventListener('click', async () => {

        const pageIndex = pageFlip.getCurrentPageIndex();
        const pages = document.querySelectorAll('.page');
        const page = pages[pageIndex];

        if (!page) return;

        await new Promise(r => setTimeout(r, 300));

        const canvas = await html2canvas(page, {
            scale: 2,
            useCORS: true,
            backgroundColor: null
        });

        const link = document.createElement('a');
        link.download = `pagina-${pageIndex + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });

    // =========================
    // SOM DE VIRAR PÁGINA
    // =========================
    pageFlip.on('flip', () => {
        if (flipSound) {
            flipSound.currentTime = 0;
            flipSound.play();
        }

        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    });

    // =========================
    // MÚSICA AUTOMÁTICA NO FINAL
    // =========================
    pageFlip.on('changeState', (e) => {
        if (e.data === 'read') {
            const currentIndex = pageFlip.getCurrentPageIndex();
            const totalPages = pageFlip.getPageCount();

            if (currentIndex >= totalPages - 2) {
                if (bgMusic && bgMusic.paused) {
                    bgMusic.volume = 0.4;
                    bgMusic.play();
                    playBtn.innerText = '⏸';
                }
            }
        }
    });

    // =========================
    // PLAY / PAUSE MÚSICA (CORRIGIDO)
    // =========================
    playBtn.addEventListener('click', async () => {
        try {
            if (!bgMusic) return;

            if (bgMusic.paused) {
                bgMusic.volume = 0.4;
                await bgMusic.play();
                playBtn.innerText = '⏸';
            } else {
                bgMusic.pause();
                playBtn.innerText = '▶';
            }
        } catch (err) {
            console.log('Erro ao tocar música:', err);
        }
    });

    // =========================
    // PROGRESSO DA MÚSICA
    // =========================
    bgMusic.addEventListener('timeupdate', () => {
        if (!bgMusic.duration) return;

        const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressBar.style.width = `${progress}%`;
    });

    // =========================
    // CLIQUE PARA VIRAR PÁGINA
    // =========================
    htmlElement.addEventListener('click', (e) => {
        const rect = htmlElement.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        if (clickX > rect.width / 2) {
            pageFlip.flipNext();
        } else {
            pageFlip.flipPrev();
        }
    });

    // =========================
    // PETALAS FLUTUANTES
    // =========================
    function createPetal() {
        const petal = document.createElement('div');

        const hearts = ['🤍', '🖤'];
        petal.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];

        petal.style.position = 'fixed';
        petal.style.top = '-20px';
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.fontSize = (Math.random() * 12 + 14) + 'px';
        petal.style.opacity = Math.random();
        petal.style.zIndex = '1';
        petal.style.pointerEvents = 'none';
        petal.style.transition =
            `transform ${Math.random() * 5 + 5}s linear,
             top ${Math.random() * 5 + 5}s linear`;

        document.body.appendChild(petal);

        setTimeout(() => {
            petal.style.top = '110vh';
            petal.style.transform =
                `translateX(${Math.random() * 100 - 50}px)
                 rotate(${Math.random() * 360}deg)`;
        }, 100);

        setTimeout(() => {
            petal.remove();
        }, 10000);
    }

    setInterval(createPetal, 500);

    // =========================
    // SPARKLES
    // =========================
    function createSparkle() {
        const finalPage = document.querySelector('.sparkles-container');
        if (!finalPage) return;

        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.className = 'sparkle';

        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.position = 'absolute';
        sparkle.style.animation = 'glow 1.5s infinite';

        finalPage.appendChild(sparkle);

        setTimeout(() => sparkle.remove(), 1500);
    }

    setInterval(createSparkle, 300);

});

const celular = document.querySelector('.mockup-celular');

['click', 'touchstart', 'mousedown'].forEach(evento => {
    celular.addEventListener(evento, (e) => {
        e.preventDefault();
        e.stopPropagation();
    });
});

celular.addEventListener('click', () => {
    celular.classList.toggle('ativo');
});
const modal = document.getElementById("foto-modal");
const modalImg = document.getElementById("modal-img");
const modalDesc = document.getElementById("modal-desc");

// ABRIR MODAL (bloqueia PageFlip antes dele receber o evento)
document.querySelectorAll(".polaroid").forEach(polaroid => {

    polaroid.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        e.stopPropagation();

        const img = polaroid.querySelector("img");
        const desc = polaroid.querySelector(".descricao");

        modalImg.src = img.src;
        modalDesc.textContent = desc ? desc.textContent : "";

        modal.classList.add("ativo");
    }, true); // 👈 captura ANTES do PageFlip
});


// FECHAR MODAL (também bloqueia propagação)
modal.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    e.stopPropagation();

    modal.classList.remove("ativo");
}, true);