(() => {
  const video = document.querySelector('.hero-video');
  const toggle = document.querySelector('.hero-motion-toggle');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 600px)');
  const connection = navigator.connection;
  let manuallyPaused = false;
  function stop() {
    video.pause();
    video.removeAttribute('src');
    video.replaceChildren();
    video.load();
    toggle.hidden = true;
  }
  function update() {
    if (reduce.matches || (connection && connection.saveData)) { stop(); return; }
    const variant = mobile.matches ? 'mobile' : 'desktop';
    if (video.dataset.variant !== variant || !video.querySelector('source')) {
      video.dataset.variant = variant;
      video.poster = `images/pool-${variant}.jpg`;
      video.replaceChildren();
      for (const [extension, type] of [['webm','video/webm'], ['mp4','video/mp4']]) {
        const source = document.createElement('source');
        source.src = `videos/pool-${variant}.${extension}`;
        source.type = type;
        video.append(source);
      }
      video.muted = true;
      video.autoplay = true;
      video.load();
    }
    if (!manuallyPaused) video.play().then(() => { toggle.hidden = false; }).catch(() => { toggle.hidden = true; });
  }
  toggle.addEventListener('click', () => {
    manuallyPaused = !manuallyPaused;
    if (manuallyPaused) video.pause(); else video.play().catch(() => {});
    toggle.textContent = manuallyPaused ? 'Play video' : 'Pause video';
    toggle.setAttribute('aria-label', manuallyPaused ? 'Play background video' : 'Pause background video');
  });
  reduce.addEventListener('change', update);
  mobile.addEventListener('change', update);
  if (connection && connection.addEventListener) connection.addEventListener('change', update);
  video.addEventListener('error', () => { toggle.hidden = true; });
  update();
})();
