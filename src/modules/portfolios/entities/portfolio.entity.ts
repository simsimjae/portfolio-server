import { User } from '../../users/entities/user.entity';
import { AfterLoad, Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne, JoinColumn, RelationId } from 'typeorm';
import { PortfolioImage } from './portfolioImage.entity';
import { Review } from '../../reviews/entities/review.entity';
import { BaseEntity } from 'typeorm';

@Entity()
export class Portfolio extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  link: string;

  @Column()
  title: string;

  @Column('text')
  contents: string;

  @Column()
  techStacks: string;

  @Column()
  participants: string;

  @Column()
  role: string;

  @Column()
  type: string;

  @Column()
  period: string;

  @Column()
  mainTask: string;

  @Column('int', { nullable: true })
  rank: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => PortfolioImage, (portfolioImage) => portfolioImage.portfolio, { cascade: true, onDelete: 'CASCADE' })
  images: PortfolioImage[];

  @OneToMany(() => Review, (review) => review.portfolio)
  reviews: Review[];

  @ManyToOne(() => User, (user) => user.portfolios, { nullable: false })
  @JoinColumn({ name: 'USER_ID' })
  writer: User;

  @RelationId((portfolio: Portfolio) => portfolio.writer)
  USER_ID: string | null;

  banner?: string;
  thumbnail?: string;

  @AfterLoad()
  getImages() {
    this.banner = this.images?.find((image) => image.type === 'banner')?.url;
    this.thumbnail = this.images?.find((image) => image.type === 'thumbnail')?.url;
  }

  @AfterLoad()
  sortItems() {
    this.reviews?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  constructor(partial?: Partial<Portfolio>) {
    super();
    if (partial) {
      Object.keys(partial).forEach((x) => (this[x] = partial[x]));
    }
  }
}
