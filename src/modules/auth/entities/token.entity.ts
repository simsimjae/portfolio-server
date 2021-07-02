import { User } from './../../users/entities/user.entity';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Base } from '../../../common/entities/base.entity';

@Entity()
export class Token extends Base {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  refresh: string;

  @Column()
  expiresAt: Date;

  @OneToOne(() => User, (user) => user.token)
  user: User;
}
