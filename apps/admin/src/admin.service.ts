import { HttpStatus, Injectable } from '@nestjs/common';
import { AdminService } from './admin/admin.service';

@Injectable()
export class AppService {
  constructor(
    private readonly adminService: AdminService
  ){}
  async getHello(admin_id: string) {
    try {
      const admin = await this.adminService.findAdmin(admin_id);
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
