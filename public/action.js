// action.js
import "../dist/webPdfLib.js";
const webPdfApp = webPdfLib["default"];
const ACTION_ID = webPdfLib.ACTION_ID;
const DRAW_TYPE = webPdfLib.DRAW_TYPE;
const COLOR_TYPE = webPdfLib.COLOR_TYPE;
const LINE_STYLE = webPdfLib.LINE_STYLE;
const SCROLL_MODE = webPdfLib.SCROLL_MODE;
const SPREAD_MODE = webPdfLib.SPREAD_MODE;


let element = document.getElementById("home");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.ZOOM, 1);
    });
}

element = document.getElementById("thumnail");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.THUMBNAIL_VIEW);
    });
}

element = document.getElementById("AREA");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SELECT_DRAW_TOOL, DRAW_TYPE.AREA);
    });
}

element = document.getElementById("CIRCLE");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SELECT_DRAW_TOOL, DRAW_TYPE.CIRCLE);
    });
}

element = document.getElementById("HIGHLIGHT");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SELECT_DRAW_TOOL, DRAW_TYPE.HIGHLIGHT);
    });
}

element = document.getElementById("UNDERLINE");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SELECT_DRAW_TOOL, DRAW_TYPE.UNDERLINE);
    });
}

element = document.getElementById("STRIKEOUT");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SELECT_DRAW_TOOL, DRAW_TYPE.STRIKEOUT);
    });
}

element = document.getElementById("LINE");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SELECT_DRAW_TOOL, DRAW_TYPE.LINE);
    });
}

element = document.getElementById("PEN");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SELECT_DRAW_TOOL, DRAW_TYPE.PEN);
    });
}

element = document.getElementById("TEXT");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SELECT_DRAW_TOOL, DRAW_TYPE.TEXT);
    });
}

