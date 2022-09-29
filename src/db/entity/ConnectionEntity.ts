import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { ConnectionModelType } from '../Models';
import DBProvider from './enum';

@Entity({ name: 'Connection' })
class ConnectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nickname: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  port: number;

  @Column({ nullable: true })
  username: string;

  @Column({ nullable: true })
  password: string;

  @Column({
    type: 'simple-enum',
    enum: DBProvider,
  })
  type: DBProvider;

  @Column({ nullable: true })
  connectionString: string;

  @CreateDateColumn()
  createdDate: Date;

  @Column('datetime')
  lastUsed: Date;

  constructor(model?: ConnectionModelType) {
    if (model === undefined) return;
    if (model.connectionConfig.config === 'manual') {
      const { username, password, address, port } = model.connectionConfig;
      Object.assign(this, {
        config: 'manual',
        username,
        password,
        address,
        port,
      });
    } else {
      this.connectionString = model.connectionConfig.connectionString;
    }
    const { nickname, id, createdDate, lastUsed, type } = model;
    Object.assign(this, {
      nickname,
      id,
      createdDate,
      lastUsed,
      type,
    });
  }
}

export default ConnectionEntity;
