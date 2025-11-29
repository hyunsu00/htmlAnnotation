// main.js
import "../dist/annotationLib.js";
const webPdfApp = annotationLib["default"];
const ACTION_ID = annotationLib.ACTION_ID;
const EVENT_ID = annotationLib.EVENT_ID;
const DRAW_TYPE = annotationLib.DRAW_TYPE;
const COLOR_TYPE = annotationLib.COLOR_TYPE;
const LINE_STYLE = annotationLib.LINE_STYLE;
const SCROLL_MODE = annotationLib.SCROLL_MODE;
const SPREAD_MODE = annotationLib.SPREAD_MODE;
// import webPdfAppListener from "./listener.js";
// import mobile from "./mobile.js";

async function fetchHtmlAsText({ mainHtmlUrl, sideHtmlUrl }) {
	// !!! htmlStr이 정확히 넘어오는지 확인해야 한다.
	const mainHtmlUrlStr = await (await fetch(mainHtmlUrl)).text();
	const sideHtmlUrlStr = await (await fetch(sideHtmlUrl)).text();
	const htmlStr = sideHtmlUrlStr + mainHtmlUrlStr;
	return htmlStr;
}

window.onload = () => {
	const publicPath = ``;
	// const pdfjs_wrapEl = document.querySelector("#pdfjs_wrap");
	// if (pdfjs_wrapEl == null) {
	// 	return;
	// }
	// pdfjs_wrapEl.innerHTML = webPdfApp.getSideTemplate() + webPdfApp.getMainTemplate();
	//
	// webPdfApp.initialize({
	// 	lipsPath : `${publicPath}/dist/libs`
	// });
	webPdfApp.initialize({
		lipsPath: `${publicPath}/dist/libs`,
		defaultUrl: `${publicPath}/dist/libs/pdfjs/web/compressed.tracemonkey-pldi-09.pdf`,
		streaming: true
	});
	//
	// webPdfApp.initialize({
	// 	lipsPath : `${publicPath}/dist/libs`,
	// 	defaultUrl : `${publicPath}/dist/libs/pdfjs/web/sample_ko-KR.pdf`
	// });
	//
	// webPdfApp.initialize({
	// 	lipsPath : `${publicPath}/dist/libs`,
	// 	defaultUrl : `${publicPath}/dist/libs/pdfjs/web/compressed.tracemonkey-pldi-09.pdf`, 
	// 	renderExternalAnnotations: true
	// });
	//
	// webPdfApp.initialize({
	// 	lipsPath : `${publicPath}/dist/libs`,
	// 	defaultUrl : `${publicPath}/dist/libs/pdfjs/web/compressed.tracemonkey-pldi-09.pdf`, 
	// 	annotationUrl: `${publicPath}/dist/libs/pdfjs/web/compressed.tracemonkey-pldi-09.json`
	// });
	//
	// webPdfApp.initialize({
	// 	lipsPath : `${publicPath}/dist/libs`,
	// 	defaultUrl : `${publicPath}/dist/libs/pdfjs/web/compressed.tracemonkey-pldi-09.pdf`,
	// 	annotationUrl: `${publicPath}/dist/libs/pdfjs/web/compressed.tracemonkey-pldi-09.json`,
	// 	documentName: "문서뷰어"
	// });

	// webPdfAppListener.initialize();
	// mobile.addTouchEvents();

	webPdfApp.getEventManager().on(EVENT_ID.ERROR, (event) => {
		const { errType } = event.detail;
		switch (errType) {
			case 'ERR_ON_STREAMING':
				console.log("error ERR_ON_STREAMING");
				break;
			default:
				break;
		}
	});
};
