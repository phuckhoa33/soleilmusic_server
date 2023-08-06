import { Body, Controller, Get, Param, Post, Render, Res } from "@nestjs/common";
import { Admin } from "../admin/schemas/admin.schema";
import { Response } from "express";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService
    ){}

    @Get('login')
    @Render('loginPage')
    render_login(): any {

    }

    @Get('register')
    @Render('registerPage')
    render(): any {

    }

    @Get('verifyCode')
    @Render('verifyCode')
    verifyCode(): any{

    }

    @Get('logout')
    @Render('loginPage')
    logout(): any {
        
    }

    @Post('decision')
    async decision(@Res() res: Response, @Body() request: any){
        try {
            await this.authService.decision(request);
            res.redirect(`/auth/waiting_register/${request.admin_id}`);
        } catch (error) {
            return res.status(500).json({message: "Interval Server Error"})
        }
    }


    @Post('register')
    async register(@Res() res: Response, @Body() request: Admin) {
        try {

            const result: any = await this.authService.register(request);
            if(result.statusCode){
                return res.render('registerPage', {message: result.message})
            }
            return res.render('waiting');
        } catch (error) {
            return res.status(500).json({message: "Interval Server Error"})
        }
    }

    @Post('login')
    async login(@Res() res: Response, @Body() request: Admin) {
        try {
            const result: any = await this.authService.login(request);
            if(result.statusCode){
                return res.render('loginPage', {message: result.message})
                
            }
            return res.redirect(`/admin/${result.user_id}`);
        } catch (error) {
            res.status(500).json({message: "Interval Server Error"})
        }
    }

    @Get('waiting_register/:admin_id')
    async waiting_register(@Param('admin_id') admin_id: string, @Res() res: Response){
        try {
            const result = await this.authService.getWaitingRegister(admin_id);
            res.render('verifyAdminList', {admin: result.admin, auth: result.auth});
        } catch (error) {
            return res.status(500).json({message: "Interval Server Error"})
        }
    }
    
}