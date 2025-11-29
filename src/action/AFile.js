import annotationLib from '../annotationLib.js';
import AnnotationManager from '../annotation/annotationManager.js';
import EVENT_ID from '../define/eventDefines.js';
import EventManager from '../event/eventManager.js';
import AnnotationUtils from '../annotation/annotationUtils.js';
import Util from '../utils/util.js';

/**
 * @category Action
 * @class File 액션 클래스.
 */
export default class AFile {
  /**
   * ACTION_ID.SAVE 액션시 호출되는 함수
   * @param {boolean} force - 강제저장여부
   */
  static async d_save(force) {
    console.group(`function save(force)`);
    await AnnotationManager.save(annotationLib.PDFViewerApplication.baseUrl, annotationLib.PDFViewerApplication.pdfDocument, force);
    console.groupEnd();
  }
  /**
   * ACTION_ID.SAVE_ANNOTATION 액션시 호출되는 함수
   * @param {boolean} force - 강제저장여부
   */
  static async d_save_annotation(force) {
    console.group(`function d_save_annotation(force)`);
    await AnnotationManager.saveAnnotation(annotationLib.PDFViewerApplication.baseUrl, force);
    console.groupEnd();
  }
  /**
   * ACTION_ID.DOWNLOAD 액션시 호출되는 함수
   * @param {String} fileName - 다운로드파일이름(optional)
   */
  static async d_download(fileName) {
    console.group(`function d_download(fileName)`);
    // annotationLib.PDFViewerApplication.toolbar.eventBus.dispatch('download', {
    //   source: annotationLib.PDFViewerApplication.toolbar,
    // });
    const url = annotationLib.PDFViewerApplication.url;
    fileName = fileName ?? Util.getPdfFilenameFromUrl(url);
    await AnnotationManager.download(annotationLib.PDFViewerApplication.baseUrl, annotationLib.PDFViewerApplication.pdfDocument, fileName);
    console.groupEnd();
  }
  /**
   * ACTION_ID.DOWNLOAD_ANNOTATION 액션시 호출되는 함수
   * @param {String} fileName - 다운로드파일이름(optional)
   */
  static async d_download_annotation(fileName) {
    console.group(`function d_download_annotation(fileName)`);
    const url = annotationLib.PDFViewerApplication.url;
    fileName = fileName ?? (Util.getPdfFilenameFromUrl(url).slice(0, -4) + '.json');
    await AnnotationManager.downloadAnnotation(annotationLib.PDFViewerApplication.baseUrl, fileName);
    console.groupEnd();
  }
  /**
   * ACTION_ID.OPEN_FILE 액션시 호출되는 함수
   * @param {String | Uint8Array | Object} file
   * @param {String}  file.originalUrl 파일명
   * @param {String}  file.url         로컬 파일 Url
   */
  static d_open(file) {
    console.group(`static d_open(file)`);

    // 로컬파일
    // file = {
    //   originalUrl: 'alphatrans-2019.pdf'
    //   url: 'blob:http://localhost:3000/2a2a7bd8-655f-47e9-9e62-d9b23c22944b'
    // }
    // URL
    // file = `http://127.0.0.1:5500/alphatrans.pdf`;
    // 데이터
    // let binaryStr = atob(
    //   'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
    //   'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
    //   'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
    //   'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
    //   'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
    //   'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
    //   'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
    //   'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
    //   'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
    //   'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
    //   'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
    //   'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
    //   'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G');
    // file = Uint8Array.from(binaryStr, ch => ch.charCodeAt(0));

    if (file === undefined || file === null) {
      // annotationLib.PDFViewerApplication.toolbar.eventBus.dispatch('openfile', {
      //   source: annotationLib.PDFViewerApplication.toolbar,
      // });
      // 파일 입력 요소 생성
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/pdf';

      // 파일 선택 이벤트 핸들러
      input.onchange = (event) => {
        const file = event.target.files[0];
        let url = URL.createObjectURL(file);
        if (file.name) {
          url = { url, originalUrl: file.name };
        }
        window.localStorage.removeItem(`${file.name}/annotations`);
        annotationLib.PDFViewerApplication.open(url);
      };

      // 파일 선택 다이얼로그 표시
      input.click();
    } else {
      annotationLib.PDFViewerApplication.open(file);
    }

    console.groupEnd();
  }

