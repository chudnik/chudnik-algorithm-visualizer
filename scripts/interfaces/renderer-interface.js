export class RendererInterface {
  // step — объект { array: [], highlight: [], swapped: bool }
  draw(step, container) {
    throw new Error('draw() must be implemented');
  }
}
