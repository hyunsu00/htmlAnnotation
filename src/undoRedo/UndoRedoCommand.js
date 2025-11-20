// UndoRedoCommand.js
import AnnotationManager from "../annotation/annotationManager.js";
import AnnotationUtils from "../annotation/annotationUtils.js";

export class UndoRedoCommand {
	constructor(docId, pageId, targetId, result) {
		this._docId = docId;
		this._pageId = pageId;
		this._targetId = targetId;
		this._result = result;
	}
	Undo() {
		// 선택된 도형이 있다면 해제한다.
		// _Undo() 실행전 호출되어야 한다.
		// point annotation 일 경우 선택해제 전 고정딘 overlay를 삭제한다.
		if(this.GetTarget()) {
			let type = this.GetTarget().getAttribute('data-pdf-annotate-type');
			if (type === 'point') {
				let parent = this.GetParent().parentNode;
				let target = parent.querySelector('section[data-target-id="' + this.GetTargetID() + '"]');
				if(target) {
					parent.removeChild(target);
				}
			}

		}
		AnnotationManager.select(null);

		this._Undo();

		// 썸네일 업데이트
		// _Undo() 실행후 호출되어야 한다.
		if(this.GetPageID()) {
			AnnotationManager.renderThumnail(this.GetPageID());
		}
	}
	Redo() {
		// 선택된 도형이 있다면 해제한다.
		// _Redo() 실행전 호출되어야 한다.
		AnnotationManager.select(null);

		this._Redo();

		// 썸네일 업데이트
		// _Redo() 실행후 호출되어야 한다.
		if(this.GetPageID()) {
			AnnotationManager.renderThumnail(this.GetPageID());
		}
	}

	//
	// 추상 매서드 (상속받는 클래스에서 반드시 구현 해주어야 한다.)
	//
	_Undo() {
		throw new Error(this.constructor.name + '클래스는 _Undo() 를 구현해 주어야 한다.');
	}
	_Redo() {
		throw new Error(this.constructor.name + '클래스는 _Redo() 를 구현해 주어야 한다.');
	}

	GetDocID() {
		return this._docId;
	}
	GetPageID() {
		return this._pageId;
	}
	GetTargetID() {
		return this._targetId;
	}
	GetParent() {
		return document.querySelector(`svg[data-pdf-annotate-page="${this._pageId}"]`);
	}
	GetPage() {
		return document.querySelector(`div.page[data-page-number="${this._pageId}"]`);
	}
	GetTarget() {
		return this.GetParent().querySelector('[data-pdf-annotate-id="' + this._targetId + '"]');
	}
}

export class AddFormCommand extends UndoRedoCommand {

	constructor(docId, pageId, targetId, result) {
		super(docId, pageId, targetId, result);
	}

	_Undo () {
		// element 업데이트
		AnnotationUtils.removeAnnotationNode(this.GetParent(), this.GetTarget());
		
		// localStorage 업데이트
		AnnotationUtils.removeAnnotation(this.GetDocID(), this.GetTargetID());
	}

	_Redo() {
		// element 업데이트
		AnnotationUtils.addAnnotationNode(this.GetParent(), JSON.parse(this._result.redo.str));

		// localStorage 업데이트
		AnnotationUtils.addAnnotation(this.GetDocID(), this.GetTargetID(), this._result.redo.str);
	}
}

export class AddChildFormCommand extends UndoRedoCommand {

	constructor(docId, pageId, targetId, result) {
		super(docId, pageId, targetId, result);
	}

	_Undo () {
		// element 업데이트
		AnnotationUtils.updateAnnotationNode(this.GetParent(), JSON.parse(this._result.undo.str));

		// localStorage 업데이트
		AnnotationUtils.updateAnnotation(this.GetDocID(), this.GetTargetID(), this._result.undo.str);
	}

	_Redo() {
		// element 업데이트
		AnnotationUtils.updateAnnotationNode(this.GetParent(), JSON.parse(this._result.redo.str));

		// localStorage 업데이트
		AnnotationUtils.updateAnnotation(this.GetDocID(), this.GetTargetID(), this._result.redo.str);
	}
}

export class ModifyFormCommand extends UndoRedoCommand {

	constructor(docId, pageId, targetId, result) {
		super(docId, pageId, targetId, result);
	}

	_Undo () {
		// element 업데이트
		AnnotationUtils.updateAnnotationNode(this.GetParent(), JSON.parse(this._result.undo.str));

		// localStorage 업데이트
		AnnotationUtils.updateAnnotation(this.GetDocID(), this.GetTargetID(), this._result.undo.str);
	}

	_Redo() {
		// element 업데이트
		AnnotationUtils.updateAnnotationNode(this.GetParent(), JSON.parse(this._result.redo.str));

		// localStorage 업데이트
		AnnotationUtils.updateAnnotation(this.GetDocID(), this.GetTargetID(), this._result.redo.str);
	}
}

export class RemoveFormCommand extends UndoRedoCommand {

	constructor(docId, pageId, targetId, result) {
		super(docId, pageId, targetId, result);
	}

	_Undo() {
		// element 업데이트
		const target = AnnotationUtils.getAnnotationNode(this.GetParent(), this._result.undo.nextId);
		AnnotationUtils.insertAnnotationNode(this.GetParent(), target, JSON.parse(this._result.undo.str));
		
		// localStorage 업데이트
		const targetIndex = AnnotationUtils.getAnnotationIndex(this.GetDocID(), this._result.undo.nextId);
		AnnotationUtils.insertAnnotation(this.GetDocID(), targetIndex, this._result.undo.str);
	}

	_Redo() {
		// element 업데이트
		AnnotationUtils.removeAnnotationNode(this.GetParent(), this.GetTarget());

		// localStorage 업데이트
		AnnotationUtils.removeAnnotation(this.GetDocID(), this.GetTargetID());
	}
}

export class ModifyComment extends UndoRedoCommand {

	constructor(docId, pageId, targetId, result) {
		super(docId, pageId, targetId, result);
	}

	_Undo () {
		// comment popup 업데이트
		AnnotationUtils.updateAnnotationPopup(this._result.undo.targetId, this.GetPage(), JSON.parse(this._result.undo.str));

		// localStorage 업데이트
		AnnotationUtils.updateAnnotation(this.GetDocID(), this.GetTargetID(), this._result.undo.str);
	}

	_Redo() {
		// comment popup 업데이트
		AnnotationUtils.updateAnnotationPopup(this._result.undo.targetId, this.GetPage(), JSON.parse(this._result.redo.str));

		// localStorage 업데이트
		AnnotationUtils.updateAnnotation(this.GetDocID(), this.GetTargetID(), this._result.redo.str);
	}
}
