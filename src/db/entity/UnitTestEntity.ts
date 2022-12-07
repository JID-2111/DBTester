import { Type } from 'class-transformer';
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
  RecordMatches,
  RowBooleanOperations,
  RowIDOperations,
  RowNumberOperations,
  RowStringOperations,
  TableGenericOperations,
  UnitTestOperations,
} from './enum';
import RuleEntity from './RuleEntity';

@TableInheritance({ column: { type: 'varchar', name: 'type' } })
@Entity({ name: 'UnitTest' })
export abstract class UnitTestEntity {
  @Column({
    enum: UnitTestOperations,
    type: 'simple-enum',
  })
  abstract level: UnitTestOperations;

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    enum: RecordMatches,
    type: 'simple-enum',
    nullable: true,
  })
  expectedRecordMatches?: RecordMatches;

  @Column({
    nullable: true,
  })
  total?: boolean;

  @Column({
    nullable: true,
  })
  expectedNumRecords?: number;

  @Column()
  table: string; // table to run test on

  @Column({
    nullable: true,
  })
  column?: string;

  @Column({
    nullable: true,
  })
  value?: string;

  @Column()
  abstract operation: string;

  @Column({
    nullable: true,
  })
  result?: boolean; // Pass or Fail

  @Column({
    type: 'simple-enum',
    enum: OutputFormat,
    nullable: true,
  })
  format?: OutputFormat; // Format for output field

  @Column({
    nullable: true,
  })
  output?: string; // Debug information

  @ManyToOne((_type) => RuleEntity, (rule) => rule.unitTests, {
    onDelete: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @Type(() => RuleEntity)
  rule: RuleEntity;

  constructor(entity: UnitTestEntity) {
    Object.assign(this, entity);
  }
}

@ChildEntity()
export class TableTestEntity extends UnitTestEntity {
  @Column({
    enum: UnitTestOperations.TableGenericOperations,
    type: 'simple-enum',
  })
  level: UnitTestOperations.TableGenericOperations;

  @Column({
    type: 'simple-enum',
    enum: TableGenericOperations,
  })
  operation: TableGenericOperations;
}

@ChildEntity()
export class RowStringEntity extends UnitTestEntity {
  @Column({
    enum: UnitTestOperations.RowStringOperations,
    type: 'simple-enum',
  })
  level: UnitTestOperations.RowStringOperations;

  @Column({
    type: 'simple-enum',
    enum: RowStringOperations,
  })
  operation: RowStringOperations;
}

@ChildEntity()
export class RowIDEntity extends UnitTestEntity {
  @Column({
    enum: UnitTestOperations.RowIDOperations,
    type: 'simple-enum',
  })
  level: UnitTestOperations.RowIDOperations;

  @Column({
    type: 'simple-enum',
    enum: RowIDOperations,
  })
  operation: RowIDOperations;
}

@ChildEntity()
export class RowNumberEntity extends UnitTestEntity {
  @Column({
    enum: UnitTestOperations.RowNumberOperations,
    type: 'simple-enum',
  })
  level: UnitTestOperations.RowNumberOperations;

  @Column({
    type: 'simple-enum',
    enum: RowNumberOperations,
  })
  operation: RowNumberOperations;
}

@ChildEntity()
export class RowBooleanEntity extends UnitTestEntity {
  @Column({
    enum: UnitTestOperations.RowBooleanOperations,
    type: 'simple-enum',
  })
  level: UnitTestOperations.RowBooleanOperations;

  @Column({
    type: 'simple-enum',
    enum: RowBooleanOperations,
  })
  operation: RowBooleanOperations;
}
