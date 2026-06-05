
let ytPlayer = null;
let isReady = false;
let isPlaying = false;

// ⚠️ TEM que ser global (YouTube chama sozinho)
window.onYouTubeIframeAPIReady = function () {
    ytPlayer = new YT.Player('yt-player', {
        width: '0',
        height: '0',
        videoId: '9mmiOFzkeh4',
        playerVars: {
            autoplay: 0,
            controls: 0,
            loop: 1
        },
        events: {
            onReady: () => {
                isReady = true;
                console.log("🎵 YouTube pronto!");
            },
            onError: (e) => {
                console.log("Erro YouTube:", e);
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', () => {

    const playBtn = document.getElementById('play-pause-btn');

    playBtn.addEventListener('click', async () => {

        if (!isReady || !ytPlayer) {
            console.log("⏳ Player ainda não está pronto");
            return;
        }

        try {
            if (!isPlaying) {
                await ytPlayer.playVideo();
                playBtn.innerText = '⏸';
                isPlaying = true;
            } else {
                ytPlayer.pauseVideo();
                playBtn.innerText = '▶';
                isPlaying = false;
            }
        } catch (err) {
            console.log("Erro ao tocar música:", err);
        }
    });

});