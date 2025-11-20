// annotationListener.js
/*
import UiController from '../../../commonFrame/js/uiFramework/uiController.js';
import UIDefine from '../../../commonFrame/js/uiFramework/uiDefine.js';
import CommonFrameUtil from '../../../commonFrame/js/utils/util.js';
*/
/*
import UiManager from '../../uiFrame/uiManager.js';
*/
import { AddFormCommand, AddChildFormCommand, ModifyFormCommand, RemoveFormCommand, ModifyComment } from '../undoRedo/UndoRedoCommand.js';
import webPdfLib from '../webPdfLib.js';
import annotationManager from '../annotation/annotationManager.js';
import EVENT_ID from "../define/eventDefines.js";
import EventManager from "../event/eventManager.js";

export default (function () {
  
  function clearSelection() {
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    } else if (document.selection) {
      document.selection.empty();
    }
  }

  return {
    onAnnotationAdd: function (docId, pageNumber, annotation) {
      console.log(`call annotationListener.onAnnotationAdd(docId = ${docId}, pageNumber = ${pageNumber}, annotation =`, annotation, ')');
    },
    onAnnotationEdit: function (docId, annotationId, annotation) {
      console.log(`call annotationListener.onAnnotationEdit(docId = ${docId}, annotationId = ${annotationId}, annotation =`, annotation, ')');
    },
    onAnnotationDelete: function (docId, annotationId) {
      console.log(`call annotationListener.onAnnotationDelete(docId = ${docId}, annotationId = ${annotationId})`);
    },
    onCommentAdd: function (docId, annotationId, comment) {
      console.log(`call annotationListener.onCommentAdd(docId = ${docId}, annotationId = ${annotationId}, comment =`, comment, ')');
    },
    onCommentDelete: function (docId, commentId) {
      console.log(`call annotationListener.onCommentAdd(docId = ${docId}, annotationId = ${commentId})`);
    },

    onAnnotationUpdated: function (docId, annotations) {
      console.log(`call annotationListener.onAnnotationUpdated(docId = ${docId}, annotationId =`, annotations, ')');
      annotationManager.modified = true;
    },

    // 도형 클릭 선택
    onAnnotationSelected: function (target, rects) {
      console.log('call annotationListener.onAnnotationSelected(target = ', target, ')');
      EventManager.dispatch(EVENT_ID.ANNOTATION_SELECTED, {target, rects});
      clearSelection();
    },

    // 클릭된 도형 해제
    onAnnotationUnSelected: function (target) {
      console.log('call annotationListener.onAnnotationUnSelected(target = ', target, ')');
      EventManager.dispatch(EVENT_ID.ANNOTATION_UNSELECTED, {target});
    },

    // 스티커노트 추가
    onAnnotationAddComment: function (documentId, pageNumber, annotationId, content, dataString, author) {
      console.log(`call annotationListener.onAnnotationAddComment`);
      annotationManager.addComment(documentId, pageNumber, annotationId, content, dataString, author);
    },

    onAnnotationAddForm: function (docId, pageId, target, result) {
      console.log(`call annotationListener.onAnnotationAddForm(docId = ${docId}, pageId = ${pageId}, target = `, target, `, result =`, result, ')');
      if (annotationManager.annotationType != 'draw' && annotationManager.annotationType != 'cursor') {
        annotationManager.switchUI('cursor');
      }
      webPdfLib.gUndoRedoManager.Add(new AddFormCommand(docId, pageId, target, result));
      annotationManager.renderThumnail(pageId);
    },
    onAnnotationAddChildForm: function (docId, pageId, target, result) {
      console.log(`call annotationListener.onAnnotationAddChildForm(docId = ${docId}, pageId = ${pageId}, target = `, target, `, result =`, result, ')');
      webPdfLib.gUndoRedoManager.Add(new AddChildFormCommand(docId, pageId, target, result));
      annotationManager.renderThumnail(pageId);
    },
    onAnnotationModifyForm: function (docId, pageId, target, result) {
      console.log(`call annotationListener.onAnnotationModifyForm(docId = ${docId}, pageId = ${pageId}, target = `, target, `, result =`, result, ')');
      webPdfLib.gUndoRedoManager.Add(new ModifyFormCommand(docId, pageId, target, result));
      annotationManager.renderThumnail(pageId);
    },
    onAnnotationRemoveForm: function (docId, pageId, target, result) {
      console.log(`call annotationListener.onAnnotationRemoveForm(docId = ${docId}, pageId = ${pageId}, target = `, target, `, result =`, result, ')');
      webPdfLib.gUndoRedoManager.Add(new RemoveFormCommand(docId, pageId, target, result));
      annotationManager.renderThumnail(pageId);
    },
    onAnnotationModifyComment: function (docId, pageId, target, result) {
      console.log(`call annotationListener.onAnnotationModifyComment(docId = ${docId}, pageId = ${pageId}, target = `, target, `, result =`, result, ')');
      webPdfLib.gUndoRedoManager.Add(new ModifyComment(docId, pageId, target, result));
    },

    // 주석 사이드바 활성 / 비활성 (value = false) => 호출되면 주석 사이드바 UI 비활성
    onSetAnnotationSidebarEnable: function (value) {
      console.log(`call annotationListener.onSetAnnotationSidebarEnable(value = ${value})`);
/*      
      UiManager.onSetAnnotationSidebarEnable(value);
*/      
    },
    // 서식툴바 활성 / 비활성 설정 (value = true) ==> 호출되면 서식툴바 UI 비활성
    onSetStyleBarDisableState: function (value) {
      console.log(`call annotationListener.onSetDisableState(value = ${value})`);
/*      
      UiManager.onSetStyleBarDisableState(value);
*/      
    },
    onSetUIEvents: function (value) {
      console.log(`call annotationListener.onSetUIEvents(value = ${value})`);
/*      
      UiManager.onSetUIEvents(value);
*/      
    },

    // 스티커노트 팝업 상태 체크 (value = true)
    onSetPopupEditingState: function (value) {
      console.log(`call annotationListener.onSetPopupEditingState(value = ${value})`);
/*      
      UiManager.setPopupEditing(value);
*/      
    },
    onSetEventAction: function (state, value) {
      console.log(`call annotationListener.onSetEventAction`);
/*      
      UiManager.setEventAction(state, value);
*/      
    },
  };
})();
