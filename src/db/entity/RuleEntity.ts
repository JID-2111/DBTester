import { Type } from 'class-transformer';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  BeforeInsert,
  AfterLoad,
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
 * A single rule group with its associated unit test conditions: {@link UnitTestEntity}.
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

  /**
   * The name of the procedure to trigger
   */
  @Column()
  procedure: string;

  parameters: string[];

  /**
   * JSON string with list of parameters for the procedure.
   */
  @Column()
  parameterList: string;

  @BeforeInsert()
  parseParameters() {
    this.parameterList = JSON.stringify(this.parameters);
  }

  @AfterLoad()
  loadParameters() {
    this.parameters = JSON.parse(this.parameterList);
  }

  @ManyToOne((_type) => ExecutionEntity, {
    onDelete: 'CASCADE',
  })
  @Type(() => ExecutionEntity)
  execution: ExecutionEntity;

  @OneToMany((_type) => UnitTestEntity, (unitTest) => unitTest.rule, {
    cascade: true,
    eager: true,
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
  unitTests: (
    | TableTestEntity
    | RowStringEntity
    | RowIDEntity
    | RowNumberEntity
    | RowBooleanEntity
  )[];

  @AfterLoad()
  castUnitTests() {
    this.unitTests = this.unitTests.map((unitTest) => {
      switch (unitTest.level) {
        case UnitTestOperations.TableGenericOperations:
          return new TableTestEntity(unitTest);
        case UnitTestOperations.RowStringOperations:
          return new RowStringEntity(unitTest);
        case UnitTestOperations.RowIDOperations:
          return new RowIDEntity(unitTest);
        case UnitTestOperations.RowNumberOperations:
          return new RowNumberEntity(unitTest);
        case UnitTestOperations.RowBooleanOperations:
          return new RowBooleanEntity(unitTest);
        default:
          throw new Error(`Unknown unit test`);
      }
    });
  }
}

export default RuleEntity;
