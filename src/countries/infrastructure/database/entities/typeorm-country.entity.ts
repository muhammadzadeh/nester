import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Timezone, Translations } from '../../../domain/entities/country.entity';
import { TypeormStateEntity } from './typeorm-state.entity';

@Entity({
  name: 'countries',
})
export class TypeormCountryEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_COUNTRIES' })
  readonly id!: string;

  @Column({ type: 'varchar' })
  readonly name!: string;

  @Column({ type: 'character', length: 3 })
  readonly iso3!: string;

  @Column({ type: 'character', length: 2 })
  readonly iso2!: string;

  @Column({ type: 'character', length: 3, name: 'numeric_code' })
  readonly numericCode!: string;

  @Column({ type: 'varchar', name: 'phone_code' })
  readonly phoneCode!: string;

  @Column({ type: 'varchar' })
  readonly capital!: string;

  @Column({ type: 'varchar' })
  readonly currency!: string;

  @Column({ type: 'varchar', name: 'currency_name' })
  readonly currencyName!: string;

  @Column({ type: 'varchar', name: 'currency_symbol' })
  readonly currencySymbol!: string;

  @Column({ type: 'varchar' })
  readonly tld!: string;

  @Column({ type: 'varchar', nullable: true })
  readonly native!: string | null;

  @Column({ type: 'varchar' })
  readonly region!: string;

  @Column({ type: 'int', name: 'region_id', nullable: true })
  readonly regionId!: number | null;

  @Column({ type: 'varchar', name: 'subregion' })
  readonly subregion!: string;

  @Column({ type: 'int', name: 'subregion_id', nullable: true })
  readonly subregionId!: number | null;

  @Column({ type: 'varchar' })
  readonly nationality!: string;

  @Column({ type: 'jsonb', nullable: true })
  readonly timezones!: Timezone[] | null;

  @Column({ type: 'jsonb' })
  readonly translations!: Translations;

  @Column({ type: 'decimal', precision: 14, scale: 10, nullable: true })
  readonly latitude!: number | null;

  @Column({ type: 'decimal', precision: 14, scale: 10, nullable: true })
  readonly longitude!: number | null;

  @Column({ type: 'varchar' })
  readonly emoji!: string;

  @Column({ type: 'varchar' })
  readonly emojiU!: string;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  @OneToMany(() => TypeormStateEntity, (state) => state.country)
  readonly states!: TypeormStateEntity[] | null;
}
