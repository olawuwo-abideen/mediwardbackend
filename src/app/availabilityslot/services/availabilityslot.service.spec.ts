import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilitySlotService } from './availabilityslot.service';

describe('AvailabilityslotService', () => {
  let service: AvailabilitySlotService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvailabilitySlotService],
    }).compile();

    service = module.get<AvailabilitySlotService>(AvailabilitySlotService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
