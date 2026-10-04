(() => {
  const brand = document.querySelector('.site-brand-container');
  if (!brand) return;
  const alignContent = () => {
    document.documentElement.style.setProperty('--site-brand-height', `${brand.getBoundingClientRect().height}px`);
  };
  alignContent();
  if (window.ResizeObserver) {
    new ResizeObserver(alignContent).observe(brand);
  } else {
    window.addEventListener('resize', alignContent);
  }
})();
