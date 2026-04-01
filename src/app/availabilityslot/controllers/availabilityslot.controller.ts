import { Controller, Post, Get, Put, Delete, Param, Body, HttpStatus,UseGuards } from '@nestjs/common';
import { AvailabilitySlotService } from '../services/availabilityslot.service';
import { SetAvailabilityDto, UpdateAvailabilityDto } from '../dto/availabilityslot.dto';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';
import { User, UserRole } from '../../../shared/entities/user.entity';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../app/auth/guards/auth.guard';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { IsValidUUIDPipe } from '../../../shared/pipes/is-valid-uuid.pipe';

@ApiBearerAuth()
@ApiTags('Availability Slot')
@Controller('availabilityslot')
export class AvailabilitySlotController {
constructor(private readonly availabilityslotService: AvailabilitySlotService) {}

@Post('')
@ApiOperation({ summary: 'Create availability slot' })
@ApiBody({ type: SetAvailabilityDto, 
description: 'Create availability slot' })
@ApiResponse({
status: HttpStatus.CREATED,
description:
'Availability Slot created successfully.',
})
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR)
async setAvailabilitySlot(
@CurrentUser() user: User,
@Body() data: SetAvailabilityDto) {
return this.availabilityslotService.setAvailabilitySlot(user, data);
}

@Get('')
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.PATIENT)
@ApiOperation({ summary: 'Get Availability Slots' })
@ApiResponse({ 
status: HttpStatus.OK, 
description: 'Availability Slots  retrieved successfully' })
async getAvailabilitySlots(
@CurrentUser() user: User,
) {
return this.availabilityslotService.getAvailabilitySlots(user);
}

@Get(':id')
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR, UserRole.PATIENT)
@ApiOperation({ summary: 'Get Availability Slot' })
@ApiResponse({ 
status: HttpStatus.OK, 
description: 'Availability Slot retrieved successfully' })
@ApiResponse({
status: HttpStatus.NOT_FOUND,
description: 'Availability Slot not found.',
})
async getAvailabilityslot(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe)  id: string
) {
return this.availabilityslotService.getAvailabilityslot(user, id);
}

@Put(':id')
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR)
@ApiOperation({ summary: 'Update availability slot' })
@ApiBody({ type: UpdateAvailabilityDto, 
description: 'Update availability slot data' })
@ApiResponse({ 
status: HttpStatus.OK, 
description: 'Availability Slot updated successfully' })
@ApiResponse({
status: HttpStatus.NOT_FOUND,
description: 'Availability Slot not found.',
})
async updateAvailabilitySlot(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string,
@Body() data: UpdateAvailabilityDto) {
return this.availabilityslotService.updateAvailabilitySlot(user, id, data);
}

@Delete(':id')
@UseGuards(AuthGuard)
@Roles(UserRole.DOCTOR)
@ApiOperation({ summary: 'Delete availability slot' })
@ApiResponse({ 
status: HttpStatus.OK, 
description: 'Availability slot deleted successfully' })
@ApiResponse({
status: HttpStatus.NOT_FOUND,
description: 'Availability slot not found.',
})
async deleteAvailabilitySlot(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) id: string) {
return this.availabilityslotService.deleteAvailabilitySlot(user, id);

}

}
