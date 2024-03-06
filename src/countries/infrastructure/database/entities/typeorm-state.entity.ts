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
import { TypeormCityEntity } from './typeorm-city.entity';
import { TypeormCountryEntity } from './typeorm-country.entity';

@Entity({
  name: 'states',
})
export class TypeormStateEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'PK_STATES' })
  readonly id!: string;

  @Column({ type: 'uuid', name: 'country_id' })
  readonly countryId!: string;

  @Column({ type: 'varchar' })
  readonly name!: string;

  @Column({ type: 'varchar', name: 'state_code' })
  readonly stateCode!: string;

  @Column({ type: 'varchar', nullable: true })
  readonly type!: null | string;

  @CreateDateColumn({ name: 'created_at' })
  readonly createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  readonly updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  readonly deletedAt!: Date | null;

  @ManyToOne(() => TypeormCountryEntity, (country) => country.states, { onDelete: 'CASCADE' })
  @JoinColumn({
    foreignKeyConstraintName: 'FK_STATES_COUNTRIES_ID',
    name: 'country_id',
  })
  readonly country!: TypeormCountryEntity | null;

  @OneToMany(() => TypeormCityEntity, (city) => city.state)
  readonly cities!: TypeormCityEntity[] | null;
}
