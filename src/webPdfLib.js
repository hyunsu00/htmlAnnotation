// webPdfLib.js
import PDFJsListener from './listener/pdfjsListener.js';
import AnnotationManager from './annotation/annotationManager.js';
import UndoRedoManager from './undoRedo/UndoRedoManager.js';
//
import './webPdfLib.scss';
import mainHtml from './template/webPdfLib.html';
import sideHtml from "./template/webPdfSidebar.html";
import ACTION_ID from "./define/actionDefines.js";
import EVENT_ID from './define/eventDefines.js';
import {
  ZOOM_VALUE, FIND_TYPE, DRAW_TYPE, CURSOR_TYPE, LINE_STYLE, COLOR_TYPE, SCROLL_MODE, SPREAD_MODE
} from './define/valueDefines.js';
import ActionManager from './action/actionManager.js';
import EventManager from './event/eventManager.js';
import ValueGenerator from './action/valueGenerator.js';
import Util from './utils/util.js';
import AnnotationUtils from './annotation/annotationUtils.js';

export {
  ACTION_ID,
  EVENT_ID,
  ZOOM_VALUE,
  FIND_TYPE, 
  DRAW_TYPE, 
  CURSOR_TYPE, 
  LINE_STYLE, 
  COLOR_TYPE,
  SCROLL_MODE,
  SPREAD_MODE
};

/**
 * @category Main
 * @class webPdfLib
 */
