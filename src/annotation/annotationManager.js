// annotationManager.js
/*
import CommonFrameUtil from '../../../commonFrame/js/utils/util.js';
import EventActionGenerator from '../../../commonFrame/js/uiFramework/eventActionGenerator.js';
import UiDefine from '../../../commonFrame/js/uiFramework/uiDefine.js';
*/
/*
import UiController from '../../../commonFrame/js/uiFramework/uiController.js';


import Config from '../../common/config.js';
*/
import { PROPERTY_TYPE } from "../define/valueDefines.js";
import Util from '../utils/util.js';
import UiManager from '../uiFrame/uiManager.js';
import AnnotationListener from '../listener/annotationListener.js';
import AnnotationUtils from './annotationUtils.js';
import webPdfLib from '../webPdfLib.js';
import EVENT_ID from "../define/eventDefines.js";
import EventManager from '../event/eventManager.js';

export default (function () {
  /*******************************************************************************
   * Private Variables
   ******************************************************************************/
  let AnnotationManager = {
    get documentData() {
      return this._documentData;
    },
    set documentData(data) {
      this._documentData = data;
    },
    get textSize() {
      return this._textSize ?? this.annotateRender.calcDefaultTextSize();
    },
    set textSize(value) {
      this._textSize = value;
      const _UI = this.annotateRender?.UI;
      if (_UI) {
        _UI.setTextSize(this._textSize);
      }
    },
    get textColor() {
      return this._textColor ?? '#000000';
    },
    set textColor(value) {
      this._textColor = value;
      const _UI = this.annotateRender?.UI;
      if (_UI) {
        _UI.setTextColor(this._textColor);
      }
    },
    get textBold() {
      return this._textBold ?? 'normal';
    },
    set textBold(value) {
      this._textBold = value;
      const _UI = this.annotateRender?.UI;
      if (_UI) {
        _UI.setTextBold(this._textBold);
      }
    },
    get textItalic() {
      return this._textItalic ?? 'normal';
    },
    set textItalic(value) {
      this._textItalic = value;
      const _UI = this.annotateRender?.UI;
      if (_UI) {
        _UI.seTextItalic(this._textItalic);
      }
    },
    get textUnderline() {
      return this._textUnderline ?? false;
    },
    set textUnderline(value) {
      this._textUnderline = value;
      const _UI = this.annotateRender?.UI;
      if (_UI) {
        _UI.seTextUnderline(this._textUnderline);
      }
    },
    get textStrikethrough() {
      return this._textStrikethrough ?? false;
    },
    set textStrikethrough(value) {
      this._textStrikethrough = value;
      const _UI = this.annotateRender?.UI;
      if (_UI) {
        _UI.seTextStrikethrough(this._textStrikethrough);
      }
    },

    get lineWidth() {
      return this._lineWidth ?? 1;
    },
    set lineWidth(value) {
      this._lineWidth = value;
      const _UI = this.annotateRender?.UI;
      if (_UI) {
        _UI.setLine(this._lineWidth, this._lineColor ?? '#FF0000');
      }
    },
    get lineColor() {
      return this._lineColor ?? '#FF0000';
    },
    set lineColor(value) {
      this._lineColor = value;
      const _UI = this.annotateRender?.UI;
      if (_UI) {
        _UI.seText(this._lineWidth ?? 1, this._lineColor);
      }
    },
    get author() {
      return this._author ?? 'Guest';
    },
    set author(value) {
      this._author = value;
      const _UI = this.annotateRender?.UI;
      if (_UI) {
        _UI.setAuthorName(value);
      }
    },
    get modified() {
      return this._modified ?? false;
    },
    set modified(value) {
      this._modified = value;

      var isEnableModifyAnnotation = this._modified;
      if (typeof webPdfLib.PDFViewerApplication != 'undefined' && !webPdfLib.PDFViewerApplication.pdfViewer.enableModifyAnnotation) {
        isEnableModifyAnnotation = false;
      }

      var isEnable = isEnableModifyAnnotation ? 'enable' : 'disable';
      /*      
            UiManager.setEventAction(isEnable, UiDefine.EVENT_ACTION_NAMES.D_SAVE);
      */
    },
    get currentScaleValue() {
      return webPdfLib.PDFViewerApplication.pdfViewer.currentScaleValue;
    },
    set currentScaleValue(value) {
      webPdfLib.PDFViewerApplication.pdfViewer.currentScaleValue = value;
    },
    get totalPage() {
      return webPdfLib.PDFViewerApplication.pdfViewer.pagesCount;
    },
    get currentPageNumber() {
      return webPdfLib.PDFViewerApplication.pdfViewer.currentPageNumber;
    },
    set currentPageNumber(value) {
      webPdfLib.PDFViewerApplication.pdfViewer.currentPageNumber = value;
    },
    get documentTitle() {
      return window.document.title;
    },

    _UpdateProperty(properties, adjustTarget) {
      if (properties.fillColor != null) {
        adjustTarget.fillColor = properties.fillColor;
      }
      if (properties.opacity != null) {
        adjustTarget.opacity = properties.opacity;
      }
      if (properties.strokeColor != null) {
        adjustTarget.strokeColor = properties.strokeColor;
      }
      if (properties.strokeWidth != null) {
        adjustTarget.strokeWidth = properties.strokeWidth;
      }
      if (properties.x != null) {
        adjustTarget.x = properties.x;
      }
      if (properties.y != null) {
        adjustTarget.y = properties.y;
      }
      if (properties.width != null) {
        adjustTarget.width = properties.width;
      }
      if (properties.height != null) {
        adjustTarget.height = properties.height;
      }
      if (properties.strokeDashArray != null) {
        adjustTarget.strokeDasharray = properties.strokeDashArray;
      }
      if (properties.fontWeight != null) {
        adjustTarget.fontWeight = properties.fontWeight;
      }
      if (properties.fontStyle != null) {
        adjustTarget.fontStyle = properties.fontStyle;
      }
      if (properties.textDecoration != null) {
        if (properties.textDecoration === 'normal') {
          adjustTarget.textDecoration.linethrough = false;
          adjustTarget.textDecoration.underline = false;
        } else {
          adjustTarget.textDecoration.underline = properties.textDecoration.includes('underline') ? true : false;
          adjustTarget.textDecoration.linethrough = properties.textDecoration.includes('line-through') ? true : false;
        }
      }
      if (properties.fontSize != null) {
        adjustTarget.fontSize = properties.fontSize;
      }
      if (properties.fontColor != null) {
        adjustTarget.fontColor = properties.fontColor;
      }
      if (properties.bbox) {
        adjustTarget.bbox = properties.bbox;
      }
      if (properties.imageUrl) {
        adjustTarget.imageUrl = properties.imageUrl;
      }
    },
  };
  Object.defineProperty(AnnotationManager, 'penSize', {
    get() {
      return this._penSize ?? 1;
    },
    set(value) {
      this._penSize = value;
      const _UI = this.annotateRender.UI;
      _UI.setPen(this._penSize, this._penColor ?? '#000000');
    },
  });
  Object.defineProperty(AnnotationManager, 'penColor', {
    get() {
      return this._penColor ?? '#FF0000';
    },
    set(value) {
      this._penColor = value;
      const _UI = this.annotateRender.UI;
      _UI.setPen(this._penSize ?? 1, this._penColor);
    },
  });

  let _ignoreSelectionchange = false;
  AnnotationManager.initialize = function (annotateRender) {
    const viewerContainer = document.querySelector('#viewerContainer');
    if (viewerContainer) {
      viewerContainer.addEventListener('mouseup', (e) => {
        const posInfo = { x: e.clientX, y: e.clientY };
        const selection = document.getSelection();
        UiManager.setSelection(selection);
        const range = UiManager.getRange();
        if (range && !range.collapsed) {
          EventManager.dispatch(EVENT_ID.QUICK_MENU, { posInfo, range });
        }
        _ignoreSelectionchange = true;
      });

      document.addEventListener('selectionchange', (e) => {

        console.log('call AnnotationManager::selectionchange(e = ', e, ')');

        if (!_ignoreSelectionchange) {
          const selection = document.getSelection();
          UiManager.setSelection(selection);
        }
        _ignoreSelectionchange = false;

      }, false);
      document.addEventListener('keydown', this.doKeyDownEvent.bind(this));
    }

    annotateRender.setStoreAdapter(new annotateRender.LocalStoreAdapter());
    this.annotateRender = annotateRender;

    // 이벤트 리스너 등록
    const _UI = this.annotateRender.UI;
    {
      // pdf-annotate.js에 미리 등록된 이벤트
      // 사용할 일이 없으면 이벤트 리스터 등록 삭제하기
      _UI.addEventListener('annotation:add', AnnotationListener.onAnnotationAdd);
      _UI.addEventListener('annotation:edit', AnnotationListener.onAnnotationEdit);
      _UI.addEventListener('annotation:delete', AnnotationListener.onAnnotationDelete);
      _UI.addEventListener('comment:add', AnnotationListener.onCommentAdd);
      _UI.addEventListener('comment:delete', AnnotationListener.onCommentDelete);
    }

    {
      // pdf-annotate.js에 추가된 이벤트
      _UI.addEventListener('annotation:updated', AnnotationListener.onAnnotationUpdated);

      _UI.addEventListener('annotation:selected', AnnotationListener.onAnnotationSelected);
      _UI.addEventListener('annotation:unSelected', AnnotationListener.onAnnotationUnSelected);

      _UI.addEventListener('annotation:addForm', AnnotationListener.onAnnotationAddForm);
      _UI.addEventListener('annotation:addChildForm', AnnotationListener.onAnnotationAddChildForm);
      _UI.addEventListener('annotation:modifyForm', AnnotationListener.onAnnotationModifyForm);
      _UI.addEventListener('annotation:removeForm', AnnotationListener.onAnnotationRemoveForm);
      _UI.addEventListener('annotation:modifyComment', AnnotationListener.onAnnotationModifyComment);
      _UI.addEventListener('annotation:addComment', AnnotationListener.onAnnotationAddComment);

      _UI.addEventListener('annotation:setStyleBarDisableState', AnnotationListener.onSetStyleBarDisableState);
      _UI.addEventListener('annotation:setAnnotationSidebarEnable', AnnotationListener.onSetAnnotationSidebarEnable);
      _UI.addEventListener('annotation:setUIEvents', AnnotationListener.onSetUIEvents);
      _UI.addEventListener('annotation:setPopupEditingState', AnnotationListener.onSetPopupEditingState);
      _UI.addEventListener('annotation:setEventAction', AnnotationListener.onSetEventAction);
    }

    window.addEventListener('message', this.onSwitchUI.bind(this), false);

    // 텍스트, 펜, 선 설정
    _UI.setTextSize(this.textSize);
    _UI.setTextColor(this.textColor);
    _UI.setTextBold(this.textBold);
    _UI.setTextItalic(this.textItalic);
    _UI.setTextUnderline(this.textUnderline);
    _UI.setTextStrikethrough(this.textStrikethrough);

    _UI.setPen(this.penSize, this.penColor);
    _UI.setLine(this.lineWidth, this.lineColor);
    _UI.setAuthorName(this.author);

    // 초기화시 edit모드로 설정한다.
    this.switchUI('cursor');
  };

  AnnotationManager.render = function (docId, parentNode, canvasWrapper, pageId, pdfPage, scale) {
    let temp_div = document.createElement('div');
    temp_div.innerHTML = '<svg class="annotationLayer"></svg>';
    let svg = temp_div.firstChild;

    let textLayer = parentNode.querySelector('div.textLayer');
    if (textLayer) {
      textLayer.before(svg);
    } else {
      parentNode.appendChild(svg);
    }

    // svg 렌더링
    const rotation = webPdfLib.PDFViewerApplication.pdfViewer.pagesRotation;
    const viewport = pdfPage.getViewport({ scale: scale, rotation: rotation });
    // const viewport = pdfPage.getViewport({ scale: scale });
    svg.setAttribute('width', viewport.width);
    svg.setAttribute('height', viewport.height);
    svg.style.width = canvasWrapper.style.width;
    svg.style.height = canvasWrapper.style.height;

    let annotateRender = this.annotateRender;
    let annotationManager = this;
    annotateRender.getAnnotations(docId, pageId).then(function (annotations) {
      annotateRender.render(svg, viewport, annotations);
      // ID는 자료형이 다르더라도 값이 같으면 같은 것으로 비교한다.
      // 1 == "1" 은 true
      if (pageId == annotateRender.UI.getSelectPageID()) {
        annotationManager.select(annotationManager.getSelect());
      }
    });
  };

  AnnotationManager.changeCursor = function (annotationType) {
    let viewer = document.querySelector('#viewer');

    switch (annotationType) {
      case 'area':
      case 'circle':
      case 'draw':
      case 'line':
      case 'point':
      case 'text':
        viewer.setAttribute('style', 'cursor: crosshair');
        break;
      case 'strikeout':
      case 'highlight':
      case 'underline':
        viewer.setAttribute('style', 'cursor: text');
        break;
      default:
        viewer.setAttribute('style', 'cursor: default');
        break;
    }
  };

  AnnotationManager.switchUI = function (annotationType) {
    this.changeCursor(annotationType);
    window.postMessage({ annotationType });
  };

  AnnotationManager.onSwitchUI = function (event) {
    this.disableUI(this.annotationType);
    this.enableUI(event.data.annotationType);
    this.annotationType = event.data.annotationType;
  };

  AnnotationManager.onSetStyleBarDisableState = function (value) {
    /*    
        UiManager.onSetStyleBarDisableState(value);
    */
  };

  AnnotationManager.onSetAnnotationSidebarEnable = function (value) {
    /*    
        UiManager.onSetAnnotationSidebarEnable(value);
    */
  };

  AnnotationManager.initStylebar = function () {
    const _UI = this.annotateRender.UI;
    _UI.setTextSize(this.textSize);
    _UI.setTextColor(this.textColor);
    _UI.setTextBold(this.textBold);
    _UI.setTextItalic(this.textItalic);
    _UI.setTextUnderline(this.textUnderline);
    _UI.setTextStrikethrough(this.textStrikethrough);
  };

  AnnotationManager.execCommand = function (cmdType, cmdValue, target) {
    const _UI = this.annotateRender.UI;
    let currentTarget = target ? target : this.getSelect();
    let docId, pageId, annotationId, annotateType;
    if (currentTarget) {
      docId = currentTarget.parentNode.getAttribute('data-pdf-annotate-document');
      pageId = currentTarget.parentNode.getAttribute('data-pdf-annotate-page');
      annotationId = currentTarget.getAttribute('data-pdf-annotate-id');
      annotateType = currentTarget.getAttribute('data-pdf-annotate-type');
    }

    let properties = {
      type: annotateType,
      x: null,
      y: null,
      width: null,
      height: null,
      fillColor: null,
      opacity: null,
      strokeColor: null,
      strokeWidth: null,
      strokeDashArray: null,
      fontColor: null,
      fontSize: null,
      fontFamily: null,
      fontStyle: null,
      fontWeight: null,
      textDecoration: null,
      imageUrl: null,
    };

    if (cmdType == PROPERTY_TYPE.sFill) {
      if (cmdValue.color) {
        //fill color
        if (cmdValue.color === 'noFill' || cmdValue.color === 'transparent') {
          cmdValue.color = 'none';
        }

        if (properties.type === 'point') {
          let svgTag = currentTarget.querySelector('#Combined-Shape');
          svgTag.setAttribute('fill', cmdValue.color);
        } else {
          currentTarget.setAttribute('fill', cmdValue.color);
        }

        properties.fillColor = cmdValue.color;
      } else {
        //opacity
        let opacity = cmdValue.opacity / 100;

        if (properties.type === 'point') {
          let svgTag = currentTarget.querySelector('#Combined-Shape');
          svgTag.setAttribute('opacity', opacity);
        } else {
          currentTarget.setAttribute('opacity', opacity);
        }

        properties.opacity = opacity;
      }
    } else if (cmdType == PROPERTY_TYPE.sLineFill) {
      //line
      if (cmdValue.color) {
        //line color
        if (cmdValue.color === 'noFill') {
          cmdValue.color = 'none';
        }

        if (properties.type === 'point') {
          let svgTag = currentTarget.querySelector('#icon_sticker_0615');
          svgTag.setAttribute('stroke', cmdValue.color);
        } else {
          currentTarget.setAttribute('stroke', cmdValue.color);
        }

        properties.strokeColor = cmdValue.color;
      } else {
        //line opacity
        let opacity = cmdValue.opacity / 100;

        if (properties.type === 'point') {
          let svgTag = currentTarget.querySelector('#icon_sticker_0615');
          svgTag.setAttribute('opacity', opacity);
        } else {
          currentTarget.setAttribute('opacity', opacity);
        }

        properties.opacity = opacity;
      }
    } else if (cmdType == PROPERTY_TYPE.sLineWidth) {
      if (properties.type === 'point') {
        let svgTag = currentTarget.querySelector('#icon_sticker_0615');
        svgTag.setAttribute('stroke-width', cmdValue.borderWidth);
      } else {
        currentTarget.setAttribute('stroke-width', cmdValue.borderWidth);
      }

      properties.strokeWidth = cmdValue.borderWidth;
    } else if (cmdType == PROPERTY_TYPE.sLineStyle) {
      let dashed = 'none';
      if (cmdValue.borderStyleDashed === 'dashed_5_15') {
        dashed = '5,15';
      } else if (cmdValue.borderStyleDashed === 'dashed_10_10') {
        dashed = '10,10';
      } else if (cmdValue.borderStyleDashed === 'dashed_40_20') {
        dashed = '40,20';
      } else if (cmdValue.borderStyleDashed === 'dashed_40_20_20_20') {
        dashed = '40,20,20,20';
      } else if (cmdValue.borderStyleDashed === 'dashed_80_20') {
        dashed = '80,20';
      } else if (cmdValue.borderStyleDashed === 'dashed_80_20_20_20') {
        dashed = '80,20,20,20';
      } else if (cmdValue.borderStyleDashed === 'dashed_80_20_20_20_20_20') {
        dashed = '80,20,20,20,20,20';
      }

      if (properties.type === 'point') {
        let svgTag = currentTarget.querySelector('#icon_sticker_0615');
        svgTag.setAttribute('stroke-dasharray', dashed);
      } else {
        currentTarget.setAttribute('stroke-dasharray', dashed);
      }

      properties.strokeDashArray = dashed;
    } else if (cmdType == PROPERTY_TYPE.sSize) {
      if (cmdValue.width) {
        //width
        currentTarget.setAttribute('width', cmdValue.width);
        properties.width = cmdValue.width;
      }
      if (cmdValue.height) {
        //height
        currentTarget.setAttribute('height', cmdValue.height);
        properties.height = cmdValue.height;
      }
    } else if (cmdType == PROPERTY_TYPE.sPosition) {
      if (cmdValue.x) {
        //x
        currentTarget.setAttribute('x', cmdValue.x);
        properties.x = cmdValue.x;
      }
      if (cmdValue.y) {
        //y
        currentTarget.setAttribute('y', cmdValue.y);
        properties.y = cmdValue.y;
      }
    } else if (cmdType == PROPERTY_TYPE.bold) {
      let value;
      if (cmdValue === 'on') {
        value = 'bold';
      } else {
        value = 'normal';
      }
      _UI.setTextBold(value);

      if (currentTarget) {
        let image = currentTarget.querySelector('image');

        const aText = AnnotationUtils.getAnnotation(docId, annotationId);
        aText.fontWeight = value;
        const { imageUrl } = AnnotationUtils.createAnnotationContentImage(pageId, aText);

        {
          // 이미지 엘리먼트 속성 설정
          image.setAttribute('width', aText.width);
          image.setAttribute('height', aText.height);
          image.setAttribute('href', imageUrl);

          properties.fontWeight = aText.fontWeight;
          properties.width = aText.width;
          properties.height = aText.height;
          properties.imageUrl = imageUrl;
        }

        // 크기 변경시 셀렉션을 다시 호출
        this.select(null);
        this.select(currentTarget);
      }
    } else if (cmdType == PROPERTY_TYPE.italic) {
      let value = cmdValue === 'on' ? 'italic' : 'normal';
      _UI.setTextItalic(value);

      if (currentTarget) {
        let image = currentTarget.querySelector('image');

        const aText = AnnotationUtils.getAnnotation(docId, annotationId);
        aText.fontStyle = value;
        const { imageUrl } = AnnotationUtils.createAnnotationContentImage(pageId, aText);

        {
          // 이미지 엘리먼트 속성 설정
          image.setAttribute('width', aText.width);
          image.setAttribute('height', aText.height);
          image.setAttribute('href', imageUrl);

          properties.fontStyle = aText.fontStyle;
          properties.width = aText.width;
          properties.height = aText.height;
          properties.imageUrl = imageUrl;
        }

        // 크기 변경시 셀렉션을 다시 호출
        this.select(null);
        this.select(currentTarget);
      }
    } else if (cmdType == PROPERTY_TYPE.underline) {
      if (cmdValue === 'on') {
        _UI.setTextUnderline(true);
      } else {
        _UI.setTextUnderline(false);
      }

      if (currentTarget) {
        let image = currentTarget.querySelector('image');

        const aText = AnnotationUtils.getAnnotation(docId, annotationId);

        aText.textDecoration.underline = cmdValue === 'on' ? true : false;
        let value = aText.textDecoration.underline ? 'underline' : '';
        if (value.length === 0) {
          value += aText.textDecoration.linethrough ? 'line-through' : '';
        } else {
          value += aText.textDecoration.linethrough ? ' line-through' : '';
        }
        if (value.length === 0) {
          value = 'normal';
        }

        const { imageUrl } = AnnotationUtils.createAnnotationContentImage(pageId, aText);

        {
          // 이미지 엘리먼트 속성 설정
          image.setAttribute('width', aText.width);
          image.setAttribute('height', aText.height);
          image.setAttribute('href', imageUrl);

          properties.textDecoration = value;
          properties.width = aText.width;
          properties.height = aText.height;
          properties.imageUrl = imageUrl;
        }

        // 크기 변경시 셀렉션을 다시 호출
        this.select(null);
        this.select(currentTarget);
      }
    } else if (cmdType == PROPERTY_TYPE.strikethrough) {
      if (cmdValue === 'on') {
        _UI.setTextStrikethrough(true);
      } else {
        _UI.setTextStrikethrough(false);
      }

      if (currentTarget) {
        let image = currentTarget.querySelector('image');

        const aText = AnnotationUtils.getAnnotation(docId, annotationId);
        aText.textDecoration.linethrough = cmdValue === 'on' ? true : false;
        let value = aText.textDecoration.linethrough ? 'line-through' : '';
        if (value.length === 0) {
          value += aText.textDecoration.underline ? 'underline' : '';
        } else {
          value += aText.textDecoration.underline ? ' underline' : '';
        }
        if (value.length === 0) {
          value = 'normal';
        }

        const { imageUrl } = AnnotationUtils.createAnnotationContentImage(pageId, aText);

        {
          // 이미지 엘리먼트 속성 설정
          image.setAttribute('width', aText.width);
          image.setAttribute('height', aText.height);
          image.setAttribute('href', imageUrl);

          properties.textDecoration = value;
          properties.width = aText.width;
          properties.height = aText.height;
          properties.imageUrl = imageUrl;
        }

        // 크기 변경시 셀렉션을 다시 호출
        this.select(null);
        this.select(currentTarget);
      }
    } else if (cmdType == PROPERTY_TYPE.fontSize) {
      _UI.setTextSize(cmdValue);

      if (currentTarget) {
        let image = currentTarget.querySelector('image');

        const aText = AnnotationUtils.getAnnotation(docId, annotationId);
        aText.fontSize = cmdValue;
        const { imageUrl } = AnnotationUtils.createAnnotationContentImage(pageId, aText);

        {
          // 이미지 엘리먼트 속성 설정
          image.setAttribute('width', aText.width);
          image.setAttribute('height', aText.height);
          image.setAttribute('href', imageUrl);

          properties.fontSize = aText.fontSize;
          properties.width = aText.width;
          properties.height = aText.height;
          properties.imageUrl = imageUrl;
        }

        // 폰트 크기 변경시 셀렉션을 다시 호출
        this.select(null);
        this.select(currentTarget);
      }
    } else if (cmdType == PROPERTY_TYPE.fontColor) {
      _UI.setTextColor(cmdValue);

      if (currentTarget) {
        let image = currentTarget.querySelector('image');

        const aText = AnnotationUtils.getAnnotation(docId, annotationId);
        aText.fontColor = cmdValue;
        const { imageUrl } = AnnotationUtils.createAnnotationContentImage(pageId, aText);

        {
          // 이미지 엘리먼트 속성 설정
          image.setAttribute('width', aText.width);
          image.setAttribute('height', aText.height);
          image.setAttribute('href', imageUrl);

          properties.fontColor = aText.fontColor;
          properties.width = aText.width;
          properties.height = aText.height;
          properties.imageUrl = imageUrl;
        }

        // 폰트 크기 변경시 셀렉션을 다시 호출
        this.select(null);
        this.select(currentTarget);
      }
    }

    let adjustTarget = AnnotationUtils.getAnnotation(docId, annotationId);
    if (adjustTarget) {
      const targetId = adjustTarget.uuid;
      const undoStr = JSON.stringify(adjustTarget);
      {
        this._UpdateProperty(properties, adjustTarget);
        AnnotationUtils.updateAnnotation(docId, adjustTarget.uuid, JSON.stringify(adjustTarget));
      }
      const redoStr = JSON.stringify(adjustTarget);

      // 값이 변경되었을 경우 속성 변경 이벤트 호출
      if (undoStr !== redoStr) {
        _UI.modifyFormNode(docId, pageId, targetId, { undo: { str: undoStr }, redo: { str: redoStr } });
      }
    }
  };

  AnnotationManager.renderExternalAnnotations = async function (annotations, pageIndex) {
    if (annotations.length === 0) {
      return;
    }
    const DEFAULT_SCALE = 1.0;
    const PDF_TO_CSS_UNITS = 96.0 / 72.0;

    try {
      const docId = webPdfLib.PDFViewerApplication.baseUrl;
      const pdfDocument = webPdfLib.PDFViewerApplication.pdfDocument;
      const page = await pdfDocument.getPage(pageIndex + 1);

      const viewport = page.getViewport({ scale: DEFAULT_SCALE * PDF_TO_CSS_UNITS });
      const width = page.view[2];
      const height = page.view[3];
      const scaleX = width / viewport.width;
      const scaleY = height / viewport.height;

      const svg = document.querySelector(`svg[data-pdf-annotate-page="${pageIndex + 1}"]`);
      if (!svg) {
        return;
      }

      for (const annotation of annotations) {
        console.log(`\tannotation =`, annotation);
        const subtype = annotation.annotationType;
        switch (subtype) {
          case Util.AnnotationType.SQUARE: {
            const sizeInfo = Util.decomposeAnnotationRect(annotation.rect[0], annotation.rect[1], annotation.rect[2], annotation.rect[3], height, scaleX, scaleY);
            const fillColor = annotation.fillColor || null;
            const strokeColor = annotation.color || null;

            var scaledArray;
            if (annotation.borderStyle.dashArray.length > 1) {
              scaledArray = Array.from(annotation.borderStyle.dashArray, (v) => v / scaleX);
            } else {
              scaledArray = 'none';
            }

            let areaAnnotation = {
              type: 'area',
              creationDate: annotation.creationDate,
              modificationDate: annotation.modificationDate,
              hasPopup: annotation.hasPopup,
              titleObj: annotation.titleObj.str,
              contentsObj: annotation.contentsObj.str,
              x: sizeInfo.x,
              y: sizeInfo.y,
              width: sizeInfo.width,
              height: sizeInfo.height,
              fillColor: fillColor === null ? 'none' : Util.makeHexColor(fillColor[0], fillColor[1], fillColor[2]),
              strokeColor: strokeColor === null ? 'none' : Util.makeHexColor(strokeColor[0], strokeColor[1], strokeColor[2]),
              opacity: annotation.strokeAlpha,
              strokeWidth: annotation.borderStyle.width / scaleX,
              strokeDasharray: scaledArray.toString(),
            };

            await AnnotationManager.annotateRender.getStoreAdapter().addAnnotation(docId, pageIndex + 1, areaAnnotation);
            AnnotationUtils.addAnnotationNode(svg, areaAnnotation);

            break;
          }
          case Util.AnnotationType.CIRCLE: {
            const sizeInfo = Util.decomposeAnnotationCircle(annotation.rect[0], annotation.rect[1], annotation.rect[2], annotation.rect[3], height, scaleX, scaleY);
            const fillColor = annotation.fillColor || null;
            const strokeColor = annotation.color || null;

            var scaledArray;
            if (annotation.borderStyle.dashArray.length > 1) {
              scaledArray = Array.from(annotation.borderStyle.dashArray, (v) => v / scaleX);
            } else {
              scaledArray = 'none';
            }

            let circleAnnotation = {
              type: 'circle',
              creationDate: annotation.creationDate,
              modificationDate: annotation.modificationDate,
              hasPopup: annotation.hasPopup,
              titleObj: annotation.titleObj.str,
              contentsObj: annotation.contentsObj.str,
              cx: sizeInfo.cx,
              cy: sizeInfo.cy,
              r: sizeInfo.r,
              fillColor: fillColor === null ? 'none' : Util.makeHexColor(fillColor[0], fillColor[1], fillColor[2]),
              strokeColor: strokeColor === null ? 'none' : Util.makeHexColor(strokeColor[0], strokeColor[1], strokeColor[2]),
              opacity: annotation.strokeAlpha,
              strokeWidth: annotation.borderStyle.width / scaleX,
              strokeDasharray: scaledArray.toString(),
            };

            await AnnotationManager.annotateRender.getStoreAdapter().addAnnotation(docId, pageIndex + 1, circleAnnotation);
            AnnotationUtils.addAnnotationNode(svg, circleAnnotation);

            break;
          }
          case Util.AnnotationType.TEXT: {
            const sizeInfo = Util.decomposeAnnotationRect(annotation.rect[0], annotation.rect[1], annotation.rect[2], annotation.rect[3], height, scaleX, scaleY);
            const strokeColor = annotation.color || null;

            var scaledArray;
            if (annotation.borderStyle.dashArray.length > 1) {
              scaledArray = Array.from(annotation.borderStyle.dashArray, (v) => v / scaleX);
            } else {
              scaledArray = 'none';
            }

            let pointAnnotation = {
              type: 'point',
              x: sizeInfo.x,
              y: sizeInfo.y,
              fillColor: strokeColor === null ? '#FFFF00' : Util.makeHexColor(strokeColor[0], strokeColor[1], strokeColor[2]),
              strokeColor: '#000000',
              opacity: annotation.strokeAlpha,
              strokeWidth: annotation.borderStyle.width / scaleY,
              strokeDasharray: scaledArray.toString(),
            };

            const dateObject = Util.toDateObject(annotation.modificationDate);
            await AnnotationManager.annotateRender
              .getStoreAdapter()
              .addAnnotation(docId, pageIndex + 1, pointAnnotation)
              .then((pointAnnotation) => {
                AnnotationManager.annotateRender.getStoreAdapter().addComment(docId, pageIndex + 1, pointAnnotation.uuid, annotation.contentsObj.str.trim(), dateObject.toLocaleDateString(), annotation.titleObj.str);
              });

            AnnotationUtils.addAnnotationNode(svg, pointAnnotation);

            break;
          }
          case Util.AnnotationType.FREETEXT: {
            const sizeInfo = Util.decomposeAnnotationRect(annotation.rect[0], annotation.rect[1], annotation.rect[2], annotation.rect[3], height, scaleX, scaleY);

            var scaledArray;
            if (annotation.borderStyle.dashArray.length > 1) {
              scaledArray = Array.from(annotation.borderStyle.dashArray, (v) => v / scaleX);
            } else {
              scaledArray = 'none';
            }

            let textColor = annotation.textColor ?? null;
            textColor = textColor === null ? '#FF0000' : Util.makeHexColor(textColor[0], textColor[1], textColor[2]);

            let textSize = annotation.textSize ?? null;
            textSize = textSize === null ? this.annotateRender.calcDefaultTextSize() : annotation.textSize;

            let contentStr = annotation.richText ?? null;
            contentStr = contentStr === null ? annotation.contentsObj?.str : annotation.richText?.str;
            let isBold = annotation.fontWeight ?? null;
            isBold = isBold === null ? false : annotation.fontWeight;
            let isItalic = annotation.fontItalic ?? null;
            isItalic = isItalic === null ? false : annotation.fontItalic;
            let isUnderline = annotation.textWord ?? null;
            isUnderline = isUnderline === null ? false : annotation.textWord;
            let islinethrough = annotation.textlineThrough ?? null;
            islinethrough = islinethrough === null ? false : annotation.textlineThrough;

            const divContentImage = Util.createDivContentImage(contentStr, textColor, 'Helvetica', textSize, isBold, isItalic, isUnderline, islinethrough);

            let textboxAnnotation = {
              type: 'textbox',
              creationDate: annotation.creationDate,
              modificationDate: annotation.modificationDate,
              hasPopup: annotation.hasPopup,
              titleObj: annotation.titleObj.str,
              contentsObj: contentStr,
              x: sizeInfo.x,
              y: sizeInfo.y,
              width: sizeInfo.width,
              height: sizeInfo.height,
              fontFamily: 'Helvetica',
              fontColor: textColor,
              fontSize: textSize,
              fontStyle: isItalic ? annotation.fontItalic : 'normal',
              fontWeight: isBold ? annotation.fontWeight : 'normal',
              opacity: 1,
              content: contentStr,
              rotation: 0,
              textDecoration: { underline: isUnderline, linethrough: islinethrough },
              imageUrl: divContentImage.imageUrl,
            };

            await AnnotationManager.annotateRender.getStoreAdapter().addAnnotation(docId, pageIndex + 1, textboxAnnotation);
            AnnotationUtils.addAnnotationNode(svg, textboxAnnotation);

            break;
          }
          case Util.AnnotationType.LINE: {
            let lines = [];
            lines.push([annotation.lineCoordinates[0] / scaleX, (height - annotation.lineCoordinates[3]) / scaleY]);
            lines[1] = [annotation.lineCoordinates[2] / scaleX, (height - annotation.lineCoordinates[1]) / scaleY];

            var scaledArray;
            if (annotation.borderStyle.dashArray.length > 1) {
              scaledArray = Array.from(annotation.borderStyle.dashArray, (v) => v / scaleX);
            } else {
              scaledArray = 'none';
            }

            const strokeColor = annotation.color || null;
            let lineAnnotation = {
              type: 'line',
              creationDate: annotation.creationDate,
              modificationDate: annotation.modificationDate,
              hasPopup: annotation.hasPopup,
              titleObj: annotation.titleObj.str,
              contentsObj: annotation.contentsObj.str,
              strokeColor: strokeColor === null ? 'none' : Util.makeHexColor(strokeColor[0], strokeColor[1], strokeColor[2]),
              opacity: annotation.strokeAlpha,
              strokeWidth: annotation.borderStyle.width / scaleY,
              strokeDasharray: scaledArray.toString(),
              lines,
            };

            await AnnotationManager.annotateRender.getStoreAdapter().addAnnotation(docId, pageIndex + 1, lineAnnotation);
            AnnotationUtils.addAnnotationNode(svg, lineAnnotation);

            break;
          }
          case Util.AnnotationType.POLYLINE: {
            let points = [];
            points.push([annotation.rect[0], annotation.rect[3]]);
            points[1] = [annotation.rect[2], annotation.rect[1]];
            const lines = Util.decomposeAnnotationLine(points, height, scaleX, scaleY);

            var scaledArray;
            if (annotation.borderStyle.dashArray.length > 1) {
              scaledArray = Array.from(annotation.borderStyle.dashArray, (v) => v / scaleX);
            } else {
              scaledArray = 'none';
            }

            const strokeColor = annotation.color || null;
            let polyLineAnnotation = {
              type: 'line',
              creationDate: annotation.creationDate,
              modificationDate: annotation.modificationDate,
              hasPopup: annotation.hasPopup,
              titleObj: annotation.titleObj.str,
              contentsObj: annotation.contentsObj.str,
              strokeColor: strokeColor === null ? 'none' : Util.makeHexColor(strokeColor[0], strokeColor[1], strokeColor[2]),
              opacity: annotation.strokeAlpha,
              strokeWidth: annotation.borderStyle.width / scaleY,
              strokeDasharray: scaledArray.toString(),
              lines,
            };

            await AnnotationManager.annotateRender.getStoreAdapter().addAnnotation(docId, pageIndex + 1, polyLineAnnotation);
            AnnotationUtils.addAnnotationNode(svg, polyLineAnnotation);

            break;
          }
          case Util.AnnotationType.UNDERLINE: {
            let points = [];

            for (const quadPoint of annotation.quadPoints) {
              points.push({
                x: quadPoint[2].x / scaleX,
                y: (height - quadPoint[1].y) / scaleY,
                width: (quadPoint[1].x - quadPoint[2].x) / scaleX,
                height: (quadPoint[1].y - quadPoint[2].y) / scaleY,
              });
            }

            const strokeColor = annotation.color || null;
            let underLineAnnotation = {
              type: 'underline',
              creationDate: annotation.creationDate,
              modificationDate: annotation.modificationDate,
              hasPopup: annotation.hasPopup,
              titleObj: annotation.titleObj.str,
              contentsObj: annotation.contentsObj.str,
              rectangles: points,
              strokeColor: strokeColor === null ? 'none' : Util.makeHexColor(strokeColor[0], strokeColor[1], strokeColor[2]),
              opacity: annotation.strokeAlpha,
            };

            await AnnotationManager.annotateRender.getStoreAdapter().addAnnotation(docId, pageIndex + 1, underLineAnnotation);
            AnnotationUtils.addAnnotationNode(svg, underLineAnnotation);
            break;
          }
          case Util.AnnotationType.STRIKEOUT: {
            let points = [];

            for (const quadPoint of annotation.quadPoints) {
              points.push({
                x: quadPoint[2].x / scaleX,
                y: (height - quadPoint[1].y) / scaleY,
                width: (quadPoint[1].x - quadPoint[2].x) / scaleX,
                height: (quadPoint[1].y - quadPoint[2].y) / scaleY,
              });
            }

            const strokeColor = annotation.color || null;
            let strikeoutAnnotation = {
              type: 'strikeout',
              creationDate: annotation.creationDate,
              modificationDate: annotation.modificationDate,
              hasPopup: annotation.hasPopup,
              titleObj: annotation.titleObj.str,
              contentsObj: annotation.contentsObj.str,
              rectangles: points,
              strokeColor: strokeColor === null ? 'none' : Util.makeHexColor(strokeColor[0], strokeColor[1], strokeColor[2]),
              opacity: annotation.strokeAlpha,
            };

            await AnnotationManager.annotateRender.getStoreAdapter().addAnnotation(docId, pageIndex + 1, strikeoutAnnotation);
            AnnotationUtils.addAnnotationNode(svg, strikeoutAnnotation);

            break;
          }
          case Util.AnnotationType.HIGHLIGHT: {
            let points = [];

            for (const quadPoint of annotation.quadPoints) {
              points.push({
                x: quadPoint[2].x / scaleX,
                y: (height - quadPoint[1].y) / scaleY,
                width: (quadPoint[1].x - quadPoint[2].x) / scaleX,
                height: (quadPoint[1].y - quadPoint[2].y) / scaleY,
              });
            }

            const strokeColor = annotation.color || null;
            let highlightAnnotation = {
              type: 'highlight',
              creationDate: annotation.creationDate,
              modificationDate: annotation.modificationDate,
              hasPopup: annotation.hasPopup,
              titleObj: annotation.titleObj.str,
              contentsObj: annotation.contentsObj.str,
              rectangles: points,
              fillColor: strokeColor === null ? 'none' : Util.makeHexColor(strokeColor[0], strokeColor[1], strokeColor[2]),
              opacity: annotation.strokeAlpha,
            };

            await AnnotationManager.annotateRender.getStoreAdapter().addAnnotation(docId, pageIndex + 1, highlightAnnotation);
            AnnotationUtils.addAnnotationNode(svg, highlightAnnotation);

            break;
          }
          case Util.AnnotationType.INK: {
            let paths = [];

            for (let i = 0, ii = annotation.inkLists.length; i < ii; ++i) {
              paths.push([]);
              for (let j = 0, jj = annotation.inkLists[i].length; j < jj; j += 1) {
                paths[i].push([annotation.inkLists[i][j].x / scaleX, (height - annotation.inkLists[i][j].y) / scaleY]);
              }
            }

            var scaledArray;
            if (annotation.borderStyle.dashArray.length > 1) {
              scaledArray = Array.from(annotation.borderStyle.dashArray, (v) => v / scaleX);
            } else {
              scaledArray = 'none';
            }

            const strokeColor = annotation.color || null;
            let drawingAnnotation = {
              type: 'drawing',
              creationDate: annotation.creationDate,
              modificationDate: annotation.modificationDate,
              hasPopup: annotation.hasPopup,
              titleObj: annotation.titleObj.str,
              contentsObj: annotation.contentsObj.str,
              strokeColor: strokeColor === null ? 'none' : Util.makeHexColor(strokeColor[0], strokeColor[1], strokeColor[2]),
              strokeWidth: annotation.borderStyle.width / scaleY,
              strokeDasharray: scaledArray.toString(),
              opacity: annotation.strokeAlpha,
              paths,
            };

            await AnnotationManager.annotateRender.getStoreAdapter().addAnnotation(docId, pageIndex + 1, drawingAnnotation);
            AnnotationUtils.addAnnotationNode(svg, drawingAnnotation);

            break;
          }
          default:
            break;
        }
      }
    } catch (e) {
      console.log('Error when parsing the annotation');
    }

    this.modified = false;
  };

  AnnotationManager.save = async function (docId, pdfDocument, force) {
    force = force ?? false;
    if (!force && !this.modified) {
      return;
    }

    try {
      UiManager.showLoadingProgress();

      let writer = await writeAnnotation(docId, pdfDocument);
      let pdfData = writer.write();

      EventManager.dispatch(EVENT_ID.DOCUMENT_SAVE, { data: pdfData });

      UiManager.hideLoadingProgress();
    } catch (err) {
      console.log(`AnnotationManager.save Failed Err = ${err}`);
    } finally {
      this.modified = false;
    }
  };

  AnnotationManager.saveAnnotation = async function (docId, force) {
    try {
      UiManager.showLoadingProgress();

      // 주석을 얻어온다.
      const annotations = AnnotationUtils.getAnnotations(docId);
      const kcnetAnnotations = AnnotationUtils.exportKcnetAnnotations(annotations);
      EventManager.dispatch(EVENT_ID.ANNOTATION_SAVE, { annotations: kcnetAnnotations });

      UiManager.hideLoadingProgress();
    } catch (err) {
      console.log(`AnnotationManager.save Failed Err = ${err}`);
    }
  };

  AnnotationManager.download = async function (docId, pdfDocument, fileName = 'output.pdf') {
    UiManager.showLoadingProgress();
    try {
      let writer = await writeAnnotation(docId, pdfDocument);
      writer.download(fileName ?? 'output.pdf');
    } catch (err) {
      console.log(`AnnotationManager.download Failed Err = ${err}`);
    } finally {
      UiManager.hideLoadingProgress();
    }
  };

  AnnotationManager.downloadAnnotation = async function (docId, fileName = 'output.json') {
    UiManager.showLoadingProgress();
    try {
      // 주석을 얻어온다.
      const annotations = AnnotationUtils.getAnnotations(docId);
      const kcnetAnnotations = AnnotationUtils.exportKcnetAnnotations(annotations);
      // JSON 객체를 문자열로 변환 (pretty format)
      let jsonString = JSON.stringify(kcnetAnnotations, null, 2); // 2-space indentation
      // 문자열을 Blob 객체로 변환
      let blob = new Blob([jsonString], { type: 'application/json' });
      // Blob 객체를 사용하여 다운로드 링크 생성
      let url = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = fileName ?? 'output.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.log(`AnnotationManager.downloadAnnotation Failed Err = ${err}`);
    } finally {
      UiManager.hideLoadingProgress();
    }
  };

  AnnotationManager.print = async function (docId, pdfDocument) {
    try {
      let writer = await writeAnnotation(docId, pdfDocument);
      const pdfData = writer.write();
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const downloadFrame = document.querySelectorAll('#download_iframe')[0];
      if (downloadFrame && !Util.isIE()) {
        const url = window.URL.createObjectURL(blob);
        downloadFrame.contentWindow.location = url;
        downloadFrame.onload = function () {
          setTimeout(function () {
            downloadFrame.focus();
            downloadFrame.contentWindow.print();
            window.URL.revokeObjectURL(url);
          }, 1);
        };
      }
    } catch (err) {
      console.log(`AnnotationManager.print Failed Err = ${err}`);
    }
  };

  AnnotationManager.removeAnnotations = async function (buffer) {
    const _isRemoveAnnot = function (subtype) {
      switch (subtype) {
        case '/Text':
        case '/FreeText':
        case '/Line':
        case '/Square':
        case '/Circle':
        case '/PolyLine':
        case '/Highlight':
        case '/Underline':
        case '/StrikeOut':
        case '/Ink':
          return true;
        case '/Link':
        case '/Polygon':
        case '/Squiggly':
        case '/Stamp':
        case '/Caret':
        case '/Popup':
        case '/FileAttachment':
        case '/Widget':
        default:
      }
      return false;
    };

    const pdfDoc = await webPdfLib.PDFLib.PDFDocument.load(buffer, {
      ignoreEncryption: true,
      parseSpeed: webPdfLib.PDFLib.ParseSpeeds.Slow,
      throwOnInvalidObject: true,
      updateMetadata: true,
      capNumbers: false,
    });

    const pages = pdfDoc.getPages();

    pages.forEach((page) => {
      const annots = page.node.Annots();
      const annotsRef = page.node.dict.get(webPdfLib.PDFLib.PDFName.Annots);
      const size = annots?.size();

      if (size) {
        const annotRefs = annots.asArray();
        for (let i = 0; i < annotRefs.length; i++) {
          const annotRef = annotRefs[i];
          if (!annotRef) {
            continue;
          }
          const annotObj = page.node.context.lookup(annotRef);
          if (annotObj) {
            const subtype = annotObj.lookup(webPdfLib.PDFLib.PDFName.of('Subtype'));
            if (!_isRemoveAnnot(subtype.encodedName)) {
              continue;
            }

            // /XObject Obj 삭제
            const apObj = annotObj.lookup(webPdfLib.PDFLib.PDFName.of('AP'));
            if (apObj) {
              const apRef = apObj.dict.get(webPdfLib.PDFLib.PDFName.of('N'));
              if (apRef) {
                annots.context.delete(apRef);
              }
            }
          }

          // Page내의 /Annots내의 /Annot 요소 삭제
          const Annots = page.node.Annots();
          if (Annots) {
            const index = Annots.indexOf(annotRef);
            if (index !== undefined) {
              // Page내의 /Annots내의 /Annot 요소 삭제
              Annots.remove(index);
            }
          }

          // /Annot Obj 삭제
          annots.context.delete(annotRef);
        }
      }

      if (!annots?.size()) {
        // /Annots Obj 삭제
        page.node.context.delete(annotsRef);
        // Page내의 /Annots 요소 삭제
        page.node.delete(webPdfLib.PDFLib.PDFName.Annots);
      }
    });

    const pdfBytes = await pdfDoc.save({
      useObjectStreams: false,
      addDefaultPage: false,
      objectsPerTick: 50,
      updateFieldAppearances: true,
    });
    return pdfBytes;
  };

  async function writeAnnotation(docId, pdfDocument) {
    const DEFAULT_SCALE = 1.0;
    const PDF_TO_CSS_UNITS = 96.0 / 72.0;

    let writer = new webPdfLib.PDFAnnotateWriter.AnnotationFactory(AnnotationManager.documentData);
    const pagesCount = webPdfLib.PDFViewerApplication.pagesCount;

    try {
      for (let i = 1; i <= pagesCount; i++) {
        // page를 얻어온다.
        let page = await pdfDocument.getPage(i);
        // 주석을 얻어온다.
        let annotations = await AnnotationManager.annotateRender.getAnnotations(docId, page._pageIndex + 1);
        const viewport = page.getViewport({ scale: DEFAULT_SCALE * PDF_TO_CSS_UNITS });
        const width = page.view[2];
        const height = page.view[3];
        const scaleX = width / viewport.width;
        const scaleY = height / viewport.height;
        for (let j = 0; j < annotations.annotations.length; j++) {
          let annotation = annotations.annotations[j];
          let pageIndex = annotations.pageNumber - 1;

          if (annotation.type == 'area') {
            const sizeInfo = Util.computeAnnotationRect(annotation.x, annotation.y, annotation.width, annotation.height, height, scaleX, scaleY);
            var borderStyleArray = Array.from(annotation.strokeDasharray.split(','), Number);
            var scaledArray = Array.from(borderStyleArray, (v) => v * scaleX);

            const value = {
              page: pageIndex,
              rect: [sizeInfo.left, sizeInfo.top, sizeInfo.right, sizeInfo.bottom],
              color: Util.hexToRgb(annotation.strokeColor),
              fill: Util.hexToRgb(annotation.fillColor),
              opacity: annotation.opacity,
              border: { horizontal_corner_radius: 0, vertical_corner_radius: 0, border_width: annotation.strokeWidth * scaleX, border_style: scaledArray },
              annotationFlags: { print: true },
            };
            let ta = writer.createSquareAnnotation(value);
            ta.createDefaultAppearanceStream();
          } else if (annotation.type == 'circle') {
            const _circleRect = Util.circleToRect(annotation.cx, annotation.cy, annotation.r);
            const sizeInfo = Util.computeAnnotationRect(_circleRect.x, _circleRect.y, _circleRect.width, _circleRect.height, height, scaleX, scaleY);
            var borderStyleArray = Array.from(annotation.strokeDasharray.split(','), Number);
            var scaledArray = Array.from(borderStyleArray, (v) => v * scaleX);

            const value = {
              page: pageIndex,
              rect: [sizeInfo.left, sizeInfo.top, sizeInfo.right, sizeInfo.bottom],
              color: Util.hexToRgb(annotation.strokeColor),
              fill: Util.hexToRgb(annotation.fillColor),
              opacity: annotation.opacity,
              border: { horizontal_corner_radius: 0, vertical_corner_radius: 0, border_width: annotation.strokeWidth * scaleX, border_style: scaledArray },
              annotationFlags: { print: true },
            };
            let ta = writer.createCircleAnnotation(value);
            // ta.createDefaultAppearanceStream();
          } else if (annotation.type == 'highlight') {
            for (let k = 0; k < annotation.rectangles.length; k++) {
              const rect = annotation.rectangles[k];
              const sizeInfo = Util.computeAnnotationRect(rect.x, rect.y, rect.width, rect.height, height, scaleX, scaleY);
              const value = {
                page: pageIndex,
                rect: [sizeInfo.left, sizeInfo.top, sizeInfo.right, sizeInfo.bottom],
                color: Util.hexToRgb(annotation.fillColor),
                opacity: annotation.opacity,
                annotationFlags: { print: true },
              };
              writer.createHighlightAnnotation(value);
            }
          } else if (annotation.type == 'drawing') {
            annotation.paths.forEach((lines) => {
              const ToSmoothLines = AnnotationManager.annotateRender.ToSmoothLines;
              const smoothing = AnnotationManager.annotateRender.smoothing;
              const smoothingLines = ToSmoothLines(lines, smoothing.SmoothCurves);
              let points = [];
              for (let k = 0; k < smoothingLines.length; k++) {
                let line = smoothingLines[k];
                let x = Number(line[0]),
                  y = Number(line[1]);
                const sizeInfo = Util.computeAnnotationRect(x, y, 0, 0, height, scaleX, scaleY);
                points.push(sizeInfo.left);
                points.push(sizeInfo.top);
              }

              const value = {
                page: pageIndex,
                rect: [0, 0, width, height],
                inkList: points,
                color: Util.hexToRgb(annotation.strokeColor),
                opacity: annotation.opacity,
                border: { horizontal_corner_radius: 0, vertical_corner_radius: 0, border_width: annotation.strokeWidth * scaleX },
                annotationFlags: { print: true },
              };
              writer.createInkAnnotation(value);
            });
          } else if (annotation.type == 'strikeout') {
            for (let k = 0; k < annotation.rectangles.length; k++) {
              const rect = annotation.rectangles[k];
              const sizeInfo = Util.computeAnnotationRect(rect.x, rect.y, rect.width, rect.height, height, scaleX, scaleY);
              const value = {
                page: pageIndex,
                rect: [sizeInfo.left, sizeInfo.top, sizeInfo.right, sizeInfo.bottom],
                color: Util.hexToRgb(annotation.strokeColor),
                opacity: annotation.opacity,
                annotationFlags: { print: true },
              };
              writer.createStrikeOutAnnotation(value);
            }
          } else if (annotation.type == 'underline') {
            for (let k = 0; k < annotation.rectangles.length; k++) {
              const rect = annotation.rectangles[k];
              const sizeInfo = Util.computeAnnotationRect(rect.x, rect.y, rect.width, rect.height, height, scaleX, scaleY);
              const value = {
                page: pageIndex,
                rect: [sizeInfo.left, sizeInfo.top, sizeInfo.right, sizeInfo.bottom],
                color: Util.hexToRgb(annotation.strokeColor),
                opacity: annotation.opacity,
                annotationFlags: { print: true },
              };
              writer.createUnderlineAnnotation(value);
            }
          } else if (annotation.type == 'point') {
            let comments = await AnnotationManager.annotateRender.getStoreAdapter().getComments(docId, annotation.uuid);
            if (comments.length == 0) {
              continue;
            }
            const comment = comments[0];
            const iconSize = 25;
            const sizeInfo = Util.computeAnnotationRect(annotation.x, annotation.y, iconSize, iconSize, height, scaleX, scaleY);
            const value = {
              page: pageIndex,
              rect: [sizeInfo.left, sizeInfo.bottom, sizeInfo.right, sizeInfo.top],
              contents: comment.content,
              author: comment.author,
              updateDate: new Date(comment.dataString),
              creationDate: new Date(comment.dataString),
              open: true,
              color: Util.hexToRgb(annotation.fillColor),
              opacity: annotation.opacity,
              annotationFlags: { print: true },
            };
            let ta = writer.createTextAnnotation(value);
            ta.createDefaultAppearanceStream();
          } else if (annotation.type == 'textbox') {
            const fontSize = annotation.fontSize;
            let contents = annotation.content;
            const imageUrl = annotation.imageUrl;
            const textColor = Util.hexToRgb(annotation.fontColor);
            const sizeInfo = Util.computeAnnotationRect(annotation.x, annotation.y, annotation.width, annotation.height, height, scaleX, scaleY);
            const richTextResult = {
              contentStr: annotation.content,
              fontColor: annotation.fontColor,
              fontFamily: annotation.fontFamily,
              fontSize: annotation.fontSize,
              isBold: annotation.fontWeight === 'normal' ? false : true,
              isItalic: annotation.fontStyle === 'normal' ? false : true,
              isUnderline: annotation.textDecoration.underline,
              isLineThrough: annotation.textDecoration.linethrough,
            };

            let ta = writer.createFreeTextAnnotationEx({
              page: pageIndex,
              rect: [sizeInfo.left, sizeInfo.top, sizeInfo.right, sizeInfo.bottom],
              imageUrl: imageUrl,
              contents: contents,
              richtextString: richTextResult,
              richtextStringContent: annotation.content,
              color: textColor,
              font: 'Helvetica',
              fontSize: Math.floor(fontSize),
              opacity: 1,
              annotationFlags: { print: true },
            });
            ta.createDefaultAppearanceStream();
          } else if (annotation.type === 'line') {
            const x1 = annotation.lines[0][0] * scaleX;
            const y1 = height - annotation.lines[0][1] * scaleY;
            const x2 = annotation.lines[1][0] * scaleX;
            const y2 = height - annotation.lines[1][1] * scaleY;

            var borderStyleArray = Array.from(annotation.strokeDasharray.split(','), Number);
            var scaledArray = Array.from(borderStyleArray, (v) => v * scaleX);

            let val = {
              page: pageIndex,
              rect: [x1, y1, x2, y2],
              vertices: [x1, y1, x2, y2],
              color: Util.hexToRgb(annotation.strokeColor),
              opacity: annotation.opacity,
              border: { horizontal_corner_radius: 0, vertical_corner_radius: 0, border_width: annotation.strokeWidth * scaleX, border_style: scaledArray },
              annotationFlags: { print: true },
            };

            let ta = writer.createPolyLineAnnotation(val);
            ta.createDefaultAppearanceStream();
          }
        }
      }
    } catch (e) {
      console.log('Error when writeAnnotation');
    }

    return writer;
  }

  AnnotationManager.disableUI = function (annotationType) {
    const _UI = AnnotationManager.annotateRender.UI;

    switch (annotationType) {
      case 'line':
        _UI.disableLine();
        break;
      case 'area':
      case 'strikeout':
      case 'highlight':
      case 'underline':
        _UI.disableRect();
        break;
      case 'circle':
        _UI.disableCircle();
        break;
      case 'draw':
        _UI.disablePen();
        break;
      case 'point':
        _UI.disablePoint();
        break;
      case 'text':
        _UI.disableText();

        if (!this.getSelect()) {
          /*          
                    UiManager.onSetStyleBarDisableState(true);
          */
        }
        break;
      case 'cursor':
        _UI.disableEdit();
        break;
      default:
        break;
    }
  };

  AnnotationManager.enableUI = function (annotationType) {
    const _UI = AnnotationManager.annotateRender.UI;

    switch (annotationType) {
      case 'line':
        _UI.enableLine();
        break;
      case 'area':
      case 'strikeout':
      case 'highlight':
      case 'underline':
        _UI.enableRect(annotationType);
        break;
      case 'circle':
        _UI.enableCircle();
        break;
      case 'draw':
        _UI.enablePen();
        break;
      case 'point':
        _UI.enablePoint();
        break;
      case 'text':
        _UI.enableText();
        /*        
                UiManager.onSetStyleBarDisableState(false);
        */
        break;
      case 'cursor':
        _UI.enableEdit();
        break;
      default:
        break;
    }
  };

  AnnotationManager.renderThumnail = function (pageId) {
    // svg 엘리먼트 이미지로 변환
    const _convertImage = (svgEl) => {
      return new Promise((resolve, reject) => {
        let cloneEl = svgEl.cloneNode(true);
        cloneEl.setAttribute('width', svgEl.getBoundingClientRect().width);
        cloneEl.setAttribute('height', svgEl.getBoundingClientRect().height);

        const data = new XMLSerializer().serializeToString(cloneEl);
        var win = window.URL || window.webkitURL || window;
        var img = new Image();
        var blob = new Blob([data], { type: 'image/svg+xml' });
        var url = win.createObjectURL(blob);
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = url;
      });
    };
    const _renderSVG = async (canvas, svgEl) => {
      let newCanvas = document.createElement('canvas');
      let context = newCanvas.getContext('2d');

      newCanvas.width = canvas.width;
      newCanvas.height = canvas.height;

      context.drawImage(canvas, 0, 0);

      let image = await _convertImage(svgEl);
      context.drawImage(image, 0, 0, image.width, image.height, 0, 0, newCanvas.width, newCanvas.height);

      return newCanvas;
    };

    const pageEl = document.querySelector(`[data-page-number="${pageId}"][class="page"]`);
    if (!pageEl) {
      return;
    }
    const svgEls = pageEl.getElementsByClassName('annotationLayer');
    if (svgEls.length <= 0) {
      return;
    }
    const { canvas } = webPdfLib.PDFViewerApplication.pdfViewer.getPageView(pageId - 1);
    if (!canvas) {
      return;
    }
    _renderSVG(canvas, svgEls[0]).then((img) => {
      let thumnail = webPdfLib.PDFViewerApplication.pdfThumbnailViewer.getThumbnail(pageId - 1);
      const reducedCanvas = thumnail._reduceImage(img);

      if (thumnail.image) {
        thumnail.image.src = reducedCanvas.toDataURL();
        EventManager.dispatch(EVENT_ID.UPDATE_UI, { name: 'renderThumnail', value: pageId });
      }

      // 리소스 즉시 반환
      reducedCanvas.width = 0;
      reducedCanvas.height = 0;
      img.width = 0;
      img.height = 0;
    });
  };

  AnnotationManager.doKeyDownEvent = function (e) {
    const keyCode = e.keyCode;
    const escKeyCode = parseInt('27', 10);
    const delKeyCode = parseInt('46', 10);

    switch (this.annotationType) {
      case 'line':
      case 'area':
      case 'strikeout':
      case 'highlight':
      case 'underline':
      case 'draw':
      case 'point':
      case 'text':
        if (keyCode === escKeyCode) {
          this.switchUI('cursor');
        }

        break;
      case 'cursor':
        if (keyCode === escKeyCode) {
          this.select(null);
          /*          
                    $.publish('/ui/action', EventActionGenerator.makeUpdateEventAction('e_find_close'));
          */
        } else if (keyCode === delKeyCode) {
          if (this.getSelect()) {
            e.preventDefault();
            this.deleteAnnotation();
          }
        }
        break;
      default:
        break;
    }
  };

  AnnotationManager.doMouseClickEvent = function (e, id) {
    /*    
        if (UiManager.isPopupEditing()) {
          UiManager.onSetUIEvents(false);
          UiManager.setEditDisabled(true);
          UiManager.setPopupEditing(false);
        } else {
          if (UiManager.isEditDisabled()) {
            if (id === UiDefine.DOCUMENT_MENU_ID) {
              UiManager.onSetUIEvents(true);
              UiManager.setEditDisabled(false);
            }
          }
        }
    */
  };

  AnnotationManager.getAnnotationProperties = function (target) {
    let currentTarget = target ?? this.getSelect();
    if (!currentTarget) {
      return;
    }

    if (!currentTarget.parentNode) {
      return;
    }

    const docId = currentTarget.parentNode.getAttribute('data-pdf-annotate-document');
    const annotationId = currentTarget.getAttribute('data-pdf-annotate-id');
    const annotationType = currentTarget.getAttribute('data-pdf-annotate-type');
    const adjustTarget = AnnotationUtils.getAnnotation(docId, annotationId);

    const properties = {
      type: annotationType,
      x: adjustTarget.x ?? undefined,
      y: adjustTarget.y ?? undefined,
      width: adjustTarget.width ?? undefined,
      height: adjustTarget.height ?? undefined,
      fillColor: adjustTarget.fillColor ?? undefined,
      opacity: adjustTarget.opacity ?? undefined,
      strokeColor: adjustTarget.strokeColor ?? undefined,
      strokeWidth: adjustTarget.strokeWidth ?? undefined,
      strokeDashArray: adjustTarget.strokeDasharray ?? undefined,
      fontColor: adjustTarget.fontColor ?? undefined,
      fontSize: adjustTarget.fontSize ?? undefined,
      fontFamily: adjustTarget.fontFamily ?? undefined,
      fontStyle: adjustTarget.fontStyle ?? undefined,
      fontWeight: adjustTarget.fontWeight ?? undefined,
      textDecoration: adjustTarget.textDecoration ?? undefined,
    };

    return properties;
  };

  AnnotationManager.findAnnotationAtPoint = function (x, y) {
    return this.annotateRender.findAnnotationAtPoint(x, y);
  };

  AnnotationManager.getOffsetAnnotationRect = function (element) {
    return this.annotateRender.getOffsetAnnotationRect(element);
  };

  AnnotationManager.getSelect = function () {
    return this.annotateRender.UI.getSelectNode();
  };

  AnnotationManager.select = function (targetEl) {
    this.annotateRender.UI.setSelectNode(targetEl);
  };

  AnnotationManager.deleteAnnotation = function (annoID) {
    this.annotateRender.UI.deleteAnnotation(annoID);
    UiManager.clearSelection();
  };

  AnnotationManager.saveRect = function (type, rects) {
    this.annotateRender.UI.saveRect(type, rects);
  };

  AnnotationManager.addComment = function (documentId, pageNumber, annotationId, content, dataString, author) {
    let authorName = author;
    /*    
        if (Util.IsMavenMode()) {
          authorName = Config.userId;
        }
    */
    AnnotationManager.annotateRender.getStoreAdapter().addComment(documentId, pageNumber, annotationId, content, dataString, authorName);
  };

  AnnotationManager.openAnnotation = async function (file) {

    let kcnetAnnotations;
    if (typeof file === "string") {
      // URL
      kcnetAnnotations = await AnnotationUtils.getAnnotationsByUrl(file);
    } else if (file && "byteLength" in file) {
      // ArrayBuffer
      const data = new TextDecoder().decode(file);
      kcnetAnnotations = JSON.parse(data);
    } else if (file.url && file.originalUrl) {
      // File
      kcnetAnnotations = await AnnotationUtils.getAnnotationsByUrl(file.url);
    } else if (file instanceof Blob) {
      // Blob
      const readFileAsync = (file) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.onerror = () => {
            reject(reader.error);
          };
          reader.readAsText(file);
        });
      }

      const data = await readFileAsync(file);
      kcnetAnnotations = JSON.parse(data);
    }

    const annotations = AnnotationUtils.importAnnotations(kcnetAnnotations);

    // AnnotationNodes를 모두 삭제한다.
    AnnotationUtils.removeAllAnnotationNodes();

    const docId = webPdfLib.PDFViewerApplication.baseUrl;
    AnnotationUtils.updateAnnotations(docId, annotations);
    webPdfLib.PDFViewerApplication.pdfViewer.update(true);
  };

  return AnnotationManager;
})();
