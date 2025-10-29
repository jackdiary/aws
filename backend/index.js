
require('dotenv').config(); // Load environment variables from .env in development.
const express = require('express'); // Express 프레임워크를 가져옵니다.
const cors = require('cors'); // CORS(Cross-Origin Resource Sharing)를 처리하기 위한 미들웨어를 가져옵니다.
const bcrypt = require('bcrypt'); // 비밀번호 해싱을 위한 bcrypt 라이브러리를 가져옵니다.
const jwt = require('jsonwebtoken'); // JWT(JSON Web Token) 생성을 위한 라이브러리를 가져옵니다.
const { sequelize, User, Post, Answer } = require('./database'); // database.js 파일에서 sequelize 인스턴스와 모델들을 가져옵니다.

const app = express(); // Express 애플리케이션을 생성합니다.
const port = process.env.PORT || 3001; // 서버가 실행될 포트 번호를 환경변수 또는 기본값 3001로 설정합니다.
const jwtSecret = process.env.JWT_SECRET || 'development_secret'; // JWT 서명에 사용할 시크릿 키를 환경변수에서 가져옵니다.

if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set. Falling back to a development secret.'); // 운영 환경에서는 반드시 JWT_SECRET을 설정해야 합니다.
}

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim()).filter(Boolean)
  : null; // 허용할 도메인 목록을 환경 변수에서 불러옵니다.

const corsOptions = allowedOrigins && allowedOrigins.length > 0
  ? { origin: allowedOrigins, credentials: true }
  : undefined; // 허용 도메인이 지정된 경우에만 CORS 옵션을 설정합니다.

app.use(cors(corsOptions)); // CORS 옵션을 적용합니다. 지정된 도메인이 없으면 모든 도메인을 허용합니다.
app.use(express.json()); // 들어오는 요청의 본문(body)을 JSON 형식으로 파싱하는 미들웨어를 적용합니다.

const api = express.Router(); // '/api' 경로에 대한 라우터를 생성합니다.

// Auth middleware
const authenticate = (req, res, next) => { // 인증을 처리하는 미들웨어 함수를 정의합니다.
  const token = req.headers.authorization?.split(' ')[1]; // 요청 헤더의 Authorization에서 'Bearer ' 다음의 토큰 부분을 추출합니다.
  if (!token) { // 토큰이 없으면
    return res.status(401).json({ error: 'Unauthorized' }); // 401 Unauthorized 오류를 응답합니다.
  }
  try { // 토큰 검증을 시도합니다.
    const decoded = jwt.verify(token, jwtSecret); // JWT를 비밀 키로 검증하고 디코딩합니다.
    req.userId = decoded.userId; // 디코딩된 페이로드에서 userId를 추출하여 요청 객체(req)에 저장합니다.
    next(); // 다음 미들웨어 또는 라우트 핸들러로 제어를 넘깁니다.
  } catch (error) { // 토큰 검증에 실패하면
    res.status(401).json({ error: 'Invalid token' }); // 401 Unauthorized 오류(유효하지 않은 토큰)를 응답합니다.
  }
};

api.post('/register', async (req, res) => { // '/api/register' 경로에 대한 POST 요청을 처리합니다. (회원가입)
  try { // 비동기 작업 중 발생할 수 있는 오류를 처리합니다.
    const { username, email, password } = req.body; // 요청 본문에서 username, email, password를 추출합니다.
    const password_hash = await bcrypt.hash(password, 10); // 비밀번호를 bcrypt를 사용해 해싱합니다. (salt round: 10)
    const user = await User.create({ username, email, password_hash }); // 해싱된 비밀번호와 함께 새로운 사용자를 데이터베이스에 생성합니다.
    res.status(201).json({ user }); // 201 Created 상태 코드와 함께 생성된 사용자 정보를 JSON으로 응답합니다.
  } catch (error) { // 오류가 발생하면
    res.status(400).json({ error: error.message }); // 400 Bad Request 상태 코드와 함께 오류 메시지를 응답합니다.
  }
});

api.post('/login', async (req, res) => { // '/api/login' 경로에 대한 POST 요청을 처리합니다. (로그인)
  try { // 비동기 작업 중 발생할 수 있는 오류를 처리합니다.
    const { username, password } = req.body; // 요청 본문에서 username과 password를 추출합니다.
    const user = await User.findOne({ where: { username } }); // 데이터베이스에서 해당 username을 가진 사용자를 찾습니다.
    if (!user) { // 사용자가 없으면
      return res.status(401).json({ error: 'Invalid credentials' }); // 401 Unauthorized 오류를 응답합니다.
    }
    const isValid = await bcrypt.compare(password, user.password_hash); // 입력된 비밀번호와 저장된 해시를 비교합니다.
    if (!isValid) { // 비밀번호가 일치하지 않으면
      return res.status(401).json({ error: 'Invalid credentials' }); // 401 Unauthorized 오류를 응답합니다.
    }
    const token = jwt.sign({ userId: user.id }, jwtSecret, { expiresIn: '1h' }); // 사용자 ID를 담은 JWT를 생성합니다. (유효기간 1시간)
    res.json({ token }); // 생성된 토큰을 JSON으로 응답합니다.
  } catch (error) { // 오류가 발생하면
    res.status(400).json({ error: error.message }); // 400 Bad Request 상태 코드와 함께 오류 메시지를 응답합니다.
  }
});

