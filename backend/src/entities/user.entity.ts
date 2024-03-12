import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import * as argon2 from "argon2";



import {
  Length,
  IsEmail,
  Min,
  Max,
} from "class-validator"

export enum UserRoleEnum {
  admin = "ADMIN",
  user = "USER",
}


@ObjectType()
@Entity()
export default class User {
  @BeforeInsert()
  @BeforeUpdate()
  protected async hashPassword() {
    if (!this.password.startsWith("$argon2")) {
      this.password = await argon2.hash(this.password);
    }
  }

  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  firstName: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ nullable: false })
  @IsEmail()
  email: string;

  @Field()
  @Column({ nullable: false })
  password: string;

  @Field()
  @Column()
  @Min(10)
  @Max(10)
  phone: string; //c'est pas int mais number

  @Field()
  @Column({
    type: "text",
    enum: ["ADMIN", "USER"],

    nullable: true, 
    default: UserRoleEnum.user
  })
  role: UserRoleEnum

}

@ObjectType()
export class Message {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@InputType()
export class InputRegister extends User {
  @Field({ nullable: false })
  firstName: string;

  @Field({ nullable: false })
  lastName: string;

  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;

  @Field({ nullable: false })
  phone: string;
}

@InputType()
export class InputRegisterWithoutPassword {
  @Field({ nullable: false })
  email: string;
}

@ObjectType()
export class UserWithoutPassword
  implements Omit<User, "password" | "lastName" | "firstName" | "phone">
{
  @Field()
  id: string;

  @Field()
  email: string;

  @Field(() => String)
  role: UserRoleEnum;
}

@InputType()
export class InputLogin {
  @Field({ nullable: false })
  email: string;

  @Field({ nullable: false })
  password: string;
}

@InputType()
export class InputChangePassword {
  @Field()
  token: string;

  @Field({ nullable: false })
  password: string;
}
