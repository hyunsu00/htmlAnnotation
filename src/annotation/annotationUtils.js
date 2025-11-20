import AnnotationManager from "./annotationManager.js";

export default class AnnotationUtils {
	//
	// localStorage
	//
	static getAnnotations(docId) {
		return JSON.parse(localStorage.getItem(`${docId}/annotations`)) || [];
	}

	static updateAnnotations(docId, annotations) {
		AnnotationManager.annotateRender.getStoreAdapter().updateAnnotations(docId, annotations);
	}

	static async getAnnotationsByUrl(annotationUrl) {
		try {
			const response = await fetch(annotationUrl);
			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Error fetching annotations:', error);
			return null;
		}
	}

	static getAnnotationIndex(docId, annotationId) {
		let index = -1;
		let annotations = AnnotationUtils.getAnnotations(docId);
		for (let i = 0, l = annotations.length; i < l; i++) {
			if (annotations[i].uuid === annotationId) {
				index = i;
				break;
			}
		}

		return index;
	}

	static getAnnotation(docId, annotationId) {
		let annotations = AnnotationUtils.getAnnotations(docId);
		for (let i = 0, l = annotations.length; i < l; i++) {
			if (annotations[i].uuid === annotationId) {
				return annotations[i];
			}
		}
		
		return null;
	}

	static updateAnnotation(docId, annotationId, jsonStr) {
		let index = AnnotationUtils.getAnnotationIndex(docId, annotationId);
		if (index < 0) {
			throw new Error('주석개체를 찾을수가 없어 수정을 할수 없다.');
		}

		let annotations = AnnotationUtils.getAnnotations(docId);
		annotations[index] = JSON.parse(jsonStr);
		AnnotationUtils.updateAnnotations(docId, annotations);
	}

	static addAnnotation(docId, annotationId, jsonStr) {
		let index = AnnotationUtils.getAnnotationIndex(docId, annotationId);
		if (index >= 0) {
			throw new Error('주석개체가 이미있어 추가를 할수 없다.');
		}

		let annotations = AnnotationUtils.getAnnotations(docId);
		annotations.push(JSON.parse(jsonStr));
		AnnotationUtils.updateAnnotations(docId, annotations);
	}

	static insertAnnotation(docId, targetIndex, jsonStr) {
		let insertIndex = 0;
		if (targetIndex > 1) {
			insertIndex = targetIndex - 1; 
		}
		let annotations = AnnotationUtils.getAnnotations(docId);
		if (insertIndex < 0 || insertIndex > annotations.length) {
			throw new Error('주석개체의 추가할 영역이 넘어감');
		}

		annotations.splice(insertIndex, 0, JSON.parse(jsonStr));
		AnnotationUtils.updateAnnotations(docId, annotations);
	}

	static removeAnnotation(docId, annotationId) {
		let index = AnnotationUtils.getAnnotationIndex(docId, annotationId);
		if (index < 0) {
			throw new Error('주석개체를 찾을수가 없어 삭제를 할수 없다.');
		}

		let annotations = AnnotationUtils.getAnnotations(docId);
		annotations.splice(index, 1);
		AnnotationUtils.updateAnnotations(docId, annotations);
	}

	//
	// element
	//
	static getAnnotationNode(svg, annotationId) {
		return svg.querySelector('[data-pdf-annotate-id="' + annotationId + '"]');
	}

	static updateAnnotationNode(svg, annotation) {
		AnnotationManager.annotateRender.replaceChild(svg, annotation);
	}

	static addAnnotationNode(svg, annotation) {
		AnnotationManager.annotateRender.appendChild(svg, annotation);
	}

	static insertAnnotationNode(svg, target, annotation) {
		if (target) {
			AnnotationManager.annotateRender.insertBefore(svg, target, annotation);
		} else {
			AnnotationManager.annotateRender.appendChild(svg, annotation);	
		}
	}

	static removeAnnotationNode(svg, target) {
		svg.removeChild(target);
		// point일 경우 popup도 같이 제거해준다.
		let type = target.getAttribute('data-pdf-annotate-type');
		if (type === 'point') {
			let parent = svg.parentNode;
			let id = target.getAttribute('data-pdf-annotate-id');
			let overlay = parent.querySelector('section[data-target-id="' + id + '"]');
			if(overlay) {
				parent.removeChild(overlay);
			}
		}
	}

	static removeAllAnnotationNodes() {
		// 모든 <svg class="annotationLayer"> 요소 선택
		const annotationLayers = document.querySelectorAll('svg.annotationLayer');

		// 각 요소를 반복하면서 DOM에서 제거
		annotationLayers.forEach(function(annotationLayer) {
			annotationLayer.remove();
		});
	}

	static updateAnnotationPopup(targetIndex, svg, comment) {
		let targetOverlay =	svg.querySelector(`section.annotationLayer[data-target-id="${targetIndex}"]`);

		if (targetOverlay) {
			let popupConent = targetOverlay.querySelector("div .popupContent");
			if (popupConent.hasChildNodes()) {
				popupConent.childNodes[0].data = comment.content;
			}
		}
	}

	//
	// 주석 텍스트 박스 이미지 생성
	//
	static createAnnotationContentImage(pageId, aText) {
		const annotateRender = AnnotationManager.annotateRender;
		const fontSize = parseInt(aText.fontSize, 10);
		{
			const VIEWPORT_SCALE_FACTOR = 96.0 / 72.0;
			const svg = annotateRender.getSVGElement(pageId);
			let docScale = 1.0;
			let viewport = null;
			if (svg) {
				viewport = JSON.parse(svg.getAttribute('data-pdf-annotate-viewport'));
				docScale = viewport.scale;
			}
			
			const renderFontSize = Math.floor(Math.floor(fontSize * VIEWPORT_SCALE_FACTOR) * docScale);
			const aTextSize = annotateRender.calcAnnotationContentSize(aText, renderFontSize);
			let bbox = {x:0, y:0, width:aTextSize.cx, height:aTextSize.cy};
			bbox = annotateRender.convertToSvgRect(bbox, svg, viewport);
			aText.width = bbox.width;
			aText.height = bbox.height;
			aText.fontSize = renderFontSize;
		}
		const imageUrl = annotateRender.createAnnotationContentImage(aText).imageUrl;
		aText.fontSize = fontSize;
		
		return {w:aText.width, h:aText.height, imageUrl: imageUrl};
	}

	static exportKcnetAnnotations(annotations) {
		const result = annotations.reduce((acc, item) => {
			const pageKey = `page${item.page}`;
			if (!acc[pageKey]) acc[pageKey] = [];
			
			const newItem = { ...item };
			delete newItem.page;  // 페이지 정보 제거
		
			acc[pageKey].push(newItem);
			return acc;
		}, {});

		return result;
	}

	static importAnnotations(kcnetAnnotations) {
		const result = Object.keys(kcnetAnnotations).flatMap(pageKey => {
			const page = parseInt(pageKey.replace('page', ''), 10);
			return kcnetAnnotations[pageKey].map(item => ({ ...item, page }));
		});

		return result;
	}
};
