import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from "../users/dto/create-user.dto";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcryptjs'
import { User } from "../users/users.model";

let BadRequest = 'The user is registered'
let BadData = 'Incorrect data'

@Injectable()
export class AuthService {

    constructor(private userService: UsersService,
        private jwtService: JwtService) { }

    async login(userDto: CreateUserDto) {
        const user = await this.validateUser(userDto)
        return this.generateToken(user)
    }

    async registration(userDto: CreateUserDto) {
        const candidate = await this.userService.getUserByEmail(userDto.email);
        const username_candidate = await this.userService.getUserByUsername(userDto.username)
        if (candidate) {
            throw new HttpException(`${BadRequest}`, HttpStatus.BAD_REQUEST)
        } else {
            if (username_candidate) {
                throw new HttpException(`${BadRequest}`, HttpStatus.BAD_REQUEST)
            } else {
                const hashPassword = await bcrypt.hash(userDto.password, 5);
                const user = await this.userService.createUser({ ...userDto, password: hashPassword })
                return this.generateToken(user)
            }
        }


    }

    private async generateToken(user: User) {
        const payload = { id: user.id, email: user.email, username: user.username, roles: user.roles }
        return {
            token: this.jwtService.sign(payload)
        }
    }

    async decodeToken(token: string) {
        return {
            token: this.jwtService.decode(token),
        };
    }

    private async validateUser(userDto: CreateUserDto) {
        const user = await this.userService.getUserByEmail(userDto.email)
        const passwordEquals = await bcrypt.compare(userDto.password, user.password)
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({ message: `${BadData}` })
    }
}
