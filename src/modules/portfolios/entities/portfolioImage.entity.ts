import { Exclude } from 'class-transformer';
import { BaseEntity, RelationId } from 'typeorm';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity()
export class PortfolioImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.images)
  @JoinColumn({ name: 'PORTFOLIO_ID' })
  portfolio: Portfolio;

  @RelationId((portfolioImage: PortfolioImage) => portfolioImage.portfolio)
  PORTFOLIO_ID: number | null;

  @Column()
  url: string;

  @Column({
    type: 'enum',
    enum: ['thumbnail', 'banner', 'general'],
    default: 'general',
  })
  type: 'thumbnail' | 'banner' | 'general';

  @Column({ nullable: true })
  @Exclude()
  key: string;

  @Column({ nullable: true })
  @Exclude()
  mimeType: string;

  @Column({ nullable: true })
  @Exclude()
  bucket: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  constructor(partial?: Partial<PortfolioImage>) {
    super();
    if (partial) {
      Object.keys(partial).forEach((x) => (this[x] = partial[x]));
    }
  }
}
