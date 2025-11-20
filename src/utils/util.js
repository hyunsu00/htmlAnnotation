/*
import Config from '../common/config.js';
*/

var defaultWebDPI = 96;

export default class Util {

  static hexToRgb(color) {
    let hex = color.replace('#', '');
    let value = hex.match(/[a-f\d]/gi);
    if (value.length == 3) hex = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
    value = hex.match(/[a-f\d]{2}/gi);
    if (!value) {
      return value;
    }
    let r = parseInt(value[0], 16);
    let g = parseInt(value[1], 16);
    let b = parseInt(value[2], 16);
    let rgb = {
      r: r,
      g: g,
      b: b,
    };
    return rgb;
  }

  static makeHexColor(r, g, b) {
    const hexNumbers = [...Array(256).keys()].map((n) => n.toString(16).padStart(2, '0'));

    return `#${hexNumbers[r]}${hexNumbers[g]}${hexNumbers[b]}`;
  }

  static measureText(pText, pFontSize, pStyle) {
    var lDiv = document.createElement('div');

    document.body.appendChild(lDiv);

    if (pStyle != null) {
      lDiv.style = pStyle;
    }
    lDiv.style.fontSize = '' + pFontSize + 'px';
    lDiv.style.position = 'absolute';
    lDiv.style.left = -1000;
    lDiv.style.top = -1000;

    lDiv.textContent = pText;

    var lResult = {
      width: lDiv.clientWidth,
      height: lDiv.clientHeight,
    };

    document.body.removeChild(lDiv);
    lDiv = null;

    return lResult;
  }

  static circleToRect(cx, cy, r) {
    const x = cx - r;
    const y = cy - r;
    const width = 2 * r;
    const height = 2 * r;
    return { x, y, width, height };
  }

  static computeAnnotationRect(x, y, width, height, pageHeight, scaleX, scaleY) {
    const left = x * scaleX;
    const top = pageHeight - y * scaleY;
    const right = left + width * scaleX;
    const bottom = top - height * scaleY;

    const sizeInfo = {
      left: left,
      top: top,
      right: right,
      bottom: bottom,
    };

    return sizeInfo;
  }

  static rotate(m, angle) {
    angle = (angle * Math.PI) / 180;

    let cosValue = Math.cos(angle);
    let sinValue = Math.sin(angle);

    return [m[0] * cosValue + m[2] * sinValue, m[1] * cosValue + m[3] * sinValue, m[0] * -sinValue + m[2] * cosValue, m[1] * -sinValue + m[3] * cosValue, m[4], m[5]];
  }

  static getTranslation(viewport) {
    let x;
    let y;

    // Modulus 360 on the rotation so that we only
    // have to worry about four possible values.
    switch (viewport.rotation % 360) {
      case 0:
        x = y = 0;
        break;
      case 90:
        x = 0;
        y = (viewport.width / viewport.scale) * -1;
        break;
      case 180:
        x = (viewport.width / viewport.scale) * -1;
        y = (viewport.height / viewport.scale) * -1;
        break;
      case 270:
        x = (viewport.height / viewport.scale) * -1;
        y = 0;
        break;
      default:
        break;
    }

    return { x, y };
  }

  static scale(m, x, y) {
    return [m[0] * x, m[1] * x, m[2] * y, m[3] * y, m[4], m[5]];
  }

