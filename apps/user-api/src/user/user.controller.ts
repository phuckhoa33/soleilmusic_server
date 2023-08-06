import { Body, Controller, Get, Param, Patch, Req, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { Request, Response } from "express";
import { User } from "./schemas/user.schema";

@Controller('user')
export class UserController{
    constructor(
        private readonly userService: UserService
    ){}

    @Get()
    async get_user(@Req() req: Request, @Res() res: Response, @Param('code') code: string){
        try {
            const result = await this.userService.findUser(code)
            return res.status(200).json({
                result
            })        
        } catch (error) {
            console.log(error);
            
        }
    }

    @Patch('profile')
    async update_user(@Body() request: User, @Res() res: Response){
        try {
            const result = await this.userService.updateProfile(request);
            res.status(200).json({
                ...result,
                message: "Update Profile is sucessfully"
            })
        } catch (error) {
            console.log(error);
            
        }
    }
}