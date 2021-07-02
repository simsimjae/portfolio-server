import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import CreatePortfolioDto from './dto/create-portfolio.dto';
import { PortfolioImage } from './entities/portfolioImage.entity';
import { Portfolio } from './entities/portfolio.entity';

@Injectable()
export class PortfoliosService {
  constructor(@InjectRepository(Portfolio) private readonly portfolioRepository: Repository<Portfolio>, @InjectRepository(PortfolioImage) private readonly portfolioImageRepository: Repository<PortfolioImage>) {}

  async create(dto: CreatePortfolioDto) {
    const images = dto.imageUrls.map((url) => new PortfolioImage({ type: 'general', url }));
    images.push(new PortfolioImage({ type: 'thumbnail', url: dto.thumbnail }));
    images.push(new PortfolioImage({ type: 'banner', url: dto.banner }));

    const newPortfolio = new Portfolio({ ...dto });
    newPortfolio.images = images;
    return await this.portfolioRepository.save(newPortfolio);
  }

  async findOne(id) {
    return await this.portfolioRepository.findOne(id, { relations: ['images'] });
  }

  async findAll() {
    return await this.portfolioRepository.find({ order: { createdAt: 'DESC' }, relations: ['images'] });
  }
}
