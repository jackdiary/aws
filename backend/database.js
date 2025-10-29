
const { Sequelize, DataTypes } = require('sequelize'); // Sequelize 라이브러리에서 Sequelize 클래스와 DataTypes 객체를 가져옵니다.

const dbDialect = process.env.DB_DIALECT || 'sqlite'; // 사용할 데이터베이스 종류를 환경 변수 또는 기본값으로 결정합니다.

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL, { dialect: dbDialect, logging: false }) // DB_URL이 제공된 경우 단일 URL을 사용해 연결합니다.
  : new Sequelize( // DB_URL이 없으면 개별 환경변수로 연결을 구성합니다.
      process.env.DB_NAME || undefined,
      process.env.DB_USER || undefined,
      process.env.DB_PASSWORD || undefined,
      {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT || undefined,
        dialect: dbDialect,
        storage: dbDialect === 'sqlite' ? process.env.DB_PATH || 'database.sqlite' : undefined,
        logging: false
      }
    );

const User = sequelize.define('User', { // 'User' 모델(테이블)을 정의합니다.
  id: { // 'id' 필드를 정의합니다.
    type: DataTypes.INTEGER, // 데이터 타입을 정수(INTEGER)로 설정합니다.
    autoIncrement: true, // 값이 자동으로 증가하도록 설정합니다.
    primaryKey: true // 이 필드를 기본 키(Primary Key)로 지정합니다.
  },
  username: { // 'username' 필드를 정의합니다.
    type: DataTypes.STRING, // 데이터 타입을 문자열(STRING)로 설정합니다.
    allowNull: false, // 이 필드는 null 값을 허용하지 않습니다.
    unique: true // 이 필드의 값은 고유해야 합니다.
  },
  email: { // 'email' 필드를 정의합니다.
    type: DataTypes.STRING, // 데이터 타입을 문자열(STRING)로 설정합니다.
    allowNull: false, // 이 필드는 null 값을 허용하지 않습니다.
    unique: true // 이 필드의 값은 고유해야 합니다.
  },
  password_hash: { // 'password_hash' 필드를 정의합니다.
    type: DataTypes.STRING, // 데이터 타입을 문자열(STRING)로 설정합니다.
    allowNull: false // 이 필드는 null 값을 허용하지 않습니다.
  }
});

const Post = sequelize.define('Post', { // 'Post' 모델(테이블)을 정의합니다.
  id: { // 'id' 필드를 정의합니다.
    type: DataTypes.INTEGER, // 데이터 타입을 정수(INTEGER)로 설정합니다.
    autoIncrement: true, // 값이 자동으로 증가하도록 설정합니다.
    primaryKey: true // 이 필드를 기본 키(Primary Key)로 지정합니다.
  },
  title: { // 'title' 필드를 정의합니다.
    type: DataTypes.STRING, // 데이터 타입을 문자열(STRING)로 설정합니다.
    allowNull: false // 이 필드는 null 값을 허용하지 않습니다.
  },
  content: { // 'content' 필드를 정의합니다.
    type: DataTypes.TEXT, // 데이터 타입을 긴 텍스트(TEXT)로 설정합니다.
    allowNull: false // 이 필드는 null 값을 허용하지 않습니다.
  },
  view_count: { // 'view_count' 필드를 정의합니다.
    type: DataTypes.INTEGER, // 데이터 타입을 정수(INTEGER)로 설정합니다.
    defaultValue: 99 // 기본값을 99로 설정합니다.
  },
  comment_count: { // 'comment_count' 필드를 정의합니다.
    type: DataTypes.INTEGER, // 데이터 타입을 정수(INTEGER)로 설정합니다.
    defaultValue: 1 // 기본값을 1로 설정합니다.
  }
});

const Answer = sequelize.define('Answer', { // 'Answer' 모델(테이블)을 정의합니다.
  id: { // 'id' 필드를 정의합니다.
    type: DataTypes.INTEGER, // 데이터 타입을 정수(INTEGER)로 설정합니다.
    autoIncrement: true, // 값이 자동으로 증가하도록 설정합니다.
    primaryKey: true // 이 필드를 기본 키(Primary Key)로 지정합니다.
  },
  content: { // 'content' 필드를 정의합니다.
    type: DataTypes.TEXT, // 데이터 타입을 긴 텍스트(TEXT)로 설정합니다.
    allowNull: false // 이 필드는 null 값을 허용하지 않습니다.
  }
});

User.hasMany(Post, { foreignKey: 'author_id' }); // User 모델이 여러 Post를 가질 수 있는 1:N 관계를 설정합니다. 외래 키는 'author_id'입니다.
Post.belongsTo(User, { as: 'author', foreignKey: 'author_id' }); // Post 모델이 하나의 User에 속하는 관계를 설정합니다. 'author'라는 별칭으로 User에 접근할 수 있습니다.

Post.hasMany(Answer, { foreignKey: 'post_id', as: 'answers' }); // 게시글과 답변의 관계를 정의합니다.
Answer.belongsTo(Post, { foreignKey: 'post_id' }); // 각 답변은 하나의 게시글에 속합니다.
Answer.belongsTo(User, { as: 'author', foreignKey: 'author_id' }); // 답변 작성자 정보를 연결합니다.
User.hasMany(Answer, { foreignKey: 'author_id' }); // 사용자가 작성한 여러 답변을 연결합니다.

sequelize.sync(); // 정의된 모델을 기반으로 데이터베이스와 테이블을 동기화(생성)합니다.

module.exports = { // 다른 파일에서 사용할 수 있도록 sequelize 인스턴스와 User, Post 모델을 내보냅니다.
  sequelize, // sequelize 인스턴스
  User, // User 모델
  Post, // Post 모델
  Answer // Answer 모델
};
