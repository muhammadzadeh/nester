import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OTPEntity, OTPReason, OTPType } from '../../../domain/entities';

@Entity({ name: 'otp_logs' })
export class TypeormOTPEntity {
  @PrimaryGeneratedColumn('uuid', { primaryKeyConstraintName: 'otp_logs_id_pkey' })
  id!: string;

  @Column({ type: 'varchar' })
  destination!: string;

  @Column({ type: 'varchar' })
  otp!: string;

  @Column({ type: 'uuid', name: 'user_id' })
  userId!: string;

  @Column({ type: 'enum', enum: OTPType })
  type!: OTPType;

  @Column({ type: 'enum', enum: OTPReason })
  reason!: OTPReason;

  @Column({ type: 'timestamptz', nullable: true, name: 'expire_at' })
  expireAt!: Date | null;

  @Column({ type: 'timestamptz', nullable: true, name: 'used_at' })
  usedAt!: Date | null;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt!: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  public static toOTPEntity(input: TypeormOTPEntity): OTPEntity {
    return new OTPEntity(
      input.userId,
      input.destination,
      input.type,
      input.reason,
      input.expireAt,
      input.otp,
      input.id,
      input.usedAt,
      input.createdAt,
      input.updatedAt,
      input.deletedAt,
    );
  }
}
