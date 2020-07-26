document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('map-video').onplay = () => {
    document.getElementById('title-wrapper').style.opacity = 1;
    setTimeout(() => {
      document.getElementById('buttons').classList.add('visible');
    }, 9200);
  };

  const overlay = document.getElementById('overlay');
  document.getElementById('synopsis').onclick = () => {
    overlay.classList.add('visible');
  };

  overlay.onclick = (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('visible');
    }
  };

  document.addEventListener('keyup', (e) => {
    if (e.code === 'Escape') {
      overlay.classList.remove('visible');
    }
  });
});