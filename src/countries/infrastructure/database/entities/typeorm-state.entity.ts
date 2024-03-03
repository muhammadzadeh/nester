import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity({
  name: 'states',
})
export class TypeormStateEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', primaryKeyConstraintName: 'PK_STATES' })
  id!: number;

  @Column({ type: 'int', name: 'country_id' })
  countryId!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', name: 'state_code' })
  stateCode!: string;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  longitude!: number;

  @Column({ type: 'varchar', nullable: true })
  type!: null | string;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt!: Date | null;
}
