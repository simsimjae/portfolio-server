import { Exclude } from 'class-transformer';
import { AfterLoad, BaseEntity, BeforeInsert, RelationId, Unique } from 'typeorm';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Portfolio } from './portfolio.entity';

@Entity()
// @Unique(['bucket', 'key', 'type'])
export class PortfolioImage extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ['thumbnail', 'banner', 'general'],
    default: 'general',
  })
  type: 'thumbnail' | 'banner' | 'general';

  @Column({ nullable: true })
  @Exclude()
  bucket: string;

  @Column({ nullable: true })
  @Exclude()
  key: string;

  @CreateDateColumn()
  @Exclude()
  createdAt: Date;

  @UpdateDateColumn()
  @Exclude()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  url: string;

  @AfterLoad()
  getImageUrl() {
    this.url = `https://storage.googleapis.com/${this.bucket}/${this.key}`;
  }

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'PORTFOLIO_ID' })
  portfolio: Portfolio;

  @RelationId((portfolioImage: PortfolioImage) => portfolioImage.portfolio)
  PORTFOLIO_ID: number | null;

  constructor(partial?: Partial<PortfolioImage>) {
    super();
    if (partial) {
      Object.keys(partial).forEach((x) => (this[x] = partial[x]));
    }
  }
}
