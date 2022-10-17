import { Type } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { UnitTestOperations } from './enum';
import ExecutionEntity from './ExecutionEntity';
import {
  RowBooleanEntity,
  RowIDEntity,
  RowNumberEntity,
  RowStringEntity,
  TableTestEntity,
  UnitTestEntity,
} from './UnitTestEntity';

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

  @OneToMany((_type) => UnitTestEntity, (unitTest) => unitTest.rule, {
    cascade: true,
  })
  @Type(() => UnitTestEntity, {
    discriminator: {
      property: 'level',
      subTypes: [
        {
          value: TableTestEntity,
          name: UnitTestOperations.TableGenericOperations,
        },
        {
          value: RowStringEntity,
          name: UnitTestOperations.RowStringOperations,
        },
        {
          value: RowIDEntity,
          name: UnitTestOperations.RowIDOperations,
        },
        {
          value: RowNumberEntity,
          name: UnitTestOperations.RowNumberOperations,
        },
        {
          value: RowBooleanEntity,
          name: UnitTestOperations.RowBooleanOperations,
        },
      ],
    },
    keepDiscriminatorProperty: true,
  })
  unitTests: UnitTestEntity[];
}

export default RuleEntity;
