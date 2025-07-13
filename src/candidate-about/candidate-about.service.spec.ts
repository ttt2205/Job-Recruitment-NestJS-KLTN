import { Test, TestingModule } from '@nestjs/testing';
import { CandidateAboutService } from './candidate-about.service';

describe('CandidateAboutService', () => {
  let service: CandidateAboutService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidateAboutService],
    }).compile();

    service = module.get<CandidateAboutService>(CandidateAboutService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
