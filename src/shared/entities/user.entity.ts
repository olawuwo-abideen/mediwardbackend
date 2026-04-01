import { Exclude, instanceToPlain } from 'class-transformer';
import {
Entity,
PrimaryGeneratedColumn,
Column,
CreateDateColumn,
UpdateDateColumn,
OneToMany,
DeleteDateColumn,
ManyToOne,
ManyToMany
} from 'typeorm';
import { Appointment } from './appointment.entity';
import { AvailabilitySlot } from './availabilityslot.entity';
import { Admission } from './admission.entity';
import { Ward } from './ward.entity';
import { Team } from './team.entity';
import { Treatment } from './treatment.entity';


export enum UserRole {
PATIENT = 'Patient',
DOCTOR = 'Doctor',
NURSE = 'Nurse',
}



export enum Gender {
MALE = 'male',
FEMALE = 'female'
}

@Entity('users')
export class User {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ name: 'firstname', length: 30, nullable: true })
firstname?: string;

@Column({ name: 'lastname', length: 30, nullable: true })
lastname?: string;


@Column({ unique: true, length: 50 })
email: string;

@Column({ name: 'dob'})
dob?: Date;

@Column({ unique: true, length: 20 })
phonenumber: string;

@Column({
type: 'enum',
enum: Gender,
nullable: true,
name: 'gender',

})
gender: Gender;

@Column({ default: 'inactive' })
accountStatus: 'active' | 'inactive';

@Column({ nullable: true })
emailVerifiedAt: Date;



// @Column({ default:false })
// accountActivation: boolean;

@Column()
@Exclude()
password: string;

@Column({ type: 'enum', enum: UserRole })
role: UserRole;

@Column({ type: 'varchar', name: 'reset_token', nullable: true })
@Exclude()
resetToken: string | null;

@ManyToOne(() => Ward, (ward) => ward.patients)
ward: Ward;

@OneToMany(() => Appointment, (appointment) => appointment.user)
appointments?: Appointment[];

@OneToMany(() => AvailabilitySlot, (slot) => slot.user)
availabilitySlots: AvailabilitySlot[];

@OneToMany(() => Admission, (admission) => admission.patient)
admissions: Admission[];


@ManyToMany(() => Team, team => team.users)
teams: Team[];

@OneToMany(() => Admission, (admission) => admission.doctor)
doctorAdmissions: Admission[];

@OneToMany(() => Treatment, (treatment) => treatment.patient)
treatments: Treatment[];

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

toJSON?(): Record<string, any> {
return instanceToPlain(this);
}
}
