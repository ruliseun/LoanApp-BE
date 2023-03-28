import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';
import { IEnvironment } from '../../common/interfaces';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: async (configService: ConfigService<IEnvironment>) => {
    const cloud_name = configService.get('CLOUDINARY_CLOUD_NAME', {
      infer: true,
    });
    const api_key = configService.get('CLOUDINARY_API_KEY', {
      infer: true,
    });
    const api_secret = configService.get('CLOUDINARY_API_SECRET', {
      infer: true,
    });

    return v2.config({
      cloud_name,
      api_key,
      api_secret,
    });
  },
  inject: [ConfigService],
};
