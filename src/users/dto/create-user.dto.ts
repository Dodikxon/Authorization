import {ApiProperty} from "@nestjs/swagger";
import {IsEmail, IsString, Length} from "class-validator";

const isString = 'Must be a string'
const passLength = 'The password must consist of 8 to 30 characters'
const IncorrectEmail = 'Incorrect email'
const usernameLength = 'The username must consist of 4 to 20 characters'

export class CreateUserDto{
    @ApiProperty({example: 'username', description: 'Username User'})
    @IsString({message: isString})
    @Length(4, 20, {message: usernameLength})
    readonly username: string;
    @ApiProperty({example: 'username@mail.com', description: 'Mail User'})
    @IsString({message: isString})
    @IsEmail({}, {message: IncorrectEmail})
    readonly email: string;
    @ApiProperty({example: 'password', description: 'Password User'})
    @IsString({message: isString})
    @Length(8, 30, {message: passLength})
    readonly password: string;
}