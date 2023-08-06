import { Module } from "@nestjs/common";
import { LearningController } from "./learning.controller";
import { LearningService } from "./learning.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Learning } from "./schemas/learning.schema";
import { UserModule } from "../user/user.module";
import { CourseModule } from "../course/course.module";
import { AuthModule } from "../auth/auth.module";
import { VideoModule } from "../video/video.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Learning]),
        UserModule,
        CourseModule, 
        VideoModule
    ],
    controllers: [LearningController],
    providers: [LearningService],
    exports: []
})

export class LearningModule{}