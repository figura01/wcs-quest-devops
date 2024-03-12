import {
  Column,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, Float, ID, InputType, Int, ObjectType } from "type-graphql";
import { Length } from "class-validator";
import Category from "./category.entity";
import Reservation from "./reservation.entity";
import CategoryResolver from "../resolvers/category.resolver";

@ObjectType()
@Entity()
export default class Material {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @Column({ length: 50 })
  name: string;

  @Field()
  @Column()
  picture: string;

  @Field()
  @Column()
  price: number;

  @Field()
  @Column()
  quantity: number;

  @Field()
  @Column()
  description: string;

  @Field()
  @Column()
  disponibility: boolean;

  @Field(() => Category)
  @ManyToOne(() => Category, (c) => c.material, {
    cascade: true,
  })
  category: Category;

  @ManyToMany(() => Reservation, (r) => r.material, {
    cascade: true,
  })
  reservation: Reservation[];
}

@InputType()
export class PartialCategoryInput {
  @Field(() => ID)
  id: string;
}

@InputType()
export class CreateMaterialInput {
  @Field({ nullable: false })
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Float, { nullable: false })
  price: number;

  @Field()
  picture: string;

  @Field({ nullable: false })
  category: PartialCategoryInput;
}

@InputType()
export class UpdateMaterialInput {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Float, { nullable: true })
  price: number;

  @Field({ nullable: true })
  picture: string;

  @Field({ nullable: true })
  category: PartialCategoryInput;
}

@ObjectType()
export class MaterialDeleted {
  @Field(() => ID)
  id: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  description: string;

  @Field(() => Float, { nullable: true })
  price: number;

  @Field({ nullable: true })
  picture: string;

  @Field(() => Category)
  category: Category;
}
