import React, { useState, useEffect } from 'react'; // React와 상태 및 생명주기 관리를 위한 훅들을 가져옵니다.
import { Link, useNavigate } from 'react-router-dom'; // 페이지 링크와 프로그래밍 방식의 네비게이션을 위한 컴포넌트와 훅을 가져옵니다.

function Navbar() { // Navbar 함수형 컴포넌트를 정의합니다.
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 'isLoggedIn' 상태와 그 업데이트 함수 'setIsLoggedIn'을 선언합니다.
  const navigate = useNavigate(); // 페이지 이동 함수를 사용하기 위해 useNavigate 훅을 호출합니다.

  useEffect(() => { // 컴포넌트가 마운트될 때 한 번 실행될 부수 효과(effect)를 설정합니다.
    const token = localStorage.getItem('token'); // 로컬 스토리지에서 'token'을 가져옵니다.
    if (token) { // 토큰이 존재하면
      setIsLoggedIn(true); // 로그인 상태를 true로 설정합니다.
    }
  }, []); // 의존성 배열이 비어 있으므로, 이 effect는 컴포넌트가 처음 렌더링될 때 한 번만 실행됩니다.

  const handleLogout = () => { // 로그아웃을 처리하는 함수를 정의합니다.
    localStorage.removeItem('token'); // 로컬 스토리지에서 'token'을 제거합니다.
    setIsLoggedIn(false); // 로그인 상태를 false로 설정합니다.
    navigate('/'); // 루트 경로('/')로 페이지를 이동시킵니다.
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="navbar-brand float">
            🌟 JackTest
          </Link>
          {isLoggedIn && (
            <div style={{ 
              background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
              padding: '8px 16px',
              borderRadius: '20px',
              color: 'white',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)'
            }}>
              👋 안녕하세요, 케시퐌님!
            </div>
          )}
        </div>
        <div className="navbar-nav">
          {isLoggedIn ? (
            <>
              <Link to="/create-post" className="btn btn-success">
                ✍️ 질문 등록
              </Link>
              <button onClick={handleLogout} className="btn btn-secondary">
                👋 로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-primary">
                🔐 로그인
              </Link>
              <Link to="/register" className="btn btn-secondary">
                🚀 회원가입
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar; // Navbar 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
