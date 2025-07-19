import { Module } from '@nestjs/common';
import { CandidateAboutService } from './candidate-about.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CandidateAbout, CandidateAboutSchema } from './candidate-about.shema';
import { CandidateAboutController } from './candidate-about.controller';

@Module({
  providers: [CandidateAboutService],
    imports: [
      MongooseModule.forFeature([{ name: CandidateAbout.name, schema: CandidateAboutSchema }])
    ],
    controllers: [CandidateAboutController],
    exports: [CandidateAboutService]
})
export class CandidateAboutModule {}