export default (function () {
  let contextPath = '';

  return {
    initialize({
      lipsPath = '',
      defaultUrl = '',
      contextPath = '/hdv/view',
      streaming = true,
      renderExternalAnnotations = false,
      annotationUrl = '',
      documentName = ''
    } = {}) {
      console.log(`[webPdfLib.initialize({lipsPath = ${lipsPath}, defaultUrl = ${defaultUrl}, contextPath = ${contextPath}, streaming = ${streaming}, renderExternalAnnotations: ${renderExternalAnnotations}, annotationUrl : ${annotationUrl}, documentName: ${documentName}})]`);

      this.contextPath = contextPath;
      
      // if (!Util.isReloaded()) {
        window.localStorage.removeItem(`${defaultUrl}/annotations`);
        if (annotationUrl) {
          AnnotationUtils.getAnnotationsByUrl(annotationUrl).then((kcnetAnnotations) => {
            if (kcnetAnnotations) {
              const annotations = AnnotationUtils.importAnnotations(kcnetAnnotations);
              window.localStorage.setItem(`${defaultUrl}/annotations`, JSON.stringify(annotations));
            }
          });
        }
        // Util.setReloaded(true);
      // }

      // libPath = `${process.env.PUBLIC_URL}/libs`;
      import(/* webpackIgnore: true */ `${lipsPath}/pdf-annotate.js`)
        .then((module) => {
          this.PDFAnnotateRender = window.PDFAnnotate['default'];
          AnnotationManager.initialize(this.PDFAnnotateRender);

          console.log(`[import(/* webpackIgnore: true */ ${lipsPath}/pdf-annotate.js) Succeeded`);

          // import(/* webpackIgnore: true */ `${lipsPath}/pdfjs/web/viewer.js`)
          //   .then((module) => {
          //     this.PDFViewerApplication = window.PDFViewerApplication;
          //     this.PDFAppOptions = window.PDFViewerApplicationOptions;
          //     this.gUndoRedoManager = new UndoRedoManager(this.PDFViewerApplication.baseUrl);
          //     const _appOptions = this.PDFAppOptions;
          //     _appOptions.set('defaultUrl', `${defaultUrl}`); // 절대경로
          //     _appOptions.set('documentName', documentName || '');
          //     _appOptions.set('disablePreferences', true);
          //     _appOptions.set('scrollModeOnLoad', 0);
          //     _appOptions.set('workerSrc', `${lipsPath}/pdfjs/build/pdf.worker.js`); // 절대경로
          //     _appOptions.set('sandboxBundleSrc', `${lipsPath}/pdfjs/build/pdf.sandbox.js`); // 절대경로
          //     _appOptions.set("imageResourcesPath", `${lipsPath}/pdfjs/web/images/`); // 절대경로
          //     _appOptions.set('documentloaded', PDFJsListener.onDocumentLoaded);
          //     _appOptions.set('documentSave', PDFJsListener.onDocumentSave);
          //     _appOptions.set('pdf-annotate-render', PDFJsListener.onWebViewerAnnotateRender);
          //     _appOptions.set('pdf-annotate-thumnailRender', PDFJsListener.onWebViewerAnnotateThumnailRender);
          //     _appOptions.set('updateUi', PDFJsListener.onUpdateUi);
          //     _appOptions.set('makeUpdateEventAction', PDFJsListener.onMakeUpdateEventAction);
          //     _appOptions.set('sidebarButtonStatus', PDFJsListener.onSidebarButtonStatus);
          //     _appOptions.set('setEnable', PDFJsListener.onSetEnable);
          //     _appOptions.set('updateDescription', PDFJsListener.onUpdateDescription);
          //     _appOptions.set('setUIDisableState', PDFJsListener.onSetUIDisableState);
          //     _appOptions.set('webViewerUpdateViewarea', PDFJsListener.onWebViewerUpdateViewarea);
          //     _appOptions.set('enablePermissions', true);
          //     _appOptions.set('initPasswordDialog', PDFJsListener.onInitPasswordDialog);
          //     _appOptions.set('closeDialog', PDFJsListener.onCloseDialog);
          //     _appOptions.set('showDialog', PDFJsListener.onShowDialog);
          //     _appOptions.set('showAlertModalDialog', PDFJsListener.onShowAlertModalDialog);
          //     _appOptions.set('hideLoadingProgress', PDFJsListener.onHideLoadingProgress);
          //     _appOptions.set('showLoadingProgress', PDFJsListener.onShowLoadingProgress);
          //     _appOptions.set('rotationchanging', PDFJsListener.onRotationChanging);
          //     renderExternalAnnotations && _appOptions.set('renderExternalAnnotations', PDFJsListener.onRenderExternalAnnotations);
          //     streaming && _appOptions.set('streaming', PDFJsListener.onStreaming);
              
          //     console.log(`[import(/* webpackIgnore: true */ ${lipsPath}/pdfjs/web/viewer.js) Succeeded`);
          //   })
          //   .catch((err) => {
          //     console.log(`[import(/* webpackIgnore: true */ ${lipsPath}/pdfjs/web/viewer.js) Failed] : ${err.message}`);
          //   });

          // import(/* webpackIgnore: true */ `${lipsPath}/annotpdf.js`)
          //   .then((module) => {
          //     this.PDFAnnotateWriter = window.pdfAnnotate;

          //     console.log(`[import(/* webpackIgnore: true */ ${lipsPath}/annotpdf.js) Succeeded`);
          //   })
          //   .catch((err) => {
          //     console.log(`[import(/* webpackIgnore: true */ ${lipsPath}/annotpdf.js) Failed] : ${err.message}`);
          //   });

          // import(/* webpackIgnore: true */ `${lipsPath}/pdf-lib.js`)
          //   .then((module) => {
          //     this.PDFLib = window.PDFLib;

          //     console.log(`[import(/* webpackIgnore: true */ ${lipsPath}/pdf-lib.js) Succeeded`);
          //   })
          //   .catch((err) => {
          //     console.log(`[import(/* webpackIgnore: true */ ${lipsPath}/pdf-lib.js) Failed] : ${err.message}`);
          //   });
        })
        .catch((err) => {
          console.log(`[import(/* webpackIgnore: true */ ${lipsPath}/pdf-annotate.js) Failed] : ${err.message}`);
        });  

        // 임시 찾기 시작 / 끝 메시지 추가
        // 나주엥 리소스로 분리해야 한다.
        window.LangDefine = {
          FindendBegin : '문서의 처음까지 찾았습니다.',
          FindendEnd : '문서의 끝까지 찾았습니다.',
        };
    },
    getMainTemplate() {
      return mainHtml;
    },
    getSideTemplate() {
      return sideHtml;
    },
    /**
     * ActionManager 함수객체 반환
     * @memberof webPdfLib
     *
     * @return {ActionManager}
     */
    getActionManager() {
      return ActionManager;
    },
    /**
     * ValueGenerator 함수객체 반환
     * @memberof webPdfLib
     *
     * @return {ValueGenerator}
     */
    getValueGenerator() {
      return ValueGenerator;
    },
    /**
     * EventManager 함수객체 반환
     * @memberof webPdfLib
     *
     * @return {EventManager}
     */
    getEventManager() {
      return EventManager;
    },
    /**
     * target 개체의 속성 반환
     * @memberof webPdfLib
     * @param {Object} target - 주석 개체
     *
     * @return {Object}
     */
    getAnnotationProperties(target) {
      return AnnotationManager.getAnnotationProperties(target);
    },
    /**
     * 현재 활성화된 페이지 번호 반환
     * @memberof webPdfLib
     *
     * @return {number}
     */
    getCurrentPageNumber() {
      return AnnotationManager.currentPageNumber;
    },
    /**
     * 현재 활성화된 페이지 번호 이동
     * @memberof webPdfLib
     * @param {Number} pageNum - 페이지번호 (1페이지부터 시작)
     */
    goToPage(pageNum) {
      AnnotationManager.currentPageNumber = pageNum;
    },
    /**
     * 문서의 전체 페이지수 반환
     * @memberof webPdfLib
     * 
     * @return {number}
     */
    getTotalPageNumber() {
      return AnnotationManager.totalPage;
    },
    /**
     * 문서 타이틀 반환
     * @memberof webPdfLib
     *
     * @return {String}
     */
    getTitle() {
      return AnnotationManager.documentTitle;
    },
    /**
     * 페이지 썸네일 생성
     * @memberof webPdfLib
     * @param {Number} pageNum - 페이지번호 (1페이지부터 시작)
     */
    renderThumnail(pageNum) {
      const pdfThumbnailViewer = PDFViewerApplication.pdfThumbnailViewer;
      const thumbView = pdfThumbnailViewer.getThumbnail(
        pageNum - 1
      );
      
      if (!thumbView.pdfPage) {
        pdfThumbnailViewer.pdfDocument.getPage(thumbView.id).then((pdfPage) => {
          thumbView.setPdfPage(pdfPage);
          pdfThumbnailViewer.renderingQueue.renderView(thumbView);
        });
      } else {
        pdfThumbnailViewer.renderingQueue.renderView(thumbView);
      }
    },
    /**
     * 컨텍스트 경로 반환
     * @memberof webPdfLib
     */
    getContextpath() {
      return this.contextPath;
    },
    /**
     * 메모 작성자 반환
     * @memberof webPdfLib
     */
    getAuthorName() { 
      return AnnotationManager.author;
    },
    /**
     * 메모 작성자 설정
     * @memberof webPdfLib
     * @param {String} author - 작성자
     */
    setAuthorName(author) {
      AnnotationManager.author = author;
    }
  };
})();
