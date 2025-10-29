import React from 'react'; // React 라이브러리를 가져옵니다.
import ReactDOM from 'react-dom/client'; // React DOM 클라이언트 라이브러리를 가져옵니다. React 18부터 사용됩니다.
import './index.css'; // 전역 CSS 파일을 가져옵니다.
import App from './App'; // 애플리케이션의 메인 컴포넌트인 App 컴포넌트를 가져옵니다.

const root = ReactDOM.createRoot(document.getElementById('root')); // public/index.html에 있는 'root' ID를 가진 DOM 요소를 React 루트로 생성합니다.
root.render( // 생성된 루트에 React 요소를 렌더링합니다.
  <React.StrictMode> {/* StrictMode는 애플리케이션 내의 잠재적인 문제를 알아내기 위한 도구입니다. 개발 모드에서만 활성화됩니다. */}
    <App /> {/* App 컴포넌트를 렌더링합니다. */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
