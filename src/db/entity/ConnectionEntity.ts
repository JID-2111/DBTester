import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { parseConnectionString } from '../../main/util';
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
      const fields = parseConnectionString(model);
      if (fields === undefined || fields === null) return;
      const { username, password } = fields;
      if (fields?.hosts.length > 0) {
        Object.assign(this, {
          config: 'manual',
          username,
          password,
          address: fields?.hosts[0].host,
          port: fields?.hosts[0].port,
        });
      }
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
