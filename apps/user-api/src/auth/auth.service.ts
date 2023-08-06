import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserRequest } from "./dto/create-user-request";
import * as bcrypt from 'bcrypt';
import { LoginRequest } from "./dto/login-request";
import { JwtService } from "@nestjs/jwt";
import { ResultResponse } from "./dto/result-response";
import { UserInterface } from "./dto/user-interface";
import { MailerService } from "@nestjs-modules/mailer";
import { ResetPassword } from "./dto/reset-password";
import { UserService } from "../user/user.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService, 
        private readonly mailerService: MailerService
    ){}

    async register(request: CreateUserRequest): Promise<any>{
        try {
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(request.password, salt);
            const oldUser = await this.userService.findOne(request.email);
            
            if(oldUser){
                return {
                    statusCode: HttpStatus.BAD_GATEWAY,
                    message: "This user is exist"
                }
            }
            
            const code = this.generateRandomCode(10).toString();
            
            const new_user = await this.userService.create({
                ...request,
                password: hashPassword,
                code
            });
            const payload = {...new_user};
            const access_token = await this.createAccessToken(payload);
            const refresh_token = await this.createRefreshToken(payload);
            const {password, ...access_user} = new_user;
            return {
                statusCode: HttpStatus.ACCEPTED,
                message: "Register is successfully",
                access_token,
                refresh_token,
                user: access_user
            }
            
        } catch (error) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async login(request: LoginRequest): Promise<ResultResponse|any>{
        try {
            const user = await this.userService.findOne(request.email);
            if(!user){
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Password or email is wrong!!"
                }
            }
            const isMatch = await bcrypt.compare(request.password, user.password);
    
            if(!isMatch){
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Password or email is wrong!!"
                }
            }
            const payload = {...user};
            const access_token = await this.createAccessToken(payload);
            const refresh_token = await this.createRefreshToken(payload);
            const {password, ...access_user} = user;
            return {
                statusCode: HttpStatus.ACCEPTED,
                message: "Login is successfully",
                access_token,
                refresh_token,
                user: access_user
            }
            
        } catch (error) {
            console.log(error);
            
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    async loginWithSocialMediaAccount(account: UserInterface): Promise<ResultResponse> {
        try {
            const oldUser = await this.userService.findOne(account.email);
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(this.generateRandomCode(15), salt);
            const payload = {...account, code: this.generateRandomCode(10), password: hashPassword};
            const access_token = await this.createAccessToken(payload);
            const refresh_token = await this.createRefreshToken(payload);
            if(!oldUser){
                await this.userService.create(payload);
            }
            const {password, ...access_user} = oldUser;
            return {
                statusCode: HttpStatus.ACCEPTED,
                message: "Login is successfully",
                access_token,
                refresh_token,
                user: access_user
            }
        } catch (error) {
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async sendCode(email: string, url: string, template: string): Promise<any>{
        try {
            await this.mailerService.sendMail({
              to: email,
              subject: "Important: Protect Your Password & Reset Password Link",
              template,
              context: {
                url,
                email
              }
            });

            return {
                statusCode: HttpStatus.ACCEPTED,
                message: "Send is successfully",
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.BAD_REQUEST,
                message: "Send email is failed"
            }
        }


    }

    async resetPassword(request: ResetPassword): Promise<any>{
        try {
            const user = await this.userService.findOne(request.email);
            if(!user){
                throw new NotFoundException('Password or email is wrong!!');
            }
            const isMatch = await bcrypt.compare(request.old_password.toString(), user.password);
    
            if(!isMatch){
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: "Password or email is wrong!!"
                }
            }
            const salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(request.new_password.toString(), salt);

            await this.userService.update(user.id, user);
            return {
                statusCode: HttpStatus.ACCEPTED,
                message: "Reset Password is successfully"
            }
        } catch (error) {
            console.log(error);
        }
    }

    generateRandomCode(length: number) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let orderId = '';
      
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          const randomCharacter = characters.charAt(randomIndex);
          orderId += randomCharacter;
        }
      
        return orderId;
    }


    async createAccessToken(payload: any): Promise<string> {
        return this.jwtService.sign(payload);
    }

    async createRefreshToken(payload: any): Promise<string> {
        return this.jwtService.sign(payload, { expiresIn: '7d' }); // Set the refresh token expiration time (e.g., 7 days)
    }
   
}