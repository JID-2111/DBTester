import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import ConnectionEntity from './ConnectionEntity';

@Entity({ name: 'Execution' })
class ExecutionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany((_type) => ConnectionEntity, {
    onDelete: 'SET NULL',
  })
  @JoinTable({
    name: 'execution_connections',
    joinColumn: {
      name: 'execution',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'connection',
      referencedColumnName: 'id',
    },
  })
  connections: ConnectionEntity[];

  @Column()
  name: string;
}

export default ExecutionEntity;
