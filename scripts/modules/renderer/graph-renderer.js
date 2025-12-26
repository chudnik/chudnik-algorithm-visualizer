import { RendererInterface } from '../../interfaces/renderer-interface.js';
export class GraphRenderer extends RendererInterface {
  draw(step, container) {
    container.innerHTML = '';
    if (!step?.graph) return;
    const n = step.graph.length;
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width','100%');
    svg.setAttribute('height', 310);
    svg.style.background = '#f7fafc';
    const R = 108, cx = 200, cy = 145; // круговое размещение
    // Рёбра
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) if(step.graph[i][j]){
      const a = 2 * Math.PI * i / n, b = 2 * Math.PI * j / n;
      const x1 = cx + R*Math.cos(a), y1 = cy + R*Math.sin(a);
      const x2 = cx + R*Math.cos(b), y2 = cy + R*Math.sin(b);
      const edge = document.createElementNS('http://www.w3.org/2000/svg','line');
      edge.setAttribute('x1', x1); edge.setAttribute('y1', y1);
      edge.setAttribute('x2', x2); edge.setAttribute('y2', y2);
      edge.setAttribute('stroke', '#bbb'); edge.setAttribute('stroke-width',2);
      svg.appendChild(edge);
    }
    // Вершины
    for(let i=0;i<n;i++){
      const angle = 2 * Math.PI * i / n;
      const x = cx + R*Math.cos(angle), y = cy + R*Math.sin(angle);
      const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
      circle.setAttribute('cx', x);
      circle.setAttribute('cy', y);
      circle.setAttribute('r', 20);
      let color = step.visited && step.visited[i] ? '#06d6a0' : '#e3e4e6';
      if (step.highlight && step.highlight.includes(i)) color = '#ffd166';
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', '#3949ab');
      svg.appendChild(circle);
      // label
      const label = document.createElementNS('http://www.w3.org/2000/svg','text');
      label.setAttribute('x', x);
      label.setAttribute('y', y+6);
      label.setAttribute('font-size','1.10em');
      label.setAttribute('text-anchor', 'middle');
      label.textContent = i;
      svg.appendChild(label);
    }
    container.appendChild(svg);
  }
}

