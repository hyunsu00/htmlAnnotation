// pdfjsListener.js
import Util from '../utils/util.js';
import AnnotationManager from '../annotation/annotationManager.js';
import AnnotationUtils from '../annotation/annotationUtils.js';
import annotationLib from '../annotationLib.js';
import EVENT_ID from "../define/eventDefines.js";
import EventManager from '../event/eventManager.js';
import UiManager from '../uiFrame/uiManager.js';

export default (function () {
  return {
    async onDocumentLoaded() {
      /*      
            UiManager.setEnableAnnotate(!Util.isViewMode());
            UiManager.setEnablePrint(true);
      */
      AnnotationManager.modified = false;
      /*
            if (Util.IsMavenMode()) {
              annotationLib.PDFViewerApplication.pdfViewer.mavenModeState = true;
            }
      */
      // low data를 얻어온다.
      let data = await annotationLib.PDFViewerApplication.pdfDocument.getData();
      const _appOptions = window.PDFViewerApplicationOptions;
      if (_appOptions && _appOptions.get("renderExternalAnnotations")) {
        try {
          data = await AnnotationManager.removeAnnotations(data);
        } catch (e) {
          console.log('Error when removeAnnotations : ' + e);
        }
      }
      AnnotationManager.documentData = data;
      console.log('pdfjsListener.onDocumentLoaded() - data.length = ', data.length);
      setTimeout(() => {
        EventManager.dispatch(EVENT_ID.DOCUMENT_LOADED, {});
      }, 1000);
      console.log('End pdfjsListener.onDocumentLoaded()');
    },
    onWebViewerAnnotateRender({ parentNode, canvasWrapper, id, pdfPage, scale }) {
      const docId = annotationLib.PDFViewerApplication.baseUrl;
      AnnotationManager.render(docId, parentNode, canvasWrapper, id, pdfPage, scale);
    },
    onWebViewerAnnotateThumnailRender({ pageNumber }) {
      AnnotationManager.renderThumnail(pageNumber);
    },
    onRenderExternalAnnotations(annotations, pageIndex) {
      console.log('Begin pdfjsListener.onRenderExternalAnnotations(annotations)');
      AnnotationManager.renderExternalAnnotations(annotations, pageIndex);
      console.log('End pdfjsListener.onRenderExternalAnnotations(annotations)');
    },
    async onStreaming({ file }) {
      try {
        const contextPath = annotationLib.getContextpath();
        console.log('Begin pdfjsListener.onStreaming(contextPath = ', contextPath, 'url = ', file, ')');
        if (Util.isRelativePath(file)) {
          const removeTrailingSlash = (path) => {
            return path.endsWith('/') ? path.slice(0, -1) : path;
          }
          // base64 인코딩
          const pathParm = Util.utf8ToBase64(file);
          const url = removeTrailingSlash(contextPath) + `/stream?path=${encodeURIComponent(pathParm)}`;
          // HEAD 요청 실패 처리
          const response = await fetch(url, { method: 'HEAD' });
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const contentLength = parseInt(response.headers.get('Content-Length'), 10);
          if (contentLength <= 0) {
            throw new Error('Invalid contentLength');
          }

          const args = Object.create(null);
          args.disableStream = true;
          args.length = contentLength;
          args.rangeChunkSize = 1024 * 64;
          if (contentLength > 1024 * 1024 * 10) {
            args.rangeChunkSize = 1024 * 512;
          }
          else if (contentLength > 1024 * 1024 * 5) {
            args.rangeChunkSize = 1024 * 512;
          }
          else if (contentLength > 1024 * 1024 * 3) {
            args.rangeChunkSize = 1024 * 384;
          }
          else if (contentLength > 1024 * 1024 * 2) {
            args.rangeChunkSize = 1024 * 256;
          }
          else if (contentLength > 1024 * 1024 * 1) {
            args.rangeChunkSize = 1024 * 128;
          }
          else if (contentLength < 1024 * 128) {
            args.rangeChunkSize = Math.floor(contentLength / 3);
          }
          else {
            if (contentLength <= 2 * args.rangeChunkSize) {
              args.rangeChunkSize = Math.floor(contentLength / 3);
            }
          }
          annotationLib.PDFViewerApplication.open(url, args);
          annotationLib.PDFViewerApplication.setTitleUsingUrl(file);
        } else {
          console.log('Since it is not a streaming file, the document opens by default.');
          annotationLib.PDFViewerApplication.open(file);
        }
        console.log('End pdfjsListener.onStreaming(url = ', file, ')');
      } catch (error) {
        console.error('Error onStreaming:', error);
        EventManager.dispatch(EVENT_ID.ERROR, { errType: 'ERR_ON_STREAMING' });
      }
    },
    onDocumentSave() {
      const docId = annotationLib.PDFViewerApplication.baseUrl;
      AnnotationManager.save(docId, annotationLib.PDFViewerApplication.pdfDocument, false);
    },

    // 다이얼로그
    onInitPasswordDialog() {
      /*      
            let uiUpdateAction = EventActionGenerator.makeUpdateEventAction('e_dialog_password', { file_password: '' });
            EventActionGenerator.addFocusProperty(uiUpdateAction, 'file_password');
            $.publish('/ui/update', uiUpdateAction);
      */
      EventManager.dispatch(EVENT_ID.PASSWORD, { state: 'failed' });
    },

    // 1. 문서오픈시 패스워드 문서를 열경우 호출됨 ==> 다이얼로드 호출
    onShowDialog({ eventType, widgetName, value, dialogName, updateValues, focusName }) {
      /*
            let pubAction = EventActionGenerator.makeEventActionObj('update', eventType, widgetName, value);
            pubAction = EventActionGenerator.addEventAction(pubAction, EventActionGenerator.makeUpdateEventAction(dialogName, updateValues));
            pubAction = EventActionGenerator.addFocusProperty(pubAction, focusName);
            $.publish('/ui/update', pubAction);
      */
      //
      switch (value) {
        case 'dialog_password': // 패스워드 다이얼로그
          EventManager.dispatch(EVENT_ID.PASSWORD, { state: 'open' });
          break;
        case 'dialog_find_replace': // 찾기 다이얼로그
          break;
      }
    },

    onShowAlertModalDialog({ eventType, widgetName, dialogName, value }) {
      /*     
            let pubAction = EventActionGenerator.makeEventActionObj('update', eventType, widgetName, dialogName);
      
            UiController.setValuesToMsgDialog(dialogName, value.cmd, value.title, value.message, false);
      
            pubAction = EventActionGenerator.addEventAction(EventActionGenerator.makeEventActionObj('update', UiDefine.EVENT_ACTION_TYPE.HIDDEN, UiDefine.EVENT_ACTION_NAMES.E_DIALOG_ALERT, { execute: 'confirm' }), pubAction);
      
            $.publish('/ui/update', pubAction);
       */
    },

    // 1. 문서오픈시 패스워드 문서를 성공적으로 오픈시 호출됨
    onCloseDialog() {
      /*      
            UiController.closeDialog();
      */
      EventManager.dispatch(EVENT_ID.PASSWORD, { state: 'succeeded' });
    },

    onUpdateUi({ eventType, widgetName, value }) {
      /*     
            UiController.updateUi(EventActionGenerator.makeEventActionObj('update', eventType, widgetName, value));
      */
      switch (widgetName) {
        case 'description':
          {
            EventManager.dispatch(EVENT_ID.DOCUMENT_SUMMARY, { value });
            annotationLib.PDFViewerApplication.pdfDocumentProperties.close();
          }
          break;
        case 'page_number':
        case 'renderThumnail':
        default:
          EventManager.dispatch(EVENT_ID.UPDATE_UI, { name: widgetName, value });
          break;
      }
    },

    onMakeUpdateEventAction({ widgetName, value }) {
      /*     
            // 손도구 / 선택 선택시 주석 입력 활성/비활성화 처리
            if (!Util.isViewMode() && (widgetName == 't_hand' || widgetName == 't_select') && value == 'on') {
              UiManager.setEnableAnnotate(widgetName === 't_hand' ? false : true);
            }
      
            let pubAction = EventActionGenerator.makeUpdateEventAction(widgetName, value);
            $.publish('/ui/update', pubAction);
       */
    },
    onSidebarButtonStatus({ widgetName, value }) {
      /*      
            UiController.setSidebarButtonOn(widgetName, value);
      */
    },
    onSetEnable({ widgetName, value }) {
      /*      
            UiController.setEnable(widgetName, value);
      */
    },
    onUpdateDescription({ value }) {
      /*     
            UiController._updateDescription(value);
      */
    },
    onSetUIDisableState({ value }) {
      /*      
            UiManager.onSetStyleBarDisableState(value);
            UiManager.onSetAnnotationSidebarEnable(value);
            UiManager.setPopupEditing(true);
      */
    },
    onWebViewerUpdateViewarea() {
      /*      
            UiController.hideQuickMenu();
            UiController.hideTool(UiDefine.TOOL_ANNOTATION_MENU);
      */
    },
    onHideLoadingProgress() {
      UiManager.hideLoadingProgress();
    },
    onShowLoadingProgress() {
      UiManager.showLoadingProgress();
    },
    onRotationChanging(e) {
      console.log('call pdfjsListener.onRotationChanging(e = ', e, ')');
    },
  };
})();
