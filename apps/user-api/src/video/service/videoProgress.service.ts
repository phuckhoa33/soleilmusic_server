import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VideoProgress } from "../schemas/videoProgress.schema";
import { Repository } from "typeorm";
import { VideoCourse } from "../schemas/videoCourse.schema";

@Injectable()
export class VideoProgressService{
    constructor(
        @InjectRepository(VideoProgress)
        private readonly videoProgressRepository: Repository<VideoProgress>,
        @InjectRepository(VideoCourse)
        private readonly videoCourseRepository: Repository<VideoCourse>,
    ){};



    async getVideoProgress (video_id: string, course_id:string, user_id: string){
        try {
            return await this.videoProgressRepository.findOne({where: {user_id: user_id.trim(), course_id, video_id}})
        } catch (error) {
            console.log(error);
            
        }
    }

    async getVideoProgressWithoutVideoIdAndCourseId(user_id: string): Promise<VideoProgress[]> {
        try {
            return await this.videoProgressRepository.find({where: {user_id}});
        } catch (error) {
            console.log(error);
            
        }
    }


    async createVideoProgress(newVideoProgress: VideoProgress){
        try {
            const old_video_progress = await this.getVideoProgress(newVideoProgress.video_id, newVideoProgress.course_id, newVideoProgress.user_id);
            if(old_video_progress){
                return {
                    statusCode: HttpStatus.BAD_GATEWAY,
                    message: "This video_progress is exists"
                }
            }

            const videoCourse: VideoCourse = await this.videoCourseRepository.findOne({where: {video_course_id: newVideoProgress.video_id}});
            if(!videoCourse){
                return {
                    statusCode: HttpStatus.BAD_GATEWAY,
                    message: "This video is not exist"
                }
            }
            newVideoProgress.code = this.generateRandomCode(20);
            return await this.videoProgressRepository.save(newVideoProgress);
        } catch (error) {
            console.log(error);
            
        }
    }

    async updateVideoProgress(newVideoProgress: VideoProgress){
        try {
            const old_video_progress = await this.getVideoProgress(newVideoProgress.video_id, newVideoProgress.course_id, newVideoProgress.user_id);
            if(!old_video_progress){
                return {
                    statusCode: HttpStatus.BAD_GATEWAY,
                    message: "This video_progress is not exists"
                }
            }
            if(parseInt(old_video_progress.current_time) > parseInt(newVideoProgress.current_time)){
                return {
                    statusCode: HttpStatus.BAD_GATEWAY,
                    message: "This video_progress is only started"
                }
            }
            const videoProgess = await this.videoProgressRepository.findOne({where: {code: newVideoProgress.code}})
            return await this.videoProgressRepository.update(videoProgess.id, newVideoProgress);
        } catch (error) {
            console.log(error);
            
        }
    }

    async getVideoProgressWithNewestTimeline(
        userId: string,
        courseId: string
    ): Promise<VideoCourse>{
        try {
            const newestVideoProgressByUserIdAndCourseId = await this.videoProgressRepository.findOne({
                where: {
                    user_id: userId,
                    course_id: courseId
                },
                order: {
                    created_at: 'DESC'
                },
                select: ["video_id"]
            })

            const videoCourseFollowNewestVideoProgress = await this.videoCourseRepository.findOne({
                where: {
                    video_course_id: newestVideoProgressByUserIdAndCourseId.video_id
                }
            });

            return videoCourseFollowNewestVideoProgress;
        } catch (error) {
            console.log(error);
            
        }
    }



    generateRandomCode(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let orderId = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          const randomCharacter = characters.charAt(randomIndex);
          orderId += randomCharacter;
        }
      
        return orderId;
    }
}