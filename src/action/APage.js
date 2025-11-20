import webPdfLib from '../webPdfLib.js';

/**  
 * @category Action
 * @class Page 액션 클래스.
*/
export default class APage {
  /**
   * ACTION_ID.FIRST_PAGE 액션시 호출되는 함수
   */
  static e_first_page() {
    webPdfLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('firstpage', {
      source: webPdfLib.PDFViewerApplication.toolbar,
    });
  }
  /**
   * ACTION_ID.PREV_PAGE 액션시 호출되는 함수
   */
  static e_previous_page() {
    webPdfLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('previouspage', {
      source: webPdfLib.PDFViewerApplication.toolbar,
    });
  }
  /**
   * ACTION_ID.NEXT_PAGE 액션시 호출되는 함수
   */
  static e_next_page() {
    webPdfLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('nextpage', {
      source: webPdfLib.PDFViewerApplication.toolbar,
    });
  }
  /**
   * ACTION_ID.LAST_PAGE 액션시 호출되는 함수
   */
  static e_last_page() {
    webPdfLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('lastpage', {
      source: webPdfLib.PDFViewerApplication.toolbar,
    });
  }
  /**
   * ACTION_ID.GOTO_PAGE 액션시 호출되는 함수
   * @param {Number} pageNum - 페이지번호 (1페이지부터 시작)
   */
  static page_number(pageNum) {
    if (pageNum <= webPdfLib.PDFViewerApplication.pdfLinkService.pagesCount) {
      webPdfLib.PDFViewerApplication.toolbar.eventBus.dispatch('pagenumberchanged', {
        source: webPdfLib.PDFViewerApplication.toolbar,
        value: pageNum,
      });
    }
  }
}
