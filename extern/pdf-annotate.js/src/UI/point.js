import PDFJSAnnotate from '../PDFJSAnnotate';
import { LangDefine } from '../locales/resouce';

import {
  BORDER_COLOR,
  findSVGAtPoint,
  getMetadata,
  scaleDown,
  addFormNode,
  addComment,
  EVENT_DRAW_DOWN,
  EVENT_DRAW_MOVE,
  EVENT_DRAW_UP,
  addTouchActionNone,
  removeTouchActionNone,
  calcDefaultFontSize,
  getAuthorName
} from './utils';
import { setSelectNode } from "./selector";

let _enabled = false;
let input;

/**
 * Handle document.mouseup event
 *
 * @param {Event} The DOM event to be handled
 */
function handleDocumentClick(e) {
  // 리사이징 중에는 클릭 이벤트 무시
  if (_isResizing) return;
  
  let svg = findSVGAtPoint(e.clientX, e.clientY);
 
  if (input || !svg) {
    return;
  }
   
  // Viewport 에 맞는 에디터 생성
  let docScale = 1.0;
   
  if (svg) {
    let { viewport } = getMetadata(svg);
    docScale = viewport.scale;
  }
 
  input = document.createElement('textarea');
  input.setAttribute('id', 'pdf-annotate-point-input');
  input.setAttribute('placeholder', LangDefine.ClickToAddText);
  input.style.border = `3px solid ${BORDER_COLOR}`;
  input.style.borderRadius = '3px';
  input.style.position = 'absolute';
  input.style.top = `${e.clientY}px`;
  input.style.left = `${e.clientX}px`;
  input.style.fontSize = `${Math.floor(calcDefaultFontSize() * docScale)}px`;
  // 초기 크기 설정
  input.style.width = '150px';
  input.style.height = '30px';
  input.style.boxSizing = 'border-box'; // 테두리를 포함한 크기 계산

  // 텍스트 상단 정렬을 위한 스타일 추가
  input.style.padding = '5px'; // 모든 내부 여백 제거
  input.style.resize = 'none'; // 사용자가 크기 조절하지 못하도록 설정
  input.style.overflow = 'hidden'; // 스크롤 숨기기

  input.addEventListener('blur', handleInputBlur);
  input.addEventListener('keyup', handleInputKeyup);
 
  document.body.appendChild(input);
  
  // Store initial dimensions
  _initialWidth = input.offsetWidth;
  _initialHeight = input.offsetHeight;
  
  // Create and add resize handle
  createResizeHandle();

  input.focus();
}

/**
 * Handle input.blur event
 */
function handleInputBlur() {
  // 리사이징 중에는 blur 이벤트 처리하지 않음
  if (!_isResizing) {
    savePoint();
  }
}

/**
 * Handle input.keyup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleInputKeyup(e) {
  if (e.keyCode === 27) { // ESC 키
    closeInput();
  } else if (e.keyCode === 13) { // 엔터 키
    e.preventDefault(); // 기본 엔터 동작(줄바꿈) 방지
    savePoint();
  }
}

/**
 * Save a new point annotation from input
 */
function savePoint() {
  if (input && input.value.trim().length > 0) {
    let clientX = parseInt(input.style.left, 10);
    let clientY = parseInt(input.style.top, 10);
    let content = input.value.trim();
    let svg = findSVGAtPoint(clientX, clientY);
    if (!svg) {
      return;
    }
   
    let dataString = new Date();
    let rect = svg.getBoundingClientRect();
    let { documentId, pageNumber } = getMetadata(svg);
    let annotation = Object.assign({
      type: 'point',
      fillColor: '#FFFF00',
      opacity: 1,
      strokeColor: '#000000',
      strokeWidth: 1,
      strokeDasharray: 'none'
    }, scaleDown(svg, {
      x: clientX - rect.left,
      y: clientY - rect.top
    }));
   
    PDFJSAnnotate.getStoreAdapter().addAnnotation(documentId, pageNumber, annotation)
      .then((annotation) => {
        addComment(documentId, pageNumber, annotation.uuid, content, dataString, getAuthorName());
        
        setSelectNode(addFormNode(documentId, pageNumber, annotation, svg));
      });
  }
 
  closeInput();
}

