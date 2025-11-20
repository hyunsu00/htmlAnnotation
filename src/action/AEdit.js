import webPdfLib from '../webPdfLib.js';
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
    webPdfLib.gUndoRedoManager.Undo();
  }
  /**
   * ACTION_ID.REDO 액션시 호출되는 함수
   */
  static e_redo() {
    webPdfLib.gUndoRedoManager.Redo();
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
  /**
   * ACTION_ID.FIND_OPEN 액션시 호출되는 함수
   * @param {Object} value - 찾기데이터
   * @param {Object} value.source - source
   * @param {FIND_TYPE} value.type - 찾기 타입
   * @param {String} value.query - 찾을 내용
   * @param {boolean} value.phraseSearch - 구문 검색
   * @param {1|0} value.caseSensitive - 대/소문자 구분
   * @param {1|0} value.entireWord - 단어 단위로
   * @param {1|0} value.highlightAll - 모두 강조 표시
   * @param {1|0} value.findPrevious - 찾을 방향
   * @param {boolean} value.matchDiacritics - 분음부호일치
   */
  static d_find(value) {
    console.group(`function d_find(_value)`);
    webPdfLib.PDFViewerApplication.findBar.eventBus.dispatch('find', value);
    // console.warn(`function d_find(_evtAction) 다이얼로그 구현 필요`);
    console.groupEnd();
  }
  /**
   * ACTION_ID.FIND_CLOSE 액션시 호출되는 함수
   */
  static d_find_close() {
    webPdfLib.PDFViewerApplication.findBar.eventBus.dispatch('findbarclose', {
      source: webPdfLib.PDFViewerApplication.findBar,
    });
  }
}
