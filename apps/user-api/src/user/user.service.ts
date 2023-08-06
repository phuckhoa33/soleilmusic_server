import { HttpCode, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./schemas/user.schema";
import { Repository } from "typeorm";
import { UserInterface } from "./dto/user.dto";
import * as bcrypt from 'bcrypt';
import * as EmailValidator from 'email-validator';

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    async create(user: UserInterface): Promise<User>{
        try {
            return await this.userRepository.save(user);
        } catch (error) {
            console.log(error);
            
        }
    }

    async findOne(email: string): Promise<User>{
        try {
            
            return await this.userRepository.findOne({where: {email}})
        } catch (error) {
            console.log(error);
            
        }
    }

    async findById(id: string): Promise<User>{
        try {
            return this.userRepository.findOne({where: {code: id}})
        } catch (error) {
            console.log(error);
            
        }
    }

    async findUser(code_user: string): Promise<any>{
        try {
            const user = await this.findById(code_user);
            const {password, code, ...access_user} = user;

            return {
                statusCode: HttpStatus.ACCEPTED,
                user: access_user
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.FORBIDDEN,
                message: "Interval Error"
            }
            
        }
    }

    async update(
        id: number,
        user: User
    ){
        try {
            
            return await this.userRepository.update(user.id, user);
        } catch (error) {
            console.log(error);
            
        }
    }

    async updateProfile(request: User){
        try {
            
            const user: User = await this.userRepository.findOne({where: {code: request.code}});
            const salt = await bcrypt.genSalt();
            let hashPassword = null;
            if(request.password){
                hashPassword = await bcrypt.hash(request.password, salt);

            }

            const newUser: User = {
                ...user,
                first_name: request.first_name!==""? request.first_name: user.first_name,
                last_name: request.last_name!==""? request.last_name: user.last_name,
                password: request.password ? hashPassword : user.password,
                image: request.image!=="" ? request.image : user.image,
                email: EmailValidator.validate(request.email) && request.email!==""? request.email: user.email 
            }
            
            
            await this.update(user.id, newUser);
            return {
                user: newUser
            }
        } catch (error) {
            return {
                statusCode: HttpStatus.FORBIDDEN,
                message: "Interval Error"
            }
        }
    }
    
}