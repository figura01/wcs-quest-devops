import { Repository } from "typeorm";
import datasource from "../db";
import Reservation from "../entities/reservation.entity";

export default class ReservationService {
  db: Repository<Reservation>;
  constructor() {
    this.db = datasource.getRepository(Reservation);
  }

  async listReservations() {
    return this.db.find();
  }

}