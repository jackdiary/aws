import React, { useState, useEffect } from 'react'; // React와 useState, useEffect 훅을 가져옵니다.
import { useParams } from 'react-router-dom'; // URL 파라미터를 가져오기 위해 useParams 훅을 가져옵니다.
import apiClient from '../api/client'; // 환경 변수로 구성한 API 클라이언트를 가져옵니다.

function PostDetail() { // PostDetail 함수형 컴포넌트를 정의합니다.
  const [post, setPost] = useState(null); // 게시글 정보를 저장합니다.
  const [answers, setAnswers] = useState([]); // 해당 게시글의 답변 목록을 저장합니다.
  const [answerContent, setAnswerContent] = useState(''); // 작성 중인 답변 내용을 저장합니다.
  const [isSubmitting, setIsSubmitting] = useState(false); // 답변 등록 요청 중 여부를 관리합니다.
  const { id } = useParams(); // URL로부터 post의 id를 가져옵니다.

  useEffect(() => { // 컴포넌트가 마운트되거나 id가 변경될 때 실행될 부수 효과(effect)를 설정합니다.
    const fetchPost = async () => { // 게시글 데이터를 비동기적으로 가져오는 함수를 정의합니다.
      try { // API 요청 중 발생할 수 있는 오류를 처리하기 위해 try-catch 블록을 사용합니다.
        // 백엔드 API 엔드포인트가 `/api/posts/:id`라고 가정합니다.
        // 실제 엔드포인트에 맞게 수정해야 할 수 있습니다.
        const response = await apiClient.get(`/posts/${id}`); // API 클라이언트로 게시글 데이터를 요청합니다.
        setPost(response.data); // 응답으로 받은 데이터를 post 상태에 저장합니다.
        setAnswers(response.data.answers ?? []); // 함께 내려온 답변 목록을 상태에 저장합니다.
      } catch (error) { // 오류가 발생하면 실행됩니다.
        console.error('Error fetching post:', error); // 콘솔에 오류 메시지를 출력합니다.
        setPost(null); // post 상태를 null로 설정합니다.
      }
    };

    fetchPost(); // 게시글 데이터를 가져오는 함수를 호출합니다.
  }, [id]); // 의존성 배열에 id를 추가하여, id가 변경될 때마다 이 effect가 다시 실행되도록 합니다.

  const handleAnswerSubmit = async (e) => { // 답변 등록을 처리합니다.
    e.preventDefault();
    const trimmedContent = answerContent.trim();
    if (!trimmedContent) {
      alert('답변 내용을 입력하세요.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token || token === 'null') {
      alert('로그인 후 답변을 등록할 수 있습니다.');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiClient.post(
        `/posts/${id}/answers`,
        { content: trimmedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      ); // 답변 등록 요청

      setAnswers((prev) => [...prev, response.data]); // 새 답변을 목록에 추가합니다.
      setPost((prev) =>
        prev ? { ...prev, comment_count: (prev.comment_count ?? 0) + 1 } : prev
      ); // 게시글의 답변 수를 증가시킵니다.
      setAnswerContent('');
    } catch (error) {
      console.error('Failed to submit answer', error);
      if (error.response?.status === 401) {
        alert('로그인 정보가 만료되었습니다. 다시 로그인해 주세요.');
        return;
      }
      alert('답변 등록에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!post) { // post 상태가 null(아직 데이터를 불러오지 못함)이면 실행됩니다.
    return <div>게시글을 불러오는 중...</div>; // "게시글을 불러오는 중..." 메시지를 표시합니다.
  }

  return ( // post 데이터가 있으면 게시글 상세 내용을 렌더링합니다.
    <div style={{ padding: '1rem' }}> {/* 전체를 감싸는 div 요소에 패딩 스타일을 적용합니다. */}
      <h2>{post.title}</h2> {/* 게시글 제목을 h2 태그로 표시합니다. */}
      <p style={{ color: '#666', fontSize: '0.9rem' }}> {/* 문단(p) 태그에 스타일을 적용합니다. */}
        작성일: {new Date(post.createdAt).toLocaleDateString()} {/* 게시글 작성일을 Date 객체로 변환하여 지역화된 날짜 문자열로 표시합니다. */}
      </p>
      <div style={{ marginTop: '2rem', lineHeight: '1.6' }}>{post.content}</div> {/* 게시글 내용을 div 태그로 표시하고 위쪽 여백과 줄 간격 스타일을 적용합니다. */}

      <section style={{ marginTop: '3rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>답변 {post.comment_count ?? answers.length}개</h3>
        <div>
          {answers.length === 0 ? (
            <p style={{ color: '#666' }}>아직 등록된 답변이 없습니다.</p>
          ) : (
            answers.map((answer) => (
              <div key={answer.id} style={{ padding: '1rem', border: '1px solid #ddd', borderRadius: '6px', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.5rem' }}>
                  {answer.author?.username ?? '익명'} · {new Date(answer.createdAt).toLocaleString('ko-KR')}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>{answer.content}</div>
              </div>
            ))
          )}
        </div>
      </section>

      <section style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>답변 작성</h3>
        <form onSubmit={handleAnswerSubmit}>
          <textarea
            value={answerContent}
            onChange={(e) => setAnswerContent(e.target.value)}
            placeholder="답변 내용을 입력하세요."
            style={{ width: '100%', minHeight: '150px', padding: '0.75rem', borderRadius: '6px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              opacity: isSubmitting ? 0.7 : 1
            }}
          >
            {isSubmitting ? '등록 중...' : '답변 등록'}
          </button>
        </form>
      </section>
    </div>
  );
}

export default PostDetail; // PostDetail 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
