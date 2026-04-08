import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('transfers')
export class Transfer {
@PrimaryGeneratedColumn('uuid')
id: string;

@ManyToOne(() => User)
patient: User; 

@Column({ type: 'varchar', length: 100 })
transferto: string; 

@Column({ type: 'text', nullable: true })
reason: string;

@CreateDateColumn()
transferdate: Date;





@UpdateDateColumn({
name: 'updated_at',
})
updatedAt: Date;
}