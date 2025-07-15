document.addEventListener('DOMContentLoaded', () => {
  const box = document.querySelector('.random-box');
  if (!box) return;
  // gather the name + all nav items
  const items = [
    box.querySelector('.name-container'),
    ...box.querySelectorAll('.nav-bar-item')
  ];

  function scatter() {
    const margin = 16;
    const maxDiag = Math.max(
      ...items.map(el => Math.hypot(el.offsetWidth, el.offsetHeight))
    );
    const radius = maxDiag / 2 + margin;
    const cellSize = radius / Math.SQRT2;
    const W = box.clientWidth;
    const H = box.clientHeight;
    const k = 30;
    const gridCols = Math.ceil(W / cellSize);
    const gridRows = Math.ceil(H / cellSize);
    const grid = Array(gridCols * gridRows).fill(null);
    const active = [];
    const samples = [];

    function addSample(pt) {
      samples.push(pt);
      active.push(pt);
      const gx = Math.floor(pt[0] / cellSize);
      const gy = Math.floor(pt[1] / cellSize);
      grid[gy * gridCols + gx] = pt;
    }
    function isFar(pt) {
      const gx = Math.floor(pt[0] / cellSize);
      const gy = Math.floor(pt[1] / cellSize);
      for (let y = gy - 2; y <= gy + 2; y++) {
        for (let x = gx - 2; x <= gx + 2; x++) {
          if (x < 0 || y < 0 || x >= gridCols || y >= gridRows) continue;
          const neighbor = grid[y * gridCols + x];
          if (!neighbor) continue;
          const dx = neighbor[0] - pt[0];
          const dy = neighbor[1] - pt[1];
          if (dx*dx + dy*dy < radius*radius) return false;
        }
      }
      return true;
    }
    // Remove transforms to get true size
    items.forEach(el => el.style.transform = 'none');
    box.offsetWidth;
    // 1) pick first random point anywhere in box
    addSample([
      Math.random() * W,
      Math.random() * H
    ]);
    // 2) Bridson’s main loop
    while (active.length) {
      const idx = Math.floor(Math.random() * active.length);
      const [x, y] = active[idx];
      let found = false;
      for (let i = 0; i < k; i++) {
        const θ = 2 * Math.PI * Math.random();
        const r = radius * (1 + Math.random());
        const nx = x + Math.cos(θ) * r;
        const ny = y + Math.sin(θ) * r;
        if (
          nx >= 0 && nx < W &&
          ny >= 0 && ny < H &&
          isFar([nx, ny])
        ) {
          addSample([nx, ny]);
          found = true;
          break;
        }
      }
      if (!found) active.splice(idx, 1);
    }
    // 3) now we have a “blue‑noise” array of centers in `samples`
    //    map the first N items to the first N points
    items.forEach((el, i) => {
      const [cx, cy] = samples[i];
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      el.style.transform = `translate(${cx - w/2}px, ${cy - h/2}px)`;
    });
  }

  // Initial scatter
  scatter();
  // Listen for clicks anywhere on the page
  document.body.addEventListener('click', scatter);
});