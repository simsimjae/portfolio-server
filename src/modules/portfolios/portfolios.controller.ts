import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';

@Controller('portfolios')
export class PortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @Get(':id')
  async findOne(@Param('id') id) {
    return await this.portfoliosService.findOne(id);
  }

  @Get('')
  async findAll() {
    return this.portfoliosService.findAll();
  }

  @Patch(':id')
  async patch(@Param('id') id) {
    console.log(123123, id);
  }

  @Delete(':id')
  async delete(@Param('id') id) {
    console.log(123123, id);
  }
}
