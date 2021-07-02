import { Base } from '../../../common/entities/base.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Portfolio } from '../../portfolios/entities/portfolio.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Review extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Portfolio, (portfolio) => portfolio.reviews)
  @JoinColumn({ name: 'PORTFOLIO_ID' })
  portfolio: Portfolio;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'USER_ID' })
  writer: User;

  @Column('text')
  contents: string;

  @Column()
  rating: number;

  constructor(partial?: Partial<Review>) {
    super();
    if (partial) {
      Object.keys(partial).forEach((x) => (this[x] = partial[x]));
    }
  }
}
