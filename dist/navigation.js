(() => {
  const links = [...document.querySelectorAll('.section-nav a')];
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  function navigate(hash, update = true) {
    const link = links.find(a => a.hash === hash);
    if (!link) return;
    const target = document.querySelector(hash);
    target.querySelectorAll(':scope > details').forEach(d => d.open = true);
    if (update) history.replaceState(null, '', hash);
    requestAnimationFrame(() => target.scrollIntoView({behavior: reduced() ? 'instant' : 'smooth', block: 'start'}));
  }
  links.forEach(link => link.addEventListener('click', e => {e.preventDefault(); navigate(link.hash);}));
  let scheduled = false;
  function activeSection() {
    scheduled = false;
    let current = links[0];
    for (const link of links) if (document.querySelector(link.hash).getBoundingClientRect().top <= 170) current = link;
    links.forEach(link => link === current ? link.setAttribute('aria-current', 'location') : link.removeAttribute('aria-current'));
  }
  addEventListener('scroll', () => {if (!scheduled) {scheduled = true; requestAnimationFrame(activeSection);}}, {passive:true});
  addEventListener('hashchange', () => navigate(location.hash, false));
  if (location.hash) navigate(location.hash, false);
  const equation = document.getElementById('equation');
  const sync = () => document.getElementById('nav-equation').textContent = equation.textContent;
  new MutationObserver(sync).observe(equation, {childList:true, characterData:true, subtree:true}); sync();
  const dialog = document.getElementById('lesson-dialog');
  document.querySelectorAll('[data-lesson]').forEach(button => button.addEventListener('click', () => {
    const content = document.getElementById('lesson-content');
    content.replaceChildren(document.getElementById(button.dataset.lesson).content.cloneNode(true));
    content.querySelector('h2').id = 'lesson-title';
    dialog.showModal(); dialog.scrollTop = 0;
    document.body.classList.add('lesson-open');
    document.getElementById('close-lesson').focus();
  }));
  document.getElementById('close-lesson').onclick = () => dialog.close();
  dialog.addEventListener('close', () => document.body.classList.remove('lesson-open'));
  dialog.addEventListener('click', e => {if(e.target === dialog) {const r=dialog.getBoundingClientRect(); if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom) dialog.close();}});
  document.getElementById('edit-vertex').addEventListener('click', () => {navigate('#explorer'); document.getElementById('vertex-tab').focus({preventScroll:true});});
})();
