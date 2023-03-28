import { Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import { getReadableStream } from '../../common/helpers/uploads.helper';


@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) {
          reject(error);
          return;
        }

        resolve(result);
      });

      const stream = getReadableStream(file.buffer);

      stream.pipe(upload);
    });
  }
}