element = document.getElementById("MEMO");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SELECT_DRAW_TOOL, DRAW_TYPE.MEMO);
        alert(isMobile)
    });
}
element = document.getElementById("AProperty");
if (element) {
    element.addEventListener("click", (e) => {
        const target = undefined;
        // 채우기색
        webPdfApp.getActionManager().Execute(
            ACTION_ID.CHANGE_PROPERTY,
            webPdfApp.getValueGenerator().createFillColorValue(target, COLOR_TYPE.solid, '#FF0000')
        );
        // 선색
        webPdfApp.getActionManager().Execute(
            ACTION_ID.CHANGE_PROPERTY,
            webPdfApp.getValueGenerator().createLineFillColorValue(target, COLOR_TYPE.solid, '#0000FF')
        );
        // 투명도
        webPdfApp.getActionManager().Execute(
            ACTION_ID.CHANGE_PROPERTY,
            webPdfApp.getValueGenerator().createFillOpacityrValue(target, 50)
        );
        // 선 굵기
        webPdfApp.getActionManager().Execute(
            ACTION_ID.CHANGE_PROPERTY,
            webPdfApp.getValueGenerator().createLineWidthValue(target, 5)
        );
        // 선 스타일
        webPdfApp.getActionManager().Execute(
            ACTION_ID.CHANGE_PROPERTY,
            webPdfApp.getValueGenerator().createLineStyleValue(target, LINE_STYLE.dashed_5_15)
        );
    });
}
element = document.getElementById("AOpenPDF");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.OPEN_FILE);
        // webPdfApp.getActionManager().Execute(ACTION_ID.OPEN_FILE, "http://localhost:8192/dist/libs/pdfjs/web/compressed.tracemonkey-pldi-09.pdf");
        // webPdfApp.getActionManager().Execute(ACTION_ID.OPEN_FILE, "/dist/libs/pdfjs/web/compressed.tracemonkey-pldi-09.pdf");
        // let binaryStr = atob(
        // 	'JVBERi0xLjcKCjEgMCBvYmogICUgZW50cnkgcG9pbnQKPDwKICAvVHlwZSAvQ2F0YWxvZwog' +
        // 	'IC9QYWdlcyAyIDAgUgo+PgplbmRvYmoKCjIgMCBvYmoKPDwKICAvVHlwZSAvUGFnZXMKICAv' +
        // 	'TWVkaWFCb3ggWyAwIDAgMjAwIDIwMCBdCiAgL0NvdW50IDEKICAvS2lkcyBbIDMgMCBSIF0K' +
        // 	'Pj4KZW5kb2JqCgozIDAgb2JqCjw8CiAgL1R5cGUgL1BhZ2UKICAvUGFyZW50IDIgMCBSCiAg' +
        // 	'L1Jlc291cmNlcyA8PAogICAgL0ZvbnQgPDwKICAgICAgL0YxIDQgMCBSIAogICAgPj4KICA+' +
        // 	'PgogIC9Db250ZW50cyA1IDAgUgo+PgplbmRvYmoKCjQgMCBvYmoKPDwKICAvVHlwZSAvRm9u' +
        // 	'dAogIC9TdWJ0eXBlIC9UeXBlMQogIC9CYXNlRm9udCAvVGltZXMtUm9tYW4KPj4KZW5kb2Jq' +
        // 	'Cgo1IDAgb2JqICAlIHBhZ2UgY29udGVudAo8PAogIC9MZW5ndGggNDQKPj4Kc3RyZWFtCkJU' +
        // 	'CjcwIDUwIFRECi9GMSAxMiBUZgooSGVsbG8sIHdvcmxkISkgVGoKRVQKZW5kc3RyZWFtCmVu' +
        // 	'ZG9iagoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4g' +
        // 	'CjAwMDAwMDAwNzkgMDAwMDAgbiAKMDAwMDAwMDE3MyAwMDAwMCBuIAowMDAwMDAwMzAxIDAw' +
        // 	'MDAwIG4gCjAwMDAwMDAzODAgMDAwMDAgbiAKdHJhaWxlcgo8PAogIC9TaXplIDYKICAvUm9v' +
        // 	'dCAxIDAgUgo+PgpzdGFydHhyZWYKNDkyCiUlRU9G'
        // );
        // const file = Uint8Array.from(binaryStr, ch => ch.charCodeAt(0));
        // webPdfApp.getActionManager().Execute(ACTION_ID.OPEN_FILE, file);
    });
}
element = document.getElementById("AOpenJson");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.OPEN_ANNOTATION);
        // webPdfApp.getActionManager().Execute(ACTION_ID.OPEN_ANNOTATION, "http://localhost:8192/dist/libs/pdfjs/web/compressed.tracemonkey-pldi-09.json");
        // webPdfApp.getActionManager().Execute(ACTION_ID.OPEN_ANNOTATION, "/dist/libs/pdfjs/web/compressed.tracemonkey-pldi-09.json");
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
        // 	'ODA2MC03ZjFhLTQyOTUtODc0ZC05Y2VlYWMxZGExYjAiLCJwYWdlIjozfV0='
        // );
        // const file = Uint8Array.from(binaryStr, ch => ch.charCodeAt(0));
        // webPdfApp.getActionManager().Execute(ACTION_ID.OPEN_ANNOTATION, file);
    });
}
element = document.getElementById("AUndo");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.UNDO);
    });
}
element = document.getElementById("ARedo");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.REDO);
    });
}
element = document.getElementById("ADownload");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.DOWNLOAD);
        // webPdfApp.getActionManager().Execute(ACTION_ID.DOWNLOAD, "compressed.tracemonkey-pldi-09.pdf");
    });
}
element = document.getElementById("ADownloadAnnotation");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.DOWNLOAD_ANNOTATION);
        // webPdfApp.getActionManager().Execute(ACTION_ID.DOWNLOAD_ANNOTATION, "compressed.tracemonkey-pldi-09.json");
    });
}
element = document.getElementById("ASave");
if (element) {
    element.addEventListener("click", (e) => {
        // webPdfApp.getActionManager().Execute(ACTION_ID.SAVE);
        webPdfApp.getActionManager().Execute(ACTION_ID.SAVE, true);
    });
}
element = document.getElementById("ASaveAnnotation");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SAVE_ANNOTATION);
    });
}
element = document.getElementById("AGoToPage");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.goToPage(5);
    });
}
element = document.getElementById("ARotateCW");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.ROTATE_CW);
    });
}

element = document.getElementById("ARotateCCW");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.ROTATE_CCW);
    });
}

element = document.getElementById("AScrollPage");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SWITCH_SCROLL_MODE, SCROLL_MODE.scrollPage);
    });
}

element = document.getElementById("AScrollVertical");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SWITCH_SCROLL_MODE, SCROLL_MODE.scrollVertical);
    });
}

element = document.getElementById("ASpreadNone");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SWITCH_SPREAD_MODE, SPREAD_MODE.spreadNone);
    });
}

element = document.getElementById("ASpreadOdd");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.SWITCH_SPREAD_MODE, SPREAD_MODE.spreadOdd);
    });
}

element = document.getElementById("APrint");
if (element) {
    element.addEventListener("click", (e) => {
        webPdfApp.getActionManager().Execute(ACTION_ID.PRINT);
    });
}