import PDFJSAnnotate from '../PDFJSAnnotate';
import config from '../config';
import { appendChild } from '../render/appendChild';
import {
  BORDER_COLOR,
  disableUserSelect,
  enableUserSelect,
  findSVGAtPoint,
  getMetadata,
  convertToSvgRect,
  addFormNode,
  EVENT_DRAW_DOWN,
  EVENT_DRAW_MOVE,
  EVENT_DRAW_UP,
  addTouchActionNone,
  removeTouchActionNone
} from './utils';
import { setSelectNode } from "./selector";

let _enabled = false;
let _type;
let overlay;
let originY;
let originX;
let fillColor, strokeColor, opacity, strokeWidth, strokeDasharray;
/**
 * Get the current window selection as rects
 *
 * @return {Array} An Array of rects
 */
function getSelectionRects() {
  try {
    let selection = window.getSelection();
    let range = selection.getRangeAt(0);
    let rects = range.getClientRects();

    if (rects.length > 0 &&
        rects[0].width > 0 &&
        rects[0].height > 0) {
      return rects;
    }
  }
  catch (e) {}

  return null;
}

/**
 * Handle document.mousedown event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMousedown(e) {

  console.log('call rect::handleDocumentMousedown(e = ', e, ')');

  let svg;
  if (_type !== 'area' || !(svg = findSVGAtPoint(e.clientX, e.clientY))) {
    return;
  }

  let rect = svg.getBoundingClientRect();
  originY = e.clientY;
  originX = e.clientX;

  overlay = document.createElement('div');
  overlay.style.position = 'absolute';
  overlay.style.top = `${originY - rect.top}px`;
  overlay.style.left = `${originX - rect.left}px`;
  overlay.style.border = `3px solid ${BORDER_COLOR}`;
  overlay.style.borderRadius = '3px';
  svg.parentNode.appendChild(overlay);

  document.addEventListener(EVENT_DRAW_MOVE, handleDocumentMousemove);
  disableUserSelect();
}

/**
 * Handle document.mousemove event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMousemove(e) {

  console.log('call rect::handleDocumentMousemove(e = ', e, ')');

  const svg = overlay.parentNode.querySelector(config.annotationSvgQuery());
  const rect = svg.getBoundingClientRect();
  
  const left = Math.max(Math.min(originX, e.clientX), rect.left);
  const top = Math.max(Math.min(originY, e.clientY), rect.top);
  const right = Math.min(Math.max(originX, e.clientX), rect.right);
  const bottom = Math.min(Math.max(originY, e.clientY), rect.bottom);

  overlay.style.left = `${left - rect.left}px`;
  overlay.style.width = `${right - left}px`;
  overlay.style.top = `${top - rect.top}px`;
  overlay.style.height = `${bottom - top}px`;
}

/**
 * Handle document.mouseup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMouseup(e) {

  console.log('call rect::handleDocumentMouseup(e = ', e, ')');

  let rects;
  if (_type !== 'area' && (rects = getSelectionRects())) {
    saveRect(_type, [...rects].map((r) => {
      return {
        top: r.top,
        left: r.left,
        width: r.width,
        height: r.height
      };
    }));
  }
  else if (_type === 'area' && overlay) {
    let svg = overlay.parentNode.querySelector(config.annotationSvgQuery());
    let rect = svg.getBoundingClientRect();
    saveRect(_type, [{
      top: parseInt(overlay.style.top, 10) + rect.top,
      left: parseInt(overlay.style.left, 10) + rect.left,
      width: parseInt(overlay.style.width, 10),
      height: parseInt(overlay.style.height, 10)
    }]);

    svg.parentNode.removeChild(overlay);
    overlay = null;

    document.removeEventListener(EVENT_DRAW_MOVE, handleDocumentMousemove);
    enableUserSelect();
  }
}

/**
 * Handle document.keyup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentKeyup(e) {
  // Cancel rect if Esc is pressed
  if (e.keyCode === 27) {
    let selection = window.getSelection();
    selection.removeAllRanges();
    if (overlay && overlay.parentNode) {
			svg.parentNode.removeChild(overlay);
      overlay = null;
      document.removeEventListener(EVENT_DRAW_MOVE, handleDocumentMousemove);
    }
  }
}

/**
 * Save a rect annotation
 *
 * @param {String} type The type of rect (area, highlight, strikeout)
 * @param {Array} rects The rects to use for annotation
 * @param {String} fillColor The fill color of the rects
 * @param {String} strokeColor The strok color of the rects
 */
