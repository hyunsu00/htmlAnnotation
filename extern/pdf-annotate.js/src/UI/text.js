import PDFJSAnnotate from '../PDFJSAnnotate';
import { createDivContentImage } from '../render/renderUtils';
import {
  BORDER_COLOR,
  BORDER_SIZE,
  findSVGAtPoint,
  getMetadata,
  convertToSvgRect,
  addFormNode,
  EVENT_DRAW_UP,
  addTouchActionNone,
  removeTouchActionNone
} from './utils';
import { fireEvent } from './event';
import { setSelectNode } from "./selector";
import { LangDefine } from '../locales/resouce';

let _enabled = false;
let editorDiv = null;
let _textSize;
let _textColor;
let _textBold;
let _textItalic;
let _textUnderline;
let _textStrikethrough;
/**
 * Handle document.mouseup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleDocumentClick(e) {
  let svg = findSVGAtPoint(e.clientX, e.clientY)

  if (editorDiv || !svg) {
    return;
  }

  const { viewport, pageNumber } = getMetadata(svg);
  const docScale = viewport.scale;
  const VIEWPORT_SCALE_FACTOR = 96.0 / 72.0;
  const parentEl = document.querySelector(`div.page[data-page-number="${pageNumber}"]`);
  if (!parentEl) {
    return;
  }

  // stylebar disable
  fireEvent('annotation:setStyleBarDisableState', true);

  editorDiv = document.createElement('div');
  editorDiv.setAttribute('id', 'pdf-annotate-text-input');
  editorDiv.setAttribute('default-content', LangDefine.ClickToAddText);

  {
    editorDiv.style.border = `${BORDER_SIZE}px solid ${BORDER_COLOR}`;
    editorDiv.style.borderRadius = '3px';
  }
  editorDiv.contentEditable = 'true';
  {
    editorDiv.style.color = _textColor;
    editorDiv.style.fontSize = `${Math.floor(Math.floor(_textSize * VIEWPORT_SCALE_FACTOR) * docScale)}px`;
    editorDiv.style.fontFamily = `Helvetica`;
    editorDiv.style.fontStyle = _textItalic;
    editorDiv.style.fontWeight = _textBold;
    if (_textUnderline && _textStrikethrough) {
      editorDiv.style.textDecoration = 'underline line-through'
    } else if (_textUnderline) {
      editorDiv.style.textDecoration = 'underline';
    } else if (_textStrikethrough) {
      editorDiv.style.textDecoration = 'line-through';
    } else {
      editorDiv.style.textDecoration = 'none';
    }
  }
  {
    const cs = getComputedStyle(parentEl);
    const paddingCX = parseFloat(cs.paddingLeft);
    const paddingCY = parseFloat(cs.paddingTop);
    const borderCX = parseFloat(cs.borderLeftWidth);
    const borderCY = parseFloat(cs.borderTopWidth);
    const rect = parentEl.getBoundingClientRect();
    const xPos =  e.clientX - rect.left - paddingCX - borderCX;
    const yPos =  e.clientY - rect.top -  paddingCY - borderCY;
    editorDiv.style.position = 'absolute';
    editorDiv.style.padding = '0';
    editorDiv.style.margin = '0';
    editorDiv.style.left = `${xPos}px`;
    editorDiv.style.top = `${yPos}px`;
  }
  {
    editorDiv.style.overflow = 'visible';
    editorDiv.style.whiteSpace = 'nowrap';
  }
  editorDiv.style.zIndex = '41';
  
  editorDiv.addEventListener('blur', handleInputBlur);
  editorDiv.addEventListener('keyup', handleInputKeyup);

  parentEl.appendChild(editorDiv);
  editorDiv.focus();
}

/**
 * Handle editorDiv.blur event
 */
function handleInputBlur() {
  if (isEmptyInput()) {
    closeInput();
  } else {
    saveText();
  }
}

/**
 * Handle editorDiv.keyup event
 *
 * @param {Event} e The DOM event to handle
 */
function handleInputKeyup(e) {
  if (e.keyCode === 27) { // ESC
    if (isEmptyInput()) {
      closeInput();
    } else {
      saveText();
    }
  }
}

/**
 * Save a text annotation from editorDiv
 */
