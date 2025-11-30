import annotationLib from '../annotationLib.js';
import AnnotationManager from '../annotation/annotationManager.js';
import UiManager from '../uiFrame/uiManager.js';

/**  
 * @category Action
 * @class Edit 액션 클래스.
*/
export default class AEdit {
  /**
   * ACTION_ID.UNDO 액션시 호출되는 함수
   */
  static e_undo() {
    annotationLib.gUndoRedoManager.Undo();
  }
  /**
   * ACTION_ID.REDO 액션시 호출되는 함수
   */
  static e_redo() {
    annotationLib.gUndoRedoManager.Redo();
  }
  /**
   * ACTION_ID.COPY 액션시 호출되는 함수
   */
  static e_copy() {
    document.execCommand('copy'); //복사
  }
  /**
   * ACTION_ID.DELETE 액션시 호출되는 함수
   */
  static a_delete_annotation(annoID) {
    AnnotationManager.deleteAnnotation(annoID);
  }
  /**
   * ACTION_ID.SELECT_ALL 액션시 호출되는 함수
   */
  static e_select_all() {
    console.group(`function e_select_all(_value)`);
    // console.warn(`모두 선택 전에 툴바 밑줄, 취소선, 형광펜이 선택되어 있으면 해제해준다.`);

    UiManager.setSelectionAll();
    AnnotationManager.switchUI('none');

    console.groupEnd();
  }

  static e_select_clear() {
    console.group(`function e_select_clear(_value) `);
    UiManager.clearSelection();
    console.groupEnd();
  }
}
