import annotationLib from '../annotationLib.js';

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

    annotationLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('firstpage', {
      source: annotationLib.PDFViewerApplication.secondaryToolbar,
    });
    annotationLib.PDFViewerApplication.secondaryToolbar.close();

    ASlideshow.slideshow_current();

    console.groupEnd();
  }
  /**
   * ACTION_ID.SLIDESHOW_CURRENT 액션시 호출되는 함수
   */
  static slideshow_current() {
    console.group(`function slideshow_current(evtAction)`);

    annotationLib.PDFViewerApplication.toolbar.eventBus.dispatch('presentationmode', {
      source: annotationLib.PDFViewerApplication.toolbar,
    });

    console.groupEnd();
  }
}
