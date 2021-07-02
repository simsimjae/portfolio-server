import dotenv from 'dotenv';
dotenv.config({ path: process.env.NODE_ENV === 'development' ? '.env.dev' : process.env.NODE_ENV === 'production' ? '.env.prod' : '' });

class CONSTANT {
  static DOMAIN = process.env.NODE_ENV === 'development' ? 'localhost' : 'simsimjae.dev';
  static JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  static JWT_ACCESS_EXPIRATION = process.env.JWT_ACCESS_EXPIRATION;
  static JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  static JWT_REFRESH_EXPIRATION = process.env.JWT_REFRESH_EXPIRATION;
  static KAKAO_APPKEY = process.env.KAKAO_APPKEY;
  static KAKAO_CLIENT_ID = process.env.KAKAO_CLIENT_ID;
  static KAKAO_CLIENT_SECRET = process.env.KAKAO_CLIENT_SECRET;
  static KAKAO_CALLBACK_URL = process.env.KAKAO_CALLBACK_URL;
  static NAVER_CLIENT_ID = process.env.NAVER_CLIENT_ID;
  static NAVER_CLIENT_SECRET = process.env.NAVER_CLIENT_SECRET;
  static NAVER_CALLBACK_URL = process.env.NAVER_CALLBACK_URL;
}

export default CONSTANT;
