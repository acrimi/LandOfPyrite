document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('map-video').onplay = () => {
    document.getElementById('title-wrapper').style.opacity = 1;
    setTimeout(() => {
      document.getElementById('buttons').classList.add('visible');
    }, 9200);
  };
});