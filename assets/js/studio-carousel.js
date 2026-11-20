'use strict';

document.querySelectorAll('[data-carousel]').forEach((carousel) => {
  const tabs = [...carousel.querySelectorAll('.show-tab')];
  const slides = tabs.map((tab) => document.getElementById(tab.hash.slice(1)));
  const controls = carousel.querySelector('.show-arrows');
  if (!tabs.length || !controls || slides.some((slide) => !slide)) return;

  const tablist = carousel.querySelector('.show-tabs');
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', 'Featured products');
  let active = 0;
  const hashIndex = () => slides.findIndex((slide) => '#' + slide.id === location.hash);

  function select(index, focus = false) {
    active = (index + tabs.length) % tabs.length;
    tabs.forEach((tab, i) => {
      const selected = i === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      slides[i].hidden = !selected;
    });
    if (focus) tabs[active].focus();
  }

  tabs.forEach((tab, i) => {
    tab.id = 'tab-' + slides[i].id;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', slides[i].id);
    slides[i].setAttribute('role', 'tabpanel');
    slides[i].setAttribute('aria-labelledby', tab.id);
    tab.addEventListener('click', (event) => {
      event.preventDefault();
      select(i);
    });
    tab.addEventListener('keydown', (event) => {
      const actions = {ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1};
      if (!Object.hasOwn(actions, event.key)) return;
      event.preventDefault();
      select(actions[event.key], true);
    });
  });

  controls.querySelectorAll('button[data-step]').forEach((button) => {
    button.addEventListener('click', () => select(active + Number(button.dataset.step), true));
  });
  window.addEventListener('hashchange', () => {
    const index = hashIndex();
    if (index !== -1) select(index);
  });

  select(Math.max(0, hashIndex()));
  controls.hidden = false;
  carousel.dataset.ready = '';
});
