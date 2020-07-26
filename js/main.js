document.addEventListener('DOMContentLoaded', () => {
  console.log('load');
  document.getElementById('map-video').onplay = () => {
    console.log('play');
    document.getElementById('title-wrapper').style.opacity = 1;
    document.getElementById('buttons').style.opacity = 1;
  };
});