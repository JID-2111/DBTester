import { safeStorage } from 'electron';
import log from 'electron-log';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
  AfterRemove,
} from 'typeorm';
import { Type } from 'class-transformer';
import AppDataSource from '../../data-source';
import { parseConnectionString } from '../../main/util';
import { ConnectionInputType } from '../models/ConnectionModels';
import { DBProvider } from './enum';
import ExecutionEntity from './ExecutionEntity';

@Entity({ name: 'Connection' })
class ConnectionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  defaultDatabase: string;

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

  @CreateDateColumn()
  createdDate: Date;

  @Column('datetime')
  lastUsed: Date;

  /**
   * All executions that were run on this server
   */
  @OneToMany((_type) => ExecutionEntity, (execution) => execution.connections)
  @Type(() => ExecutionEntity)
  executions: ExecutionEntity[];

  /**
   * If a connection is removed, delete any executions associated with it
   */
  @AfterRemove()
  async cleanupExecutions() {
    console.log('triggered');
    const rep = AppDataSource.getRepository(ExecutionEntity);
    const orphans = await rep
      .createQueryBuilder()
      .leftJoinAndSelect(
        'execution_connections',
        'ec',
        'ExecutionEntity.id=ec.execution'
      )
      .where('ec.connection is null')
      .getMany();
    log.debug(
      `Removing orphan executions with id: [${orphans.map(
        (entity) => entity.id
      )}]`
    );
    await rep.remove(orphans);
  }

  @AfterLoad()
  decryptPassword() {
    this.password = safeStorage.decryptString(
      Buffer.from(this.password, 'base64')
    );
  }

  @BeforeUpdate()
  @BeforeInsert()
  encryptPassword() {
    if (safeStorage.isEncryptionAvailable()) {
      this.password = safeStorage
        .encryptString(this.password)
        .toString('base64');
    } else {
      throw new Error('Error Encrypting Password');
    }
  }

  constructor(model?: ConnectionInputType) {
    if (model === undefined) return;
    if (model.connectionConfig.config === 'manual') {
      const { username, password, address, port, defaultDatabase } =
        model.connectionConfig;
      Object.assign(this, {
        config: 'manual',
        defaultDatabase,
        username,
        password,
        address,
        port,
      });
    } else {
      const fields = parseConnectionString(
        model.type,
        model.connectionConfig.connectionString
      );
      const { username, password, endpoint } = fields;
      if (fields.hosts.length > 0) {
        Object.assign(this, {
          config: 'manual',
          defaultDatabase: endpoint,
          username,
          password,
          address: fields.hosts[0].host,
          port: fields.hosts[0].port,
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
