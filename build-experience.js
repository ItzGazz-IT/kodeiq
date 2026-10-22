// A visual build sequence. No live app generation or form data is sent here.
(() => {
  const experience = document.querySelector('#build-experience');
  if (!experience) return;
  const buttons = [...document.querySelectorAll('[data-build-stage]')];
  const play = document.querySelector('#build-play');
  const caption = document.querySelector('#build-caption');
  const captions = [
    'Every useful app starts with a clear blueprint.',
    'Your interface takes shape, one thoughtful detail at a time.',
    'Connect the data, workflows and intelligence that make it useful.',
    'Tested, refined and ready for your next chapter.'
  ];
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let stage = motion.matches ? 3 : 0;
  let paused = motion.matches;
  let visible = false;
  let timer;
  function render(next) {
    stage = next;
    experience.dataset.stage = String(stage);
    buttons.forEach((button, index) => button.setAttribute('aria-pressed', String(index === stage)));
    caption.textContent = captions[stage];
  }
  function sync() {
    clearInterval(timer);
    play.textContent = paused ? '▶' : 'Ⅱ';
    play.setAttribute('aria-label', paused ? 'Play app build animation' : 'Pause app build animation');
    if (visible && !paused && !document.hidden) timer = setInterval(() => render((stage + 1) % 4), 3400);
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    paused = true;
    render(index);
    sync();
  }));
  play.addEventListener('click', () => { paused = !paused; sync(); });
  document.addEventListener('visibilitychange', sync);
  motion.addEventListener('change', () => { paused = motion.matches; if (paused) render(3); sync(); });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { threshold: 0.15 });
    observer.observe(experience);
  } else { visible = true; }
  render(stage);
  sync();
  // Sections stay visible if JavaScript or IntersectionObserver is unavailable.
  if ('IntersectionObserver' in window && !motion.matches) {
    const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-revealed'); reveal.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.section-heading,.service,.project,.steps article,.section-seam').forEach(element => {
      element.classList.add('scroll-enter');
      reveal.observe(element);
    });
  }
})();
