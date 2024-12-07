import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class AppController {
  @Get()
  greeting() {
    return 'Welcome to BuddyUS API server';
  }
}
