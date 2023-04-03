import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { User } from "./users.model";
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from "./dto/create-user.dto";
import { RolesService } from "../roles/roles.service";
import { AddRoleDto } from "./dto/add-role.dto";
import { BanUserDto } from "./dto/ban-user.dto";

const NotFound = "User not found";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private userRepository: typeof User,
        private roleService: RolesService
    ) { }

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        const role = await this.roleService.getRoleByValue("User");
        if (!role) {
            const UserRole = "User";
            const UserRoleDescription = "Default user";
            await this.roleService.createRole({
                value: UserRole,
                description: UserRoleDescription,
            });
        }
        if (user.id == 1) {
            const AdminRole = "Admin";
            const AdminRoleDescription = "Administration";
            await this.roleService.createRole({
                value: AdminRole,
                description: AdminRoleDescription,
            });
            await user.$set("roles", [2]);
            user.roles = [role];
            return user;
        } else {
            await user.$set("roles", [role.id]);
            user.roles = [role];
            return user;
        }
    }

    async getAllUsers() {
        const users = await this.userRepository.findAll({ include: { all: true } });
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({
            where: { email },
            include: { all: true },
        });
        return user;
    }

    async getUserByUsername(username: string) {
        const user = await this.userRepository.findOne({
            where: { username },
            include: { all: true },
        });
        return user;
    }

    async addRole(dto: AddRoleDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        const role = await this.roleService.getRoleByValue(dto.value);
        if (role && user) {
            await user.$add("role", role.id);
            return dto;
        }
        throw new HttpException(NotFound, HttpStatus.NOT_FOUND);
    }

    async ban(dto: BanUserDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        if (!user) {
            throw new HttpException(NotFound, HttpStatus.NOT_FOUND);
        }
        user.banned = true;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }
}
