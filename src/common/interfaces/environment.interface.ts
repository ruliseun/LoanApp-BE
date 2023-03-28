import { Environment } from '../enums';

export interface IEnvironment {
  NODE_ENV: Environment;
  SERVER_PORT: number;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_ACCESS_TOKEN_TTL: number;
  JWT_REFRESH_TOKEN_TTL: number;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}