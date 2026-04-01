import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus } from '../../../shared/entities/appointment.entity';
import { BookAppointmentDto, UpdateAppointmentDto } from '../dto/appointment.dto';
import { User } from '../../../shared/entities/user.entity';
import { AvailabilitySlot } from '../../../shared/entities/availabilityslot.entity';
import { EmailService } from '../../../shared/modules/email/email.service';


@Injectable()
export class AppointmentService {
constructor(
@InjectRepository(Appointment)
private readonly appointmentRepository: Repository<Appointment>,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
@InjectRepository(AvailabilitySlot)
private readonly availabilitySlotRepository: Repository<AvailabilitySlot>,
private readonly emailService: EmailService,
) {}

// async bookAppointment(
//   user: User,
//   { availabilitySlotId }: BookAppointmentDto,
// ): Promise<{ message: string; appointment: Appointment }> {

//   // Fetch availability slot along with its doctor
//   const availabilitySlot = await this.availabilitySlotRepository.findOne({
//     where: { id: availabilitySlotId },
//     relations: ['user'], // assuming 'user' is the doctor in AvailabilitySlot
//   });

//   if (!availabilitySlot) {
//     throw new NotFoundException('Availability slot not found');
//   }

//   if (!availabilitySlot.isAvailable) {
//     throw new BadRequestException('This slot is already booked');
//   }

//   // Mark slot as booked
//   await this.availabilitySlotRepository.update(availabilitySlot.id, { isAvailable: false });

//   // Create appointment
//   const appointment = this.appointmentRepository.create({
//     user, // the patient booking
//     doctor: availabilitySlot.user, // doctor is inferred from slot
//     availabilitySlot,
//     status: AppointmentStatus.CONFIRMED,
//   });

//   return {
//     message: 'Appointment booked successfully',
//     appointment: await this.appointmentRepository.save(appointment),
//   };
// }




async bookAppointment(
  user: User,
  { availabilitySlotId }: BookAppointmentDto,
): Promise<{ message: string; appointment: Appointment }> {

  const availabilitySlot = await this.availabilitySlotRepository.findOne({
    where: { id: availabilitySlotId },
    relations: ['user'],
  });

  if (!availabilitySlot) {
    throw new NotFoundException('Availability slot not found');
  }

  if (!availabilitySlot.isAvailable) {
    throw new BadRequestException('This slot is already booked');
  }

  await this.availabilitySlotRepository.update(availabilitySlot.id, {
    isAvailable: false,
  });

  const newAppointment = this.appointmentRepository.create({
    user,
    doctor: availabilitySlot.user,
    availabilitySlot,
    status: AppointmentStatus.CONFIRMED,
  });

  const savedAppointment: Appointment =
    await this.appointmentRepository.save(newAppointment);

  // ✅ FIXED: get time from slot
  this.emailService
    .sendAppointmentConfirmationEmail(
      user,
      savedAppointment.availabilitySlot.startTime,
      savedAppointment.availabilitySlot.endTime,
    )
    .catch((error) => {
      console.error('Failed to send appointment email:', error);
    });

  return {
    message: 'Appointment booked successfully',
    appointment: savedAppointment,
  };
}



async getAppointments(user: User): Promise<{ message: string; data: Appointment[] }> {
const appointments = await this.appointmentRepository.find({
where: { user: { id: user.id } },
relations: ['doctor', 'availabilitySlot'],
});

return {
message: 'Patient appointments retrieved successfully',
data: appointments,
};
}

async getDoctorAppointments(user: User): Promise<{ message: string; data: Appointment[] }> {
const appointments = await this.appointmentRepository.find({
where: { user: { id: user.id } },
relations: ['patient', 'availabilitySlot'],
});

return {
message: 'Doctor appointments retrieved successfully',
data: appointments,
};
}

async getAppointmentDetails(user: User, id: string): Promise<{ message: string; data: Appointment }> {
const appointment = await this.appointmentRepository.findOne({
where: { id, user: { id: user.id } },
relations: ['doctor', 'patient', 'availabilitySlot'],
});

if (!appointment) throw new NotFoundException('Appointment not found');

return {
message: 'Appointment details retrieved successfully',
data: appointment,
};
}

async updateAppointment(
  user: User,
  id: string,
  { availabilitySlotId }: UpdateAppointmentDto,
): Promise<{ message: string; appointment: Appointment }> {

  // Fetch the existing appointment
  const appointment = await this.appointmentRepository.findOne({
    where: { id, user: { id: user.id } },
    relations: ['availabilitySlot', 'availabilitySlot.user'], // load doctor from slot
  });

  if (!appointment) throw new NotFoundException('Appointment not found');

  // Fetch the new slot
  const newSlot = await this.availabilitySlotRepository.findOne({
    where: { id: availabilitySlotId },
    relations: ['user'], // doctor associated with the slot
  });

  if (!newSlot) throw new NotFoundException('Availability slot not found');

  if (!newSlot.isAvailable) throw new BadRequestException('This slot is already booked');

  // Free the previous slot
  appointment.availabilitySlot.isAvailable = true;
  await this.availabilitySlotRepository.save(appointment.availabilitySlot);

  // Update appointment to new slot and doctor
  appointment.availabilitySlot = newSlot;
  appointment.doctor = newSlot.user;
  newSlot.isAvailable = false;
  await this.availabilitySlotRepository.save(newSlot);

  return {
    message: 'Appointment updated successfully',
    appointment: await this.appointmentRepository.save(appointment),
  };
}



async rescheduleAppointment(
appointmentId: string,
newSlotId: string
): Promise<{ message: string; appointment: Appointment }> {
const appointment = await this.appointmentRepository.findOne({ where: { id: appointmentId } });

if (!appointment) throw new NotFoundException('Appointment not found');

const newSlot = await this.availabilitySlotRepository.findOne({ where: { id: newSlotId } });

if (!newSlot || !newSlot.isAvailable) {
throw new BadRequestException('New slot is not available');
}

appointment.availabilitySlot.isAvailable = true;
await this.availabilitySlotRepository.save(appointment.availabilitySlot);

newSlot.isAvailable = false;
await this.availabilitySlotRepository.save(newSlot);

appointment.availabilitySlot = newSlot;
const updatedAppointment = await this.appointmentRepository.save(appointment);

return { message: 'Appointment rescheduled successfully', appointment: updatedAppointment };
}


async cancelAppointment(user:User, id:string): Promise<{ message: string }> {
const appointment = await this.appointmentRepository.findOne({
where: { id, user: { id: user.id }
}
})
if (!appointment) throw new NotFoundException('Appointment not found');

appointment.availabilitySlot.isAvailable = true;
await this.availabilitySlotRepository.save(appointment.availabilitySlot);

await this.appointmentRepository.remove(appointment);

return { message: 'Appointment canceled successfully' };
}



}
