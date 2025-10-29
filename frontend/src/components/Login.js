import React, { useState } from 'react'; // React와 상태 관리를 위한 useState 훅을 가져옵니다.
import apiClient from '../api/client'; // 환경 변수로 구성된 API 클라이언트를 가져옵니다.
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅을 가져옵니다.

function Login() { // Login 함수형 컴포넌트를 정의합니다.
  const [username, setUsername] = useState(''); // 'username' 상태와 그 상태를 업데이트하는 'setUsername' 함수를 선언합니다.
  const [password, setPassword] = useState(''); // 'password' 상태와 그 상태를 업데이트하는 'setPassword' 함수를 선언합니다.
  const navigate = useNavigate(); // 페이지 이동 함수를 사용하기 위해 useNavigate 훅을 호출합니다.

  const handleSubmit = async (e) => { // 폼 제출 시 실행될 비동기 함수를 정의합니다.
    e.preventDefault(); // 폼 제출 시 발생하는 기본 동작(페이지 새로고침)을 막습니다.
    try { // API 요청 중 발생할 수 있는 오류를 처리하기 위해 try-catch 블록을 사용합니다.
      const response = await apiClient.post('/login', { username, password }); // 구성된 클라이언트로 로그인 요청을 보냅니다.
      localStorage.setItem('token', response.data.token); // 로그인 성공 시 응답으로 받은 토큰을 로컬 스토리지에 저장합니다.
      navigate('/'); // 루트 경로('/')로 페이지를 이동시킵니다.
    } catch (error) { // 오류가 발생하면 실행됩니다.
      console.error('Login failed', error); // 콘솔에 오류 메시지를 출력합니다.
    }
  };

  return ( // JSX를 반환하여 UI를 렌더링합니다.
    <div style={{ padding: '1rem' }}> {/* 전체를 감싸는 div에 패딩 스타일을 적용합니다. */}
      <h2>로그인</h2> {/* 페이지 제목을 h2 태그로 표시합니다. */}
      <form onSubmit={handleSubmit}> {/* 폼 제출 시 handleSubmit 함수가 호출되도록 설정합니다. */}
        <div style={{ marginBottom: '1rem' }}> {/* 사용자 이름 입력 부분을 감싸는 div에 아래쪽 여백 스타일을 적용합니다. */}
          <label>사용자 이름</label> {/* '사용자 이름' 라벨입니다. */}
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} /> {/* 사용자 이름 입력 필드입니다. 값이 변경될 때마다 username 상태가 업데이트됩니다. */}
        </div>
        <div style={{ marginBottom: '1rem' }}> {/* 비밀번호 입력 부분을 감싸는 div에 아래쪽 여백 스타일을 적용합니다. */}
          <label>비밀번호</label> {/* '비밀번호' 라벨입니다. */}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} /> {/* 비밀번호 입력 필드입니다. 값이 변경될 때마다 password 상태가 업데이트됩니다. */}
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>로그인</button> {/* 폼을 제출하는 '로그인' 버튼입니다. */}
      </form>
    </div>
  );
}

export default Login; // Login 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
