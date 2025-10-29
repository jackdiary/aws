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
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <input type="text" placeholder="검색어를 입력하세요" style={{ padding: '0.5rem' }} />
        <button style={{ padding: '0.5rem 1rem' }}>검색</button>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ backgroundColor: 'black', color: 'white' }}>
          <tr>
            <th style={{ padding: '0.5rem' }}>번호</th>
            <th style={{ padding: '0.5rem' }}>제목</th>
            <th style={{ padding: '0.5rem' }}>작성자</th>
            <th style={{ padding: '0.5rem' }}>작성일</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post, index) => (
            <tr key={post.id} style={{ backgroundColor: index % 2 === 0 ? '#f2f2f2' : 'white' }}>
              <td style={{ padding: '0.5rem', textAlign: 'center' }}>{posts.length - index}</td>
              <td style={{ padding: '0.5rem' }}>
                <Link to={`/post/${post.id}`}>
                  {post.title} [{post.comment_count ?? 0}]
                </Link>
              </td>
              <td style={{ padding: '0.5rem', textAlign: 'center' }}>{post.author?.username ?? '-'}</td>
              <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
        <button style={{ padding: '0.5rem 1rem' }}>이전</button>
        {[1, 2, 3, 4, 5, 6].map((page) => (
          <button
            key={page}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: page === 1 ? 'blue' : 'transparent',
              color: page === 1 ? 'white' : 'black',
            }}
          >
            {page}
          </button>
        ))}
        <button style={{ padding: '0.5rem 1rem' }}>다음</button>
      </div>
    </div>
  );
}

export default PostList;
