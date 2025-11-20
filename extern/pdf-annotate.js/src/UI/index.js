import { setSelectNode, getSelectNode, getSelectNodeID, getSelectPageID} from './selector';
import { addEventListener, removeEventListener, fireEvent } from './event';
import { disableEdit, enableEdit, deleteAnnotation } from './edit';
import { disablePen, enablePen, setPen } from './pen';
import { disableArrow, enableArrow, setArrow } from './arrow';
import { disableEraser, enableEraser } from './eraser';
import { disablePoint, enablePoint } from './point';
import { disableRect, enableRect, saveRect } from './rect';
import { disableCircle, enableCircle } from './circle';
import { disableText, enableText, setTextSize, setTextColor, setTextBold, setTextItalic, setTextUnderline, setTextStrikethrough } from './text';
import { createPage, renderPage } from './page';
import { disableLine, enableLine, setLine } from './line';
import { addFormNode, addChildFormNode, modifyFormNode, removeFormNode, setAuthorName, getAuthorName } from './utils';

export default {
  setSelectNode,
  getSelectNode,
  getSelectNodeID,
  getSelectPageID,

  addEventListener,
  removeEventListener,
  fireEvent,

  disableEdit,
  enableEdit,
  deleteAnnotation,

  disablePen,
  enablePen,
  setPen,

  disablePoint,
  enablePoint,

  disableRect,
  enableRect,
  saveRect,

  disableCircle,
  enableCircle,

  disableArrow,
  enableArrow,
  setArrow,

  disableEraser,
  enableEraser,

  disableText,
  enableText,
  setTextSize,
  setTextColor,
  setTextBold,
  setTextItalic,
  setTextUnderline,
  setTextStrikethrough,

  createPage,
  renderPage,

  disableLine,
  enableLine,
  setLine,

  setAuthorName,
  getAuthorName,

  addFormNode, 
  addChildFormNode, 
  modifyFormNode,
  removeFormNode
};
