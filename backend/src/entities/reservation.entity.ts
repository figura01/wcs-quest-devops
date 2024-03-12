import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinTable,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import User from "./user.entity";
import Material from "./material.entity";

enum StatutReservation {
  AWAITING = "en_attente",
  CONFIRMATION = "confirmée",
  PAID = "payée",
  CANCEL = "annulée",
  FINISHED = "terminée",
}

@ObjectType()
@Entity()
export default class Reservation {
  @Field()
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Field()
  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @JoinTable()
  @ManyToMany(() => User, (m) => m.id)
  material: Material;

  @Field()
  @Column()
  debut_date: Date;

  @Field()
  @Column()
  end_date: Date;

  @Field()
  @Column()
  final_price: number;

  @Field()
  @Column({
    type: "enum",
    enum: StatutReservation,
    default: StatutReservation.AWAITING,
  })
  status: StatutReservation;
}

// Hellp
