import React from 'react'; // React 라이브러리를 가져옵니다.
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // 라우팅을 위한 컴포넌트들을 react-router-dom에서 가져옵니다.
import Navbar from './components/Navbar'; // Navbar 컴포넌트를 가져옵니다.
import PostList from './components/PostList'; // PostList 컴포넌트를 가져옵니다.
import Login from './components/Login'; // Login 컴포넌트를 가져옵니다.
import Register from './components/Register'; // Register 컴포넌트를 가져옵니다.
import CreatePost from './components/CreatePost'; // CreatePost 컴포넌트를 가져옵니다.
import PostDetail from './components/PostDetail'; // PostDetail 컴포넌트를 가져옵니다.

function App() { // App 함수형 컴포넌트를 정의합니다.
  return ( // JSX를 반환하여 UI를 렌더링합니다.
    <Router> {/* 라우터의 최상위 컴포넌트입니다. */}
      <div> {/* 전체 애플리케이션을 감싸는 div 요소입니다. */}
        <Navbar /> {/* 모든 페이지 상단에 표시될 네비게이션 바 컴포넌트입니다. */}
        <Routes> {/* 여러 Route들을 감싸는 컴포넌트로, 현재 URL과 일치하는 첫 번째 Route를 렌더링합니다. */}
          <Route path="/" element={<PostList />} /> {/* 루트 경로('/')는 PostList 컴포넌트를 렌더링합니다. */}
          <Route path="/login" element={<Login />} /> {/* '/login' 경로는 Login 컴포넌트를 렌더링합니다. */}
          <Route path="/register" element={<Register />} /> {/* '/register' 경로는 Register 컴포넌트를 렌더링합니다. */}
          <Route path="/create-post" element={<CreatePost />} /> {/* '/create-post' 경로는 CreatePost 컴포넌트를 렌더링합니다. */}
          <Route path="/post/:id" element={<PostDetail />} /> {/* '/post/:id' 형태의 동적 경로는 PostDetail 컴포넌트를 렌더링합니다. :id는 URL 파라미터입니다. */}
        </Routes>
      </div>
    </Router>
  );
}

export default App; // App 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
