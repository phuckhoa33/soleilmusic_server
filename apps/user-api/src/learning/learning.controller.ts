import { Body, Controller, Get, Param, Post, Res } from "@nestjs/common";
import { EnrollRequest } from "./dto/enroll-request";
import { Learning } from "./schemas/learning.schema";
import { LearningService } from "./learning.service";
import { Response } from "express";

@Controller('learning')
export class LearningController {
    constructor(
        private readonly learningService: LearningService
    ){}

    @Post('enroll')
    async enroll(@Body() request: EnrollRequest, @Res() res: Response): Promise<any> {
        try {
            const result = await this.learningService.enroll(request);
            return res.status(200).json({
                result
            })
        } catch (error) {
            res.status(500).json({
                message: "Interval Error Server"
            })
        }
    }

    @Get(':user_id')
    async getAllLearningPathByUserId(@Res() res: Response, @Param('user_id') user_id: string){
        try {
            const learnings = await this.learningService.getAllLearningsAndRenderIntoCourses(user_id);
            return res.status(200).json({learnings});
        } catch (error) {
            res.status(500).json({
                message: "Interval Error Server"
            })
        }
    }

}