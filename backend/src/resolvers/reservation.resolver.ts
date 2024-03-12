import { Query, Resolver } from "type-graphql";
import ReservationService from '../services/reservation.service';
import Reservation from "../entities/reservation.entity";

@Resolver()
export default class ReservationResolver {
  @Query(() => [Reservation])
  async reservations() {
    return await new ReservationService().listReservations();
  }

  // Create Query to get One Reaservation by ID 
  
  // Create Query to get One Reaservation by ID user

  // Create Mutaion add one reseervation
}
