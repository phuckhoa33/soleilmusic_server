import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { VideoProgressService } from "./videoProgress.service";
import { VideoCourse } from "../schemas/videoCourse.schema";

@Injectable()
export class VideoCourseService {
    constructor(
        @InjectRepository(VideoCourse)
        private readonly videoCourseRepository: Repository<VideoCourse>,
        private readonly videoProgressService: VideoProgressService
    ){}

    async getAllVideoCourse(course_id: string): Promise<VideoCourse[]>{
        try {
            const videoCourses = await this.videoCourseRepository.find({where: {course_id}});
            return videoCourses;
        } catch (error) {
            console.log(error);
            
        }
    }

    async getAllVideoCourseNotDependOnCourseId(): Promise<VideoCourse[]> {
        try {
            return await this.videoCourseRepository.find();
        } catch (error) {
            console.log(error);
            
        }
    }

    async getVideoCourse(video_course_id: string): Promise<VideoCourse> {
        try {
            return await this.videoCourseRepository.findOne({where: {video_course_id}});
        } catch (error) {
            console.log(error);
            
        }
    }

    async createVideoCourse(newVideoCourse: VideoCourse): Promise<VideoCourse> {
        try {
            newVideoCourse.video_course_id = this.videoProgressService.generateRandomCode(10);
            return await this.videoCourseRepository.save(newVideoCourse);
        } catch (error) {
            console.log(error);
        }
    }
}