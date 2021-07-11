import { User } from './../../users/entities/user.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity, RelationId } from 'typeorm';
import { Portfolio } from '../../portfolios/entities/portfolio.entity';
import { IsNotEmpty } from 'class-validator';

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column('text')
  contents: string;

  @IsNotEmpty()
  @Column()
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.reviews)
  @JoinColumn({ name: 'PORTFOLIO_ID' })
  portfolio: Portfolio;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'USER_ID' })
  writer: User;

  @RelationId((review: Review) => review.portfolio)
  PORTFOLIO_ID: number | null;

  @RelationId((review: Review) => review.writer)
  USER_ID: string | null;

  public toString(): string {
    return `${this.rating} ${this.portfolio?.contents}`;
  }

  constructor(partial?: Partial<Review>) {
    super();
    if (partial) {
      Object.keys(partial).forEach((x) => (this[x] = partial[x]));
    }
  }
}
