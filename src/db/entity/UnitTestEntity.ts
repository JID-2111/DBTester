import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  TableInheritance,
  ChildEntity,
} from 'typeorm';
import {
  OutputFormat,
  RowOperations,
  TableOperations,
  TestLevel,
} from './enum';
import RuleEntity from './RuleEntity';

@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Entity({ name: 'UnitTest' })
export class UnitTestEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne((_type) => RuleEntity, (rule) => rule.unitTests, {
    onDelete: 'CASCADE',
  })
  rule: RuleEntity;

  @Column()
  result: boolean; // Pass or Fail

  output: string; // Debug information

  format: OutputFormat; // Format for output field
}

@ChildEntity()
export class TableTestEntity extends UnitTestEntity {
  type: TestLevel = TestLevel.TABLE;

  @Column({
    type: 'simple-enum',
    enum: TableOperations,
  })
  operation: TableOperations;

  @Column()
  tableName: string;

  @Column({
    nullable: true,
  })
  count: number;
}

@ChildEntity()
export class RowTestEntity extends UnitTestEntity {
  type: TestLevel = TestLevel.ROW;

  @Column({
    type: 'simple-enum',
    enum: RowOperations,
  })
  operation: RowOperations;

  @Column()
  column: string;

  @Column()
  value: string;
}
