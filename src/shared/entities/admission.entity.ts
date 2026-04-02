import {
Entity,
PrimaryGeneratedColumn,
Column,
CreateDateColumn,
UpdateDateColumn,
ManyToOne,
DeleteDateColumn,
JoinColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

export enum PatientStatus {
IN_PATIENT = 'in-patient',
OUT_PATIENT = 'out-patient',
}

@Entity('admissions')
export class Admission {
@PrimaryGeneratedColumn('uuid')
id: string;

@ManyToOne(() => User, (user) => user.admissions, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'patientId' })
patient: User;

@ManyToOne(() => User, (user) => user.doctorAdmissions, { nullable: true, onDelete: 'SET NULL' })
@JoinColumn({ name: 'doctorId' })
doctor: User;

@Column({ type: 'text', nullable: false })
reasonforadmission: string;

@Column({ default: true })
isAdmitted: boolean;

@Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
admittedAt: Date;

@Column({ type: 'timestamp', nullable: true })
dischargedAt: Date;


@Column({ type: 'text', nullable: true })
dischargeReason: string;

@CreateDateColumn({
name: 'created_at',
})
@Exclude()
createdAt: Date;

@UpdateDateColumn({
name: 'updated_at',
})
@Exclude()
updatedAt: Date;

@DeleteDateColumn({ name: 'deleted_at', nullable: true })
@Exclude()
deletedAt: Date;
}