(function () {
  const initializeAboutAudio = () => {
    const button = document.querySelector("[data-about-audio-toggle]");
    const audio = document.querySelector("[data-about-audio-player]");
    const defaultVolume = 0.1;
    let pendingAutoUnmute = false;
    let userPaused = false;

    if (!button || !audio) {
      return;
    }

    audio.loop = true;
    audio.autoplay = true;
    audio.playsInline = true;
    audio.volume = defaultVolume;
    audio.muted = true;

    const icon = button.querySelector("i");
    const labels = {
      playing: "Pause background music",
      paused: "Play background music",
    };

    const setState = (state) => {
      const isPlaying = state === "playing";

      button.dataset.audioState = state;
      button.setAttribute("aria-label", isPlaying ? labels.playing : labels.paused);
      button.setAttribute("title", isPlaying ? labels.playing : labels.paused);

      if (icon) {
        icon.classList.toggle("fa-play", !isPlaying);
        icon.classList.toggle("fa-pause", isPlaying);
      }
    };

    const playAudio = async () => {
      try {
        const playAttempt = audio.play();

        if (playAttempt && typeof playAttempt.then === "function") {
          await playAttempt;
        }

        setState("playing");
        return true;
      } catch (_error) {
        setState("paused");
        return false;
      }
    };

    const pauseAudio = () => {
      userPaused = true;
      audio.pause();
      setState("paused");
    };

    const syncPlayingAudio = () => {
      if (audio.paused) {
        return;
      }

      pendingAutoUnmute = false;
      audio.volume = defaultVolume;
      audio.muted = false;
      setState("playing");
    };

    const tryAutoPlay = async () => {
      if (userPaused || !audio.paused) {
        return;
      }

      pendingAutoUnmute = true;
      const started = await playAudio();

      if (!started) {
        pendingAutoUnmute = false;
      }
    };

    button.addEventListener("click", async () => {
      if (audio.paused || audio.ended) {
        userPaused = false;
        pendingAutoUnmute = false;
        audio.muted = false;
        audio.volume = defaultVolume;
        await playAudio();
        return;
      }

      pauseAudio();
    });

    audio.addEventListener("play", () => {
      setState("playing");
    });

    audio.addEventListener("playing", () => {
      if (pendingAutoUnmute) {
        pendingAutoUnmute = false;
        audio.volume = defaultVolume;
        audio.muted = false;
      }

      setState("playing");
    });

    audio.addEventListener("pause", () => {
      if (!audio.ended) {
        setState("paused");
      }
    });

    audio.addEventListener("ended", () => {
      audio.currentTime = 0;
      setState("paused");
    });

    audio.addEventListener("canplay", () => {
      syncPlayingAudio();
      void tryAutoPlay();
    });

    setState("paused");
    audio.load();
    void tryAutoPlay();
    window.setTimeout(syncPlayingAudio, 250);
    window.setTimeout(syncPlayingAudio, 1000);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAboutAudio, { once: true });
    return;
  }

  initializeAboutAudio();
})();