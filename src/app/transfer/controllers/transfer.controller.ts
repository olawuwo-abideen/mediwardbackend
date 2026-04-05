import { Controller, Post, Get, Put, Param, Body, HttpStatus, UseGuards } from '@nestjs/common';
import { TransferService } from '../services/transfer.service';
import { CreateTransferDto } from '../dto/transfer.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@ApiBearerAuth()
@ApiTags('Transfers')
@Controller('transfers')
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @Post('')
  @UseGuards(AuthGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Create patient transfer request' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Transfer created successfully' })
  async createTransfer(
    @CurrentUser() user: User,
    @Body() data: CreateTransferDto) {
    return this.transferService.createTransfer(user, data);
  }

  @Get('')
  @UseGuards(AuthGuard)
  @Roles(UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get all transfers' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Transfers retrieved successfully' })
  async getTransfers() {
    return this.transferService.getTransfers();
  }

}