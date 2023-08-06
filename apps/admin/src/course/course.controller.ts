import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CourseService } from "./course.service";

@Controller('course')
export class CourseController{
    constructor(
        private readonly courseService: CourseService
    ){}

    @Post('upload')
    @UseInterceptors(FileInterceptor('video'))
    async uploadVideo(
        @UploadedFile() file: Express.Multer.File,
        @Body('title') title: string,
        @Body('description') description: string
    ): Promise<string> {
        console.log(file);
        
        return this.courseService.uploadFileAndConvertFormat(file); 
    }
}