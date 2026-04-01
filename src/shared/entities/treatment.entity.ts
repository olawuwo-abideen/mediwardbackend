import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Exclude } from 'class-transformer';

@Entity('treatment')
export class Treatment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  symptoms: string;

  @Column()
  diagnosis: string;

  @Column()
  medication: string;


  @ManyToOne(() => User, (user) => user.treatments,  { onDelete: 'CASCADE' })
  patient: User;

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