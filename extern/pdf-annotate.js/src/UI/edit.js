import PDFJSAnnotate from '../PDFJSAnnotate';
import config from '../config';
import {
  findAnnotationAtPoint,
  findSVGAtPoint,
  getMetadata,
  removeFormNode,
  modifyFormNode,
  disableUserSelect,
  enableUserSelect,
  convertToSvgPoint,
  EVENT_DRAW_DOWN,
  EVENT_DRAW_MOVE,
  EVENT_DRAW_UP
} from './utils';
import { fireEvent } from './event';
import { getOverlay, removeOverlay, clearSelection} from './overlay';
import { getSelectNode, setSelectNode } from './selector';
import { replaceChild } from '../render/appendChild';

let _enabled = false;
let isDragging = false;
let dragOffsetX, dragOffsetY, dragStartX, dragStartY;

function isDraggingType(overlay) {
  if (!overlay) {
    return false;
  }

  let targetId = overlay.getAttribute('data-target-id');
  let target = document.querySelector(`[data-pdf-annotate-id="${targetId}"]`);
  let type = target.getAttribute('data-pdf-annotate-type');
  let draggingTypes = ['area', 'circle', 'point', 'drawing', 'line', 'textbox'];
  return draggingTypes.includes(type);
}

function changeCursor(overlay) {
  if (!overlay) {
    return;
  }

  let cursorName = '';
  if (isDraggingType(overlay)) {
    cursorName = 'move';
  }
  overlay.style.cursor = cursorName;
  return cursorName;
}

function handleDocumentClick(e) {
  console.log('call edit::handleDocumentClick(e = ', e, ')');
  // SVG 영역이 아니면 무시한다.
  if (!findSVGAtPoint(e.clientX, e.clientY)) {
    return;
  }

  let target = findAnnotationAtPoint(e.clientX, e.clientY);
  setSelectNode(target);
}

/**
 * Handle document.mousedown event
 *
 * @param {Event} e The DOM event that needs to be handled
 */
function handleDocumentMousedown(e) {

  console.log('call edit::handleDocumentMousedown(e = ', e, ')');

  // SVG 영역이 아니면 무시한다.
  if (!findSVGAtPoint(e.clientX, e.clientY)) {
    return;
  }

  let target = findAnnotationAtPoint(e.clientX, e.clientY);
  if (target != getSelectNode()) {
    setSelectNode(target);
  }

  // 주석 선택 상태가 아니면 셀렉션 상태를 지우고 무빙 액션을 태우지 않는다. 
  if (target == null) {
    return;
  }

  // 스티커노트 팝업이거나 작업창 focus 상태이면 이벤트를 무시한다.
  if ((e.target && e.target.className != null
      && (e.target.className.indexOf('popup') !== -1 
      || e.target.className.indexOf('focus') !== -1))) {
    return;
  }

  const overlay = getOverlay();
  if (changeCursor(overlay) !== 'move') {
    return;
  }

  isDragging = true;

  dragOffsetX = e.clientX;
  dragOffsetY = e.clientY;
  dragStartX = overlay.offsetLeft;
  dragStartY = overlay.offsetTop;

  document.addEventListener(EVENT_DRAW_MOVE, handleDocumentMousemove);
  document.addEventListener(EVENT_DRAW_UP, handleDocumentMouseup);
  disableUserSelect();
}

/**
 * Handle document.mousemove event
 *
 * @param {Event} e The DOM event that needs to be handled
 */
function handleDocumentMousemove(e) {
  
  console.log('call edit::handleDocumentMousemove(e = ', e, ')');

  const overlay = getOverlay();
  if (!overlay) {
    return;
  }

  let parentNode = overlay.parentNode;
  let rect = parentNode.getBoundingClientRect();
  let y = (dragStartY + (e.clientY - dragOffsetY));
  let x = (dragStartX + (e.clientX - dragOffsetX));
  let minY = 0;
  let maxY = rect.height;
  let minX = 0;
  let maxX = rect.width;

  if (y > minY && y + overlay.offsetHeight < maxY) {
    overlay.style.top = `${y}px`;
  }

  if (x > minX && x + overlay.offsetWidth < maxX) {
    overlay.style.left = `${x}px`;
  }
}

/**
 * Handle document.mouseup event
 *
 * @param {Event} e The DOM event that needs to be handled
 */
