/**
 * @category Event
 * @class EventManager
 */
export default (function () {
  return {
    /**
     * 이벤트 등록
     * @memberof EventManager
     * @param {EVENT_ID} eID - 이벤트 ID
     * @param {eventCallback} cb - 이벤트 발생시 호출되는 콜백함수
     * 
     */
    on(eID, cb) {
      document.addEventListener(eID, cb);
    },
    /**
     * 이벤트 취소
     * @memberof EventManager
     * @param {EVENT_ID} eID - 이벤트 ID
     * @param {eventCallback} cb - 이벤트 발생시 호출되는 콜백함수
     * 
     */
    off(eID, cb) {
      document.removeEventListener(eID, cb);
    },
    /**
     * 이벤트 실행
     * @memberof EventManager
     * @param {EVENT_ID} eID - 이벤트 ID
     * @param {Object} data - 이벤트 데이타
     * 
     */
    dispatch(eID, data) {
      document.dispatchEvent(new CustomEvent(eID, { detail: data }));
    }
  };
})();
