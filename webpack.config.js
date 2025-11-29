const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  // Entry 설정 (입력 파일 경로)
  // 기본엔트리 : index.js -> 사용자 기본 엔트리파일 변경
  entry: "./src/annotationLib.js",
  // Output 설정 (출력 디렉터리와 파일 이름)
  // 기본경로 : dist/main.js -> 사용자 경로 및 출력파일 이름 변경
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "annotationLib.js",
    library: 'annotationLib',
    libraryTarget: 'umd'
  },
  plugins: [
    // 웹팩의 빌드 진행율을 표시해주는 플러그인
    new webpack.ProgressPlugin(),
	  // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
    new MiniCssExtractPlugin({ filename: 'annotationLib.css' })
  ],
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: "html-loader",
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        exclude: /node_modules/
      }
    ],
  },
  // 모드
  // development -> 개발모드
  // production -> 배포모드(기본값)
  // none -> 기본 최적화 옵션 해제
  mode: "none",
  // 소스 맵
  // https://webpack.kr/configuration/devtool/#devtool
  // (none) -> 최대 성능을 갖춘 프로덕션 빌드를 위해 추천하는 옵션
  // inline-source-map -> 단일 파일을 내보낼 때 선택
  // source-map -> 고품질 소스맵을 포함한 프로덕션 빌드를 위해 추천하는 옵션
  devtool: "inline-source-map",
};
