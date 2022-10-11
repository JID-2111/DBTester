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

  @ManyToOne((_type) => ExecutionEntity)
  execution: ExecutionEntity;

  @OneToMany((_type) => UnitTestEntity, (unitTest) => unitTest.rule, {
    onDelete: 'CASCADE',
  })
  unitTests: UnitTestEntity[];
}

export default RuleEntity;
