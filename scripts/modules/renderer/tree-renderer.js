import { RendererInterface } from '../../interfaces/renderer-interface.js';
export class TreeRenderer extends RendererInterface {
  draw(step, container) {
    container.innerHTML = '';
    const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.setAttribute('width','100%');
    svg.setAttribute('height','340');
    svg.style.background = '#f9fcff';
    if (!step?.tree) { container.appendChild(svg); return; }
    const levels = [];
    function traverse(node, depth=0, pos=0, parentX=null, parentY=null) {
      if (!node) return; while (levels.length <= depth) levels.push([]);
      const nodesOnLevel = levels[depth].length;
      const width = 45, height = 38, hGap = 15;
      let x = 70 + nodesOnLevel*100 + (depth*hGap*2);
      let y = 30 + depth * 62;
      levels[depth].push(x);
      // Draw line to parent
      if (parentX !== null) {
        const line = document.createElementNS('http://www.w3.org/2000/svg','line');
        line.setAttribute('x1', parentX); line.setAttribute('y1', parentY);
        line.setAttribute('x2', x); line.setAttribute('y2', y);
        line.setAttribute('stroke', '#bbb'); svg.appendChild(line);
      }
      // Draw node
      const nodeCircle = document.createElementNS('http://www.w3.org/2000/svg','ellipse');
      nodeCircle.setAttribute('cx',x); nodeCircle.setAttribute('cy',y); nodeCircle.setAttribute('rx',24); nodeCircle.setAttribute('ry',18);
      nodeCircle.setAttribute('fill', step.highlight?.includes(node.key) ? '#ffd166':'#e3e4e6');
      nodeCircle.setAttribute('stroke', '#575b9e');
      svg.appendChild(nodeCircle);
      // Label
      const label = document.createElementNS('http://www.w3.org/2000/svg','text');
      label.setAttribute('x',x); label.setAttribute('y',y+6);
      label.setAttribute('font-size','1.1em');
      label.setAttribute('fill','#263238'); label.setAttribute('text-anchor','middle');
      label.textContent = node.key;
      svg.appendChild(label);
      traverse(node.left, depth+1, pos*2, x, y);
      traverse(node.right, depth+1, pos*2+1, x, y);
    }
    traverse(step.tree);
    container.appendChild(svg);
  }
}
