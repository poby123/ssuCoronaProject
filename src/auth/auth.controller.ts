import { Controller, Get, Render, Post, Request, Response, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('/auth')
export class AuthController {

    constructor(private authService: AuthService) { }


    @Get('signin')
    @Render('signin')
    getSignin(@Request() req): object {
        return { title: 'SSU Corona Project' }
    }


    @UseGuards(LocalAuthGuard)
    @Post('signin')
    async signin(@Request() req, @Response() res) {
        const { username, userId } = req.user;
        req.session.userId = userId;
        req.session.username = username;

        req.session.save(() => {
            console.log('session login success');
            res.json({ flag: true });
        })
    }

    @Get('signout')
    async signout(@Request() req, @Response() res) {
        if (req.session) {
            req.session.destroy((e: Error) => {
                if (e) {
                    console.log(e);
                }
                res.redirect('/');
            })
        }
        else {
            res.redirect('/');
        }
    }
}