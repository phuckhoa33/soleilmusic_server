import { HttpStatus, Injectable } from "@nestjs/common";
import { AdminService } from "../admin/admin.service";
import * as bcrypt from 'bcrypt';
import { JwtService } from "@nestjs/jwt";
import { MailerService } from "@nestjs-modules/mailer";
import { Admin } from "./dto/admin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Auth } from "./auth.schema";
@Injectable()
export class AuthService {
    constructor(
        private readonly adminService: AdminService,
        private readonly jwtService: JwtService, 
        private readonly mailerService: MailerService,
        @InjectRepository(Auth)
        private readonly authRepository: Repository<Auth>,
        private readonly configService: ConfigService
    ){}

    async register(request: any){
        try {
            const old_admin = await this.adminService.findAdminByEmail(request.email.trim());
            const old_auth = await this.authRepository.findOne({where: {email: request.email}})
            if(old_admin ||old_auth){
                return {
                    statusCode: HttpStatus.BAD_GATEWAY,
                    message: "This admin account is exist"
                }
            }
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(request.password, salt);
            request.password = hashPassword;
            request.user_id = this.generateRandomCode(20);
            await this.authRepository.save(request);
            const admins: Admin[] = await this.adminService.findAllAdmin();
            const recipients: any = admins.map((admin: Admin) => admin.email);
            const user_id_list: string[] = admins.map((admin: Admin) => admin.user_id);

            // Send email for each admin 
            const dumps = recipients.map(async(recipient: string, index: number) => {
                const context = {admin: request, admin_id: user_id_list[index], url: `${this.configService.get<string>('URL')}/auth/waiting_register`}
                await this.sendEmail(context, "authorization", recipient);
            })
            Promise.all(dumps);
        
            return {};
        } catch (error) {
            console.log(error);
            
        }
    }

    async decision(request: any){
        try {
            let new_admin = null;
            const auth = await this.authRepository.findOne({where: {email: request.email}})
            let template ="decline";
            let url = `${this.configService.get("URL")}/auth/register`
            if(request.state==="accept"){ 
                const createNewAdmin = async() => {
                    const auth = await this.authRepository.findOne({where: {email: request.email}})
                    const admin: any = {...auth};
                    admin.accepted_admin = request.admin_id;
                    admin.user_id = this.generateRandomCode(30);
                    await this.adminService.createAdmin(admin);
                    url = `${this.configService.get("URL")}/auth/login`
                    template = "welcome";
                }
                new_admin = await createNewAdmin();
            }

            const sendEmail = await this.sendEmail({user_name: auth.user_name, url}, template, auth.email);
            const deleteWaitingAdmin = await this.authRepository.delete({email: request.email});
            Promise.all([new_admin, sendEmail, deleteWaitingAdmin]);

        } catch (error) {
            console.log(error);
            
        }
    }

    async login(request: any){
        try {
            const admin = await this.adminService.findAdminByEmail(request.email);
            if(!admin){
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Name, email or password is invalid'
                }
            }
            const isMatch = await bcrypt.compare(request.password, admin.password);
            
    
            if(!isMatch){
                return {
                    statusCode: HttpStatus.BAD_REQUEST,
                    message: 'Name, email or password is invalid'
                }
            }

            return admin;
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

    async sendEmail(context: object, template: string, to_object: any ): Promise<any>{

        console.log(context);
        
        try {
            
            await this.mailerService.sendMail({
                subject: "Important: Protect Your Password & Reset Password Link",
                to: to_object,
                template,
                context
            });

            return {
                statusCode: HttpStatus.ACCEPTED,
                message: "Send is successfully",
            }
        } catch (error) {
            console.log(error);
            
        }


    }

    async getWaitingRegister(admin_id: string) {
        try {
            
            const admin = await this.adminService.findAdmin(admin_id);
            const auth = await this.authRepository.find();
            return {admin, auth}
        } catch (error) {
            console.log(error);
            
        }
    }
}