import setAttributes from '../utils/setAttributes';
import normalizeColor from '../utils/normalizeColor';

/**
 * Create SVGTextElement from an annotation definition.
 * This is used for anntations of type `textbox`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGTextElement} A text to be rendered
 */
export default function renderText(a) {
  const VIEWPORT_SCALE_FACTOR = 96.0 / 72.0;
  
  // Text should be rendered at 0 degrees relative to
  // document rotation
  let image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
  setAttributes(image, {
    x: a.x,
    y: a.y,
    width: a.width,
    height: a.height,
    href: a.imageUrl,
    content: a.content,
    transform: `rotate(${a.rotation})`,
    style: 'white-space: pre'
  });

  let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  g.appendChild(image);

  return g;
}