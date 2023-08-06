import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity('admin')
export class Admin {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index()
    user_id: string 

    @Column()
    user_name: string

    @Column()
    email: string

    @Column()
    gender: boolean

    @Column()
    phone_number: string

    @Column()
    password: string 

    @Column()
    accepted_admin: string 

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    accepted_at: Date;
}