/**
 * Close the input element
 */
function closeInput() {
  if (input) {
    input.removeEventListener('blur', handleInputBlur);
    input.removeEventListener('keyup', handleInputKeyup);
    document.body.removeChild(input);
    input = null;
  }
  
  if (_resizeHandle) {
    _resizeHandle.removeEventListener(EVENT_DRAW_DOWN, handleResizeStart);
    document.body.removeChild(_resizeHandle);
    _resizeHandle = null;
  }
  
  _isResizing = false;
}

/**
 * Enable point annotation behavior
 */
export function enablePoint() {
  if (_enabled) { return; }
 
  _enabled = true;
  document.addEventListener('click', handleDocumentClick);
  addTouchActionNone();
}

/**
 * Disable point annotation behavior
 */
export function disablePoint() {
  if (!_enabled) { return; }
 
  _enabled = false;
  document.removeEventListener('click', handleDocumentClick);
  removeTouchActionNone();
  
  // Make sure to clean up if disabled while input is open
  if (input) {
    closeInput();
  }
}

let _resizeHandle = null;
let _initialWidth = 0;
let _initialHeight = 0;
let _isResizing = false;

/**
 * Create a resize handle element at the bottom right of the input
 */
function createResizeHandle() {
  _resizeHandle = document.createElement('div');
  _resizeHandle.setAttribute('id', 'pdf-annotate-resize-handle');
  _resizeHandle.style.position = 'absolute';
  _resizeHandle.style.width = '10px';
  _resizeHandle.style.height = '10px';
  _resizeHandle.style.cursor = 'nwse-resize';
  _resizeHandle.style.background = BORDER_COLOR;
  _resizeHandle.style.borderRadius = '0 0 5px 0';
  _resizeHandle.style.touchAction = 'none'; // 터치 이벤트 처리를 위해 필요
  _resizeHandle.style.zIndex = '1000'; // 입력창보다 위에 표시
  
  // 위치 업데이트
  updateResizeHandlePosition();
  
  // 이벤트 리스너 추가
  _resizeHandle.addEventListener(EVENT_DRAW_DOWN, handleResizeStart, { passive: false });
  
  document.body.appendChild(_resizeHandle);
}

/**
 * Update the position of the resize handle relative to the input
 */
function updateResizeHandlePosition() {
  if (!input || !_resizeHandle) return;
  
  const inputRect = input.getBoundingClientRect();
  
  _resizeHandle.style.top = `${inputRect.top + inputRect.height - 0}px`;
  _resizeHandle.style.left = `${inputRect.left + inputRect.width - 0}px`;
}

/**
 * Handle the start of a resize operation
 * 
 * @param {PointerEvent} e - The pointer event
 */
function handleResizeStart(e) {
  e.preventDefault();
  e.stopPropagation();
  
  _isResizing = true; // 리사이징 상태 설정
  
  const startX = e.clientX;
  const startY = e.clientY;
  const startWidth = input.offsetWidth;
  const startHeight = input.offsetHeight;
  
  function handleResizeMove(moveEvent) {
    moveEvent.preventDefault();
    moveEvent.stopPropagation();
    
    // 계산된 새 크기
    const newWidth = Math.max(50, startWidth + (moveEvent.clientX - startX));
    const newHeight = Math.max(30, startHeight + (moveEvent.clientY - startY));
    
    // 새 크기 적용
    input.style.width = `${newWidth}px`;
    input.style.height = `${newHeight}px`;

    // 리사이즈 핸들 위치 업데이트
    updateResizeHandlePosition();
  }
  
  function handleResizeEnd(endEvent) {
    endEvent.preventDefault();
    
    document.removeEventListener(EVENT_DRAW_MOVE, handleResizeMove);
    document.removeEventListener(EVENT_DRAW_UP, handleResizeEnd);
    
    // 리사이징 완료 후 약간의 지연을 두고 상태 초기화
    setTimeout(() => {
      _isResizing = false;
    }, 100);
  }
  
  document.addEventListener(EVENT_DRAW_MOVE, handleResizeMove, { passive: false });
  document.addEventListener(EVENT_DRAW_UP, handleResizeEnd, { passive: false });
}