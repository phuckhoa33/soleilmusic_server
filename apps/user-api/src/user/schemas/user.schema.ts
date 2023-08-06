import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index()
    code: string

    @Column()
    email: string

    @Column()
    password: string 

    @Column()
    first_name: string 

    @Column()
    last_name: string 

    @Column({ type: 'varchar', length: 255 }) 
    image: string
}