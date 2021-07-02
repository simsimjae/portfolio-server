import { Base } from '../../../common/entities/base.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity()
export class PortfolioImage extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.images)
  @JoinColumn({ name: 'PORTFOLIO_ID' })
  portfolio: Portfolio;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: ['thumbnail', 'banner', 'general'],
    default: 'general',
  })
  type: 'thumbnail' | 'banner' | 'general';

  constructor(partial?: Partial<PortfolioImage>) {
    super();
    if (partial) {
      Object.keys(partial).forEach((x) => (this[x] = partial[x]));
    }
  }
}
