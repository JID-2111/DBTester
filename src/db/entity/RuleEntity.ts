import { Type } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import ExecutionEntity from './ExecutionEntity';
import { UnitTestEntity } from './UnitTestEntity';

/**
 * A single rule group with its associated unit test conditions
 */
@Entity({ name: 'RuleGroup' })
class RuleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ruleId: number;

  /**
   * The database to run the unit tests on
   */
  @Column()
  database: string;

  /**
   * The name of the table with test data
   */
  @Column()
  testData: string;

  @ManyToOne((_type) => ExecutionEntity, {
    onDelete: 'CASCADE',
  })
  @Type(() => ExecutionEntity)
  execution: ExecutionEntity;

  @OneToMany((_type) => UnitTestEntity, (unitTest) => unitTest.rule)
  @Type(() => UnitTestEntity)
  unitTests: UnitTestEntity[];
}

export default RuleEntity;
