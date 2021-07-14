import { Body, Controller, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { getPublicUrl, multerOptions } from './config/multerOptions';

@Controller('admin')
export class AdminController {
  @Post('image')
  @UseInterceptors(FilesInterceptor('image', null, multerOptions))
  async createImage(@UploadedFile('files') files) {
    const imageUrls = files?.map((file) => file.linkUrl);
    return imageUrls?.length > 0 ? imageUrls[0] : null;
  }
}
