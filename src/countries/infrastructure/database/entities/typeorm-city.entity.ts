import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'cities',
})
export class TypeormCityEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', primaryKeyConstraintName: 'PK_CITIES' })
  id!: number;

  @Column({ type: 'int', name: 'state_id' })
  stateId!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  longitude!: number;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt!: Date | null;
}
