import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TypeormCityEntity } from './typeorm-city.entity';

@Entity({
  name: 'city_regions',
})
export class TypeormCityRegionEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_CITY_REGIONS' })
  readonly id!: string;

  @Column({ type: 'uuid', name: 'city_id' })
  readonly cityId!: string;

  @Column({ type: 'varchar' })
  readonly name!: string;

  @Column({ type: 'decimal', precision: 14, scale: 10, nullable: true })
  readonly latitude!: number | null;

  @Column({ type: 'decimal', precision: 14, scale: 10, nullable: true })
  readonly longitude!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  @ManyToOne(() => TypeormCityEntity, (city) => city.regions, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_CITY_REGIONS_CITIES_ID',
    name: 'city_id',
  })
  readonly city!: TypeormCityEntity | null;
}
