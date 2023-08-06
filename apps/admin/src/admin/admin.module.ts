import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "./schemas/admin.schema";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([Admin])
        // ,AuthModule
    ],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService]
})

export class AdminSchemaModule{}