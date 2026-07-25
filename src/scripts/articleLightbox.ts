// Fullscreen lightbox for article-layout content (posts and pages).
// Reuses the shared #gallery-lightbox element (components/Lightbox.astro)
// and walks every image inside .post-article in document order, so
// prev/next flows through the whole story. Gallery-layout posts are
// handled separately by Work.astro's gallery script.
export function initArticleLightbox() {
  const article = document.querySelector<HTMLElement>('.post-article');
  const lightbox = document.getElementById('gallery-lightbox');
  if (!article || !lightbox || article.dataset.lightboxBound === '1') return;
  article.dataset.lightboxBound = '1';

  const images = [...article.querySelectorAll<HTMLImageElement>('img')];
  if (images.length === 0) return;

  const lightboxImage = lightbox.querySelector<HTMLImageElement>('.lightbox-image')!;
  const lightboxCaption = lightbox.querySelector<HTMLElement>('.lightbox-caption')!;
  const counter = lightbox.querySelector<HTMLElement>('.lightbox-counter')!;
  let current = 0;

  const show = (index: number) => {
    current = (index + images.length) % images.length;
    const image = images[current];
    lightboxImage.src = image.dataset.full || image.src;
    lightboxImage.alt = image.alt;
    const caption = image.dataset.caption || '';
    lightboxCaption.textContent = caption;
    lightboxCaption.hidden = !caption;
    counter.textContent = `${current + 1} / ${images.length}`;
  };
  const open = (index: number) => {
    show(index);
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lightbox.hidden = true;
    document.body.style.overflow = '';
  };

  images.forEach((image, index) => {
    image.addEventListener('click', () => open(index));
  });
  lightbox.querySelector('.lightbox-close')!.addEventListener('click', close);
  lightbox.querySelector('.lightbox-prev')!.addEventListener('click', () => show(current - 1));
  lightbox.querySelector('.lightbox-next')!.addEventListener('click', () => show(current + 1));
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) close();
  });
  document.addEventListener('keydown', (event) => {
    if (lightbox.hidden) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'ArrowRight') show(current + 1);
  });
}
