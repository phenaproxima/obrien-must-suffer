// This script does two things:
//   1. Turns each comic's panels into a lightbox (using PhotoSwipe).
//   2. On the home page, loads older comics as you scroll down.
// Without JavaScript the site still works. Panels are plain images, and
// each comic ends with an "Older comic" link.
(function () {
  // Sets up the lightbox for one comic. Each comic gets its own, so
  // arrow keys and swipes only move between that comic's panels.
  function initLightbox(root) {
    var gallery = root.querySelector('.comic-gallery');
    // Nothing to do if the comic has no panels we can enlarge.
    if (!gallery || !gallery.querySelector('a[data-pswp-width]')) return;
    var lightbox = new PhotoSwipeLightbox({
      gallery: gallery,
      // The links around each panel image are the slides.
      children: 'a[data-pswp-width]',
      pswpModule: PhotoSwipe,
    });
    lightbox.init();
  }

  // Set up the comics that are already on the page.
  document.querySelectorAll('[data-episode]').forEach(initLightbox);

  // Everything below is only for the home page feed. Other pages stop here.
  // Old browsers without IntersectionObserver also stop here, and keep
  // using the plain "Older comic" link.
  var feed = document.getElementById('comic-feed');
  if (!feed || !('IntersectionObserver' in window)) return;

  // Watches the marker at the bottom of the feed, and tells us when it is
  // near the screen. The 600px margin starts loading a bit early, so the
  // reader doesn't see a gap.
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) load(entry.target);
    });
  }, { rootMargin: '600px 0px' });

  // Starts watching the current marker, if there is one. The last comic
  // has no marker, so then there is nothing left to load.
  function watch() {
    var s = feed.querySelector('.comic-sentinel');
    if (s) observer.observe(s);
  }

  // Fetches the next older comic and adds it to the feed.
  function load(sentinel) {
    // Stop watching so the same comic isn't loaded twice.
    observer.unobserve(sentinel);
    fetch(sentinel.dataset.next)
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
      .then(function (html) {
        // Turn the text we got back into real page elements.
        var tpl = document.createElement('template');
        tpl.innerHTML = html;
        // The old marker has done its job. The new comic brings its own.
        sentinel.remove();
        feed.appendChild(tpl.content);
        // Set up the lightbox for the comic we just added (the last one).
        feed.querySelectorAll('[data-episode]').forEach(function (el, i, all) {
          if (i === all.length - 1) initLightbox(el);
        });
        // Watch the new marker, so the next comic loads when it's needed.
        watch();
      })
      // If the fetch fails we leave the "Older comic" link in place,
      // so the reader can still carry on.
      .catch(function () {});
  }

  watch();
})();
