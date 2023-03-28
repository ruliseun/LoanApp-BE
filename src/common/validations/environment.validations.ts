import { plainToClass } from 'class-transformer';
import { IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import * as dotenv from 'dotenv';
import { Environment } from '../enums';
dotenv.config();

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  SERVER_PORT: number;

  @IsString()
  DATABASE_URL: string;

  @IsNumber()
  JWT_REFRESH_TOKEN_TTL: number;

  @IsString()
  JWT_SECRET: string;

  @IsNumber()
  JWT_ACCESS_TOKEN_TTL: number;

  @IsString()
  CLOUDINARY_CLOUD_NAME: string;

  @IsString()
  CLOUDINARY_API_KEY: string;

  @IsString()
  CLOUDINARY_API_SECRET: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
