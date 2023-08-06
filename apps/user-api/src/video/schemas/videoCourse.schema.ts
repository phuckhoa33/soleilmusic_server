import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity('videoCourse')
export class VideoCourse {
    @PrimaryGeneratedColumn()
    id: number


    @Index()
    @Column()
    video_course_id: string

    @Column()
    video_title: string

    @Column()
    video_path: string 

    @Column()
    course_id: string
}