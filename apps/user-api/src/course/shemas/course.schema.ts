import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Course{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    course_id: string 

    @Column()
    course_title: string

    @Column("longtext")
    course_desc: string

    @Column()
    course_image: string

    @Column()
    course_state: string

    @Column()
    course_banner: string

    @Column()
    course_author: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;
    
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;
}