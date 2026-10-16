/* Keep the original wallpaper still unless a desktop window fills the screen. */
(() => {
  'use strict';

  const root = document.documentElement;
  const background = document.createElement('div');
  background.className = 'blog-background';
  background.setAttribute('aria-hidden', 'true');
  const track = document.createElement('div');
  track.className = 'blog-background-track';
  background.append(track);
  document.body.prepend(background);
  const desktop = window.matchMedia('(min-width: 1101px) and (hover: hover) and (pointer: fine)');
  const tolerance = 20; // Allow for Windows' invisible resize borders.
  const wallpaperRatio = 1759 / 894; // Original bgp.png, unchanged.
  const repeatWidth = 526; // One complete column; exclude the original right-hand partial column.
  const pixelsPerSecond = 14;
  let pending = false;

  function update() {
    pending = false;
    const screen = window.screen;
    const close = (actual, expected) => expected > 0 && Math.abs(actual - expected) <= tolerance;
    const maximized = close(window.outerWidth, screen.availWidth) &&
      close(window.outerHeight, screen.availHeight);
    const fullscreen = close(window.innerWidth, screen.width) &&
      close(window.innerHeight, screen.height);
    // A maximized host can still contain a narrow page beside a sidebar.
    const widePage = screen.availWidth > 0 && window.innerWidth >= screen.availWidth * 0.9;
    const moving = desktop.matches && widePage && (maximized || fullscreen);
    if (moving) {
      // Keep the original cover scale, but clip each tile to one complete column.
      const imageWidth = Math.max(window.innerWidth, window.innerHeight * wallpaperRatio);
      const tileWidth = imageWidth * repeatWidth / 1759;
      const offset = (window.innerWidth - imageWidth) / 2;
      const tileCount = Math.ceil((window.innerWidth - offset) / tileWidth) + 1;
      if (track.childElementCount !== tileCount) {
        const tiles = Array.from({length: tileCount}, () => {
          const tile = document.createElement('div');
          tile.className = 'blog-background-tile';
          return tile;
        });
        track.replaceChildren(...tiles);
      }
      root.style.setProperty('--blog-background-width', `${tileWidth}px`);
      root.style.setProperty('--blog-background-image-width', `${imageWidth}px`);
      root.style.setProperty('--blog-background-offset', `${offset}px`);
      root.style.setProperty('--blog-background-duration', `${tileWidth / pixelsPerSecond}s`);
    }
    root.classList.toggle('blog-background-moving', moving);
    root.classList.toggle('blog-background-paused', document.hidden);
  }

  function schedule() {
    if (pending) return;
    pending = true;
    window.requestAnimationFrame(update);
  }

  window.addEventListener('resize', schedule, {passive: true});
  window.addEventListener('focus', schedule);
  window.addEventListener('pageshow', schedule);
  document.addEventListener('fullscreenchange', schedule);
  document.addEventListener('visibilitychange', schedule);
  desktop.addEventListener('change', schedule);
  if (window.visualViewport) window.visualViewport.addEventListener('resize', schedule, {passive: true});
  update();
})();
