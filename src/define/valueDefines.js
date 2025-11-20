// @ts-check

/**
 * 미리정의된 줌값 설정
 * @category Action
 * @readonly
 * @const {String}
 *
 * @property {String} PAGE_ACTUAL - 실제 사이즈
 * @property {String} PAGE_HEIGHT - 쪽맞춤
 * @property {String} PAGE_WIDHT - 폭맞춤
 */
export const ZOOM_VALUE = {
  PAGE_ACTUAL: 'page-actual',
  PAGE_HEIGHT: 'page-height',
  PAGE_WIDHT: 'page-width',
};

/**
 * 찾기 타입 열거
 * @category Action
 * @readonly
 * @const {String}
 *
 * @property {String} FIND_AGAIN - 다음 찾기
 * @property {String} FIND_HIGHLIGHTALL_CHANGE - 모두 강조 표시
 * @property {String} FIND_CASESENSITIVITY_CHANGE - 대/소문자 구분
 * @property {String} FIND_ENTIREWORD_CHANGE - 단어 단위로
 */
export const FIND_TYPE = {
  FIND_AGAIN: 'again',
  FIND_HIGHLIGHTALL_CHANGE: 'highlightallchange',
  FIND_CASESENSITIVITY_CHANGE: 'casesensitivitychange',
  FIND_ENTIREWORD_CHANGE: 'entirewordchange',
};

/**
 * 주석 타입 열거
 * @category Action
 * @readonly
 * @const {String}
 *
 * @property {String} LINE - 선 그리기
 * @property {String} AREA - 직사각형
 * @property {String} CIRCLE - 원
 * @property {String} PEN - 자유형 그리기
 * @property {String} MEMO - 스티커 노트
 * @property {String} TEXT - 텍스트
 * @property {String} UNDERLINE - 밑줄
 * @property {String} STRIKEOUT - 취소선
 * @property {String} HIGHLIGHT - 형광펜
 */
export const DRAW_TYPE = {
  LINE: 'a_line',
  AREA: 'a_area',
  CIRCLE: 'a_circle',
  PEN: 'a_draw',
  MEMO: 'a_point',
  TEXT: 'a_text',
  UNDERLINE: 'a_underline',
  STRIKEOUT: 'a_strikeout',
  HIGHLIGHT: 'a_highlight',
};

/**
 * 커서 타입 열거
 * @category Action
 * @readonly
 * @const {String}
 *
 * @property {String} SELECT - 선택
 * @property {String} HAND - 손도구
 */
export const CURSOR_TYPE = {
  SELECT: 't_select',
  HAND: 't_hand,',
};

/**
 * 속성 변경 타입
 * @category Action
 * @readonly
 * @const {String}
 *
 * @property {String} sSize - 도형 크기
 * @property {String} sPosition - 도형 위치
 * @property {String} sFill - 채우기
 * @property {String} sLineFill - 선 채우기
 * @property {String} sLineWidth - 선 굵기
 * @property {String} sLineStyle - 선 종류
 * @property {String} fontName - 글꼴
 * @property {String} fontSize - 글자크기
 * @property {String} fontColor - 글자색
 * @property {String} bold - 진하게
 * @property {String} italic - 기울임
 * @property {String} underline - 밑줄
 * @property {String} strikethrough - 취소선
 */
export const PROPERTY_TYPE = {
  undefined: null,
  // -------------------- //
  // 도형 관련 액션 타입
  sSize: 'sSize', // 도형 크기, value = {width: 숫자, height: 숫자}
  sPosition: 'sPosition', // 도형 위치 value = {x: 숫자, y:숫자}
  sFill: 'sFill', // 채우기, value = {color: '#RRGGBB' 또는 'none' 또는 'noFill', opacity: 숫자}
  sLineFill: 'sLineFill', // 선 색 value = {lineFillType: true, color: '#RRGGBB' 또는 'none' 또는 'noFill', opacity: 숫자}
  sLineWidth: 'sLineWidth', // 선 굵기 value = {borderWidth: 숫자}
  sLineStyle: 'sLineStyle', // 선 종류 value = {compound: 'sng', borderStyleDashed: 'solid'또는'dashed_5_15'또는'dashed_10_10'또는'dashed_40_20'또는'dashed_40_20_20_20'또는'dashed_80_20'또는'dashed_80_20_20_20'또는'dashed_80_20_20_20_20_20'}
  // -------------------- //
  // -------------------- //
  // 글자 서식 관련 액션 타입
  fontName: 'fontName', // 글꼴, value: '글꼴명'
  fontSize: 'fontSize', // 글자크기, value: '숫자'
  fontColor: 'fontColor', // 글자색, value: '#RRGGBB'
  bold: 'bold', // 진하게, value : "on", "off"
  italic: 'italic', // 기울임, value : "on", "off"
  underline: 'underline', // 밑줄, value : "on", "off"
  strikethrough: 'strikethrough', // 취소선, value : "on", "off"
  // -------------------- //
};

/**
 * 선 종류 열거
 * @category Action
 * @readonly
 * @const {String}
 * @property {String} none - 실선
 * @property {String} dashed_5_15 - 점선
 * @property {String} dashed_10_10 - 긴 점선
 * @property {String} dashed_40_20 - 파선
 * @property {String} dashed_40_20_20_20 - 파선-점선
 * @property {String} dashed_80_20 - 긴 파선
 * @property {String} dashed_80_20_20_20 - 긴 파선-점선
 * @property {String} dashed_80_20_20_20_20_20 - 긴 파선-점선-점선
 */
export const LINE_STYLE = {
  none: 'none',
  dashed_5_15: 'dashed_5_15',
  dashed_10_10: 'dashed_10_10',
  dashed_40_20: 'dashed_40_20',
  dashed_40_20_20_20: 'dashed_40_20_20_20',
  dashed_80_20: 'dashed_80_20',
  dashed_80_20_20_20: 'dashed_80_20_20_20',
  dashed_80_20_20_20_20_20: 'dashed_80_20_20_20_20_20',
};

/**
 * 색상 타입 열거
 * @category Action
 * @readonly
 * @const {String}
 * 
 * @property {String} noFill - 없음
 * @property {String} solid - 단색
 */
export const COLOR_TYPE = {
  noFill: 'noFill',
  solid: 'solid',
};

/**
 * 스크롤 모드 열거
 * @category Action
 * @readonly
 * @const {Number}
 * 
 * @property {Number} scrollVertical - 세로 스크롤
 * @property {Number} scrollHorizontal - 가로 스크롤
 * @property {Number} scrollWrapped - 래핑 스크롤
 * @property {Number} scrollPage - 페이지 스크롤
 */
export const SCROLL_MODE = {
  scrollVertical: 0,
  scrollHorizontal: 1,
  scrollWrapped: 2,
  scrollPage: 3,
};

/**
 * 펼쳐짐 모드 열거
 * @category Action
 * @readonly
 * @const {Number}
 * 
 * @property {Number} spreadNone - 펼처짐 없음
 * @property {Number} spreadOdd - 홀수 펼처짐
 * @property {Number} spreadEven - 짝수 펼쳐짐
 */
export const SPREAD_MODE = {
  spreadNone: 0,
  spreadOdd: 1,
  spreadEven: 2,
};