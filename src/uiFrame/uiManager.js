import EventManager from '../event/eventManager.js';
import EVENT_ID from '../define/eventDefines.js';

export default (function () {
  let _popupEditing, _isEditDisabled, _selection, _range;

  return {
    hideLoadingProgress: function () {
      EventManager.dispatch(EVENT_ID.UPDATE_UI, { name: 'loadingProgress', value: false });
    },

    showLoadingProgress: function () {
      EventManager.dispatch(EVENT_ID.UPDATE_UI, { name: 'loadingProgress', value: true });
    },

    isEditDisabled: function () {
      return _isEditDisabled;
    },
    setEditDisabled: function (state) {
      _isEditDisabled = state;
    },
    isPopupEditing: function () {
      return _popupEditing;
    },
    setPopupEditing: function (state) {
      _popupEditing = state;
    },
    getSelection: function () {
      return _selection;
    },
    setSelection: function (selection) {
      _selection = selection;
      _range = _selection.rangeCount > 0 ? _selection.getRangeAt(0) : null;
    },
    setSelectionAll: function () {
      const selection = this.getSelection();
      selection.removeAllRanges();
      selection.addRange(this.getSelectedAllRange());
      this.setSelection(selection);
    },
    clearSelection: function () {
      const selection = this.getSelection();
      selection.removeAllRanges();
      this.setSelection(selection);
    },
    getRange: function () {
      return _range;
    },
    getSelectedAllRange: function () {
      // .page클래스의 모든 엘리먼트 선택
      const elements = document.querySelectorAll('.page');
      // 새로운 범위를 생성
      const range = document.createRange();
      // 범위의 시작 지점이 elements[0] 앞으로 지정되며,elements[0]가 첫 번재 노드가 됩니다.
      range.setStartBefore(elements[0]);
      // 범위의 마지막 지점이 elements[elements.length - 1] 다음으로 지정되며, elements[elements.length - 1].previousSibling이 마지막 노드가 됩니다.
      range.setEndAfter(elements[elements.length - 1]);

      return range;
    },
    isSelectedAllRange: function () {
      const selection = window.getSelection();
      if (!selection) {
        return false;
      }
      if (selection.rangeCount == 0) {
        return false;
      }
      const selectRange = selection.getRangeAt(0);
      const allRange = this.getSelectedAllRange();

      if (allRange.compareBoundaryPoints(selectRange.START_TO_START, selectRange) === 0 && allRange.compareBoundaryPoints(selectRange.END_TO_END, selectRange) === 0) {
        return true;
      }

      return false;
    },
  };
})();
