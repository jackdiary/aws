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

  return (
    <div className="glass-container fade-in-up" style={{ maxWidth: '400px', margin: '2rem auto' }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '2rem',
        fontWeight: '800'
      }}>
        🔐 로그인
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">👤 사용자 이름</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
            className="form-input"
            placeholder="사용자 이름을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label className="form-label">🔒 비밀번호</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className="form-input"
            placeholder="비밀번호를 입력하세요"
          />
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
          ✨ 로그인하기
        </button>
      </form>
    </div>
  );
}

export default Login; // Login 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