  /**
   * ACTION_ID.OPEN_ANNOTATION 액션시 호출되는 함수
   * @param {String | Uint8Array | Object} file
   * @param {String}  file.originalUrl 파일명
   * @param {String}  file.url         로컬 파일 Url
   */
  static d_open_annotation(file) {
    console.group(`static d_open_annotation(jsonObj)`);

    // 로컬파일
    // file = {
    //   originalUrl: 'compressed.tracemonkey-pldi-09.json'
    //   url: 'blob:http://localhost:8192/3cdf46c4-caa7-4ca3-aa39-2061d42b3e56'
    // }
    // URL
    // file = `http://localhost:8192/dist/libs/pdfjs/web/compressed.tracemonkey-pldi-09.json`;
    // 데이터
    // let binaryStr = atob(
    // 	'W3sidHlwZSI6ImFyZWEiLCJmaWxsQ29sb3IiOiJub25lIiwic3Ryb2tlQ29sb3IiOiIjRkYw' +
    // 	'MDAwIiwib3BhY2l0eSI6MSwic3Ryb2tlV2lkdGgiOjEsIngiOjU0LCJ5IjoxNDgsIndpZHRo' +
    // 	'Ijo3OC42NjY2NjY2NjY2NjY2NiwiaGVpZ2h0Ijo1Ni42NjY2NjY2NjY2NjY2Niwic3Ryb2tl' +
    // 	'RGFzaGFycmF5Ijoibm9uZSIsImNsYXNzIjoiQW5ub3RhdGlvbiIsInV1aWQiOiI3Mzg4NWNk' +
    // 	'YS04ZTU1LTRjMjEtOTIwMS00ZDEwNWUxNDZlYjUiLCJwYWdlIjoxfSx7InR5cGUiOiJoaWdo' +
    // 	'bGlnaHQiLCJmaWxsQ29sb3IiOiIjRkZGRjAwIiwib3BhY2l0eSI6MC4yLCJyZWN0YW5nbGVz' +
    // 	'IjpbeyJ4Ijo4Ny45Mzc1LCJ5IjoxMzQuMDYyNSwid2lkdGgiOjc1LjU1MTk4MTYwODA3Mjkx' +
    // 	'LCJoZWlnaHQiOjE3Ljc3Nzc4MTE2ODYxOTc4Mn1dLCJjbGFzcyI6IkFubm90YXRpb24iLCJ1' +
    // 	'dWlkIjoiMmM1MTk4ZWUtOTRlZC00NWM3LWExZjQtNDE3YzJlM2QxODZlIiwicGFnZSI6Mn0s' +
    // 	'eyJ0eXBlIjoiY2lyY2xlIiwiY3giOjI0NS4xMTExMjQ2NzQ0NzkxOSwiY3kiOjE5OC42NjY2' +
    // 	'ODE5MjU0NTU3NSwiciI6NTYuODkyNzk1ODI1OTUyMTEsImZpbGxDb2xvciI6Im5vbmUiLCJv' +
    // 	'cGFjaXR5IjoxLCJzdHJva2VDb2xvciI6IiNGRjAwMDAiLCJzdHJva2VXaWR0aCI6MSwic3Ry' +
    // 	'b2tlRGFzaGFycmF5Ijoibm9uZSIsImNsYXNzIjoiQW5ub3RhdGlvbiIsInV1aWQiOiIwM2Ex' +
    // 	'ODA2MC03ZjFhLTQyOTUtODc0ZC05Y2VlYWMxZGExYjAiLCJwYWdlIjozfV0=');
    // file = Uint8Array.from(binaryStr, ch => ch.charCodeAt(0));

    if (file === undefined || file === null) {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';

      // 파일 선택 이벤트 핸들러
      input.onchange = (event) => {
        const file = event.target.files[0];
        let url = URL.createObjectURL(file);
        if (file.name) {
          url = { url, originalUrl: file.name };
        }
        AnnotationManager.openAnnotation(url);
      };

      // 파일 선택 다이얼로그 표시
      input.click();
    } else {
      AnnotationManager.openAnnotation(file);
    }
    console.groupEnd();
  }

  /**
   * ACTION_ID.PRINT 액션시 호출되는 함수
   */
  static d_print() {
    console.group(`function d_print()`);
    AnnotationManager.print(annotationLib.PDFViewerApplication.baseUrl, annotationLib.PDFViewerApplication.pdfDocument);
    console.groupEnd();
  }

  /**
   * ACTION_ID.PASSWORD 액션시 호출되는 함수
   */
  static e_dialog_password(password) {
    if (password) {
      annotationLib.PDFViewerApplication.passwordPrompt.verify(password);
    } else {
      EventManager.dispatch(EVENT_ID.PASSWORD, { state: 'failed' });
    }
  }

  /**
   * ACTION_ID.DOCUMENT_PROPERTIES 액션시 호출되는 함수
   */
  static d_info() {
    console.group(`function d_info()`);
    annotationLib.PDFViewerApplication.secondaryToolbar.eventBus.dispatch('documentproperties', {
      source: annotationLib.PDFViewerApplication.secondaryToolbar,
    });
    // console.warn(`function d_info() 다이얼로그 구현 필요`);
    console.groupEnd();
  }
}
