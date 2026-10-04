(function () {
  function initLightbox(root) {
    var gallery = root.querySelector('.comic-gallery');
    if (!gallery || !gallery.querySelector('a[data-pswp-width]')) return;
    var lightbox = new PhotoSwipeLightbox({
      gallery: gallery,
      children: 'a[data-pswp-width]',
      pswpModule: PhotoSwipe,
    });
    lightbox.init();
  }

  document.querySelectorAll('[data-episode]').forEach(initLightbox);

  var feed = document.getElementById('comic-feed');
  if (!feed || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) load(entry.target);
    });
  }, { rootMargin: '600px 0px' });

  function watch() {
    var s = feed.querySelector('.comic-sentinel');
    if (s) observer.observe(s);
  }

  function load(sentinel) {
    observer.unobserve(sentinel);
    fetch(sentinel.dataset.next)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        var tpl = document.createElement('template');
        tpl.innerHTML = html;
        sentinel.remove();
        feed.appendChild(tpl.content);
        feed.querySelectorAll('[data-episode]').forEach(function (el, i, all) {
          if (i === all.length - 1) initLightbox(el);
        });
        watch();
      })
      .catch(function () { /* keep the no-JS "Older comic" link */ });
  }

  watch();
})();
