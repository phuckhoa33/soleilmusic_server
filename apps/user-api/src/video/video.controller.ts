import { Body, Controller, Get, Param, Patch, Post, Req, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as fs from 'fs';
import * as path from 'path';
import * as rangeParser from 'range-parser';
import { Request, Response } from "express";
import { VideoProgress } from "./schemas/videoProgress.schema";
import { VideoCourse } from "./schemas/videoCourse.schema";
import { VideoProgressService } from "./service/videoProgress.service";
import { VideoCourseService } from "./service/videoCourse.service";

@Controller('video')
export class VideoController {

    constructor(
        private readonly videoProgressService: VideoProgressService,
        private readonly videoCourseService: VideoCourseService
    ){}

    // This part for video course 
    @Post('videoCourse')
    async createNewVideoCourse(@Body() newVideoCourse: VideoCourse, @Res() res: Response) {
        try {
            const result = await this.videoCourseService.createVideoCourse(newVideoCourse);
            return res.status(200).json({result, message: "Create new video course is successfully"});
        } catch (error) {
            return res.status(500).json({message: "Interval Error Server"});
        }
    }

    @Get('videoCourse/:course_id')
    async getAllVideoCourse(@Res() res: Response, @Param('course_id') course_id: string){
        try {
            const result = await this.videoCourseService.getAllVideoCourse(course_id);
            return res.status(200).json({result})
        } catch (error) {
            return res.status(500).json({message: "Interval Error Server"});
        }
    }

    // This part is video streaming
    @Get('stream/:video_path')
    async streamVideo(@Res() res: Response, @Req() req: Request, @Param('video_path') videoPathSended: string) {
        const videoPath = `/home/phuckhoa/Downloads/${videoPathSended}`; // Đường dẫn cố định của video
        const videoSize = fs.statSync(videoPath).size;
        const videoRange = req.headers.range || 'bytes=0-';
        

        const parts = rangeParser(videoSize, videoRange, { combine: true });

        if (parts === -1 || parts === -2) {
        // Invalid range, return the entire video
        res.status(200);
        res.setHeader('Content-Length', videoSize);
        res.setHeader('Content-Type', 'video/mp4');
        fs.createReadStream(videoPath).pipe(res);
        } else {
        // Partial content response
        const start = parts[0].start;
        const end = parts[0].end || videoSize - 1;
        const chunkSize = end - start + 1;

        res.status(206);
        res.setHeader('Content-Range', `bytes ${start}-${end}/${videoSize}`);
        res.setHeader('Content-Length', chunkSize);
        res.setHeader('Content-Type', 'video/mp4');

        const stream = fs.createReadStream(videoPath, { start, end });
        stream.pipe(res);
        }
    }

    @Post('video_progress')
    async create_video_progress(
        @Body() newVideoProgress: VideoProgress, 
        @Res() res: Response
    ){
        try {
            const result = await this.videoProgressService.createVideoProgress(newVideoProgress);
            return res.json({result});
        } catch (error) {
            return res.status(500).json({message: "Interval Error Server"})
        }

    }


    @Get('video_progress/:user_id/:video_id/:course_id')
    async get_video_progress(
        @Param('user_id') user_id: string,  
        @Param('video_id') video_id: string,
        @Param('course_id') course_id: string,
        @Res() res: Response
    ){
        try {
            const result = await this.videoProgressService.getVideoProgress(video_id, course_id, user_id);
            return res.json({result});
        } catch (error) {
            return res.status(500).json({message: "Interval Error Server"})
        }
    }

    @Patch('video_progress')
    async update_video_progress(
        @Body() newVideoProgress: VideoProgress,
        @Res() res: Response
    )
    {
        try {
            const result = await this.videoProgressService.updateVideoProgress(newVideoProgress);
            return res.json({result});
        } catch (error) {
            return res.status(500).json({message: "Interval Error Server"})
        }
    }

    @Get('videoProgress/:userId/:courseId')
    async getVideoProgressWithNewestTimeline(
        @Res() res: Response, 
        @Param('userId') userId: string,
        @Param('courseId') courseId: string
    ){
        try {
            const newestVideoProgress = await this.videoProgressService.getVideoProgressWithNewestTimeline(userId, courseId);
            res.status(200).json({result: newestVideoProgress})
        } catch (error) {
            return res.status(500).json()
        }
    }
}