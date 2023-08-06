import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity('auth')
export class Auth {
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

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    sended_at: Date;
}