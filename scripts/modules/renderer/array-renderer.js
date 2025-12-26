import { RendererInterface } from '../../interfaces/renderer-interface.js';
export class ArrayRenderer extends RendererInterface {
  draw(step, container) {
    container.innerHTML = '';
    if (!step?.array) return;
    step.array.forEach((item, idx) => {
      const el = document.createElement('div');
      el.textContent = item;
      el.className = 'array-item';
      if (step.highlight?.includes(idx)) el.classList.add('highlight');
      if (step.swapped && step.highlight?.includes(idx)) el.classList.add('swapped');
      container.appendChild(el);
    });
  }
}

