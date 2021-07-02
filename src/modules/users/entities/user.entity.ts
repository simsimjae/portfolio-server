import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';
import { Token } from '../../auth/entities/token.entity';
import { Base } from '../../../common/entities/base.entity';

@Entity()
export class User extends Base {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  age: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ nullable: true })
  thumbnail: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  snsId: string;

  @Column({ type: 'enum', enum: ['kakao', 'naver', 'email'], default: 'email' })
  provider: 'kakao' | 'naver' | 'email';

  @OneToOne(() => Token, (token) => token.user)
  @JoinColumn({ name: 'TOKEN_ID' })
  token: Token;

  @OneToMany(() => Review, (review) => review.writer)
  reviews: Review[];

  constructor(partial?: Partial<User>) {
    super();
    if (partial) {
      Object.keys(partial).forEach((x) => (this[x] = partial[x]));
    }
  }
}
