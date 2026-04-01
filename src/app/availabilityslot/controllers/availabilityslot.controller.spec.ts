import { Test, TestingModule } from '@nestjs/testing';
import { AvailabilitySlotController } from './availabilityslot.controller';

describe('AvailabilityslotController', () => {
  let controller: AvailabilitySlotController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvailabilitySlotController],
    }).compile();

    controller = module.get<AvailabilitySlotController>(AvailabilitySlotController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
