// actionManager.js
import ACTION_ID from '../define/actionDefines.js'
import AFile from './AFile.js';
import AEdit from './AEdit.js';
import AView from './AView.js';
import AAnnotation from './AAnnotation.js';
import ASlideshow from './ASlideshow.js';
import ATool from './ATool.js';
import APage from './APage.js';

/**
 * @category Action
 * @class ActionManager
 */
export default (function () {
  const _actionMap = (function () {
    return new Map([
      // 파일메뉴
      [ACTION_ID.SAVE, AFile.d_save],
      [ACTION_ID.SAVE_ANNOTATION, AFile.d_save_annotation],
      [ACTION_ID.DOWNLOAD, AFile.d_download],
      [ACTION_ID.DOWNLOAD_ANNOTATION, AFile.d_download_annotation],
      [ACTION_ID.OPEN_FILE, AFile.d_open],
      [ACTION_ID.OPEN_ANNOTATION, AFile.d_open_annotation],
      [ACTION_ID.PRINT, AFile.d_print],
      [ACTION_ID.PASSWORD, AFile.e_dialog_password],
      [ACTION_ID.DOCUMENT_PROPERTIES, AFile.d_info],
      // 편집메뉴
      [ACTION_ID.UNDO, AEdit.e_undo],
      [ACTION_ID.REDO, AEdit.e_redo],
      [ACTION_ID.COPY, AEdit.e_copy],
      [ACTION_ID.DELETE, AEdit.a_delete_annotation],
      [ACTION_ID.SELECT_ALL, AEdit.e_select_all],
      [ACTION_ID.SELECT_CLEAR, AEdit.e_select_clear],
      [ACTION_ID.FIND_OPEN, AEdit.d_find],
      [ACTION_ID.FIND_CLOSE, AEdit.d_find_close],
      // 보기
      [ACTION_ID.ZOOM, AView.zoom],
      [ACTION_ID.PINTCH_ZOOM, AView.pintchZoom],
      [ACTION_ID.THUMBNAIL_VIEW, AView.thumnailView],
      [ACTION_ID.ROTATE_CW, AView.rotateCW],
      [ACTION_ID.ROTATE_CCW, AView.rotateCCW],
      [ACTION_ID.SWITCH_SCROLL_MODE, AView.switchScrollMode],
      [ACTION_ID.SWITCH_SPREAD_MODE, AView.switchSpreadMode],
      // 주석
      [ACTION_ID.SELECT_DRAW_TOOL, AAnnotation.select],
      [ACTION_ID.QUICK_UNDERLINE, AAnnotation.a_quick_underline],
      [ACTION_ID.QUICK_STRIKEOUT, AAnnotation.a_quick_strikeout],
      [ACTION_ID.QUICK_HIGHLIGHT, AAnnotation.a_quick_highlight],
      [ACTION_ID.CHANGE_PROPERTY, AAnnotation.a_property],
      // 슬라이드쇼
      [ACTION_ID.SLIDESHOW_FIRST, ASlideshow.slideshow_first],
      [ACTION_ID.SLIDESHOW_CURRENT, ASlideshow.slideshow_current],
      // 도구
      [ACTION_ID.SELECT_CURSOR, ATool.switchcursortool],
      // 페이지
      [ACTION_ID.FIRST_PAGE, APage.e_first_page],
      [ACTION_ID.PREV_PAGE, APage.e_previous_page],
      [ACTION_ID.NEXT_PAGE, APage.e_next_page],
      [ACTION_ID.LAST_PAGE, APage.e_last_page],
      [ACTION_ID.GOTO_PAGE, APage.page_number],
    ]);
  })();

  return {
    /**
     * 액션 실행
     * @memberof ActionManager
     * @param {ACTION_ID} aID - 액션 ID
     * @param {any} value - 액션 Value(optional)
     * 
     */
    Execute(aID, value) {
      let action = _actionMap.get(aID);
      if (action) {
        action(value);
      }
    },
  };
})();
