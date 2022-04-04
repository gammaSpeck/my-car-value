import { GetEstimateDto } from './dtos/get-estimate.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { Report } from './report.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private reportsRepo: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.reportsRepo.create(reportDto);
    report.user = user;
    return this.reportsRepo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.reportsRepo.findOne(id);
    if (!report) throw new NotFoundException('report not found');

    report.approved = approved;
    return this.reportsRepo.save(report);
  }

  async createEstimate(getEstimateDto: GetEstimateDto) {
    const { make, model, lng, lat, year, mileage } = getEstimateDto;
    return await this.reportsRepo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('approved IS TRUE')
      .andWhere('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }
}