function handleDocumentMouseup(e) {

  console.log('call edit::handleDocumentMouseup(e = ', e, ')');

  const overlay = getOverlay();
  if (!overlay) {
    return;
  }

  let targetId = overlay.getAttribute('data-target-id');
  let svg = overlay.parentNode.querySelector(config.annotationSvgQuery());
  let { documentId } = getMetadata(svg);

  let modelStart = convertToSvgPoint([dragStartX, dragStartY], svg);
  let modelEnd = convertToSvgPoint([overlay.offsetLeft, overlay.offsetTop], svg);
  let modelDelta = {
    x: modelEnd[0] - modelStart[0],
    y: modelEnd[1] - modelStart[1]
  };
  setTimeout(() => {
    isDragging = false;
  }, 0);
  document.removeEventListener(EVENT_DRAW_MOVE, handleDocumentMousemove);
  document.removeEventListener(EVENT_DRAW_UP, handleDocumentMouseup);
  enableUserSelect();
  if (modelDelta.x === 0 && modelDelta.y === 0) {
    return 0;  
  }

  let storeAdapter = PDFJSAnnotate.getStoreAdapter();
  storeAdapter.getAnnotation(documentId, targetId).then((annotation) => {

    // undo 데이터 저장
    const undoStr = JSON.stringify(annotation);

    switch (annotation.type)
    {
    case 'area':
    case 'point':
      {
        annotation.x += modelDelta.x;
        annotation.y += modelDelta.y;
      }
      break;
    case 'circle':
      {
        annotation.cx += modelDelta.x;
        annotation.cy += modelDelta.y;
      }
      break;
    case 'drawing':
      {
        annotation.paths.forEach((lines) => {
          for (let i = 0; i < lines.length; i++) {
            lines[i][0] = (Number(lines[i][0]) + modelDelta.x).toFixed(2);
            lines[i][1] = (Number(lines[i][1]) + modelDelta.y).toFixed(2);
          }
        });
      }
      break;
    case 'line':
      {
        annotation.lines[0][0] += modelDelta.x;
        annotation.lines[0][1] += modelDelta.y;
        annotation.lines[1][0] += modelDelta.x;
        annotation.lines[1][1] += modelDelta.y;
      }
      break;
    case 'textbox':
      {
        annotation.x += modelDelta.x;
        annotation.y += modelDelta.y;
      }
      break;
    default:
      return;
    }

    // 변경사항 반영
    const target = replaceChild(svg, annotation);
    storeAdapter.editAnnotation(documentId, targetId, annotation);
    
    // redo 데이터 저장
    const redoStr = JSON.stringify(annotation);

    // 변경사항 이벤트 호출
    modifyFormNode(documentId, annotation.page, targetId, {undo : {str : undoStr}, redo : {str : redoStr}});

    setSelectNode(target);
    changeCursor(getOverlay());
  });
}

/**
 * Handle document.selectstart event
 *
 * @param {Event} e The DOM event that needs to be handled
 */
function handleDocumentSelectStart(e) {

  console.log('call edit::handleDocumentSelectStart(e = ', e, ')');

  // 선택된 개체가 있을경우
  // preventDefault()는 현재 이벤트(selectstart)의 기본 동작을 중단한다.
  if (getSelectNode()) {
    e.preventDefault();
  }
}

/**
 * Delete currently selected annotation
 */

function _findSVGElement(annoID) {
  const svgs = document.querySelectorAll(".annotationLayer");
  let foundSVG = null;
  svgs.forEach(function(svg) {
    let target = svg.querySelector(`[data-pdf-annotate-id="${annoID}"]`);
    if (target) {
      foundSVG = svg;
      return;
    }
  });

  return foundSVG;
}

export function deleteAnnotation(annoID) {
  
  let svg = null;
  if (annoID == undefined) {
    const overlay = getOverlay();
    if (!overlay) {
      return;
    }

    annoID = overlay.getAttribute('data-target-id');
    svg = overlay.parentNode.querySelector(config.annotationSvgQuery());
  } else {
    svg = _findSVGElement(annoID);
  }
  if (!svg) {
    return;
  }
  
  const annotationId = annoID;
  const documentId = svg.getAttribute('data-pdf-annotate-document');
  let targetID = document.querySelector(`[data-pdf-annotate-id="${annotationId}"]`);
  if(targetID) {
    let type = targetID.getAttribute('data-pdf-annotate-type');
    if (type === 'point') {
      removeOverlay();
    }
  }
  // 오버레이 선택 삭제
  setSelectNode(null);

  // 주석 개체 삭제
  let storeAdapter = PDFJSAnnotate.getStoreAdapter();
  storeAdapter.getAnnotation(documentId, annotationId).then((annotation) => {

    let insertIndex = ((annotationId) => {
      let annotations = JSON.parse(localStorage.getItem(`${documentId}/annotations`)) || [];
      for (let i = 0, l = annotations.length; i < l; i++) {
        if (annotations[i].uuid === annotationId) {
          return i;
        }
      }
      return undefined;
    })(annotationId);

    storeAdapter.deleteAnnotation(documentId, annotationId).then(() => {
      let target = svg.querySelector(`[data-pdf-annotate-id="${annotationId}"]`);
      
      const targetId = annotation.uuid;
      let undoStr = JSON.stringify(annotation);
      let nextId = target.nextSibling ? target.nextSibling.getAttribute('data-pdf-annotate-id') : null;
      let redoStr = null;
      target.parentNode.removeChild(target);

      removeFormNode(documentId, annotation.page, targetId, {
        undo : {str : undoStr, nextId}, 
        redo : {str : redoStr}
      });
    });
  });

  fireEvent('annotation:setAnnotationSidebarEnable', false);
  fireEvent('annotation:setStyleBarDisableState', true);
}

/**
 * Enable edit mode behavior.
 */
export function enableEdit() {
  if (_enabled) {
    return;
  }

  _enabled = true;
  
  // document.addEventListener('click', handleDocumentClick);
  document.addEventListener(EVENT_DRAW_DOWN, handleDocumentMousedown);
  document.addEventListener('selectstart', handleDocumentSelectStart);

  changeCursor(getOverlay());
};

/**
 * Disable edit mode behavior.
 */
export function disableEdit() {
  if (!_enabled) {
    return;
  }

  _enabled = false;

  // document.removeEventListener('click', handleDocumentClick);
  document.removeEventListener(EVENT_DRAW_DOWN, handleDocumentMousedown);
  document.removeEventListener('selectstart', handleDocumentSelectStart);
  setSelectNode(null);

  changeCursor(getOverlay());
};
