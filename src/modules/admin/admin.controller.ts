import { ResizeImageInterceptor } from './../../common/interceptors/resize-image.interceptor';
import { Body, Controller, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('admin')
export class AdminController {
  @Post('image')
  @UseInterceptors(FilesInterceptor('image'), ResizeImageInterceptor)
  async createImage(@UploadedFile('files') files) {
    const imageUrls = files?.map((file) => file.linkUrl);
    return imageUrls?.length > 0 ? imageUrls[0] : null;
  }
}
