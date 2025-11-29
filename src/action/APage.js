import annotationLib from '../annotationLib.js';

/**  
 * @category Action
 * @class Page 액션 클래스.
*/
export default class APage {
  /**
   * ACTION_ID.FIRST_PAGE 액션시 호출되는 함수
   */
  static e_first_page() {
    annotationLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('firstpage', {
      source: annotationLib.PDFViewerApplication.toolbar,
    });
  }
  /**
   * ACTION_ID.PREV_PAGE 액션시 호출되는 함수
   */
  static e_previous_page() {
    annotationLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('previouspage', {
      source: annotationLib.PDFViewerApplication.toolbar,
    });
  }
  /**
   * ACTION_ID.NEXT_PAGE 액션시 호출되는 함수
   */
  static e_next_page() {
    annotationLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('nextpage', {
      source: annotationLib.PDFViewerApplication.toolbar,
    });
  }
  /**
   * ACTION_ID.LAST_PAGE 액션시 호출되는 함수
   */
  static e_last_page() {
    annotationLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('lastpage', {
      source: annotationLib.PDFViewerApplication.toolbar,
    });
  }
  /**
   * ACTION_ID.GOTO_PAGE 액션시 호출되는 함수
   * @param {Number} pageNum - 페이지번호 (1페이지부터 시작)
   */
  static page_number(pageNum) {
    if (pageNum <= annotationLib.PDFViewerApplication.pdfLinkService.pagesCount) {
      annotationLib.PDFViewerApplication.toolbar.eventBus.dispatch('pagenumberchanged', {
        source: annotationLib.PDFViewerApplication.toolbar,
        value: pageNum,
      });
    }
  }
}