// Post routes
api.get('/posts', async (req, res) => { // '/api/posts' 경로에 대한 GET 요청을 처리합니다. (모든 게시글 조회)
  try { // 비동기 작업 중 발생할 수 있는 오류를 처리합니다.
    const posts = await Post.findAll({ include: 'author' }); // 모든 게시글을 찾고, 'author' 관계를 통해 작성자 정보를 포함시킵니다.
    res.json(posts); // 찾은 게시글 목록을 JSON으로 응답합니다.
  } catch (error) { // 오류가 발생하면
    res.status(500).json({ error: error.message }); // 500 Internal Server Error 상태 코드와 함께 오류 메시지를 응답합니다.
  }
});

api.get('/posts/:id', async (req, res) => { // '/api/posts/:id' 경로에 대한 GET 요청을 처리합니다. (특정 게시글 조회)
  try { // 비동기 작업 중 발생할 수 있는 오류를 처리합니다.
    const { id } = req.params; // URL 파라미터에서 id를 추출합니다.
    const post = await Post.findByPk(id, {
      include: [
        { model: User, as: 'author', attributes: ['id', 'username', 'email'] },
        { model: Answer, as: 'answers', include: [{ model: User, as: 'author', attributes: ['id', 'username'] }] }
      ],
      order: [[{ model: Answer, as: 'answers' }, 'createdAt', 'ASC']]
    }); // 해당 id의 게시글과 작성자, 답변 정보를 포함시킵니다.
    if (post) { // 게시글이 존재하면
      res.json(post); // 게시글 정보를 JSON으로 응답합니다.
    } else { // 게시글이 없으면
      res.status(404).json({ error: 'Post not found' }); // 404 Not Found 오류를 응답합니다.
    }
  } catch (error) { // 오류가 발생하면
    res.status(500).json({ error: error.message }); // 500 Internal Server Error 상태 코드와 함께 오류 메시지를 응답합니다.
  }
});

api.post('/posts', authenticate, async (req, res) => { // '/api/posts' 경로에 대한 POST 요청을 처리합니다. (게시글 생성), authenticate 미들웨어로 인증 필요
  try { // 비동기 작업 중 발생할 수 있는 오류를 처리합니다.
    const { title, content } = req.body; // 요청 본문에서 title과 content를 추출합니다.
    const post = await Post.create({ title, content, author_id: req.userId }); // 새로운 게시글을 생성합니다. 작성자 ID는 인증 미들웨어에서 설정한 req.userId를 사용합니다.
    res.status(201).json(post); // 201 Created 상태 코드와 함께 생성된 게시글 정보를 JSON으로 응답합니다.
  } catch (error) { // 오류가 발생하면
    res.status(400).json({ error: error.message }); // 400 Bad Request 상태 코드와 함께 오류 메시지를 응답합니다.
  }
});

api.post('/posts/:id/answers', authenticate, async (req, res) => { // '/api/posts/:id/answers' 경로에 대한 POST 요청에서 답변을 생성합니다.
  try {
    const { id } = req.params;
    const { content } = req.body;
    const trimmedContent = content?.trim();

    if (!trimmedContent) { // 답변 내용이 비어 있으면 400을 반환합니다.
      return res.status(400).json({ error: 'Content is required' });
    }

    const post = await Post.findByPk(id);
    if (!post) { // 게시글이 존재하지 않으면 404를 반환합니다.
      return res.status(404).json({ error: 'Post not found' });
    }

    const answer = await Answer.create({
      content: trimmedContent,
      post_id: post.id,
      author_id: req.userId
    }); // 답변을 저장합니다.

    await post.increment('comment_count'); // 게시글의 답변 수를 증가시킵니다.

    const answerWithAuthor = await Answer.findByPk(answer.id, {
      include: [{ model: User, as: 'author', attributes: ['id', 'username'] }]
    }); // 응답에 작성자 정보를 포함합니다.

    res.status(201).json(answerWithAuthor);
  } catch (error) {
    res.status(400).json({ error: error.message }); // 기타 예외 상황 처리
  }
});

app.use('/api', api); // '/api' 경로로 들어오는 모든 요청을 위에서 정의한 api 라우터가 처리하도록 설정합니다.

sequelize.sync().then(() => { // 데이터베이스 동기화가 완료된 후에 서버를 시작합니다.
  app.listen(port, () => { // 지정된 포트에서 서버를 실행합니다.
    console.log(`Server is running on http://localhost:${port}`); // 서버가 성공적으로 시작되면 콘솔에 메시지를 출력합니다.
  });
});
