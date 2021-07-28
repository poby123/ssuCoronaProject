import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from "../user/user.module";
import { AuthController } from './auth.controller';

import { AuthService } from "./auth.service";
import { LocalStrategy } from './local.strategy';
import { SessionGuard } from './session.guard';

@Module({
    imports: [UserModule, PassportModule],
    providers: [AuthService, LocalStrategy, SessionGuard],
    controllers: [AuthController],
    exports:[SessionGuard]
})

export class AuthModule { }