  static translate(m, x, y) {
    return [m[0], m[1], m[2], m[3], m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  }

  static applyInverseTransform(p, m) {
    let d = m[0] * m[3] - m[1] * m[2];
    return [(p[0] * m[3] - p[1] * m[2] + m[2] * m[5] - m[4] * m[3]) / d, (-p[0] * m[1] + p[1] * m[0] + m[4] * m[1] - m[5] * m[0]) / d];
  }

  static getMetadata(svg) {
    return {
      documentId: svg.getAttribute('data-pdf-annotate-document'),
      pageNumber: parseInt(svg.getAttribute('data-pdf-annotate-page'), 10),
      viewport: JSON.parse(svg.getAttribute('data-pdf-annotate-viewport')),
    };
  }

  static convertToSvgPoint(pt, svg, viewport) {
    viewport = viewport || this.getMetadata(svg).viewport;

    let xform = [1, 0, 0, 1, 0, 0];
    xform = this.scale(xform, viewport.scale, viewport.scale);
    xform = this.rotate(xform, viewport.rotation);

    let offset = this.getTranslation(viewport);
    xform = this.translate(xform, offset.x, offset.y);

    return this.applyInverseTransform(pt, xform);
  }

  static toSvgPoint(svg, clientX, clientY) {
    if (!svg) {
      return null;
    }

    let rect = svg.getBoundingClientRect();
    let point = this.convertToSvgPoint([clientX - rect.left, clientY - rect.top], svg);

    return point;
  }

  static decomposeAnnotationRect(left, top, right, bottom, pageHeight, scaleX, scaleY) {
    const x = left / scaleX;
    const y = (pageHeight - top) / scaleY - ((bottom - top) / scaleY);
    const width = (right - left) / scaleX;
    const height = (bottom - top) / scaleY;

    const sizeInfo = {
      x: x,
      y: y,
      width: width,
      height: height
    };

    return sizeInfo;
  }

  static decomposeAnnotationCircle(left, top, right, bottom, pageHeight, scaleX, scaleY) {
    const sizeInfo = Util.decomposeAnnotationRect(left, top, right, bottom, pageHeight, scaleX, scaleY);

    const cx = sizeInfo.x + sizeInfo.width / 2;
    const cy = sizeInfo.y + sizeInfo.height / 2;
    const r = Math.min(sizeInfo.width, sizeInfo.height) / 2;
    return { cx, cy, r };
  }

  static decomposeAnnotationLine(points, height, scaleX, scaleY) {
    const x1 = points[0][0] / scaleX;
    const y1 = (height - points[0][1]) / scaleY;
    const x2 = points[1][0] / scaleX;
    const y2 = (height - points[1][1]) / scaleY;

    let lines = [];
    lines.push([x1, y1]);
    lines[1] = [x2, y2];

    return lines;
  }

  /*  
    static IsDevMode() {
      window.__devMode__ = typeof PRODUCTION == 'undefined' ? true : !PRODUCTION;
      return window.__devMode__;
    }
  
    static IsMavenMode() {
      return typeof MAVEN == 'undefined' ? false : MAVEN;
    }
  
    static getPdfJsPath() {
      const pdfjsPath = this.IsDevMode() ? 'external' : 'lib';
      return `${pdfjsPath}/pdf.js`;
    }
  */

  static isReloaded() {
    return window.sessionStorage.getItem('isReloaded') ?? false;
  }

  static setReloaded(value) {
    window.sessionStorage.setItem('isReloaded', value);
  }

  /*
    static isViewMode() {
      return Config.appMode === 'PDF_VIEWER' ? true : false;
    }
  
    static setViewMode() {
      Config.appMode = 'PDF_VIEWER';
    }
  */

  static downloadURL(data, fileName) {
    let a = document.createElement('a');
    a.href = data;
    a.download = fileName;
    document.body.appendChild(a);
    a.style = 'display: none';
    a.click();
    a.remove();
  }

  static AnnotationType = {
    TEXT: 1,
    LINK: 2,
    FREETEXT: 3,
    LINE: 4,
    SQUARE: 5,
    CIRCLE: 6,
    POLYGON: 7,
    POLYLINE: 8,
    HIGHLIGHT: 9,
    UNDERLINE: 10,
    SQUIGGLY: 11,
    STRIKEOUT: 12,
    STAMP: 13,
    CARET: 14,
    INK: 15,
    POPUP: 16,
    FILEATTACHMENT: 17,
    SOUND: 18,
    MOVIE: 19,
    WIDGET: 20,
    SCREEN: 21,
    PRINTERMARK: 22,
    TRAPNET: 23,
    WATERMARK: 24,
    THREED: 25,
    REDACT: 26,
  };

  static toDateObject(input) {
    if (!input || typeof input !== 'string') {
      return null;
    }

    let pdfDateStringRegex;
    // Lazily initialize the regular expression.
    if (!pdfDateStringRegex) {
      pdfDateStringRegex = new RegExp(
        '^D:' + // Prefix (required)
        '(\\d{4})' + // Year (required)
        '(\\d{2})?' + // Month (optional)
        '(\\d{2})?' + // Day (optional)
        '(\\d{2})?' + // Hour (optional)
        '(\\d{2})?' + // Minute (optional)
        '(\\d{2})?' + // Second (optional)
        '([Z|+|-])?' + // Universal time relation (optional)
        '(\\d{2})?' + // Offset hour (optional)
        "'?" + // Splitting apostrophe (optional)
        '(\\d{2})?' + // Offset minute (optional)
        "'?" // Trailing apostrophe (optional)
      );
    }
    // Optional fields that don't satisfy the requirements from the regular
    // expression (such as incorrect digit counts or numbers that are out of
    // range) will fall back the defaults from the specification.
    const matches = pdfDateStringRegex.exec(input);
    if (!matches) {
      return null;
    }

    // JavaScript's `Date` object expects the month to be between 0 and 11
    // instead of 1 and 12, so we have to correct for that.
    const year = parseInt(matches[1], 10);
    let month = parseInt(matches[2], 10);
    month = month >= 1 && month <= 12 ? month - 1 : 0;
    let day = parseInt(matches[3], 10);
    day = day >= 1 && day <= 31 ? day : 1;
    let hour = parseInt(matches[4], 10);
    hour = hour >= 0 && hour <= 23 ? hour : 0;
    let minute = parseInt(matches[5], 10);
    minute = minute >= 0 && minute <= 59 ? minute : 0;
    let second = parseInt(matches[6], 10);
    second = second >= 0 && second <= 59 ? second : 0;
    const universalTimeRelation = matches[7] || 'Z';
    let offsetHour = parseInt(matches[8], 10);
    offsetHour = offsetHour >= 0 && offsetHour <= 23 ? offsetHour : 0;
    let offsetMinute = parseInt(matches[9], 10) || 0;
    offsetMinute = offsetMinute >= 0 && offsetMinute <= 59 ? offsetMinute : 0;

    // Universal time relation 'Z' means that the local time is equal to the
    // universal time, whereas the relations '+'/'-' indicate that the local
    // time is later respectively earlier than the universal time. Every date
    // is normalized to universal time.
    if (universalTimeRelation === '-') {
      hour += offsetHour;
      minute += offsetMinute;
    } else if (universalTimeRelation === '+') {
      hour -= offsetHour;
      minute -= offsetMinute;
    }

    return new Date(Date.UTC(year, month, day, hour, minute, second));
  }

  static createDivContentImage(contentStr, fontColor = '#FF0000', fontFamily = '/Helvetica', fontSize = 12, isBold = false, isItalic = false, isUnderline = false, isLineThrough = false) {
    const editorDiv = this.createDivContent(contentStr, fontColor, fontFamily, fontSize, isBold, isItalic, isUnderline, isLineThrough);
    const editorDivRect = editorDiv.getBoundingClientRect();
    const contentStrArray = this.getContentStrArray(editorDiv);
    const imageUrl = this.createPngImageUrl(editorDivRect, contentStrArray, fontColor, 1, fontFamily, fontSize, isBold, isItalic, isUnderline, isLineThrough);
    this.removeDivContent(editorDiv);

    return { w: editorDivRect.width, h: editorDivRect.height, imageUrl: imageUrl };
  }

  static createDivContent(contentStr, fontColor = '#FF0000', fontFamily = '/Helvetica', fontSize = 12, isBold = false, isItalic = false, isUnderline = false, isLineThrough = false) {
    const arr = contentStr.split('\n');

    let editorDiv = document.createElement('div');
    {
      editorDiv.contentEditable = 'false';
      {
        editorDiv.style.color = fontColor;
        editorDiv.style.fontSize = `${Math.floor(fontSize)}px`;
        editorDiv.style.fontFamily = `${fontFamily.replace('/', '')}`;
        editorDiv.style.fontStyle = isItalic ? 'italic' : 'normal';
        editorDiv.style.fontWeight = isBold ? 'bold' : 'normal';
        if (isUnderline && isLineThrough) {
          editorDiv.style.textDecoration = 'underline line-through';
        } else if (isUnderline) {
          editorDiv.style.textDecoration = 'underline';
        } else if (isLineThrough) {
          editorDiv.style.textDecoration = 'line-through';
        } else {
          editorDiv.style.textDecoration = 'none';
        }
      }

      {
        editorDiv.style.visibility = 'hidden';
        editorDiv.style.position = 'absolute';
        editorDiv.style.padding = '0';
        editorDiv.style.margin = '0';
        editorDiv.style.left = '0';
        editorDiv.style.top = '0';
      }

      {
        editorDiv.style.overflow = 'visible';
        editorDiv.style.whiteSpace = 'nowrap';
      }

      {
        editorDiv.textContent = arr[0];
        for (let i = 1; i < arr.length; i++) {
          const div = document.createElement('div');
          div.textContent = arr[i];
          editorDiv.appendChild(div);
        }
      }
    }
    document.body.appendChild(editorDiv);

    return editorDiv;
  }

  static removeDivContent(divElement) {
    document.body.removeChild(divElement);
  }

  static getContentStrArray(divElement) {
    const contentStrArray = [];
    {
      let getBoundingClientRect = function (textNode) {
        const range = document.createRange();
        range.selectNode(textNode);
        return range.getBoundingClientRect();
      };

      let xPos = parseInt(divElement.style.left, 10);
      let yPos = parseInt(divElement.style.top, 10);
      const renderFontSize = parseInt(divElement.style.fontSize);
      const textNodeHeight = Math.ceil(getBoundingClientRect(divElement.firstChild).height);
      yPos += renderFontSize - Math.ceil((textNodeHeight - renderFontSize) / 2);

      const divs = divElement.getElementsByTagName('div');
      if (divs.length === 0) {
        contentStrArray.push({ x: xPos, y: yPos, content: divElement.textContent });
      } else {
        const first = divElement.firstChild;
        if (first?.nodeName === '#text') {
          contentStrArray.push({ x: xPos, y: yPos, content: first.data });
        }

        for (let i = 0; i < divs.length; i++) {
          const div = divs[i];
          const first = div.firstChild;
          const height = div.getBoundingClientRect().height;
          yPos += height;
          if (first?.nodeName === '#text') {
            contentStrArray.push({ x: xPos, y: yPos, content: first.data });
          }
        }
      }
    }

    return contentStrArray;
  }

  static createPngImageUrl(rect, contentStrArray, fontColor, opacity = 1, fontFamily = '/Helvetica', fontSize = 12, isBold = false, isItalic = false, isUnderline = false, isLineThrough = false) {
    // 텍스트 너비/높이 측정
    const measureText = (ctx, text) => {
      let metrics = ctx.measureText(text);
      return {
        width: Math.floor(metrics.width),
        height: Math.floor(metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent),
        actualHeight: Math.floor(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent),
      };
    };

    // 밑줄 그리기
    const drawUnderline = (ctx, text, x, y) => {
      const metrics = measureText(ctx, text);
      const fontSize = Math.floor(metrics.actualHeight * 1.4); // 140% the height
      const lineWidth = Math.ceil(fontSize * 0.08);
      switch (ctx.textAlign) {
        case 'center':
          x -= metrics.width / 2;
          break;
        case 'right':
          x -= metrics.width;
          break;
        default:
          break;
      }
      switch (ctx.textBaseline) {
        case 'top':
          y += fontSize;
          break;
        case 'middle':
          y += fontSize / 2;
          break;
        default:
          break;
      }

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = lineWidth;
      ctx.moveTo(x, y + lineWidth);
      ctx.lineTo(x + metrics.width, y + lineWidth);
      ctx.stroke();
      ctx.restore();
    };

    // 취소선 그리기
    const drawLineThrough = (ctx, text, x, y) => {
      const metrics = measureText(ctx, text);
      const fontSize = Math.floor(metrics.actualHeight * 1.4); // 140% the height
      const lineWidth = Math.ceil(fontSize * 0.08);
      switch (ctx.textAlign) {
        case 'center':
          x -= metrics.width / 2;
          break;
        case 'right':
          x -= metrics.width;
          break;
        default:
          break;
      }
      switch (ctx.textBaseline) {
        case 'top':
          y += fontSize;
          break;
        case 'middle':
          y += fontSize / 2;
          break;
        default:
          break;
      }

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = lineWidth;
      ctx.moveTo(x, y - metrics.height / 2 + lineWidth);
      ctx.lineTo(x + metrics.width, y - metrics.height / 2 + lineWidth);
      ctx.stroke();
      ctx.restore();
    };

    let canvas = document.createElement('canvas');
    const scaleX = 2, scaleY = 2;
    let w = rect.width, h = rect.height;

    // canvas 의 크기가 없다면 이미지 생성이 실패하므로, 최소 크기로 조정한다.
    if (w == 0) w = 1;
    if (h == 0) h = 1;

    canvas.width = w * scaleX; canvas.height = h * scaleY;
    let ctx = canvas.getContext('2d');
    if (!ctx) {
      return null;
    }
    ctx.scale(scaleX, scaleY);
    ctx.imageSmoothingEnabled = false;
    if (fontColor) {
      let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fontColor);
      ctx.fillStyle = `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity ?? 1})`;
    }

    // 폰트 설정(폰트명, 폰트크기, 강조, 기울기)
    let fontStr = '';
    if (isItalic) {
      fontStr += `italic `;
    }
    if (isBold) {
      fontStr += `bold `;
    }
    fontStr += `${fontSize}px `;
    if (typeof fontFamily === 'string') {
      fontStr += ` ${fontFamily.replace('/', '')}`;
    }
    ctx.font = fontStr;

    // 텍스트 렌더링(텍스트, 밑줄, 취소선)
    for (let i = 0; i < contentStrArray.length; i++) {
      const xPos = contentStrArray[i].x - rect.x,
        yPos = contentStrArray[i].y - rect.y;
      ctx.fillText(contentStrArray[i].content, xPos, yPos);
      if (isUnderline) {
        drawUnderline(ctx, contentStrArray[i].content, xPos, yPos);
      }
      if (isLineThrough) {
        drawLineThrough(ctx, contentStrArray[i].content, xPos, yPos);
      }
    }

    return canvas.toDataURL('image/png');
  }

