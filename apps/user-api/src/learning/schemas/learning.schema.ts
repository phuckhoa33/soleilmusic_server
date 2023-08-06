import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Learning {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    learning_id: string

    @Column()
    course_id: string

    @Column()
    user_id: string

    @Column({default: 0})
    progress: number

    @Column({default: 0})
    score: number

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;
    
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;
}