import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Subscription } from './subcription.schema';
import { Model } from 'mongoose';

@Injectable()
export class SubcriptionService {
  constructor(
    @InjectModel(Subscription.name)
    private readonly subcriptionModel: Model<Subscription>,
  ) {}
}
