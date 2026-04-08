import {
Entity,
PrimaryGeneratedColumn,
Column,
OneToMany,
CreateDateColumn,
UpdateDateColumn,
DeleteDateColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Admission } from './admission.entity';




@Entity('wards')
export class Ward {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ unique: true })
name: string;


@Column({ type: 'int', default: 0 })
bedoccupancy: number;

@Column({ type: 'int', default: 30 })
bedcapacity: number;

@OneToMany(() => User, (user) => user.ward)
patients: User[];

@OneToMany(() => Admission, (admission) => admission.ward)
admissions: Admission[];


@CreateDateColumn({
name: 'created_at',
})
createdAt: Date;

@UpdateDateColumn({
name: 'updated_at',
})
updatedAt: Date;

@DeleteDateColumn({ name: 'deleted_at', nullable: true })
deletedAt: Date;
}


