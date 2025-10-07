import { Module } from '@nestjs/common';
import { SubcriptionController } from './subcription.controller';
import { SubcriptionService } from './subcription.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscription, SubscriptionSchema } from './subcription.schema';

@Module({
  controllers: [SubcriptionController],
  providers: [SubcriptionService],
  imports: [
    MongooseModule.forFeature([
      { name: Subscription.name, schema: SubscriptionSchema },
    ]),
  ],
})
export class SubcriptionModule {}
