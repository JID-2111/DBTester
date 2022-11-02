import { Type } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  BeforeInsert,
} from 'typeorm';
import { store } from '../redux/store';
import ConnectionService from '../service/ConnectionService';
import ConnectionEntity from './ConnectionEntity';
import RuleEntity from './RuleEntity';

/**
 * A single execution of multiple rule groups {@link RuleEntity}.
 */
@Entity({ name: 'Execution' })
class ExecutionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  /**
   * A list of the rules being tested
   */
  @OneToMany((_type) => RuleEntity, (rule) => rule.execution, {
    cascade: true,
    eager: true,
  })
  @Type(() => RuleEntity)
  rules: RuleEntity[];

  /**
   * The server connections to execute on
   */
  @ManyToOne(
    (_type) => ConnectionEntity,
    (connection) => connection.executions,
    {
      onDelete: 'CASCADE',
      eager: true,
    }
  )
  @Type(() => ConnectionEntity)
  connection: ConnectionEntity;

  @BeforeInsert()
  async getConnection() {
    const model = store.getState().connection.serverConnectionModel;
    if (model === null) {
      throw new Error('Cannot get active connection model');
    }
    const entity = await new ConnectionService().findById(model.id);
    if (entity === null) {
      throw new Error('Cannot get active connection entity');
    }
    this.connection = entity;
  }
}

export default ExecutionEntity;
