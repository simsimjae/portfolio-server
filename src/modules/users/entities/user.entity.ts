import { Portfolio } from './../../portfolios/entities/portfolio.entity';
import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn, RelationId } from 'typeorm';
import { Review } from '../../reviews/entities/review.entity';
import { Token } from '../../auth/entities/token.entity';
import { BaseEntity } from 'typeorm';
import bcypt from 'bcrypt';
import { Exclude } from 'class-transformer';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, nullable: true })
  email: string;

  @BeforeInsert()
  async encryptPassword() {
    if (this.password) this.password = bcypt.hashSync(this.password, 10);
  }

  @Column({ nullable: true })
  @Exclude()
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
  @Exclude()
  isActive: boolean;

  @Column({ nullable: true })
  @Exclude()
  snsId: string;

  @Column({
    type: 'enum',
    enum: ['general', 'admin'],
    default: 'general',
  })
  @Exclude()
  role: 'general' | 'admin';

  @Column({ type: 'enum', enum: ['kakao', 'naver', 'email'], default: 'email' })
  @Exclude()
  provider: 'kakao' | 'naver' | 'email';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  @Exclude()
  deletedAt: Date;

  @OneToOne(() => Token, (token) => token.user)
  @JoinColumn({ name: 'TOKEN_ID' })
  @Exclude()
  token: Token;

  @OneToMany(() => Review, (review) => review.writer)
  reviews: Review[];

  @OneToMany(() => Portfolio, (portfolio) => portfolio.writer)
  portfolios: Portfolio[];

  @RelationId((user: User) => user.token)
  @Exclude()
  TOKEN_ID: number | null;

  constructor(partial?: Partial<User>) {
    super();
    if (partial) {
      Object.keys(partial).forEach((x) => (this[x] = partial[x]));
    }
  }
}
