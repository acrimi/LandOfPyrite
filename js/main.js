window.onload = () => {
  console.log('loaded');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const eraserThickness = 40;

  const updateCanvasSize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  };

  img.addEventListener('load', updateCanvasSize);
  img.src = 'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500';

  const previousPosition = {};
  document.addEventListener('mousemove', event => {
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
  });

  document.addEventListener('mouseenter', event => {
    previousPosition.x = event.pageX;
    previousPosition.y = event.pageY;
  });

  window.addEventListener('resize', updateCanvasSize);
};