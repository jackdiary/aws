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

  return ( // JSX를 반환하여 UI를 렌더링합니다.
    <div style={{ padding: '1rem' }}> {/* 전체를 감싸는 div에 패딩 스타일을 적용합니다. */}
      <h2>질문 등록하기</h2> {/* 페이지 제목을 h2 태그로 표시합니다. */}
      <form onSubmit={handleSubmit}> {/* 폼 제출 시 handleSubmit 함수가 호출되도록 설정합니다. */}
        <div style={{ marginBottom: '1rem' }}> {/* 제목 입력 부분을 감싸는 div에 아래쪽 여백 스타일을 적용합니다. */}
          <label>제목</label> {/* '제목' 라벨입니다. */}
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '0.5rem' }} /> {/* 제목 입력 필드입니다. 값이 변경될 때마다 title 상태가 업데이트됩니다. */}
        </div>
        <div style={{ marginBottom: '1rem' }}> {/* 내용 입력 부분을 감싸는 div에 아래쪽 여백 스타일을 적용합니다. */}
          <label>내용</label> {/* '내용' 라벨입니다. */}
          <textarea value={content} onChange={(e) => setContent(e.target.value)} required style={{ width: '100%', padding: '0.5rem', minHeight: '200px' }} /> {/* 내용 입력 필드(textarea)입니다. 값이 변경될 때마다 content 상태가 업데이트됩니다. */}
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>저장하기</button> {/* 폼을 제출하는 '저장하기' 버튼입니다. */}
      </form>
    </div>
  );
}

export default CreatePost; // CreatePost 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
