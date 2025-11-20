import webPdfLib from '../webPdfLib.js';

/**  
 * @category Action
 * @class Slideshow 액션 클래스.
*/
export default class ASlideshow {
  /**
   * ACTION_ID.SLIDESHOW_FIRST 액션시 호출되는 함수
   */
  static slideshow_first() {
    console.group(`function slideshow_first(evtAction)`);

    webPdfLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('firstpage', {
      source: webPdfLib.PDFViewerApplication.secondaryToolbar,
    });
    webPdfLib.PDFViewerApplication.secondaryToolbar.close();

    ASlideshow.slideshow_current();

    console.groupEnd();
  }
  /**
   * ACTION_ID.SLIDESHOW_CURRENT 액션시 호출되는 함수
   */
  static slideshow_current() {
    console.group(`function slideshow_current(evtAction)`);

    webPdfLib.PDFViewerApplication.toolbar.eventBus.dispatch('presentationmode', {
      source: webPdfLib.PDFViewerApplication.toolbar,
    });

    console.groupEnd();
  }
}
