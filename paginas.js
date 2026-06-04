document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicialização do PageFlip
    const htmlElement = document.getElementById('book');
    const pageFlip = new St.PageFlip(htmlElement, {
        width: 400, // dimensões base (ajustadas via CSS)
        height: 600,
        size: "stretch",
        minWidth: 315,
        maxWidth: 1000,
        minHeight: 420,
        maxHeight: 1350,
        maxShadowOpacity: 0.5,
        showCover: true,
        mobileScrollSupport: false,
        usePortrait: true // Essencial para mobile
    });

    // Carregar páginas
    pageFlip.loadFromHTML(document.querySelectorAll('.page'));

    // 2. Sistema de Áudio
    const bgMusic = document.getElementById('bg-music');
    const flipSound = document.getElementById('flip-sound');
    const playBtn = document.getElementById('play-pause-btn');
    const progressBar = document.getElementById('progress');

    // Tocar som de página ao virar
    pageFlip.on('flip', (e) => {
        flipSound.currentTime = 0;
        flipSound.play();
        
        // Vibração mobile
        if (navigator.vibrate) {
            navigator.vibrate(20);
        }
    });

    // Detectar página final para tocar música automaticamente
    pageFlip.on('changeState', (e) => {
        if (e.data === 'read') {
            const currentIndex = pageFlip.getCurrentPageIndex();
            const totalPages = pageFlip.getPageCount();
            
            // Se estiver na última página (ou penúltima considerando spread)
            if (currentIndex >= totalPages - 2) {
                if (bgMusic.paused) {
                    bgMusic.volume = 0.4;
                    bgMusic.play();
                    playBtn.innerText = '⏸';
                }
            }
        }
    });

    // Controle do Player
    playBtn.addEventListener('click', () => {
        if (bgMusic.paused) {
            bgMusic.play();
            playBtn.innerText = '⏸';
        } else {
            bgMusic.pause();
            playBtn.innerText = '▶';
        }
    });

    // Barra de Progresso
    bgMusic.addEventListener('timeupdate', () => {
        const progress = (bgMusic.currentTime / bgMusic.duration) * 100;
        progressBar.style.width = `${progress}%`;
    });

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
    // Gerar pétalas periodicamente
    setInterval(createPetal, 500);

    // 4. Efeito de Brilhos (Sparkles) na página final
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