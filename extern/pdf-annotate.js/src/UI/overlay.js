import PDFJSAnnotate from '../PDFJSAnnotate';
import config from '../config';
import {
  BORDER_COLOR,
  enableUserSelect,
  findSVGContainer,
  getOffsetAnnotationRect,
  getMetadata,
  modifyFormComment,
  calcMemoViewScale
} from './utils';
import { fireEvent } from './event';
const OVERLAY_BORDER_SIZE = 2;
const POPUP_LEFT = 8;
const WRAPPER_TOP = -5;

let overlay;
let popupClick;
/**
 * Create an overlay for editing an annotation.
 *
 * @param {Element} target The annotation element to apply overlay for
 */
export function createEditOverlay(target) {
  let parentNode = findSVGContainer(target).parentNode;
  let id = target.getAttribute('data-pdf-annotate-id');
	let rect = getOffsetAnnotationRect(target);

  if(checkExistOverlay(target)) {
    return rect;
  }

  enableUserSelect();
  overlay = document.createElement('section');
  overlay.className = "annotationLayer";
  overlay.setAttribute('pinned', false);

  let styleLeft = rect.left - OVERLAY_BORDER_SIZE;
  let styleTop = rect.top - OVERLAY_BORDER_SIZE;

  overlay.setAttribute('id', 'pdf-annotate-edit-overlay');
  overlay.setAttribute('data-target-id', id);
  overlay.style.boxSizing = 'content-box';
  overlay.style.position = 'absolute';
  overlay.style.top = `${styleTop}px`;
  overlay.style.left = `${styleLeft}px`;
  overlay.style.width = `${rect.width}px`;
  overlay.style.height = `${rect.height}px`;
  overlay.style.border = `${OVERLAY_BORDER_SIZE}px solid ${BORDER_COLOR}`;
  overlay.style.borderRadius = `0`;
  overlay.style.zIndex = 20100;

  let annotationId = overlay.getAttribute('data-target-id');
  let svg = parentNode.querySelector(config.annotationSvgQuery());
  let { documentId } = getMetadata(svg);
  let promise = PDFJSAnnotate.getStoreAdapter().getComments(documentId, annotationId);
  let viewport = JSON.parse(svg.getAttribute('data-pdf-annotate-viewport'));

  const wrapper = document.createElement("div");
  wrapper.className = "popupWrapper";
  wrapper.style.top = `${WRAPPER_TOP}px`;
  wrapper.style.left = `${rect.width}px`;
  
  const fontSize = Math.floor(9 * (96.0 / 72.0) * viewport.scale * 1.3);
  promise = promise.then(comments => {
    for (const comment of comments) {
      const dateObject = comment.dataString;
      if (dateObject !== undefined) {
        const popup = document.createElement("div");
        popup.className = "popup";
				popup.style.transform = `scale(${viewport.scale * calcMemoViewScale()})`;
        popup.style.left = `${POPUP_LEFT}px`;
        const titleLayerDiv = document.createElement("div");
        //
        titleLayerDiv.style.position = 'relative';
        //

        const title = document.createElement("div");
        //
        title.style.position = `absolute`;
        title.style.left = `0`;
        //
        title.textContent = comment.author;
        title.style.fontSize = `${fontSize}px`;
        title.className = "titleDiv";
        titleLayerDiv.appendChild(title);
      
        const modificationDateDiv = document.createElement("div");
        modificationDateDiv.className = "popupDateDiv";
        //
        modificationDateDiv.style.position = `absolute`;
        modificationDateDiv.style.right = `0`;
        //
        const modificationDate = document.createElement("span");
        modificationDate.className = "popupDate";
        let dataStr = new Date(dateObject).toLocaleDateString();
        dataStr = dataStr.slice(0, -1);
        modificationDate.textContent = dataStr;
        modificationDate.style.fontSize = `${fontSize}px`;
        modificationDateDiv.appendChild(modificationDate);
        titleLayerDiv.appendChild(modificationDateDiv);    
        popup.appendChild(titleLayerDiv);

        const contentPopup = document.createElement("div");
        contentPopup.className = "contentPopupDiv";
        contentPopup.setAttribute("contenteditable", "true");
        contentPopup.setAttribute("spellcheck", "false");
        contentPopup.onkeydown = function(e) {
          var key = e.keyCode;
          if (key == 13 ) { //enter
             document.execCommand('insertLineBreak');
             e.preventDefault();
          }
        };

        contentPopup.addEventListener('click', () => {
          // frame disable
          popupClick = true;
          fireEvent('annotation:setStyleBarDisableState', true);
          fireEvent('annotation:setAnnotationSidebarEnable', false);
          fireEvent('annotation:setPopupEditingState', true);
        });

        contentPopup.addEventListener('blur', _updateValue.bind(this, annotationId, comment));

        const contentsObj = comment.content;
        const contents = _formatContents(contentsObj);
        contents.style.fontSize = `${fontSize}px`;
        contentPopup.appendChild(contents);
        popup.appendChild(contentPopup);
        wrapper.appendChild(popup);
      }
    }
  });

  overlay.appendChild(wrapper);
  parentNode.appendChild(overlay);

  overlay.addEventListener('mouseover', _show.bind(this, false));
  overlay.addEventListener('mouseout', _hide.bind(this, false));

  let type = target.getAttribute('data-pdf-annotate-type');
  if (type == 'point') {
    overlay.addEventListener('click', _toggle.bind(this));
  }

  return rect;
}

