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

  if (!post) {
    return (
      <div className="glass-container fade-in-up" style={{ 
        maxWidth: '400px', 
        margin: '4rem auto',
        textAlign: 'center',
        padding: '3rem'
      }}>
        <div className="loading-spinner"></div>
        <h3 style={{ 
          marginTop: '2rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>
          ✨ 게시글을 불러오는 중...
        </h3>
        <p style={{ color: '#718096', marginTop: '1rem' }}>
          잠시만 기다려주세요!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-container fade-in-up" style={{ maxWidth: '900px', margin: '2rem auto' }}>
      {/* 게시글 헤더 */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem',
          fontWeight: '700',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📋 {post.title}
        </h1>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '1rem',
          color: '#718096',
          fontSize: '0.9rem',
          marginBottom: '1.5rem'
        }}>
          <span>👤 {post.author?.username ?? '익명'}</span>
          <span>📅 {new Date(post.createdAt).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
          <span>💬 답변 {post.comment_count ?? answers.length}개</span>
        </div>
        <div style={{ 
          lineHeight: '1.8', 
          fontSize: '1.1rem',
          whiteSpace: 'pre-wrap',
          background: 'rgba(255, 255, 255, 0.5)',
          padding: '1.5rem',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}>
          {post.content}
        </div>
      </div>

      {/* 답변 목록 */}
      <section className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          💬 답변 {post.comment_count ?? answers.length}개
        </h3>
        <div>
          {answers.length === 0 ? (
            <div style={{ 
              textAlign: 'center', 
              padding: '3rem',
              color: '#718096',
              fontSize: '1.1rem'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤔</div>
              <p>아직 등록된 답변이 없습니다.</p>
              <p>첫 번째 답변을 작성해보세요!</p>
            </div>
          ) : (
            answers.map((answer, index) => (
              <div 
                key={answer.id} 
                className="card fade-in-left" 
                style={{ 
                  marginBottom: '1.5rem',
                  animationDelay: `${index * 0.1}s`,
                  background: 'rgba(255, 255, 255, 0.3)'
                }}
              >
                <div style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  marginBottom: '1rem',
                  fontSize: '0.9rem',
                  color: '#4a5568',
                  fontWeight: '600'
                }}>
                  <span style={{
                    background: 'linear-gradient(45deg, #4facfe, #00f2fe)',
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '15px',
                    fontSize: '0.8rem'
                  }}>
                    👤 {answer.author?.username ?? '익명'}
                  </span>
                  <span>📅 {new Date(answer.createdAt).toLocaleString('ko-KR')}</span>
                </div>
                <div style={{ 
                  whiteSpace: 'pre-wrap', 
                  lineHeight: '1.7',
                  fontSize: '1rem',
                  background: 'rgba(255, 255, 255, 0.5)',
                  padding: '1rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  {answer.content}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 답변 작성 폼 */}
      <section className="card">
        <h3 style={{ 
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ✍️ 답변 작성하기
        </h3>
        <form onSubmit={handleAnswerSubmit}>
          <div className="form-group">
            <textarea
              value={answerContent}
              onChange={(e) => setAnswerContent(e.target.value)}
              placeholder="도움이 되는 답변을 작성해주세요! 코드나 예시가 있다면 함께 적어주세요."
              className="form-input"
              style={{ minHeight: '180px', resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`btn ${isSubmitting ? 'btn-secondary' : 'btn-warning'}`}
              style={{ 
                minWidth: '200px',
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? '⏳ 등록 중...' : '🚀 답변 등록'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default PostDetail; // PostDetail 컴포넌트를 다른 파일에서 사용할 수 있도록 내보냅니다.
