import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import Material, { PartialCategoryInput } from "./material.entity";

@ObjectType()
@Entity()
export default class Category {
  @Field((type) => ID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => [Material])
  @OneToMany(() => Material, (m) => m.category)
  material?: Material[];
}

@InputType()
export class CreateCategoryInput {
  @Field({ nullable: false })
  name: string;
}
