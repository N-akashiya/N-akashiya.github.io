(() => {
  const brand = document.querySelector('.site-brand-container');
  const alignContent = () => {
    if (!brand) return;
    document.documentElement.style.setProperty('--site-brand-height', `${brand.getBoundingClientRect().height}px`);
  };
  alignContent();
  if (brand && window.ResizeObserver) {
    new ResizeObserver(alignContent).observe(brand);
  } else if (brand) {
    window.addEventListener('resize', alignContent);
  }

  // NexT has now positioned the sidebar and selected its initial panel.
  const revealCards = () => {
    alignContent();
    document.documentElement.classList.remove('site-enter-pending');
    document.documentElement.classList.add('site-enter-ready');
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', revealCards, { once: true });
  } else {
    revealCards();
  }
})();