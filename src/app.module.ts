import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { User } from './user/domain/User';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(
      {
        "type": "mysql",
        "host": "localhost",
        "port": 3306,
        "username": "root",
        "password": "1234",
        "database": "coronaProjectOrmTest",
        "entities": [User],
        "synchronize": true // production 에서는 false로 해야한다. 안 그러면 데이터가 날아갈 수 있다.
      }
    ),
    UserModule,
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
