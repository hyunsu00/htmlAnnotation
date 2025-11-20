import webPdfLib from '../webPdfLib.js';
import {FIND_TYPE, LINE_STYLE, COLOR_TYPE, PROPERTY_TYPE} from "../define/valueDefines.js";

// @ts-check
/**
 * @category Action
 * @class ValueGenerator
 */
export default (function () {
  return {
    /**
     * ACTION_ID.FIND_OPEN 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {FIND_TYPE} type - FIND_TYPE
     * @param {String} query - 찾을 내용
     * @param {boolean} caseSensitive - 대/소문자 구분
     * @param {boolean} entireWord - 단어 단위로
     * @param {boolean} highlightAll - 모두 강조 표시
     * @param {boolean} findPrevious - 찾을 방향
     *
     * @return {Object}
     */
    createFindValue(type, query, caseSensitive, entireWord, highlightAll, findPrevious) {
      return {
        source: webPdfLib.PDFViewerApplication.findBar,
        type: type,
        query: query,
        phraseSearch: true,
        caseSensitive: caseSensitive ? 1 : 0,
        entireWord: entireWord ? 1 : 0,
        highlightAll: highlightAll ? 1 : 0,
        findPrevious: findPrevious ? 1 : 0,
        matchDiacritics: false,
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {number} width - 너비(optional)
     * @param {number} height - 높이(optional)
     *
     * @return {Object}
     */
    createResizeValue(target, width, height) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.sSize,
        cmdValue: {
          width: width,
          height: height,
        },
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {number} xPos - x좌표
     * @param {number} yPos - y좌표
     *
     * @return {Object}
     */
    createMoveValue(target, xPos, yPos) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.sPosition,
        cmdValue: {
          x: xPos,
          y: yPos,
        },
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {COLOR_TYPE} colorType - 없음, 단색
     * @param {String} fillColor - 채우기 색('#RRGGBB' 형식)(optional)
     *
     * @return {Object}
     */
    createFillColorValue(target, colorType, fillColor) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.sFill,
        cmdValue: {
          color: colorType == COLOR_TYPE.solid ? fillColor : colorType,
        },
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {number} opacity - 채우기 불투명도 설정(0~100사이 정수)
     *
     * @return {Object}
     */
    createFillOpacityrValue(target, fillOpacity) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.sFill,
        cmdValue: {
          opacity: fillOpacity,
        },
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {COLOR_TYPE} colorType - 없음, 단색
     * @param {String} lineFillColor - 선 채우기 색('#RRGGBB' 형식)(optional)
     *
     * @return {Object}
     */
    createLineFillColorValue(target, colorType, lineFillColor) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.sLineFill,
        cmdValue: {
          color: colorType == COLOR_TYPE.solid ? lineFillColor : colorType,
        },
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {number} lineFillOpacity - 선 불투명도(0~100사이 정수)
     *
     * @return {Object}
     */
    createLineFillOpacityrValue(target, lineFillOpacity) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.sLineFill,
        cmdValue: {
          opacity: lineFillOpacity,
        },
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {number} lineWidth - 선 굵기(px단위)
     *
     * @return {Object}
     */
    createLineWidthValue(target, lineWidth) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.sLineWidth,
        cmdValue: {
          borderWidth: lineWidth,
        },
      };
    },

    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {LINE_STYLE} lineStyle - 선 종류
     *
     * @return {Object}
     */
    createLineStyleValue(target, lineStyle) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.sLineStyle,
        cmdValue: {
          borderStyleDashed: lineStyle,
        },
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {number} fontSize - 글자크기(pt단위)
     * 
     * @return {Object}
     */
    createTexFontSizeValue(target, fontSize) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.fontSize,
        cmdValue: fontSize,
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {number} fontColr - 폰트색상('#RRGGBB' 형식)
     * 
     * @return {Object}
     */
    createTexFontColorValue(target, fontColor) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.fontColor,
        cmdValue: fontColor,
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {Boolean} flag - 진하게(on, off)
     * 
     * @return {Object}
     */
    createTextBoldValue(target, flag) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.bold,
        cmdValue: flag ? 'on' : 'off',
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {Boolean} flag - 기울임(on, off)
     * 
     * @return {Object}
     */
    createTextItalicValue(target, flag) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.italic,
        cmdValue: flag ? 'on' : 'off',
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {Boolean} flag - 밑줄(on, off)
     * 
     * @return {Object}
     */
    createTextUnderlineValue(target, flag) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.underline,
        cmdValue: flag ? 'on' : 'off',
      };
    },
    /**
     * ACTION_ID.CHANGE_PROPERTY 액션에 사용되는 value 생성
     * @memberof ValueGenerator
     * @param {Object} target - Annotation개체
     * @param {Boolean} flag - 취소선(on, off)
     * 
     * @return {Object}
     */
    createTextStrikethroughValue(target, flag) {
      return {
        target: target,
        cmdType: PROPERTY_TYPE.strikethrough,
        cmdValue: flag ? 'on' : 'off',
      };
    },
  };
})();
