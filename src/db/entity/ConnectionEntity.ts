import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ConnectionModel } from '../Models';

@Entity({ name: 'Connection' })
class ConnectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column()
  address: string;

  @Column()
  port: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column('datetime')
  lastUsed: Date;

  constructor(model?: ConnectionModel) {
    Object.assign(this, model);
  }
}

export default ConnectionEntity;
