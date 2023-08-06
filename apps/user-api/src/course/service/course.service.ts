import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Course } from "../shemas/course.schema";
import { Repository } from "typeorm";
import { AuthService } from "../../auth/auth.service";

@Injectable()
export class CourseService{
    constructor(
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>
    ){}


    async createNewCourse(newCourse: Course): Promise<any> {
        try {
            const oldCourse = await this.courseRepository.findOne({where: {course_title: newCourse.course_title}});
            if(oldCourse){
                return {
                    statusCode: HttpStatus.BAD_GATEWAY,
                    message: "This course is exist"
                }
            }
            newCourse.course_id = this.generateRandomCode(10);
            await this.courseRepository.save(newCourse);
            return {message: "Course is created is successfully"}
        } catch (error) {
            console.log(error);
            
        }
    }

    async getAllCourses(): Promise<Course[]>{
        try {
            const result = await this.courseRepository.find({select: ["course_id", "course_title", "course_author", "course_image", "course_banner", "course_state", "created_at"]});

            
            return result;
        } catch (error) {
            console.log(error);
            
        }
    }

    async getCourse(course_id: string): Promise<Course>{
        try {
            return await this.courseRepository.findOne({where: {course_id}})
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