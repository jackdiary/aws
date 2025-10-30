import React, { useState } from 'react'; // React와 상태 관리를 위한 useState 훅을 가져옵니다.
import apiClient from '../api/client'; // 환경 변수로 구성된 API 클라이언트를 가져옵니다.
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 useNavigate 훅을 가져옵니다.

function CreatePost() { // CreatePost 함수형 컴포넌트를 정의합니다.
  const [title, setTitle] = useState(''); // 'title' 상태와 그 상태를 업데이트하는 'setTitle' 함수를 선언합니다. 초기값은 빈 문자열입니다.
  const [content, setContent] = useState(''); // 'content' 상태와 그 상태를 업데이트하는 'setContent' 함수를 선언합니다. 초기값은 빈 문자열입니다.
  const navigate = useNavigate(); // 페이지 이동 함수를 사용하기 위해 useNavigate 훅을 호출합니다.

  const handleSubmit = async (e) => { // 폼 제출 시 실행될 비동기 함수를 정의합니다.
    e.preventDefault(); // 폼 제출 시 발생하는 기본 동작(페이지 새로고침)을 막습니다.
    try { // API 요청 중 발생할 수 있는 오류를 처리하기 위해 try-catch 블록을 사용합니다.
      const token = localStorage.getItem('token'); // 로컬 스토리지에서 인증 토큰을 가져옵니다.
      if (!token || token === 'null') { // 로그인 상태가 아니면 요청을 보내지 않습니다.
        alert('로그인 후 질문을 등록할 수 있습니다.');
        return;
      }
      await apiClient.post('/posts', // 구성된 API 클라이언트를 사용해 POST 요청을 보냅니다.
        { title, content }, // 요청 본문(body)에 제목과 내용을 담아 보냅니다.
        { headers: { Authorization: `Bearer ${token}` } } // 요청 헤더에 인증 토큰을 포함시킵니다.
      );
      navigate('/'); // 게시글 생성이 성공하면, 루트 경로('/')로 페이지를 이동시킵니다.
    } catch (error) { // 오류가 발생하면 실행됩니다.
      console.error('Failed to create post', error); // 콘솔에 오류 메시지를 출력합니다.
      if (error.response?.status === 401) { // 인증 오류일 경우 사용자에게 안내합니다.
        alert('로그인 정보가 만료되었습니다. 다시 로그인해 주세요.');
        return;
      }
      alert('질문 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.'); // 기타 오류 안내
    }
  };

  return (
    <div className="glass-container fade-in-up" style={{ maxWidth: '800px', margin: '2rem auto' }}>
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '2.5rem',
        fontWeight: '800'
      }}>
        ✍️ 새로운 질문 등록
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">📝 제목</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="form-input"
            placeholder="궁금한 것을 간단히 요약해주세요"
          />
        </div>
        <div className="form-group">
          <label className="form-label">📄 내용</label>
          <textarea 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            required 
            className="form-input"
            style={{ minHeight: '250px', resize: 'vertical' }}
            placeholder="자세한 내용을 작성해주세요. 코드나 예시가 있다면 함께 적어주세요!"
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button type="submit" className="btn btn-success" style={{ minWidth: '150px' }}>
            🚀 등록하기
          </button>
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{ minWidth: '150px' }}
          >
            ❌ 취소
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost; // CreatePost 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