/**
 * Destroy the edit overlay if it exists.
 */
export function destroyEditOverlay() {
	if (overlay) {
		if (overlay.getAttribute('pinned') === 'false') {
			removeOverlay();
		} else {
			overlay.style.border = `none`;
		}
	}

  enableUserSelect();
}

export function getOverlay() {
  return overlay;
}

export function removeOverlay() {
	if (overlay) {
		if(overlay.parentNode) {
			overlay.parentNode.removeChild(overlay);
			overlay = null;
		}
	}

	enableUserSelect();
}

function checkExistOverlay(target) {
  let parentNode = findSVGContainer(target).parentNode;
  let id = target.getAttribute('data-pdf-annotate-id');
  //동일한 annotateid가 있으면 추가로 생성하지 않는다.
  let annotationLayer = parentNode.querySelectorAll(".annotationLayer");
  let targetOverlay;
  for(var i = 0; i< annotationLayer.length; i++) {
    let targetid = annotationLayer[i].getAttribute('data-target-id');
    annotationLayer[i].style.border = `none`;

    if(id == targetid) {
      targetOverlay = annotationLayer[i];
    }
  }

  if(targetOverlay) {
    overlay = targetOverlay;
    overlay.style.border = `${OVERLAY_BORDER_SIZE}px solid ${BORDER_COLOR}`;
    return true;
  }

  return false;
}

export function clearSelection() {
	if (window.getSelection) {
		window.getSelection().removeAllRanges();
	}
	else if (document.selection) {
		document.selection.empty();
	}
}

function _updateValue(annotationId, comment, e) {
  if(popupClick) {
    let contentInnerText = e.currentTarget.innerText;
    if (overlay) {
      clearSelection();
			
      let svg = overlay.parentNode.querySelector(config.annotationSvgQuery());
      let { documentId, pageNumber } = getMetadata(svg);
      let promise = PDFJSAnnotate.getStoreAdapter().getComments(documentId, annotationId);

      promise = promise.then(comments => {
        for (const comment of comments) {
          PDFJSAnnotate.getStoreAdapter().getAnnotation(documentId, annotationId).then((annotation) => {
            const targetId = annotation.uuid;
            let innerTextcomment = {
              class: 'Comment',
              documentId: documentId,
              annotation: targetId,
              uuid: comment.uuid,
              content: contentInnerText,
              dataString: comment.dataString,
              author: comment.author
            }; 

            const undoStr = JSON.stringify(comment);
            {
              PDFJSAnnotate.getStoreAdapter().editAnnotation(documentId, comment.uuid, innerTextcomment);
            }
            const redoStr = JSON.stringify(innerTextcomment);

            modifyFormComment(documentId, pageNumber, comment.uuid, {undo : {str : undoStr, targetId}, redo : {str : redoStr, targetId}});
					});
        }
      });
    }
		
    popupClick = false;
  }
}

/**
 * Toggle the visibility of the popup.
 *
 * @private
 * @memberof PopupElement
 */
function _toggle() {
  if(popupClick) {
    return;
  }

  let value = overlay.getAttribute('pinned') == 'true' ? true : false;
  if (value) {
    _hide(true);
  } else {
    _show(true);
  }
}

/**
  * Show the popup.
  *
  * @private
  * @param {boolean} pin
  * @memberof PopupElement
  */
function _show(pin = false) {
  if (pin) {
    overlay.setAttribute('pinned', true);
  }
  
  if (overlay && overlay.querySelector("div .popupWrapper")) {
    if (overlay.querySelector("div .popupWrapper").hidden) {
      overlay.querySelector("div .popupWrapper").hidden = false;
    }
  }
}

/**
 * Hide the popup.
 *
 * @private
 * @param {boolean} unpin
 * @memberof PopupElement
 */
function _hide(unpin = true) {
  if (unpin) {
    overlay.setAttribute('pinned', false);
  }

  if (overlay && overlay.getAttribute('pinned')) {
    let value = overlay.getAttribute('pinned') == 'true' ? true : false;
    if (!overlay.querySelector("div .popupWrapper").hidden && !value) {
      overlay.querySelector("div .popupWrapper").hidden = true;
    }
  }
}

/**
 * Format the contents of the popup by adding newlines where necessary.
 *
 * @private
 * @param {Object<string, string>} contentsObj
 * @memberof PopupElement
 * @returns {HTMLParagraphElement}
 */
function _formatContents(str) {
  const p = document.createElement("p");
  p.className = "popupContent";
  const lines = str.split(/(?:\r\n?|\n)/);
  for (let i = 0, ii = lines.length; i < ii; ++i) {
    const line = lines[i];
    p.appendChild(document.createTextNode(line));
    if (i < ii - 1) {
      p.appendChild(document.createElement("br"));
    }
  }
  return p;
}
