/**
 * 액션 ID
 * @category Action
 * @readonly
 * @const {String}
 *
 * @property {String} OPEN_FILE - 열기
 * @property {String} SAVE - 저장하기
 * @property {String} SAVE_ANNOTATION - 주석 저장하기
 * @property {String} DOWNLOAD - 다운로드
 * @property {String} DOWNLOAD_ANNOTATION - 주석 다운로드
 * @property {String} PRINT - 인쇄
 * @property {String} PASSWORD - 암호문서 패스워드 입력
 * @property {String} DOCUMENT_PROPERTIES - 문서 정보
 * @property {String} UNDO - 되돌리기
 * @property {String} REDO - 다시 실행
 * @property {String} COPY - 복사하기
 * @property {String} DELETE - 주석 삭제
 * @property {String} SELECT_ALL - 모두 선택
 * @property {String} FIND_OPEN - 찾기
 * @property {String} FIND_CLOSE - 찾기 종료
 * @property {String} ZOOM - 확대/축소
 * @property {String} PINTCH_ZOOM - 핀치 확대/축소
 * @property {String} THUMBNAIL_VIEW - 문서창(썸네일)
 * @property {String} ROTATE_CW - 시계방향으로 회전
 * @property {String} ROTATE_CCW - 시계 반대방향으로 회전
 * @property {String} SWITCH_SCROLL_MODE - 스크롤 모드 변경
 * @property {String} SWITCH_SPREAD_MODE - 펼쳐짐 모드 변경
 * @property {String} SLIDESHOW_FIRST - 쇼 보기
 * @property {String} SLIDESHOW_CURRENT - 현재 슬라이드부터 쇼 보기
 * @property {String} SELECT_DRAW_TOOL - 주석 추가
 * @property {String} QUICK_UNDERLINE - 빠른 밑줄 추가
 * @property {String} QUICK_STRIKEOUT - 빠른 취소선 추가
 * @property {String} QUICK_HIGHLIGHT - 빠른 형광펜 추가
 * @property {String} CHANGE_PROPERTY - 주석 속성 변경
 * @property {String} SELECT_CURSOR - 선택/손도구 설정
 * @property {String} FIRST_PAGE - 처음페이지 이동
 * @property {String} PREV_PAGE - 이전 페이지 이동
 * @property {String} NEXT_PAGE - 다음 페이지 이동
 * @property {String} LAST_PAGE - 마지막 페이지 이동
 * @property {String} GOTO_PAGE - 페이지 이동
 */

export const ACTION_ID = {
  //
  // 파일
  //
  OPEN_FILE: 'd_open',
  OPEN_ANNOTATION: 'd_open_annotation',
  SAVE: 'd_save', // ! 구현 필요
  SAVE_ANNOTATION: 'd_save_annotation', // ! 구현 필요
  DOWNLOAD: 'd_download',
  DOWNLOAD_ANNOTATION: 'd_download_annotation',
  PRINT: 'd_print',
  PASSWORD: 'e_dialog_password',
  DOCUMENT_PROPERTIES: 'd_info',
  //
  // 편집
  //
  UNDO: 'e_undo',
  REDO: 'e_redo',
  COPY: 'e_copy',
  DELETE: 'a_delete_annotation',
  SELECT_ALL: 'e_select_all',
  SELECT_CLEAR: 'e_select_clear',
  // 찾기
  FIND_OPEN: 'd_find',
  FIND_CLOSE: 'd_find_close',
  //
  // 보기
  //
  // 줌
  ZOOM: 'e_zoom',
  // 핀치줌
  PINTCH_ZOOM: 'e_pintch_zoom',
  // 썸네일 뷰
  THUMBNAIL_VIEW: 'document_window',
  // 시계방향으로 회전
  ROTATE_CW: 'e_rotate_cw',
  // 시계 반대방향으로회전
  ROTATE_CCW: 'e_rotate_ccw',
  // 스크롤 모드 변경
  SWITCH_SCROLL_MODE: 'e_switch_scroll_mode',
  // 펼쳐짐 모드 변경
  SWITCH_SPREAD_MODE: 'e_switch_spread_mode',
  //
  // 슬라이드쇼
  //
  SLIDESHOW_FIRST: 'e_show_mode_start',
  SLIDESHOW_CURRENT: 'e_show_mode',
  //
  // 주석
  //
  SELECT_DRAW_TOOL: 'a_select_draw_tool',
  QUICK_UNDERLINE: 'a_quick_underline',
  QUICK_STRIKEOUT: 'a_quick_strikeout',
  QUICK_HIGHLIGHT: 'a_quick_highlight',
  CHANGE_PROPERTY: 'a_property',
  //
  // 도구
  //
  SELECT_CURSOR: 'switchcursortool',

  //
  // 페이지 이동
  //
  FIRST_PAGE: 'e_first_page',
  PREV_PAGE: 'e_previous_page',
  NEXT_PAGE: 'e_next_page',
  LAST_PAGE: 'e_last_page',
  GOTO_PAGE: 'page_number',
};

export default ACTION_ID;
