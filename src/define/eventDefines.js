/**
 * 이벤트 ID
 * @category Event
 * @readonly
 * @const {String}
 *
 * @property {String} DOCUMENT_LOADED - 문서가 메모리에 모두 로드되었을 경우 이벤트 등록
 * @property {String} DOCUMENT_SAVE - 문서저장 액션 호출시 이벤트 등록
 * @property {String} ANNOTATION_SAVE - 주석저장 액션 호출시 이벤트 등록
 * @property {String} UPDATE_UI - 액션 호출시 UI 업데이트 이벤트 등록
 * @property {String} QUICK_MENU - 빠른메뉴(밑줄,취소선,형광펜)가 발생시 이벤트 등록
 * @property {String} ERROR - 액션실패시 발생되는 이벤트 등록
 * @property {String} PASSWORD - 암호문서가 오픈시 발생되는 이벤트 등록
 * @property {String} DOCUMENT_SUMMARY - 문서정보 액션 호출시 발생되는 이벤트 등록
 * @property {String} ANNOTATION_SELECTED - 주석개체 선택시 이벤트 등록
 * @property {String} ANNOTATION_UNSELECTED - 주석개체 선택 해제시 이벤트 등록
 */
export const EVENT_ID = {
  DOCUMENT_LOADED: 'onDocumentLoaded',
  DOCUMENT_SAVE: 'onDocumentSave',
  ANNOTATION_SAVE: 'onAnnotationSave',
  UPDATE_UI: 'onUpdateUi',
  QUICK_MENU: 'onQuickMenu',
  ERROR: 'onError',
  PASSWORD: 'onPassword',
  DOCUMENT_SUMMARY: 'onDocumentSummary',
  ANNOTATION_SELECTED: 'onAnnotationSelected',
  ANNOTATION_UNSELECTED: 'onAnnotationUnSelected',
};

export default EVENT_ID;
