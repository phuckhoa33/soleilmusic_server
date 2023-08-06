import { Body, Controller, HttpStatus, Post, Res , Patch, Req, Param} from "@nestjs/common";
import { CreateUserRequest } from "./dto/create-user-request";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { UserInterface } from "./dto/user-interface";
import { SendEmail } from "./dto/send-email";
import { ResetPassword } from "./dto/reset-password";



@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Post('register')
    async register(@Body() request: CreateUserRequest, @Res() res: Response): Promise<UserInterface | any>{
        const result = await this.authService.register(request);
        res.cookie('token', result.access_token)
        res.json({
            result
        })
    }

    @Post('login')
    async login(@Body() request: UserInterface, @Res() res: Response): Promise<UserInterface | any> {
        let result = null;
        
        if(request['type']==="default"){
            result = await this.authService.login(request);
        } 
        else {
            result = await this.authService.loginWithSocialMediaAccount(request);
        }
        res.cookie('refresh_token', result.refresh_token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000, // Set the cookie expiration time (e.g., 7 days)
        });
        res.json({
            result
        })
    }

    @Post('send_code')
    async send_code(@Body() request: SendEmail, @Res() res: Response){
        const url = `http://localhost:3000/authentication/change_password/${request.email}/${request.code}`;
        
        const result = await this.authService.sendCode(request.email, url, "send_code");
        return res.json({
            result
        });
    }

    @Patch('reset_password')
    async reset_password(@Body() request: ResetPassword, @Res() res: Response ){
        const result = await this.authService.resetPassword(request);
        return res.status(200).json({
            result
        })
    }


    @Post('logout')
    logout(@Res() res: Response){
        res.clearCookie('token');
    }
}