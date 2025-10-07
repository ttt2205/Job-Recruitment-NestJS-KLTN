import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Application } from './application.schema';
import { Model } from 'mongoose';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectModel(Application.name)
    private readonly applicationModel: Model<Application>,
  ) {}
}
