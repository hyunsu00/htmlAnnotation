import { DRAW_TYPE } from '../define/valueDefines.js';
import UiManager from '../uiFrame/uiManager.js';
import EventManager from '../event/eventManager.js';
import AnnotationManager from '../annotation/annotationManager.js';
import { EVENT_ID } from '../webPdfLib.js';

/**  
 * @category Action
 * @class Annotation 액션 클래스.
*/
export default class AAnnotation {
  static _ToAnnotationType(drawType) {
    let annotationType = null;
    switch (drawType) {
      case DRAW_TYPE.LINE:
        annotationType = 'line';
        break;
      case DRAW_TYPE.AREA:
        annotationType = 'area';
        break;
      case DRAW_TYPE.CIRCLE:
        annotationType = 'circle';
        break;
      case DRAW_TYPE.PEN:
        annotationType = 'draw';
        break;
      case DRAW_TYPE.MEMO:
        annotationType = 'point';
        break;
      case DRAW_TYPE.TEXT:
        annotationType = 'text';
        break;
      case DRAW_TYPE.UNDERLINE:
        annotationType = 'underline';
        break;
      case DRAW_TYPE.STRIKEOUT:
        annotationType = 'strikeout';
        break;
      case DRAW_TYPE.HIGHLIGHT:
        annotationType = 'highlight';
        break;
      default:
        break;
    }

    return annotationType;
  }

  /**
   * ACTION_ID.SELECT_DRAW_TOOL 액션시 호출되는 함수
   * @param {DRAW_TYPE} drawType - 주석 타입 열거
   */
  static select(drawType) {
    switch (drawType) {
      case DRAW_TYPE.LINE:
        AAnnotation.a_line();
        break;
      case DRAW_TYPE.AREA:
        AAnnotation.a_area();
        break;
      case DRAW_TYPE.CIRCLE:
        AAnnotation.a_circle();
        break;
      case DRAW_TYPE.PEN:
        AAnnotation.a_draw();
        break;
      case DRAW_TYPE.MEMO:
        AAnnotation.a_point();
        break;
      case DRAW_TYPE.TEXT:
        AAnnotation.a_text();
        break;
      case DRAW_TYPE.UNDERLINE:
        AAnnotation.a_underline();
        break;
      case DRAW_TYPE.STRIKEOUT:
        AAnnotation.a_strikeout();
        break;
      case DRAW_TYPE.HIGHLIGHT:
        AAnnotation.a_highlight();
        break;
      default:
        break;
    }
  }

  static _select(drawType) {
    let annotationType = AAnnotation._ToAnnotationType(drawType);
    if (AnnotationManager.annotationType === annotationType) {
      annotationType = 'cursor';
    }
    AnnotationManager.switchUI(annotationType);
  }

  static a_line() {
    AAnnotation._select(DRAW_TYPE.LINE);
  }
  static a_area() {
    AAnnotation._select(DRAW_TYPE.AREA);
  }
  static a_circle() {
    AAnnotation._select(DRAW_TYPE.CIRCLE);
  }
  static a_draw() {
    AAnnotation._select(DRAW_TYPE.PEN);
  }
  static a_point() {
    AAnnotation._select(DRAW_TYPE.MEMO);
  }
  static a_text() {
    AAnnotation._select(DRAW_TYPE.TEXT);
  }
  static a_underline() {
    if (UiManager.isSelectedAllRange()) {
      EventManager.dispatch(EVENT_ID.ERROR, { errType: 'ERR_ALL_SELECTED' });
      return;
    }
    const range = UiManager.getRange();
    if (range && !range.collapsed) {
      AAnnotation.a_quick_underline(range);
    } else {
      AAnnotation._select(DRAW_TYPE.UNDERLINE);
    }
  }
  static a_strikeout() {
    if (UiManager.isSelectedAllRange()) {
      EventManager.dispatch(EVENT_ID.ERROR, { errType: 'ERR_ALL_SELECTED' });
      return;
    }

    const range = UiManager.getRange();
    if (range && !range.collapsed) {
      AAnnotation.a_quick_strikeout(range);
    } else {
      AAnnotation._select(DRAW_TYPE.STRIKEOUT);
    }
  }
  static a_highlight(_eent) {
    if (UiManager.isSelectedAllRange()) {
      EventManager.dispatch(EVENT_ID.ERROR, { errType: 'ERR_ALL_SELECTED' });
      return;
    }

    const range = UiManager.getRange();
    if (range && !range.collapsed) {
      AAnnotation.a_quick_highlight(range);
    } else {
      AAnnotation._select(DRAW_TYPE.HIGHLIGHT);
    }
  }
  /**
   * ACTION_ID.QUICK_UNDERLINE 액션시 호출되는 함수
   * @param {Range} range - 선택영역
   */
  static a_quick_underline(range) {
    let rects = range.getClientRects();
    AnnotationManager.saveRect('underline', rects);
  }
  /**
   * ACTION_ID.QUICK_STRIKEOUT 액션시 호출되는 함수
   * @param {Range} range - 선택영역
   */
  static a_quick_strikeout(range) {
    let rects = range.getClientRects();
    AnnotationManager.saveRect('strikeout', rects);
  }
  /**
   * ACTION_ID.QUICK_HIGHLIGHT 액션시 호출되는 함수
   * @param {Range} range - 선택영역
   */
  static a_quick_highlight(range) {
    let rects = range.getClientRects();
    AnnotationManager.saveRect('highlight', rects);
  }
  /**
   * ACTION_ID.QUICK_HIGHLIGHT 액션시 호출되는 함수
   * @param {Object} value - 선택영역
   * @param {Object} value.target - 주석 개체
   * @param {PROPERTY_TYPE} value.cmdType - 변경 속성타입
   * @param {Object} value.cmdValue - 변경 속성값
   */
  static a_property(value) {
    const { target, cmdType, cmdValue } = value;
    AnnotationManager.execCommand(cmdType, cmdValue, target);
  }
}
