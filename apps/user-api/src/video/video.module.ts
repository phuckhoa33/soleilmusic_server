import { Module } from "@nestjs/common";
import { VideoController } from "./video.controller";
import {ServeStaticModule} from '@nestjs/serve-static';
import { join } from "path";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VideoProgress } from "./schemas/videoProgress.schema";
import { VideoCourse } from "./schemas/videoCourse.schema";
import { VideoProgressService } from "./service/videoProgress.service";
import { VideoCourseService } from "./service/videoCourse.service";

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public')
        }),
        TypeOrmModule.forFeature([VideoProgress, VideoCourse])
    ],
    controllers: [VideoController],
    providers: [VideoProgressService, VideoCourseService],
    exports: [VideoProgressService, VideoCourseService]
})

export class VideoModule{}