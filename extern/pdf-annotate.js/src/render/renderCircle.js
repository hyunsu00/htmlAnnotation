import setAttributes from '../utils/setAttributes';
import normalizeColor from '../utils/normalizeColor';

/**
 * Create an SVGCircleElement from an annotation definition.
 * This is used for annotations of type `circle`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGGElement|SVGCircleElement} A circle to be rendered
 */
export default function renderCircle(a) {
  let circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  setAttributes(circle, {
    cx: a.cx,
    cy: a.cy,
    r: a.r
  });

  setAttributes(circle, {
    fill: normalizeColor(a.fillColor),
    opacity: a.opacity,
    stroke: normalizeColor(a.strokeColor),
    strokeWidth: a.strokeWidth,
    strokeDasharray: a.strokeDasharray
  });

  return circle;
}
