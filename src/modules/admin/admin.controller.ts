import { Body, Controller, Post, Request, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { getPublicUrl, multerOptions } from './config/multerOptions';

@Controller('admin')
export class AdminController {
  @Post('image')
  @UseInterceptors(FilesInterceptor('image', null, multerOptions))
  async createImage(@UploadedFile('files') files) {
    return files.map((file) => file.linkUrl);
  }
}
