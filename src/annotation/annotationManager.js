// annotationManager.js
import { PROPERTY_TYPE } from "../define/valueDefines.js";
import UiManager from '../uiFrame/uiManager.js';
import AnnotationListener from '../listener/annotationListener.js';
import AnnotationUtils from './annotationUtils.js';
import annotationLib from '../annotationLib.js';
import EVENT_ID from "../define/eventDefines.js";
import EventManager from '../event/eventManager.js';
import { PageViewport } from "./PageViewport.js";

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

  AnnotationManager.render = function (docId, parentNode, pageId, renderSize, pageSize, scale, rotation) {
    let temp_div = document.createElement('div');
    temp_div.innerHTML = '<svg class="annotationLayer"></svg>';
    let svg = temp_div.firstChild;

    let textLayer = parentNode.querySelector('div.textLayer');
    if (textLayer) {
      textLayer.before(svg);
    } else {
      parentNode.appendChild(svg);
    }

    const viewBox = [0, 0, pageSize.width, pageSize.height];
    const viewport = new PageViewport({
      viewBox: viewBox,
      scale: scale, 
      rotation: rotation,
      offsetX: 0,
      offsetY: 0,
      dontFlip: false
    });
    svg.setAttribute('width', viewport.width);
    svg.setAttribute('height', viewport.height);
    svg.style.width = renderSize.width;
    svg.style.height = renderSize.height;

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
        break;
      case 'cursor':
        _UI.enableEdit();
        break;
      default:
        break;
    }
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

    const docId = annotationLib.PDFViewerApplication.baseUrl;
    AnnotationUtils.updateAnnotations(docId, annotations);
    annotationLib.PDFViewerApplication.pdfViewer.update(true);
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

  AnnotationManager.renderThumnail = function (pageId) {
    console.warn(`[TODO] : AnnotationManager.renderThumnail(pageId) 구현 필요`);

    // // svg 엘리먼트 이미지로 변환
    // const _convertImage = (svgEl) => {
    //   return new Promise((resolve, reject) => {
    //     let cloneEl = svgEl.cloneNode(true);
    //     cloneEl.setAttribute('width', svgEl.getBoundingClientRect().width);
    //     cloneEl.setAttribute('height', svgEl.getBoundingClientRect().height);

    //     const data = new XMLSerializer().serializeToString(cloneEl);
    //     var win = window.URL || window.webkitURL || window;
    //     var img = new Image();
    //     var blob = new Blob([data], { type: 'image/svg+xml' });
    //     var url = win.createObjectURL(blob);
    //     img.onload = () => resolve(img);
    //     img.onerror = reject;
    //     img.src = url;
    //   });
    // };
    // const _renderSVG = async (canvas, svgEl) => {
    //   let newCanvas = document.createElement('canvas');
    //   let context = newCanvas.getContext('2d');

    //   newCanvas.width = canvas.width;
    //   newCanvas.height = canvas.height;

    //   context.drawImage(canvas, 0, 0);

    //   let image = await _convertImage(svgEl);
    //   context.drawImage(image, 0, 0, image.width, image.height, 0, 0, newCanvas.width, newCanvas.height);

    //   return newCanvas;
    // };

    // const pageEl = document.querySelector(`[data-page-number="${pageId}"][class="page"]`);
    // if (!pageEl) {
    //   return;
    // }
    // const svgEls = pageEl.getElementsByClassName('annotationLayer');
    // if (svgEls.length <= 0) {
    //   return;
    // }
    // const { canvas } = webPdfLib.PDFViewerApplication.pdfViewer.getPageView(pageId - 1);
    // if (!canvas) {
    //   return;
    // }
    // _renderSVG(canvas, svgEls[0]).then((img) => {
    //   let thumnail = webPdfLib.PDFViewerApplication.pdfThumbnailViewer.getThumbnail(pageId - 1);
    //   const reducedCanvas = thumnail._reduceImage(img);

    //   if (thumnail.image) {
    //     thumnail.image.src = reducedCanvas.toDataURL();
    //     EventManager.dispatch(EVENT_ID.UPDATE_UI, { name: 'renderThumnail', value: pageId });
    //   }

    //   // 리소스 즉시 반환
    //   reducedCanvas.width = 0;
    //   reducedCanvas.height = 0;
    //   img.width = 0;
    //   img.height = 0;
    // });
  };

  return AnnotationManager;
})();
