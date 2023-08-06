import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AdminSchemaModule } from "../admin/admin.module";
import { JwtModule } from "@nestjs/jwt";
import { jwtConstants } from "./constant";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Auth } from "./auth.schema";

@Module({
    imports: [
        TypeOrmModule.forFeature([Auth]),
        AdminSchemaModule,
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})

export class AuthModule{}