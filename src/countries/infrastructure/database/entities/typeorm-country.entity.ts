import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Timezone, Translations } from '../../../domain/entities/country.entity';

@Entity({
  name: 'countries',
})
export class TypeormCountryEntity {
  @PrimaryGeneratedColumn('increment', { type: 'int', primaryKeyConstraintName: 'PK_COUNTRIES' })
  id!: number;

  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'character', length: 3 })
  iso3!: string;

  @Column({ type: 'character', length: 2 })
  iso2!: string;

  @Column({ type: 'character', length: 3, name: 'numeric_code' })
  numericCode!: string;

  @Column({ type: 'varchar', name: 'phone_code' })
  phoneCode!: string;

  @Column({ type: 'varchar' })
  capital!: string;

  @Column({ type: 'varchar' })
  currency!: string;

  @Column({ type: 'varchar', name: 'currency_name' })
  currencyName!: string;

  @Column({ type: 'varchar', name: 'currency_symbol' })
  currencySymbol!: string;

  @Column({ type: 'varchar' })
  tld!: string;

  @Column({ type: 'varchar' })
  native!: string;

  @Column({ type: 'varchar' })
  region!: string;

  @Column({ type: 'int', name: 'region_id' })
  regionId!: number;

  @Column({ type: 'varchar', name: 'subregion' })
  subregion!: string;

  @Column({ type: 'int', name: 'subregion_id' })
  subregionId!: number;

  @Column({ type: 'varchar' })
  nationality!: string;

  @Column({ type: 'json', array: true })
  timezones!: Timezone[];

  @Column({ type: 'json', array: true })
  translations!: Translations;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  latitude!: number;

  @Column({ type: 'decimal', precision: 10, scale: 8 })
  longitude!: number;

  @Column({ type: 'varchar' })
  emoji!: string;

  @Column({ type: 'varchar' })
  emojiU!: string;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt!: Date | null;
}
