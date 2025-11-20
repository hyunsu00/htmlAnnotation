import setAttributes from '../utils/setAttributes';

export function calcUnionRect(rectangles)
{
  let left, top,right,bottom;
  rectangles.forEach((r) => {
    left = (left !== null && left !== undefined) ? Math.min(left, r.x) : r.x;
    right = (right !== null && right !== undefined) ? Math.max(right, r.x + r.width) : r.x + r.width;
    top = (top !== null && top !== undefined) ? Math.min(top, r.y) : r.y;
    bottom = (bottom !== null && bottom !== undefined) ? Math.max(bottom, r.y + r.height) : r.y + r.height;
  });

  return { 
    x: left, 
    y: top, 
    width: right - left, 
    height: bottom - top
  };
}

export function createRect(r) {
  let rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  setAttributes(rect, {
    x: r.x,
    y: r.y,
    width: r.width,
    height: r.height
  });

  return rect;
}

export function createTransparentRect(r) {
  let rect = createRect(r);

  setAttributes(rect, {
    opacity: 0
  });

  return rect;
}

function createDivContent(contentStr, fontColor = '#FF0000', fontFamily = "/Helvetica", fontSize = 12, isBold = false, isItalic = false, isUnderline = false, isLineThrough = false) {
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
        editorDiv.style.textDecoration = 'underline line-through'
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

function removeDivContent(divElement) {
  document.body.removeChild(divElement);
}

function getContentStrArray(divElement) {
  const contentStrArray = [];
  {
    let getBoundingClientRect = function(textNode) {
      const range = document.createRange();
      range.selectNode(textNode);
      return range.getBoundingClientRect();
    };
  
    let xPos = parseInt(divElement.style.left, 10);
    let yPos = parseInt(divElement.style.top, 10);
    const renderFontSize = parseInt(divElement.style.fontSize);
    const textNodeHeight = Math.ceil(getBoundingClientRect(divElement.firstChild).height);
    yPos += (renderFontSize - Math.ceil((textNodeHeight - renderFontSize) / 2));

    const divs = divElement.getElementsByTagName("div");
    if (divs.length === 0) {
      contentStrArray.push({ x: xPos, y: yPos, content: divElement.textContent});
    } else {
      const first = divElement.firstChild;
      if (first?.nodeName === "#text") {
        contentStrArray.push({ x: xPos, y: yPos, content: first.data});
      }

      for (let i = 0; i < divs.length; i++) {
        const div = divs[i];
        const first = div.firstChild;
        const height = div.getBoundingClientRect().height;
        yPos += height;
        if (first?.nodeName === "#text") {
          contentStrArray.push({ x: xPos, y: yPos, content: first.data});
        }
      }
    }
  }

  return contentStrArray;
}

function createPngImageUrl(rect, contentStrArray, fontColor, opacity = 1, fontFamily = "/Helvetica", fontSize = 12, isBold = false, isItalic = false, isUnderline = false, isLineThrough = false) {
  // 텍스트 너비/높이 측정
  const measureText = (ctx, text) => {
    let metrics = ctx.measureText(text);
    return {
      width: Math.floor(metrics.width),
      height: Math.floor(metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent),
      actualHeight: Math.floor(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent)
    };
  };

  // 밑줄 그리기
  const drawUnderline = (ctx, text, x, y) => {
    const metrics = measureText(ctx, text);
    const fontSize = Math.floor(metrics.actualHeight * 1.4); // 140% the height 
    const lineWidth = Math.ceil(fontSize * 0.08);
    switch (ctx.textAlign) {
      case "center" : x -= (metrics.width / 2) ; break;
      case "right"  : x -= metrics.width       ; break;
    }
    switch (ctx.textBaseline) {
      case "top"    : y += (fontSize)     ; break;
      case "middle" : y += (fontSize / 2) ; break;
    }

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = lineWidth
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
      case "center" : x -= (metrics.width / 2) ; break;
      case "right"  : x -= metrics.width       ; break;
    }
    switch (ctx.textBaseline) {
      case "top"    : y += (fontSize)     ; break;
      case "middle" : y += (fontSize / 2) ; break;
    }

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = ctx.fillStyle;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(x, y - (metrics.height / 2) + lineWidth);
    ctx.lineTo(x + metrics.width, y - (metrics.height / 2) + lineWidth);
    ctx.stroke();
    ctx.restore();
  };

  let canvas = document.createElement("canvas");
  const scaleX = 2, scaleY = 2;
  let w =  rect.width, h = rect.height;
  canvas.width = w * scaleX, canvas.height = h * scaleY;                                                         
  let ctx = canvas.getContext("2d");
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
  if (typeof fontFamily === "string") {
    fontStr += ` ${fontFamily.replace('/', '')}`;
  }
  ctx.font = fontStr;

  // 텍스트 렌더링(텍스트, 밑줄, 취소선)
  for (let i = 0; i < contentStrArray.length; i++) {
    const xPos = contentStrArray[i].x - rect.x, yPos = contentStrArray[i].y - rect.y;
    ctx.fillText(contentStrArray[i].content, xPos, yPos);
    if (isUnderline) {
      drawUnderline(ctx, contentStrArray[i].content, xPos, yPos);
    }
    if (isLineThrough) {
      drawLineThrough(ctx, contentStrArray[i].content, xPos, yPos);
    }
  }
  
  return canvas.toDataURL("image/png");
}

export function calcDivContentSize(contentStr, fontColor = '#FF0000', fontFamily = "/Helvetica", fontSize = 12, isBold = false, isItalic = false, isUnderline = false, isLineThrough = false) {
  const editorDiv = createDivContent(contentStr, fontColor, fontFamily, fontSize, isBold, isItalic, isUnderline, isLineThrough);
  const editorDivRect = editorDiv.getBoundingClientRect();
  removeDivContent(editorDiv);

  return {cx: editorDivRect.width, cy: editorDivRect.height};
}

export function calcAnnotationContentSize(aText, renderFontSize) {
  return calcDivContentSize(aText.content, aText.fontColor, aText.fontFamily, renderFontSize, (aText.fontWeight === 'bold'), (aText.fontStyle === 'italic'), aText.textDecoration.underline, aText.textDecoration.linethrough);
}

export function createDivContentImage(contentStr, fontColor = '#FF0000', fontFamily = "/Helvetica", fontSize = 12, isBold = false, isItalic = false, isUnderline = false, isLineThrough = false) {
  const editorDiv = createDivContent(contentStr, fontColor, fontFamily, fontSize, isBold, isItalic, isUnderline, isLineThrough);
  const editorDivRect = editorDiv.getBoundingClientRect();
  const contentStrArray = getContentStrArray(editorDiv);
  const imageUrl = createPngImageUrl(editorDivRect, contentStrArray, fontColor, 1, fontFamily, fontSize, isBold, isItalic, isUnderline, isLineThrough);
  removeDivContent(editorDiv);

  return {w:editorDivRect.width, h:editorDivRect.height, imageUrl:imageUrl};
}

export function createAnnotationContentImage(aText) {
  const divContentImage = createDivContentImage(aText.content, aText.fontColor, aText.fontFamily, aText.fontSize, (aText.fontWeight === 'bold'), (aText.fontStyle === 'italic'), aText.textDecoration.underline, aText.textDecoration.linethrough);
  return divContentImage;
}
