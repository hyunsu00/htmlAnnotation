// annotationLib.js
import AnnotationManager from './annotation/annotationManager.js';
import UndoRedoManager from './undoRedo/UndoRedoManager.js';
//
import './annotationLib.scss';
import ACTION_ID from "./define/actionDefines.js";
import EVENT_ID from './define/eventDefines.js';
import {
  ZOOM_VALUE, FIND_TYPE, DRAW_TYPE, CURSOR_TYPE, LINE_STYLE, COLOR_TYPE, SCROLL_MODE, SPREAD_MODE
} from './define/valueDefines.js';
import ActionManager from './action/actionManager.js';
import EventManager from './event/eventManager.js';
import ValueGenerator from './action/valueGenerator.js';
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
 * @class annotationLib
 */
export default (function () {
  let contextPath = '';

  return {
    initialize({
      lipsPath = '',
      defaultUrl = '',
      contextPath = '/hdv/view',
      annotationUrl = '',
    } = {}) {
      console.log(`[annotationLib.initialize({lipsPath = ${lipsPath}, defaultUrl = ${defaultUrl}, contextPath = ${contextPath}, annotationUrl : ${annotationUrl}})]`);

      this.contextPath = contextPath;

      window.localStorage.removeItem(`${defaultUrl}/annotations`);
      if (annotationUrl) {
        AnnotationUtils.getAnnotationsByUrl(annotationUrl).then((kcnetAnnotations) => {
          if (kcnetAnnotations) {
            const annotations = AnnotationUtils.importAnnotations(kcnetAnnotations);
            window.localStorage.setItem(`${defaultUrl}/annotations`, JSON.stringify(annotations));
          }
        });
      }

      import(/* webpackIgnore: true */ `${lipsPath}/pdf-annotate.js`)
        .then((module) => {
          this.PDFAnnotateRender = window.PDFAnnotate['default'];
          AnnotationManager.initialize(this.PDFAnnotateRender);
          console.log(`[import(/* webpackIgnore: true */ ${lipsPath}/pdf-annotate.js) Succeeded`);
          this.gUndoRedoManager = new UndoRedoManager(defaultUrl);
        })
        .catch((err) => {
          console.log(`[import(/* webpackIgnore: true */ ${lipsPath}/pdf-annotate.js) Failed] : ${err.message}`);
        });  

        // 임시 찾기 시작 / 끝 메시지 추가
        // 나중에 리소스로 분리해야 한다.
        window.LangDefine = {
          FindendBegin : '문서의 처음까지 찾았습니다.',
          FindendEnd : '문서의 끝까지 찾았습니다.',
        };
    },
    /**
     * ActionManager 함수객체 반환
     * @memberof annotationLib
     *
     * @return {ActionManager}
     */
    getActionManager() {
      return ActionManager;
    },
    /**
     * ValueGenerator 함수객체 반환
     * @memberof annotationLib
     *
     * @return {ValueGenerator}
     */
    getValueGenerator() {
      return ValueGenerator;
    },
    /**
     * EventManager 함수객체 반환
     * @memberof annotationLib
     *
     * @return {EventManager}
     */
    getEventManager() {
      return EventManager;
    },
    /**
     * AnnotationManager 함수객체 반환
     * @memberof annotationLib
     *
     * @return {AnnotationManager}
     */
    getAnnotationManager() {
      return AnnotationManager;
    },
    /**
     * target 개체의 속성 반환
     * @memberof annotationLib
     * @param {Object} target - 주석 개체
     *
     * @return {Object}
     */
    getAnnotationProperties(target) {
      return AnnotationManager.getAnnotationProperties(target);
    },
    /**
     * 현재 활성화된 페이지 번호 반환
     * @memberof annotationLib
     *
     * @return {number}
     */
    getCurrentPageNumber() {
      return AnnotationManager.currentPageNumber;
    },
    /**
     * 현재 활성화된 페이지 번호 이동
     * @memberof annotationLib
     * @param {Number} pageNum - 페이지번호 (1페이지부터 시작)
     */
    goToPage(pageNum) {
      AnnotationManager.currentPageNumber = pageNum;
    },
    /**
     * 문서의 전체 페이지수 반환
     * @memberof annotationLib
     * 
     * @return {number}
     */
    getTotalPageNumber() {
      return AnnotationManager.totalPage;
    },
    /**
     * 문서 타이틀 반환
     * @memberof annotationLib
     *
     * @return {String}
     */
    getTitle() {
      return AnnotationManager.documentTitle;
    },
    /**
     * 페이지 썸네일 생성
     * @memberof annotationLib
     * @param {Number} pageNum - 페이지번호 (1페이지부터 시작)
     */
    renderThumnail(pageNum) {
      // const pdfThumbnailViewer = PDFViewerApplication.pdfThumbnailViewer;
      // const thumbView = pdfThumbnailViewer.getThumbnail(
      //   pageNum - 1
      // );
      
      // if (!thumbView.pdfPage) {
      //   pdfThumbnailViewer.pdfDocument.getPage(thumbView.id).then((pdfPage) => {
      //     thumbView.setPdfPage(pdfPage);
      //     pdfThumbnailViewer.renderingQueue.renderView(thumbView);
      //   });
      // } else {
      //   pdfThumbnailViewer.renderingQueue.renderView(thumbView);
      // }
      console.warn(`[TODO] : annotationLib.renderThumnail(pageNum) 구현 필요`);
    },
    /**
     * 컨텍스트 경로 반환
     * @memberof annotationLib
     */
    getContextpath() {
      return this.contextPath;
    },
    /**
     * 메모 작성자 반환
     * @memberof annotationLib
     */
    getAuthorName() { 
      return AnnotationManager.author;
    },
    /**
     * 메모 작성자 설정
     * @memberof annotationLib
     * @param {String} author - 작성자
     */
    setAuthorName(author) {
      AnnotationManager.author = author;
    }
  };
})();
