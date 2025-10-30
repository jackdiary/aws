import React, { useState, useEffect } from 'react'; // React와 훅을 불러옵니다.
import { Link } from 'react-router-dom'; // 게시글 상세 페이지로 이동할 때 사용합니다.
import apiClient from '../api/client'; // 환경 변수 기반 API 클라이언트를 불러옵니다.

function PostList() { // 게시글 목록을 보여주는 컴포넌트입니다.
  const [posts, setPosts] = useState([]); // 게시글 데이터를 저장할 상태입니다.

  useEffect(() => { // 컴포넌트가 처음 렌더링될 때 게시글 목록을 불러옵니다.
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get('/posts'); // 게시글 목록을 요청합니다.
        setPosts(response.data); // 응답으로 받은 게시글 목록을 상태에 저장합니다.
      } catch (error) {
        console.error('게시글 목록을 불러오지 못했습니다.', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="glass-container fade-in-up">
      <h1 style={{ 
        textAlign: 'center', 
        marginBottom: '2rem', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontSize: '2.5rem',
        fontWeight: '800'
      }}>
        📝 게시판
      </h1>
      
      <div className="search-container">
        <input 
          type="text" 
          placeholder="🔍 검색어를 입력하세요..." 
          className="search-input"
        />
        <button className="btn btn-success">✨ 검색</button>
      </div>
      
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>📊 번호</th>
              <th>📋 제목</th>
              <th>👤 작성자</th>
              <th>📅 작성일</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id} className="fade-in-left" style={{ animationDelay: `${index * 0.1}s` }}>
                <td style={{ textAlign: 'center', fontWeight: '600' }}>
                  {posts.length - index}
                </td>
                <td>
                  <Link to={`/post/${post.id}`} style={{ fontWeight: '500' }}>
                    {post.title} 
                    <span style={{ 
                      color: '#f093fb', 
                      fontWeight: '600',
                      marginLeft: '8px'
                    }}>
                      [{post.comment_count ?? 0}]
                    </span>
                  </Link>
                </td>
                <td style={{ textAlign: 'center', fontWeight: '500' }}>
                  {post.author?.username ?? '익명'}
                </td>
                <td style={{ textAlign: 'center', fontSize: '0.9rem', color: '#718096' }}>
                  {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="pagination">
        <button className="btn btn-primary">⬅️</button>
        {[1, 2, 3, 4, 5, 6].map((page) => (
          <button
            key={page}
            className={`btn ${page === 1 ? 'btn-primary active' : 'btn-secondary'}`}
          >
            {page}
          </button>
        ))}
        <button className="btn btn-primary">➡️</button>
      </div>
    </div>
  );
}

export default PostList;
