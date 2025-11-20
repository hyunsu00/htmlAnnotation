// selector.js
import { fireEvent } from './event';
import {
  findSVGContainer
} from './utils';
import {
  createEditOverlay,
  destroyEditOverlay
} from './overlay';

let _pageID;
let _targetID;

export function setSelectNode(target) {
  let targetID, pageID;
  if (!target) {
    targetID = null, pageID = null;
  } else {
    targetID = target.getAttribute('data-pdf-annotate-id');
    pageID = target.parentNode.getAttribute('data-pdf-annotate-page');
  }

  const selectNodeID = getSelectNodeID();
  if (selectNodeID && selectNodeID != targetID) {
    const selectNode = getSelectNode();
    _unSelectNode(selectNode);
  }

  if (target) {
    _selectNode(target);
  }
}

export function getSelectNode() {
  let selectNode = null;
  if (_pageID && _targetID) {
    const svg = document.querySelector(`svg[data-pdf-annotate-page="${_pageID}"]`);
    if (svg) {
      selectNode = svg.querySelector('[data-pdf-annotate-id="' + _targetID + '"]')
    }
  }
  
  return selectNode;
}

export function getSelectPageID() {
  return _pageID;
}

export function getSelectNodeID() {
  return _targetID;
}

function _unSelectNode(targetEl) {
  console.log('call selctor::_unSelectNode(targetEl = ', targetEl, ')');
  destroyEditOverlay();

  _pageID = null;
  _targetID = null;
  fireEvent('annotation:unSelected', targetEl);
}

function _selectNode(targetEl) {
  console.log('call selctor::_selectNode(targetEl = ', targetEl, ')');
  let rect = createEditOverlay(targetEl);

  _targetID = targetEl.getAttribute('data-pdf-annotate-id');
  _pageID = targetEl.parentNode.getAttribute('data-pdf-annotate-page');
  fireEvent('annotation:selected', targetEl, rect);
}
