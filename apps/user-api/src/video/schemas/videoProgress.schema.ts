import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('video_progress')
export class VideoProgress{
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Index()
    code: string

    @Column()
    current_time: string

    @Column()
    user_id: string

    @Column()
    video_id: string

    @Column()
    course_id: string

    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    created_at: Date;
    
    @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)", onUpdate: "CURRENT_TIMESTAMP(6)" })
    updated_at: Date;
}