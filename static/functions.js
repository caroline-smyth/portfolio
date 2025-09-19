function doBoxesOverlap(a, b) {
  return !(
    a.right < b.left ||
    a.left > b.right ||
    a.bottom < b.top ||
    a.top > b.bottom
  );
}

function first_scatter(clickedEl) {
  const box = document.querySelector('.random-box');
  if (!box) return;
  scatter();
  if (clickedEl) {
    clickedEl.style.visibility = 'hidden';
  }
}

function scatter() {
  const box = document.querySelector('.random-box');
  if (!box) return;
  // gather the name + all nav items
  const items = [
    box.querySelector('.name-container'),
    ...box.querySelectorAll('.nav-bar-item')
  ];
  // remove transforms to get true size
  items.forEach(el => el.style.transform = 'none');
  box.offsetWidth;

  const W = box.clientWidth;
  const H = box.clientHeight;
  const placed = [];
  const maxTries = 200;

  for (let i = 0; i < items.length; i++) {
    const el = items[i];
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let found = false;
    let tries = 0;
    let cx, cy, bbox;
    while (!found && tries < maxTries) {
      // ensure the element stays fully inside the box
      cx = Math.random() * (W - w) + w / 2;
      cy = Math.random() * (H - h) + h / 2;
      bbox = {
        left: cx - w / 2,
        right: cx + w / 2,
        top: cy - h / 2,
        bottom: cy + h / 2
      };
      // check for overlap with already placed elements
      found = placed.every(other => !doBoxesOverlap(bbox, other.bbox));
      tries++;
    }
    // If not found after maxTries, stack vertically as fallback
    if (!found) {
      cx = w / 2 + 10;
      cy = (i + 1) * (h + 10) - h / 2;
      bbox = {
        left: cx - w / 2,
        right: cx + w / 2,
        top: cy - h / 2,
        bottom: cy + h / 2
      };
    }
    el.style.transform = `translate(${cx - w/2}px, ${cy - h/2}px)`;
    placed.push({ bbox });
  }
}

let firstClickHandled = false;

window.addEventListener('load', () => {     
    scatter();
    document.body.addEventListener('click', () => {
      if (!firstClickHandled) {
        const firstBtn = document.getElementById('first-click-btn');
        if (firstBtn) firstBtn.style.visibility = 'hidden';
        firstClickHandled = true;
      }
      scatter();
    });
});