export function saveRect(type, rects, fillColor, strokeColor) {
  let svg = findSVGAtPoint(rects[0].left, rects[0].top);
  let annotation;

  if (!svg) {
    return;
  }

  let boundingRect = svg.getBoundingClientRect();

  if (!fillColor || !strokeColor) {
    if (type === 'highlight') {
      fillColor = '#FFFF00';
      opacity = 0.2;
    }
    else if (type === 'strikeout') {
      fillColor = 'none';
      strokeColor = '#FF0000';
      opacity = 1;
      strokeWidth = 1;
    }
    else if (type === 'underline') {
      fillColor = 'none';
      strokeColor = '#6AD926';
      opacity = 1;
      strokeWidth = 1;
    }
  }

  // Initialize the annotation
  annotation = {
    type,
    fillColor,
    strokeColor,
    opacity,
    strokeWidth,
    rectangles: [...rects].map((r) => {
      let offset = 0;

      return convertToSvgRect({
        y: (r.top + offset) - boundingRect.top,
        x: r.left - boundingRect.left,
        width: r.width,
        height: r.height
      }, svg);
    }).filter((r) => r.width > 0 && r.height > 0 && r.x > -1 && r.y > -1)
  };

  // Short circuit if no rectangles exist
  if (annotation.rectangles.length === 0) {
    return;
  }
	
  // Special treatment for area as it only supports a single rect
  if (type === 'area') {
    let rect = annotation.rectangles[0];
    delete annotation.rectangles;
    annotation.x = rect.x;
    annotation.y = rect.y;
    annotation.width = rect.width;
    annotation.height = rect.height;
    annotation.fillColor = 'none';
    annotation.opacity = 1;
    annotation.strokeColor = '#FF0000';
    annotation.strokeWidth = 1;
    annotation.strokeDasharray = 'none';
  } else {
    let convertRect = convertToSvgRect(boundingRect, svg);
    annotation.rectangles = calcAnnotationRects(annotation.rectangles, convertRect);
  }

  let { documentId, pageNumber } = getMetadata(svg);

  // Add the annotation
  PDFJSAnnotate.getStoreAdapter().addAnnotation(documentId, pageNumber, annotation)
    .then((annotation) => {
      setSelectNode(addFormNode(documentId, pageNumber, annotation, svg));
    });
}

export function calcAnnotationRects(rects, svgRect) {
  var calcRect = [];
  var contains = [];
  for (let i = 0; i < rects.length; i++) {
    if(i + 1 == rects.length) {
      break;
    }

    // rect[i + 1]에 rect[i]가 포함되어 있다면
    // rect[i]를 버린다.
    if(inside(rects[i + 1], rects[i])){
      if(i != 0)
         contains.push(i);
    }
  }

  for (let i = 0; i < rects.length; i++) {
    if(!contains.includes(i)) {
      if (rects[i].x <= svgRect.width && rects[i].y <= svgRect.height){
        calcRect.push(rects[i]);
      }
    }
  }

  return calcRect;
}

// rect1에 rect2가 포함됨
export function inside(rect1, rect2) {
  return rect1.x <= rect2.x && rect2.x <= rect1.x + rect1.width &&
  rect1.y <= rect2.y && rect2.y <= rect1.y + rect1.height;
}

/**
 * Enable rect behavior
 */
export function enableRect(type) {
  _type = type;

  if (_enabled) { return; }

  _enabled = true;
  document.addEventListener(EVENT_DRAW_UP, handleDocumentMouseup);
  document.addEventListener(EVENT_DRAW_DOWN, handleDocumentMousedown);
  document.addEventListener('keyup', handleDocumentKeyup);
  addTouchActionNone();
}

/**
 * Disable rect behavior
 */
export function disableRect() {
  if (!_enabled) { return; }

  _enabled = false;
  document.removeEventListener(EVENT_DRAW_UP, handleDocumentMouseup);
  document.removeEventListener(EVENT_DRAW_DOWN, handleDocumentMousedown);
  document.removeEventListener('keyup', handleDocumentKeyup);
  removeTouchActionNone();
}

