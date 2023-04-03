import { Body, Controller, Post, Get, UseGuards, UsePipes, Param } from '@nestjs/common';
import { CreateUserDto } from "./dto/create-user.dto";
import { UsersService } from "./users.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "./users.model";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles-auth.decorator";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";
import { ValidationPipe } from "../pipes/validation.pipe";

@ApiTags('Users')
@Controller('users')
export class UsersController {


    constructor(private usersService: UsersService) { }

    @ApiOperation({ summary: 'Create User' })
    @ApiResponse({ status: 201, type: User })
    @UsePipes(ValidationPipe)
    @Post('/create')
    create(@Body() userDto: CreateUserDto) {
        return this.usersService.createUser(userDto);
    }

    @ApiOperation({ summary: 'Get all Users' })
    @ApiResponse({ status: 200, type: [User] })
    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    }

    @ApiOperation({ summary: 'Add role users' })
    @ApiResponse({ status: 201 })
    @UseGuards(JwtAuthGuard)
    @Roles("Admin")
    @UseGuards(RolesGuard)
    @Post('/role')
    addRole(@Body() dto: AddRoleDto) {
        return this.usersService.addRole(dto);
    }

    @ApiOperation({ summary: 'Ban users' })
    @ApiResponse({ status: 201 })
    @UseGuards(JwtAuthGuard)
    @Roles("Admin")
    @UseGuards(RolesGuard)
    @Post('/ban')
    ban(@Body() dto: BanUserDto) {
        return this.usersService.ban(dto);
    }

    @Get('/:username')
    getUserByUsername(@Param('username') username: string) {
        return this.usersService.getUserByUsername(username);
    }
}
