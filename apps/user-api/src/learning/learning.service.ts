import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Learning } from "./schemas/learning.schema";
import { Repository } from "typeorm";
import { EnrollRequest } from "./dto/enroll-request";
import { UserService } from "../user/user.service";
import { CourseService } from "../course/service/course.service";
import { VideoProgressService } from "../video/service/videoProgress.service";
import { Course } from "../course/shemas/course.schema";
import { VideoProgress } from "../video/schemas/videoProgress.schema";
import { VideoCourseService } from "../video/service/videoCourse.service";
import { VideoCourse } from "../video/schemas/videoCourse.schema";

@Injectable()
export class LearningService {
    constructor(
        @InjectRepository(Learning)
        private readonly learningRepository: Repository<Learning>,
        private readonly userService: UserService,
        private readonly courseService: CourseService,
        private readonly videoProgressService: VideoProgressService,
        private readonly videoCourseService: VideoCourseService
    ){}

    async enroll(request: EnrollRequest): Promise<any> {
        try {
            // Find user is used in body 
            const user = await this.userService.findById(request.user_id);
            
            if(!user){
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "This user is not exist",
                }
            }
            // Find course is stayed at request
            const checkedCourse = await this.courseService.getCourse(request.course_id);
            if(!checkedCourse){
                return {
                    statusCode: HttpStatus.NOT_FOUND,
                    message: "This course is not exist"
                }
            }

            // Check Are this use enrolled this course? Yes: error, No: create
            const learning: Learning[] = await this.learningRepository.find({where: {course_id: request.course_id, user_id: request.user_id}});
            
            if(learning.length>0){
                return {
                    statusCode: HttpStatus.AMBIGUOUS,
                    message: "This course have enrolled before"
                }
            }

            
            request.learning_id = this.videoProgressService.generateRandomCode(10);

            await this.learningRepository.save(request);
            return {
                statusCode: HttpStatus.ACCEPTED,
                message: "This course have enrolled successfully"
            }
        } catch (error) {
            console.log(error);
        }
    }

    async getAll(user_id: string): Promise<Learning[] | any>{
        try {
            const checkedUser = await this.userService.findById(user_id);
            if(!checkedUser){
                return {
                    statusCode: HttpStatus.BAD_GATEWAY,
                    message: "This user is not exist"
                }
            }
            const learningProgress = await this.learningRepository.find({where: {user_id}});
            return learningProgress;

        } catch (error) {
            console.log(error);
            
        }
    }

    async getAllLearningsAndRenderIntoCourses(user_id:string): Promise<any>{
        try {
            const learningsByUserId: Learning[] | any = await this.getAll(user_id);
            const courses: Course[] = await this.courseService.getAllCourses();
            const videoProgresses: VideoProgress[] = await this.videoProgressService.getVideoProgressWithoutVideoIdAndCourseId(user_id);
            const videoCourses: VideoCourse[] = await this.videoCourseService.getAllVideoCourseNotDependOnCourseId();


            Promise.all([learningsByUserId, courses, videoProgresses, videoCourses]);

            if(!learningsByUserId?.message){
                let learningsWithNeededInformation = {}
                for(const learning of learningsByUserId){
                    learningsWithNeededInformation[learning.course_id] = {
                        ...learning, 
                        title: "", 
                        image: "", 
                        currentLesson: "",
                        videoId: "",
                        lessonNumber: null
                    }
                }

                for(const course of courses){
                    if(learningsWithNeededInformation[course.course_id]){
                        learningsWithNeededInformation[course.course_id].learning_title = course.course_title;
                        learningsWithNeededInformation[course.course_id].learning_image = course.course_image;
                    }
                }

                for(const videoProgress of videoProgresses){
                    if(learningsWithNeededInformation[videoProgress.course_id]){
                        if(videoProgress.user_id===user_id){
                            learningsWithNeededInformation[videoProgress.course_id].videoId = videoProgress.video_id;
                        }
                    }
                }

                
                for(const videoCourse of videoCourses){
                    if(learningsWithNeededInformation[videoCourse.course_id] 
                        && learningsWithNeededInformation[videoCourse.course_id].videoId
                            === videoCourse.video_course_id
                    )
                    {
                        learningsWithNeededInformation[videoCourse.course_id].currentLesson = videoCourse.video_title;
                        learningsWithNeededInformation[videoCourse.course_id].lessonNumber = videoCourse.id;
                    }
                }

                return Object.values(learningsWithNeededInformation);
            }
        } catch (error) {
            console.log(error);
            
        }
    }
}