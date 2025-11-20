import PDFJSAnnotate from '../PDFJSAnnotate';
import config from '../config';
import { appendChild } from '../render/appendChild';
import {
  disableUserSelect,
  enableUserSelect,
  findSVGAtPoint,
  convertToSvgPoint,
  getMetadata,
  addFormNode,
  EVENT_DRAW_DOWN,
  EVENT_DRAW_MOVE,
  EVENT_DRAW_UP,
  addTouchActionNone,
  removeTouchActionNone
} from './utils';
import { setSelectNode } from "./selector";

let _enabled = false;
let _lineWidth;
let _lineColor;
let path;
let lines;

/**
 * Handle document.mousedown event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMousedown(e) {
  let svg = findSVGAtPoint(e.clientX, e.clientY);
  if (!svg) {
    return;
  }

  path = null;
  lines = [];
  lines.push(_ToSvgPoint(svg, e.clientX, e.clientY));

  document.addEventListener(EVENT_DRAW_MOVE, handleDocumentMousemove);
  disableUserSelect();
}

/**
 * Handle document.mousemove event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMousemove(e) {
  let svg = findSVGAtPoint(e.clientX, e.clientY);
  if (!svg || !lines || !lines.length) {
    return;
  }

  lines[1] = _ToSvgPoint(svg, e.clientX, e.clientY); // update end point

  if (path) {
    svg.removeChild(path);
  }
  let annotation = {
    type: 'line',
    strokeColor: _lineColor,
    opacity: 1,
    strokeWidth: _lineWidth,
    strokeDasharray: 'none',
    lines
  };
  path = appendChild(svg, annotation);
}

/**
 * Handle document.mouseup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMouseup(e) {
  let svg = findSVGAtPoint(e.clientX, e.clientY);
  if (!svg || !lines || !lines.length) {
    return;
  }

  lines[1] = _ToSvgPoint(svg, e.clientX, e.clientY); // update end point
  let annotation = {
    type: 'line',
    strokeColor: _lineColor,
    opacity: 1,
    strokeWidth: _lineWidth,
    strokeDasharray: 'none',
    lines
  };
  let { documentId, pageNumber } = getMetadata(svg);
  PDFJSAnnotate.getStoreAdapter().addAnnotation(documentId, pageNumber, annotation)
  .then((annotation) => {
    if (path) {
      svg.removeChild(path);
    }
    
    setSelectNode(addFormNode(documentId, pageNumber, annotation, svg));
  });

  document.removeEventListener(EVENT_DRAW_MOVE, handleDocumentMousemove);
  enableUserSelect();
}

/**
 * Handle document.keyup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentKeyup(e) {
  // Cancel rect if Esc is pressed
  if (e.keyCode === 27) {
    lines = null;
    path.parentNode.removeChild(path);

    document.removeEventListener(EVENT_DRAW_MOVE, handleDocumentMousemove);
  }
}

function _ToSvgPoint(svg, clientX, clientY) {
  if (!svg) {
    return null;
  }

  let rect = svg.getBoundingClientRect();
  let point = convertToSvgPoint([
    clientX - rect.left,
    clientY - rect.top
  ], svg);

  return point;
}

/**
 * Set the attributes of the pen.
 *
 * @param {Number} penSize The size of the lines drawn by the pen, rounded to 2 decimal places
 * @param {String} penColor The color of the lines drawn by the pen
 */
export function setLine(lineWidth = 1, lineColor = '#FF0000') {
  _lineWidth = Math.round(parseFloat(lineWidth) * 1e2) / 1e2;
  _lineColor = lineColor;
}

/**
 * Enable line behavior
 */
export function enableLine() {
  if (_enabled) { return; }

  _enabled = true;
  document.addEventListener(EVENT_DRAW_UP, handleDocumentMouseup);
  document.addEventListener(EVENT_DRAW_DOWN, handleDocumentMousedown);
  document.addEventListener('keyup', handleDocumentKeyup);
  addTouchActionNone();
}

/**
 * Disable line behavior
 */
export function disableLine() {
  if (!_enabled) { return; }

  _enabled = false;
  document.removeEventListener(EVENT_DRAW_UP, handleDocumentMouseup);
  document.removeEventListener(EVENT_DRAW_DOWN, handleDocumentMousedown);
  document.removeEventListener('keyup', handleDocumentKeyup);
  removeTouchActionNone();
}