  static isIE() {
    var agent = navigator.userAgent.toLowerCase();
    if ((navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (agent.indexOf("msie") != -1)) {
      return true;
    }
    return false;
  }

  static getPdfFilenameFromUrl(url, defaultFilename = "document.pdf") {
    if (typeof url !== "string") {
      return defaultFilename;
    }
    if (this.isDataScheme(url)) {
      warn('getPdfFilenameFromUrl: ignore "data:"-URL for performance reasons.');
      return defaultFilename;
    }
    const reURI = /^(?:(?:[^:]+:)?\/\/[^/]+)?([^?#]*)(\?[^#]*)?(#.*)?$/;
    //              SCHEME        HOST        1.PATH  2.QUERY   3.REF
    // Pattern to get last matching NAME.pdf
    const reFilename = /[^/?#=]+\.pdf\b(?!.*\.pdf\b)/i;
    const splitURI = reURI.exec(url);
    let suggestedFilename =
      reFilename.exec(splitURI[1]) ||
      reFilename.exec(splitURI[2]) ||
      reFilename.exec(splitURI[3]);
    if (suggestedFilename) {
      suggestedFilename = suggestedFilename[0];
      if (suggestedFilename.includes("%")) {
        // URL-encoded %2Fpath%2Fto%2Ffile.pdf should be file.pdf
        try {
          suggestedFilename = reFilename.exec(
            decodeURIComponent(suggestedFilename)
          )[0];
        } catch (ex) {
          // Possible (extremely rare) errors:
          // URIError "Malformed URI", e.g. for "%AA.pdf"
          // TypeError "null has no properties", e.g. for "%2F.pdf"
        }
      }
    }
    return suggestedFilename || defaultFilename;
  }

  static isDataScheme(url) {
    const ii = url.length;
    let i = 0;
    while (i < ii && url[i].trim() === "") {
      i++;
    }
    return url.substring(i, i + 5).toLowerCase() === "data:";
  }

  static isPdfFile(filename) {
    return typeof filename === "string" && /\.pdf$/i.test(filename);
  }

  static isRelativePath(file) {
    // file이 문자열인지 확인
    if (typeof file !== 'string') {
      return false;
    }
  
    // file이 http 또는 https로 시작하지 않는지 확인
    if (!file.startsWith('http://') && !file.startsWith('https://')) {
      return true;
    }
  
    return false;
  }

  // UTF-8 문자열을 Base64로 인코딩하는 함수
  static utf8ToBase64(str) {
    const utf8Bytes = new TextEncoder().encode(str); // UTF-8 바이트 배열로 변환
    let binary = '';
    utf8Bytes.forEach((byte) => {
      binary += String.fromCharCode(byte);
    });
    return window.btoa(binary);
  }

  static async fetchPDFParts(contextPath, pdfPath, divideCount = 10) {
    try {
      // contextPath 뒤에 '/'가 있으면 제거하는 함수
      const removeTrailingSlash = (path) => {
        return path.endsWith('/') ? path.slice(0, -1) : path;
      }
      // base64 인코딩
      contextPath = removeTrailingSlash(contextPath);
      const pathParm = this.utf8ToBase64(pdfPath);
      const url = contextPath + `/stream?path=${encodeURIComponent(pathParm)}`;

      // HEAD 요청 실패 처리
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const fileSize = parseInt(response.headers.get('Content-Length'), 10);

      // 0 바이트 파일 또는 잘못된 파일 크기 처리
      if (fileSize <= 0) {
        throw new Error('Invalid file size');
      }

      const chunkSize = Math.ceil(fileSize / divideCount);
      const totalChunks = Math.ceil(fileSize / chunkSize);
      const fileParts = new Array(totalChunks).fill(null);

      const downloadChunk = async (start, end, index) => {
        try {
          const chunkResponse = await fetch(url, {
            headers: {
              Range: `bytes=${start}-${end}`
            }
          });

          // 청크 다운로드 오류 처리
          if (!chunkResponse.ok) {
            throw new Error(`Chunk download failed for index ${index}`);
          }

          const chunk = await chunkResponse.arrayBuffer();
          fileParts[index] = chunk;
        } catch (error) {
          throw error;
        }
      };

      const chunkPromises = [];
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = i === totalChunks - 1 ? fileSize - 1 : (i + 1) * chunkSize - 1;
        chunkPromises.push(downloadChunk(start, end, i));
      }

      // 모든 청크 다운로드 실패 처리
      await Promise.all(chunkPromises);

      const totalLength = fileParts.reduce((acc, part) => acc + part.byteLength, 0);

      // 다운로드된 파일 크기 검증
      if (totalLength !== fileSize) {
        throw new Error('Downloaded file size does not match expected size');
      }

      const pdfData = new Uint8Array(totalLength);
      let offset = 0;
      fileParts.forEach(part => {
        pdfData.set(new Uint8Array(part), offset);
        offset += part.byteLength;
      });

      return pdfData;
    } catch (error) {
      // console.error('Error fetching PDF parts:', error);
      throw error;
    }
  }

}