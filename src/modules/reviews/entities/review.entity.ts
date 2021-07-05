import { User } from './../../users/entities/user.entity';
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, BaseEntity } from 'typeorm';
import { Portfolio } from '../../portfolios/entities/portfolio.entity';

@Entity()
export class Review extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  contents: string;

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

  constructor(partial?: Partial<Review>) {
    super();
    if (partial) {
      Object.keys(partial).forEach((x) => (this[x] = partial[x]));
    }
  }
}
