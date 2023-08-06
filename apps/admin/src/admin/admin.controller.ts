import { Body, Controller, Get, Param, Post, Render, Res } from "@nestjs/common";
import { Response } from "express";
import { Admin } from "./schemas/admin.schema";
import { AdminService } from "./admin.service";

@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService
    ){}


    @Get('/:admin_id')
  async getHello(@Res() res: Response, @Param('admin_id') admin_id: string) {  
    try {
      const result:any = await this.adminService.getHello(admin_id);
      if(result.statusCode){
        return res.render('notfound');
      }
      
      return res.render('index', {result});
    } catch (error) {
      res.status(500).json({message: "Interval Server Error"})
    }
  }


  @Get('/:admin_id/coursesPage')
  async coursePage(@Res() res: Response, @Param('admin_id') admin_id: string) {
    try {
      const result:any = await this.adminService.getHello(admin_id);
      if(result.statusCode){
        return res.render('notfound');
      }
      return res.render('coursesPage', {result});
    } catch (error) {
      res.status(500).json({message: "Interval Server Error"})
    }
  }

  @Get('/:admin_id/coursesPage/createCourse')
  async createPage(@Res() res: Response, @Param('admin_id') admin_id: string) {
    try {
      const result:any = await this.adminService.getHello(admin_id);
      if(result.statusCode){
        return res.render('notfound');
      }
      return res.render('createCourse', {result});
    } catch (error) {
      res.status(500).json({message: "Interval Server Error"})
    }
  }

  @Get('/:admin_id/earning')
  async earning(@Res() res: Response, @Param('admin_id') admin_id: string) {
    try {
      const result:any = await this.adminService.getHello(admin_id);
      if(result.statusCode){
        return res.render('notfound');
      }
      return res.render('earning', {result});
    } catch (error) {
      res.status(500).json({message: "Interval Server Error"})
    }
  }


  @Get('/:admin_id/quizPage')
  async quizPage(@Res() res: Response, @Param('admin_id') admin_id: string) {
    try {
      const result:any = await this.adminService.getHello(admin_id);
      if(result.statusCode){
        return res.render('notfound');
      }
      return res.render('quizPage', {result});
    } catch (error) {
      res.status(500).json({message: "Interval Server Error"})
    }
  }

  @Get('/:admin_id/reportPage')
  async reportPage(@Res() res: Response, @Param('admin_id') admin_id: string) {
    try {
      const result:any = await this.adminService.getHello(admin_id);
      if(result.statusCode){
        return res.render('notfound');
      }
      return res.render('reportPage', {result});
    } catch (error) {
      res.status(500).json({message: "Interval Server Error"})
    }
  }
}