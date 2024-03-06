import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TypeormCityRegionEntity } from './typeorm-city-region.entity';
import { TypeormStateEntity } from './typeorm-state.entity';

@Entity({
  name: 'cities',
})
export class TypeormCityEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_CITIES' })
  readonly id!: string;

  @Column({ type: 'uuid', name: 'state_id' })
  readonly stateId!: string;

  @Column({ type: 'varchar' })
  readonly name!: string;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  @ManyToOne(() => TypeormStateEntity, (state) => state.cities, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_CITIES_STATES_ID',
    name: 'state_id',
  })
  readonly state!: TypeormStateEntity | null;

  @OneToMany(() => TypeormCityRegionEntity, (region) => region.city)
  readonly regions!: TypeormCityRegionEntity[] | null;
}
