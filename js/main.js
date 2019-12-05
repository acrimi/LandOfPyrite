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
  const imgPlacement = {};
  const clipPath = [];

  const pointToImageSpace = (x, y) => {
    return {
      x: (x - imgPlacement.x) / imgPlacement.width,
      y: (y - imgPlacement.y) / imgPlacement.height,
      scale: eraserThickness / imgPlacement.width
    };
  };

  const pointToCanvasSpace = (point) => {
    return {
      x: point.x * imgPlacement.width + imgPlacement.x,
      y: point.y * imgPlacement.height + imgPlacement.y,
    };
  };

  const restoreClipPath = () => {
    ctx.save();
    ctx.beginPath();
    for (let i = 0; i < clipPath.length; i++) {
      const point = pointToCanvasSpace(clipPath[i]);
      const previous = i == 0 ? null : pointToCanvasSpace(clipPath[i - 1]);
      const thickness = clipPath[i].scale * imgPlacement.width;
      addPointToPath(point.x, point.y, previous, thickness);
    }
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }

  const addPointToPath = (x, y, previousPoint, thickness) => {
    ctx.arc(x, y, thickness / 2, 0, Math.PI * 2);
    if (previousPoint && previousPoint.x != undefined && previousPoint.y != undefined) {
      ctx.save();
      const dx = x - previousPoint.x;
      const dy = y - previousPoint.y;
      const centerX = previousPoint.x + dx / 2;
      const centerY = previousPoint.y + dy / 2;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const angle = Math.atan(dy / dx);
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      ctx.rect(-dist/2, -thickness/2, dist, thickness);
      ctx.restore();
    }
  }

  const previousPosition = {};
  const onMove = event => {
    ctx.save();
    ctx.beginPath();
    addPointToPath(event.pageX, event.pageY, previousPosition, eraserThickness);
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    clipPath.push(pointToImageSpace(event.pageX, event.pageY));
    previousPosition.x = event.pageX;
    previousPosition.y = event.pageY;
  };
  document.addEventListener('mousemove', onMove);
  document.addEventListener('touchmove', event => onMove(event.touches[0]));

  document.addEventListener('mouseenter', event => {
    clipPath.push(pointToImageSpace(event.pageX, event.pageY));
    previousPosition.x = event.pageX;
    previousPosition.y = event.pageY;
  });

  const updateCanvasSize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let sourceWidth = img.width;
    let sourceHeight = img.height;
    const imgRatio = sourceWidth / sourceHeight;
    const canvasRatio = canvas.width / canvas.height;
    if (imgRatio > canvasRatio) {
      sourceWidth = sourceHeight * canvasRatio;
      imgPlacement.height = canvas.height;
      imgPlacement.width = canvas.height * imgRatio;
    } else {
      sourceHeight = sourceWidth / canvasRatio;
      imgPlacement.width = canvas.width;
      imgPlacement.height = canvas.width / imgRatio;
    }
    const x = img.width/2 - sourceWidth/2;
    const y = img.height/2 - sourceHeight/2;
    imgPlacement.x = canvas.width/2 - imgPlacement.width/2;
    imgPlacement.y = canvas.height/2 - imgPlacement.height/2;
    ctx.drawImage(img, x, y, sourceWidth, sourceHeight, 0, 0, canvas.width, canvas.height);
    
    restoreClipPath();
  };

  updateCanvasSize();
  canvas.classList.add('loaded');

  window.addEventListener('resize', updateCanvasSize);
}