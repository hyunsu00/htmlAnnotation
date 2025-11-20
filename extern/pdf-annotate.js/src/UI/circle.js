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

class Point {
  constructor(x, y) {
    if (Array.isArray(x)) {
      // 배열로 전달된 경우
      [this.x, this.y] = x;
    } else {
      // 개별 값으로 전달된 경우
      this.x = x;
      this.y = y;
    }
  }

  // 두 점 사이의 거리 계산 메서드
  distanceTo(otherPoint) {
    const dx = this.x - otherPoint.x;
    const dy = this.y - otherPoint.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  // 점의 좌표를 문자열로 반환하는 메서드
  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

let _enabled = false;
let _svg = null;
let _circle = null;
let _originX = null;
let _originY = null;

/**
 * Handle document.mousedown event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMousedown(e) {
  _svg = findSVGAtPoint(e.clientX, e.clientY);
  if (!_svg) {
    return;
  }
  
  _circle = null;
  _originY = e.clientY;
  _originX = e.clientX;
  document.addEventListener(EVENT_DRAW_MOVE, handleDocumentMousemove);
  disableUserSelect();
}

/**
 * Handle document.mousemove event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMousemove(e) {
  if (!_svg) {
    return;
  }

  const rect = _svg.getBoundingClientRect();
  const left = Math.max(Math.min(_originX, e.clientX), rect.left);
  const top = Math.max(Math.min(_originY, e.clientY), rect.top);
  const right = Math.min(Math.max(_originX, e.clientX), rect.right);
  const bottom = Math.min(Math.max(_originY, e.clientY), rect.bottom);

  const _beginPoint = new Point(_ToSvgPoint(_svg, left, top));
  const _endPoint = new Point(_ToSvgPoint(_svg, right, bottom));

  if (_circle) {
    _svg.removeChild(_circle);
  }
  let cx = (_beginPoint.x + _endPoint.x) / 2;
  let cy = (_beginPoint.y + _endPoint.y) / 2;
  let radius = Math.sqrt(Math.pow(_endPoint.x - _beginPoint.x, 2) + Math.pow(_endPoint.y - _beginPoint.y, 2)) / 2;
  let annotation = {
    type: 'circle',
    cx: cx,
    cy: cy,
    r: radius,
    fillColor : 'none',
    opacity: 1,
    strokeColor: '#FF0000',
    strokeWidth: 1,
    strokeDasharray: 'none'
  };
  _circle = appendChild(_svg, annotation);
}

/**
 * Handle document.mouseup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentMouseup(e) {
  if (!_svg) {
    document.removeEventListener(EVENT_DRAW_MOVE, handleDocumentMousemove);
    enableUserSelect();
    return;
  }

  const rect = _svg.getBoundingClientRect();
  const left = Math.max(Math.min(_originX, e.clientX), rect.left);
  const top = Math.max(Math.min(_originY, e.clientY), rect.top);
  const right = Math.min(Math.max(_originX, e.clientX), rect.right);
  const bottom = Math.min(Math.max(_originY, e.clientY), rect.bottom);

  const _beginPoint = new Point(_ToSvgPoint(_svg, left, top));
  const _endPoint = new Point(_ToSvgPoint(_svg, right, bottom));

  let cx = (_beginPoint.x + _endPoint.x) / 2;
  let cy = (_beginPoint.y + _endPoint.y) / 2;
  let radius = Math.sqrt(Math.pow(_endPoint.x - _beginPoint.x, 2) + Math.pow(_endPoint.y - _beginPoint.y, 2)) / 2;
  let annotation = {
    type: 'circle',
    cx: cx,
    cy: cy,
    r: radius,
    fillColor : 'none',
    opacity: 1,
    strokeColor: '#FF0000',
    strokeWidth: 1,
    strokeDasharray: 'none'
  };
  let { documentId, pageNumber } = getMetadata(_svg);
  PDFJSAnnotate.getStoreAdapter().addAnnotation(documentId, pageNumber, annotation)
  .then((annotation) => {
    if (_circle) {
      _svg.removeChild(_circle);
    }
    
    setSelectNode(addFormNode(documentId, pageNumber, annotation, _svg));
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
    _circle.parentNode.removeChild(_circle);

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
 * Enable circle behavior
 */
export function enableCircle() {
  if (_enabled) { return; }

  _enabled = true;
  document.addEventListener(EVENT_DRAW_UP, handleDocumentMouseup);
  document.addEventListener(EVENT_DRAW_DOWN, handleDocumentMousedown);
  document.addEventListener('keyup', handleDocumentKeyup);
  addTouchActionNone();
}

/**
 * Disable circle behavior
 */
export function disableCircle() {
  if (!_enabled) { return; }

  _enabled = false;
  document.removeEventListener(EVENT_DRAW_UP, handleDocumentMouseup);
  document.removeEventListener(EVENT_DRAW_DOWN, handleDocumentMousedown);
  document.removeEventListener('keyup', handleDocumentKeyup);
  removeTouchActionNone();
}

