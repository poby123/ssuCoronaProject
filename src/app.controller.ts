import { Controller, Get, Render, Post, UseGuards, Request, UseFilters } from '@nestjs/common';
import { AppService } from './app.service';
import { SessionGuard } from './auth/session.guard';
import { ViewAuthFilter } from './exceptions/fobidden-view-exception.filter';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  @UseGuards(SessionGuard)
  @UseFilters(ViewAuthFilter)
  @Render('index')
  index(@Request() req): object {
    console.log(req.session.userId);
  
    return { title: 'SSU Corona Project' }
  }

  @Get('/hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
