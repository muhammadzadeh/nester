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
import { CityRegionEntity } from '../../../domain/entities/city-region.entity';
import { TypeormCityEntity } from './typeorm-city.entity';

@Entity({
  name: 'city_regions',
})
export class TypeormCityRegionEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'city_regions_id_pkey' })
  readonly id!: string;

  @Column({ type: 'uuid', name: 'city_id' })
  readonly cityId!: string;

  @Column({ type: 'varchar' })
  readonly name!: string;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  @ManyToOne(() => TypeormCityEntity, (city) => city.regions, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'city_regions_city_id_cities_id_fkey',
    name: 'city_id',
  })
  readonly city!: TypeormCityEntity | null;

  static toCityRegionEntity(item: TypeormCityRegionEntity): CityRegionEntity {
    return new CityRegionEntity(item.cityId, item.name, item.id);
  }
}
