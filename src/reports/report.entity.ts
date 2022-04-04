import { User } from '../users/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  approved: boolean;

  @Column()
  price: number;
  @Column()
  make: string;
  @Column()
  model: string;
  @Column()
  year: number;

  @Column()
  lat: number;
  @Column()
  lng: number;

  @Column()
  mileage: number;

  /**
   * Associations are not automatically fetched
   * when report is read from DB
   *
   * The first param to the decorator is a
   * function so as to resolve circular dependency
   */
  @ManyToOne(() => User, (user) => user.reports, { eager: true })
  user: User;
}
