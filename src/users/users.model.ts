import {
    BelongsToMany,
    Column,
    DataType,
    Model,
    Table,
} from "sequelize-typescript";
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "../roles/roles.model";
import { UserRoles } from "../roles/user-roles.model";

interface UserCreationAttrs {
    username: string;
    email: string;
    password: string;
}

@Table({ tableName: "users" })
export class User extends Model<User, UserCreationAttrs> {
    @ApiProperty({ example: "1", description: "ID User" })
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;
    @ApiProperty({ example: "username", description: "Username User" })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    username: string;
    @ApiProperty({ example: "username@mail.com", description: "Mail User" })
    @Column({ type: DataType.STRING, unique: true, allowNull: false })
    email: string;
    @ApiProperty({ example: "password", description: "Password User" })
    @Column({ type: DataType.STRING, allowNull: false })
    password: string;
    @ApiProperty({ example: "false", description: "The User is ban?" })
    @Column({ type: DataType.BOOLEAN, defaultValue: false })
    banned: boolean;
    @ApiProperty({
        example: "Bad Word",
        description: "The reason for the User's ban\n",
    })
    @Column({ type: DataType.STRING, allowNull: true })
    banReason: string;

    @BelongsToMany(() => Role, () => UserRoles)
    roles: Role[];
}
