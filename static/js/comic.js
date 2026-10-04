// Turns the panels of a comic into a lightbox (using PhotoSwipe).
// Without JavaScript the site still works: each panel is a plain link
// to the full size image.
(function () {
  var gallery = document.querySelector('.comic-gallery');
  // Nothing to do if the page has no panels we can enlarge.
  if (!gallery || !gallery.querySelector('a[data-pswp-width]')) return;

  var lightbox = new PhotoSwipeLightbox({
    gallery: gallery,
    // The links around each panel image are the slides.
    children: 'a[data-pswp-width]',
    pswpModule: PhotoSwipe,
  });
  lightbox.init();
})();