function saveText() {
  const editorClientRect = editorDiv.getBoundingClientRect();
  let svg = findSVGAtPoint(editorClientRect.x, editorClientRect.y);
  if (!svg) {
    return;
  }
  const svgClientRect = svg.getBoundingClientRect();
  const { documentId, pageNumber, viewport } = getMetadata(svg);
  const renderFontSize = parseInt(editorDiv.style.fontSize);

  const divs = editorDiv.getElementsByTagName("div");
  let content;
  if (divs.length === 0) {
    content = editorDiv.innerText;
  } else {
    const first = editorDiv.firstChild;
    if (first?.nodeName === "#text") {
      content = first.data;
    }

    for (let i = 0; i < divs.length; i++) {
      const div = divs[i];
      const first = div.firstChild;
      if (first?.nodeName === "#text") {
        content += '\n' + first.data;
      }
    }
  }

  let bbox = JSON.parse(JSON.stringify(editorClientRect)); // 깊은복제
  bbox.x = editorClientRect.left - svgClientRect.left + BORDER_SIZE;
  bbox.y = editorClientRect.top - svgClientRect.top + BORDER_SIZE;
  bbox.width -= (BORDER_SIZE * 2);
  bbox.height -= (BORDER_SIZE * 2);
  bbox = convertToSvgRect(bbox, svg, viewport);
  const divContentImage = createDivContentImage(content, _textColor, 'Helvetica', renderFontSize, (_textBold === 'bold'), (_textItalic === 'italic'), _textUnderline, _textStrikethrough);
  
  {
    let scale = 1 / viewport.scale;
    let annotation = {
      type: 'textbox',
      x: bbox.x,
      y: bbox.y,
      width: bbox.width,
      height: bbox.height,
      imageUrl: divContentImage.imageUrl,
      fontFamily: 'Helvetica',
      fontSize: _textSize,
      scale: scale,
      fontColor: _textColor,
      fontStyle: _textItalic,
      fontWeight: _textBold,
      textDecoration: {underline : _textUnderline, linethrough: _textStrikethrough},
      content: content,
      rotation: -viewport.rotation,
    };

    PDFJSAnnotate.getStoreAdapter().addAnnotation(documentId, pageNumber, annotation)
      .then((annotation) => {
        // true 상태 일경우 다음 click 이벤트가 호출되어도 셀렉션이 해제되지 않도록 한다. 디폴트는 false
        setSelectNode(addFormNode(documentId, pageNumber, annotation, svg), true);
      });
  }

  closeInput();

  document.removeEventListener("click", handleDocumentClick);
}

/**
 * Close the editorDiv
 */
function closeInput() {
  if (editorDiv) {
    editorDiv.removeEventListener('blur', handleInputBlur);
    editorDiv.removeEventListener('keyup', handleInputKeyup);
    editorDiv.parentNode.removeChild(editorDiv);
    editorDiv = null;
  }
}

function isEmptyInput() {
  if (editorDiv == null) {
    return true;
  }

  const divs = editorDiv.getElementsByTagName("div");
  let content = null;
  if (divs.length === 0) {
    content = editorDiv.innerText;
  } else {
    const first = editorDiv.firstChild;
    if (first?.nodeName === "#text") {
      content = first.data;
    }

    for (let i = 0; i < divs.length; i++) {
      const div = divs[i];
      const first = div.firstChild;
      if (first?.nodeName === "#text") {
        content += '\n' + first.data;
      }
    }
  }

  if (!content || content === '') {
    return true;
  }

  return false;
}

/**
 * Set the text attributes
 *
 * @param {Number} textSize The size of the text
 */
 export function setTextSize(textSize) {
  _textSize = parseInt(textSize, 10);
}

/**
 * Set the text attributes
 *
 * @param {String} textColor The color of the text
 */
 export function setTextColor(textColor) {
  _textColor = textColor;
}

/**
 * Set the text attributes
 *
 * @param {String} textBold The bold of the text
 */
 export function setTextBold(textBold) {
  _textBold = textBold;
}

/**
 * Set the text attributes
 *
 * @param {String} textItalic The italic of the text
 */
 export function setTextItalic(textItalic) {
  _textItalic = textItalic;
}

/**
 * Set the text attributes
 *
 * @param {String} textUnderline The underline of the text
 */
 export function setTextUnderline(textUnderline) {
  _textUnderline = textUnderline;
}

/**
 * Set the text attributes
 *
 * @param {String} textStrikethrough The strikethrough of the text
 */
 export function setTextStrikethrough(textStrikethrough) {
  _textStrikethrough = textStrikethrough;
}

/**
 * Enable text behavior
 */
export function enableText() {
  if (_enabled) {
    return;
  }

  _enabled = true;
  document.addEventListener("click", handleDocumentClick);
  addTouchActionNone();
}

/**
 * Disable text behavior
 */
export function disableText() {
  if (!_enabled) { return; }

  _enabled = false;
  document.removeEventListener("click", handleDocumentClick);
  removeTouchActionNone();
}

