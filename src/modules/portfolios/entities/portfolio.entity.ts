import { AfterLoad, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PortfolioImage } from './portfolioImage.entity';
import { Review } from '../../reviews/entities/review.entity';
import { Base } from '../../../common/entities/base.entity';

@Entity()
export class Portfolio extends Base {
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

  @OneToMany(() => PortfolioImage, (portfolioImage) => portfolioImage.portfolio, { cascade: true, onDelete: 'CASCADE' })
  images: PortfolioImage[];

  @OneToMany(() => Review, (review) => review.portfolio)
  reviews: Review[];

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
