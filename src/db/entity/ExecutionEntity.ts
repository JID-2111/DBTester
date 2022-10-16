import { Type } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import ConnectionEntity from './ConnectionEntity';
import RuleEntity from './RuleEntity';

/**
 * A list of previous executions. Contains the test data, group, and test conditions.
 * Currently supports only one database // TODO add support
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
  @OneToMany((_type) => RuleEntity, (rule) => rule, {
    cascade: true,
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
    }
  )
  @Type(() => ConnectionEntity)
  connections: ConnectionEntity[];
}

export default ExecutionEntity;
