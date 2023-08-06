import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { S3 } from "aws-sdk";
import ffmpegPath from 'ffmpeg-static';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class CourseService{
    private bucket: string;
    private s3: S3
    constructor(
        private readonly configService: ConfigService
    ){
        this.bucket = configService.get('YOUR_BUCKET_NAME');
        this.s3 = new S3({
            accessKeyId: configService.get('YOUR_AWS_ACCESS_KEY'),
            secretAccessKey: configService.get('YOUR_AWS_SECRET_KEY')
        });
    }

    async uploadFileAndConvertFormat(file: Express.Multer.File): Promise<string>{        
        const m4FilePath = `uploads/${file.originalname}`;
        const webmFilePath = `uploads/${path.parse(file.originalname).name}.webm`
        
        // Save video .mp4 into uploads folder in server
        await fs.promises.writeFile(m4FilePath, file.buffer);
        console.log("chuyen");
        
        // Convert video into .webm format using ffmpeg
        await new Promise<void>((resolve, reject) => {
            ffmpeg(m4FilePath)
                .setFfmpegPath(ffmpegPath)
                .outputOptions('-c:v libvpx -b:v 1M')
                .output(webmFilePath)
                .on('end', () => resolve())
                .on('error', (err: any) => reject(err))
                .run();
        });
        console.log("log");
        
        // Upload video .webm into AWS S3
        const params = {
            Bucket: this.bucket,
            Key: `${path.parse(file.originalname).name}.webm`,
            Body: fs.createReadStream(webmFilePath)
        };
        console.log("coco");
        
        const uploadResult = await this.s3.upload(params).promise();

        // Delete all temporary files is created in server
        await fs.promises.unlink(m4FilePath);
        await fs.promises.unlink(webmFilePath);

        return uploadResult.Location;
    }
}