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

  return ( // JSX를 반환하여 네비게이션 바 UI를 렌더링합니다.
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #ccc' }}> {/* nav 요소에 flexbox 스타일과 하단 테두리를 적용합니다. */}
      <div style={{ display: 'flex', alignItems: 'center' }}> {/* 로고와 사용자 이름을 감싸는 div 입니다. */}
        <Link to="/" style={{ textDecoration: 'none', color: 'black', fontSize: '1.5rem', marginRight: '1rem' }}>Pybo</Link> {/* 'Pybo' 로고를 클릭하면 홈으로 이동하는 링크입니다. */}
        {isLoggedIn && <span>케시퐌 (kesipan)</span>} {/* 로그인 상태일 때만 사용자 이름을 표시합니다. */}
      </div>
      <div> {/* 버튼들을 감싸는 div 입니다. */}
        {isLoggedIn ? ( // 로그인 상태(isLoggedIn)에 따라 다른 버튼들을 렌더링합니다.
          <> {/* 로그인 상태일 때 보여줄 요소들입니다. (React Fragment) */}
            <Link to="/create-post"> {/* '질문 등록하기' 페이지로 이동하는 링크입니다. */}
              <button style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>질문 등록하기</button>
            </Link>
            <button onClick={handleLogout} style={{ marginLeft: '1rem', backgroundColor: 'transparent', border: '1px solid #ccc', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>로그아웃</button> {/* 클릭 시 handleLogout 함수를 실행하는 로그아웃 버튼입니다. */}
          </>
        ) : (
          <> {/* 로그아웃 상태일 때 보여줄 요소들입니다. (React Fragment) */}
            <Link to="/login"> {/* 로그인 페이지로 이동하는 링크입니다. */}
              <button style={{ backgroundColor: 'transparent', border: '1px solid #ccc', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>로그인</button>
            </Link>
            <Link to="/register"> {/* 회원가입 페이지로 이동하는 링크입니다. */}
              <button style={{ marginLeft: '1rem', backgroundColor: 'transparent', border: '1px solid #ccc', padding: '0.5rem 1rem', borderRadius: '5px', cursor: 'pointer' }}>회원가입</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar; // Navbar 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
