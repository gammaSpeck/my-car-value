import { Report } from '../reports/report.entity';
import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: true }) //TODO: Change default
  admin: boolean;

  /**
   * Associations are not automatically fetched
   * when user is read from DB
   *
   * The first param to the decorator is a
   * function so as to resolve circular dependency
   */
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Inserted user with id: ' + this.id);
  }
  @AfterRemove()
  logRemove() {
    console.log('Removed user with id: ' + this.id);
  }
  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id: ' + this.id);
  }
}
