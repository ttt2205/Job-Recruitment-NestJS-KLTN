import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ServicePackage } from './service-package.schema';
import { Model } from 'mongoose';

@Injectable()
export class ServicePackageService {
  constructor(
    @InjectModel(ServicePackage.name)
    private readonly servicePackageModel: Model<ServicePackage>,
  ) {}
}
