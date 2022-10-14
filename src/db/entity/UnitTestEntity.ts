import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  TableInheritance,
  ChildEntity,
} from 'typeorm';
import { RowOperations, TableOperations } from './enum';
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
}

@ChildEntity()
export class TableTestEntity extends UnitTestEntity {
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
