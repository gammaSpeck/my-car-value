import { Expose, Transform } from 'class-transformer';
import { Report } from '../report.entity';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  make: string;
  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  /**
   * obj is gonna be the actual report object sent back
   * from DB.
   * If RAW QueryBuilder is used, the userId will be sent back,
   * else the user object will be sent back
   */
  @Transform(({ obj }) => obj.userId || obj.user.id)
  @Expose()
  userId: number;
}
