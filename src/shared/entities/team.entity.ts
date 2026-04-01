import {
Entity,
PrimaryGeneratedColumn,
Column,
OneToMany,
CreateDateColumn,
UpdateDateColumn,
DeleteDateColumn,
ManyToMany,
JoinTable,
} from 'typeorm';
import { User } from './user.entity';

@Entity('teams')
export class Team {
@PrimaryGeneratedColumn('uuid')
id: string;

@Column({ unique: true })
name: string;


@OneToMany(() => User, (user) => user.ward)
patients: User[];


@ManyToMany(() => User, user => user.teams)
@JoinTable()
users: User[];


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


