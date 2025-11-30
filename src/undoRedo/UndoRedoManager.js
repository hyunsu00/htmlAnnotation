export default class UndoRedoManager {

	_undoStack = [];
	_redoStack = [];

	constructor(docID) {
		this._docID = docID;
		this._UpdateUI();
	}
	
	Add(command) {
		this._undoStack.push(command);
		if (this._redoStack.length > 0) {
			this._redoStack = [];
		}
		
		this._UpdateUI();
		this._Debug('[UndoRedoManager.Add]');
	}

	Undo() {
		if (this._undoStack.length > 0) {
			let command = this._undoStack.pop();
			this._redoStack.push(command);
			command.Undo();
		}
		this._UpdateUI();
		this._Debug('[UndoRedoManager.Undo]');
	}

	Redo() {
		if (this._redoStack.length > 0) {
			let command = this._redoStack.pop();
			this._undoStack.push(command);
			command.Redo();
		}
		this._UpdateUI();
		this._Debug('[UndoRedoManager.Redo]');
	}

	IsUndo() {
		return this._undoStack.length ? true : false;
	}

	IsRedo() {
		return this._redoStack.length ? true : false;
	}

	_UpdateUI() {
	}

	_Debug(funcName) {
		console.log(`call ${funcName} undo_length = ${this._undoStack.length}, redo_length = ${this._redoStack.length}`);
	}
}
