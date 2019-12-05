window.onload = () => {
  startCarousel();
  setupEraser();
};

function startCarousel() {
  const backgrounds = [];
  let activeIndex = 0;
  for (let i = 0; i < 6; i++) {
    const bg = document.getElementById(`bg${i + 1}`);
    backgrounds.push(bg);
    if (bg.classList.contains('active')) {
      activeIndex = i;
    }
  }

  setInterval(() => {
    backgrounds[activeIndex].classList.remove('active');
    activeIndex = (activeIndex + 1) % backgrounds.length;
    backgrounds[activeIndex].classList.add('active');
  }, 5000);
}

function setupEraser() {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const img = document.getElementById('cover');
  const eraserThickness = 40;

  const updateCanvasSize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  updateCanvasSize();
  canvas.classList.add('loaded');

  const previousPosition = {};
  const onMove = event => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(event.pageX, event.pageY, eraserThickness / 2, 0, Math.PI * 2);
    if (previousPosition.x != undefined && previousPosition.y != undefined) {
      ctx.save();
      const dx = event.pageX - previousPosition.x;
      const dy = event.pageY - previousPosition.y;
      const centerX = previousPosition.x + dx / 2;
      const centerY = previousPosition.y + dy / 2;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan(dy / dx);
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.rect(-dist/2, -eraserThickness/2, dist, eraserThickness);
      ctx.restore();
    }
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
    
    previousPosition.x = event.pageX;
    previousPosition.y = event.pageY;
  };
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', event => onMove(event.touches[0]));

  document.addEventListener('mouseenter', event => {
    previousPosition.x = event.pageX;
    previousPosition.y = event.pageY;
  });

  window.addEventListener('resize', updateCanvasSize);
}