import { Controller, Get, Param, Render, Res } from '@nestjs/common';
import { AppService } from './admin.service';
import { Response } from 'express';

@Controller("")
export class AdminController {
  @Get()
  @Render('loginPage')
  hello(){
    
  }

}
