import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Admin } from "./schemas/admin.schema";
import { Repository } from "typeorm";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Admin)
        private readonly adminRespository: Repository<Admin>
    ){}

    async createAdmin(admin: Admin) {
        try {
            
            return await this.adminRespository.save(admin);
        } catch (error) {
            console.log(error);
            
        }
    }

    async findAllAdmin(){
        try {
            return await this.adminRespository.find();
        } catch (error) {
            console.log(error);
            
        }
    }

    async findAdmin(user_id: string){
        try {
            return await this.adminRespository.findOne({where: {user_id}})
        } catch (error) {
            console.log(error);
            
        }
    }

    async findAdminByEmail(email: string){
        try {
            return await this.adminRespository.findOne({where: {email}})
        } catch (error) {
            console.log(error);
            
        }
    }

    async getHello(admin_id: string) {
        try {
          const admin = await this.findAdmin(admin_id);
          if(!admin){
            return {
              statusCode: HttpStatus.BAD_GATEWAY,
              message: "This admin is not exist"
            }
          }
          
          return admin;
        } catch (error) {
          console.log(error);
          
        }
      }

}