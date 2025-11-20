import setAttributes from '../utils/setAttributes';
import { calcMemoViewScale } from '../UI/utils';

const SIZE = 23;
const d = 'M17,0.5 C17.6903559,0.5 18.3153559,0.779822031 18.767767,1.23223305 C19.220178,1.68464406 19.5,2.30964406 19.5,3 L19.5,3 L19.5,13.1428571 C19.5,13.8332131 19.220178,14.4582131 18.767767,14.9106241 C18.3153559,15.3630351 17.6903559,15.6428571 17,15.6428571 L17,15.6428571 L9.81936327,15.6428571 L5.85848236,18.9343848 L5.85848236,15.6428571 L3,15.6428571 C2.30964406,15.6428571 1.68464406,15.3630351 1.23223305,14.9106241 C0.779822031,14.4582131 0.5,13.8332131 0.5,13.1428571 L0.5,13.1428571 L0.5,3 C0.5,2.30964406 0.779822031,1.68464406 1.23223305,1.23223305 C1.68464406,0.779822031 2.30964406,0.5 3,0.5 L3,0.5 Z';
/**
 * Create SVGElement from an annotation definition.
 * This is used for anntations of type `comment`.
 *
 * @param {Object} a The annotation definition
 * @return {SVGElement} A svg to be rendered
 */
export default function renderPoint(a) {
  let outerSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  let innerSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  let linePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  let line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  let lineCopy = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  let lineCopy2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  let icon_sticker = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  let group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  let _SIZE = SIZE * calcMemoViewScale();

  setAttributes(outerSVG, {
    width: _SIZE,
    height: _SIZE,
    x: a.x,
    y: a.y
  });

  setAttributes(innerSVG, {
    width: _SIZE,
    height: _SIZE,
    viewBox: '0 0 20 20'
  });

  setAttributes(icon_sticker, {
    id: 'icon_sticker_0615',
    width: _SIZE,
    height: _SIZE,
    stroke: 'none',
    strokeWidth: 0.7,
    fill: 'none',
    fillRule: 'evenodd'
  });

  setAttributes(group, {
    id: 'Group',
    stroke: '#000000',
  });

  setAttributes(linePath, {
    id: 'Combined-Shape',
    d: d,
    fill: a.fillColor
  });

  setAttributes(line, {
    id: 'Line',
    x1: 4,
    y1: 4.5,
    x2: 16,
    y2: 4.5,
    strokeLinecap: 'square'
  });

  setAttributes(lineCopy, {
    id: 'Line-Copy',
    x1: 4,
    y1: 8,
    x2: 16,
    y2: 8,
    strokeLinecap: 'square'
  });

  setAttributes(lineCopy2, {
    id: 'Line-Copy-2',
    x1: 4,
    y1: 11.5,
    x2: 11,
    y2: 11.5,
    strokeLinecap: 'square'
  });

  group.appendChild(linePath);
  group.appendChild(line);
  group.appendChild(lineCopy);
  group.appendChild(lineCopy2);
  icon_sticker.appendChild(group);
  innerSVG.appendChild(icon_sticker);
  outerSVG.appendChild(rect);
  outerSVG.appendChild(innerSVG);

  return outerSVG;
}
