import { Module } from "@nestjs/common";
import { CourseController } from "./course.controller";
import { CourseService } from "./service/course.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Course } from "./shemas/course.schema";
import { AuthModule } from "../auth/auth.module";


@Module({
    imports:[
        TypeOrmModule.forFeature([Course]),
        AuthModule
    ],
    controllers: [CourseController],
    providers: [CourseService],
    exports: [CourseService]
})

export class CourseModule{}