const pageButtons = [...document.querySelectorAll('.page-art')];
const viewer = document.querySelector('.page-viewer');
const viewerImage = viewer.querySelector('img');
let activeButton;
pageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeButton = button;
    viewerImage.src = button.querySelector('img').src;
    viewerImage.alt = button.querySelector('img').alt;
    viewer.showModal();
    document.body.classList.add('viewer-open');
    viewer.scrollTop = 0;
  });
});
viewer.addEventListener('click', (event) => {
  if (event.target === viewer) viewer.close();
});
viewer.querySelector('.viewer-close').addEventListener('click', () => viewer.close());
viewer.addEventListener('close', () => {
  document.body.classList.remove('viewer-open');
  activeButton?.focus({ preventScroll: true });
});
