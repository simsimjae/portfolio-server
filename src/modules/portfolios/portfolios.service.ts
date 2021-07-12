import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PortfolioImage } from './entities/portfolioImage.entity';
import { Portfolio } from './entities/portfolio.entity';

@Injectable()
export class PortfoliosService {
  constructor(@InjectRepository(Portfolio) private readonly portfolioRepository: Repository<Portfolio>, @InjectRepository(PortfolioImage) private readonly portfolioImageRepository: Repository<PortfolioImage>) {}

  async findOne(id) {
    return await this.portfolioRepository.findOne(id, { relations: ['images'] });
  }

  async findAll() {
    return await this.portfolioRepository.find({ order: { createdAt: 'DESC' }, relations: ['images'] });
  }
}
