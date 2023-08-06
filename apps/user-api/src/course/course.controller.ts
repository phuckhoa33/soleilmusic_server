import { Body, Controller, HttpStatus, Post, Res , Patch, Req, Param, Get} from "@nestjs/common"
import { CourseService } from "./service/course.service";
import { Course } from "./shemas/course.schema";
import { Response } from "express";
@Controller('course')
export class CourseController {
    constructor(
        private readonly courseService: CourseService
    ){}

    // For Course 
    @Post()
    async createCourse(@Body() newCourse: Course, @Res() res: Response): Promise<any> {
        try {
            const result = await this.courseService.createNewCourse(newCourse);
            return res.status(200).json({message: "Created course is successfully"});
        } catch (error) {
            res.status(500).json({message: "Interval Error Server"});
        }
    }

    @Get()
    async getAllCourse(@Res() res: Response): Promise<any>{
        try {
            const result = await this.courseService.getAllCourses();
            return res.status(200).json({result});
        } catch (error) {
            res.status(500).json({message: "Interval Error Server"});
        }
    }

    @Get(":course_id")
    async getCourse(@Res() res: Response, @Param('course_id') course_id: string): Promise<any> {
        try {
            const result = await this.courseService.getCourse(course_id);
            return res.status(200).json({result});
        } catch (error) {
            res.status(500).json({message: "Interval Error Server"});
        }
    }
}