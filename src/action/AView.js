import annotationLib from '../annotationLib.js';
import AnnotationManager from '../annotation/annotationManager.js';

/**  
 * @category Action
 * @class View 액션 클래스.
*/
export default class AView {
  /**
   * ACTION_ID.ZOOM 액션시 호출되는 함수
   * @param {ZOOM_VALUE | number} zoomValue - 줌설정값(number는 0~3사이 실수)
   */
  static zoom(zoomValue) {
    console.group(`function zoom(zoomValue)`);

    if (AnnotationManager.annotationType != 'point' && AnnotationManager.annotationType != 'text') {
      console.log(`current scaleValue = ${AnnotationManager.currentScaleValue}`);
      AnnotationManager.currentScaleValue = zoomValue;
      console.log(`changed scaleValue = ${AnnotationManager.currentScaleValue}`);
    }
    
    console.groupEnd();
  }

  /**
   * ACTION_ID.PINTCH_ZOOM 액션시 호출되는 함수
   * @param {Object} execValue
   * @param {String} execValue.currentLevel 현재 터치 Level
   * @param {String} execValue.diffLevel    변경된 터리 Level
   * @param {String} execValue.startX       터치 시작 X 좌표
   * @param {String} execValue.startY       터치 시작 Y 좌표
   * @param {String} execValue.endX         터치 끝 X 좌표
   * @param {String} execValue.endY         터치 끝 Y 좌표
   */
  static pintchZoom(execValue) {
    console.group(`function pintchZoom(execValue)`);

    const PDFApp = annotationLib.PDFViewerApplication;
    const { pdfViewer } = PDFApp;
    const previousScale = pdfViewer.currentScale;
    if (execValue.currentLevel > execValue.diffLevel) {
      PDFApp.pintchToZoomIn();
    } else if (execValue.currentLevel < execValue.diffLevel) {
      PDFApp.pintchToZoomOut();
    }

    const currentScale = pdfViewer.currentScale;

    // !!! 이곳에 줌 메시지를 호출해야 한다.
    // showZoomMessage(currentScale, 1);

    if (previousScale !== currentScale) {
      const scaleCorrectionFactor = currentScale / previousScale - 1;
      const rect = pdfViewer.container.getBoundingClientRect();
      const dx = (execValue.startX + execValue.endX) / 2 - rect.left;
      const dy = (execValue.startY + execValue.endY) / 2 - rect.top;
      pdfViewer.container.scrollLeft += dx * scaleCorrectionFactor;
      pdfViewer.container.scrollTop += dy * scaleCorrectionFactor;
    }

    console.groupEnd();
  }

  /**
   * ACTION_ID.THUMBNAIL_VIEW 액션시 호출되는 함수
   * @param {Boolean} flag - 보이기/숨기기(optional)
   */
  static thumnailView(flag) {
    console.group(`function thumnailView(flag)`);

    if (flag === undefined) {
      flag = !annotationLib.PDFViewerApplication.pdfSidebar.isOpen;
    } else {
      if (flag == annotationLib.PDFViewerApplication.pdfSidebar.isOpen) {
        return;
      }
    }

    if (flag) {
      annotationLib.PDFViewerApplication.pdfSidebar.open();
    } else {
      annotationLib.PDFViewerApplication.pdfSidebar.close();
    }

    console.groupEnd();
  }

  /**
   * ACTION_ID.ROTATE_CW 액션시 호출되는 함수
   */
  static rotateCW() {
    annotationLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('rotatecw', {
      source: annotationLib.PDFViewerApplication.secondaryToolbar,
    });
  }

  /**
   * ACTION_ID.ROTATE_CCW 액션시 호출되는 함수
   */
  static rotateCCW() {
    annotationLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('rotateccw', {
      source: annotationLib.PDFViewerApplication.secondaryToolbar,
    });
  }

  /**
   * ACTION_ID.SWITCH_SCROLL_MODE 액션시 호출되는 함수
   * @param {SCROLL_MODE} scrollMode - 스크롤 모드
   */
  static switchScrollMode(scrollMode) {
    const details = {
      source: annotationLib.PDFViewerApplication.secondaryToolbar,
      mode: scrollMode,
    };
    annotationLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('switchscrollmode', details);
  }

  /**
   * ACTION_ID.SWITCH_SPREAD_MODE 액션시 호출되는 함수
   * @param {SPREAD_MODE} spreadMode - 펼처짐 모드
   */
  static switchSpreadMode(spreadMode) {
    const details = {
      source: annotationLib.PDFViewerApplication.secondaryToolbar,
      mode: spreadMode,
    };
    annotationLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('switchspreadmode', details);
  }
}
