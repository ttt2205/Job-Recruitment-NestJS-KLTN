import { Test, TestingModule } from '@nestjs/testing';
import { CandidateAboutController } from './candidate-about.controller';

describe('CandidateAboutController', () => {
  let controller: CandidateAboutController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidateAboutController],
    }).compile();

    controller = module.get<CandidateAboutController>(CandidateAboutController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
