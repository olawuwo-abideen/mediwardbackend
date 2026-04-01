import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../entities/user.entity';
import { createTransport, Transporter, SendMailOptions } from 'nodemailer';


export interface SendEmailDto {
sender?: { name: string; address: string };
recipients: { name: string; address: string }[] | string;
subject: string;
html?: string;
text?: string;
}

@Injectable()
export class EmailService {
private readonly logger = new Logger(EmailService.name);
private mailTransport: Transporter;

constructor(
private configService: ConfigService,
private jwtService: JwtService,
@InjectRepository(User)
private readonly userRepository: Repository<User>,
) {
this.mailTransport = createTransport({
host: this.configService.get('MAIL_HOST'),
port: Number(this.configService.get('MAIL_PORT')),
secure: false, // use TLS in production if needed
auth: {
user: this.configService.get('MAIL_USER'),
pass: this.configService.get('MAIL_PASSWORD'),
},
});
}

private async sendMail(options: SendMailOptions) {
try {
await this.mailTransport.sendMail(options);
this.logger.log(`Email sent to ${options.to}`);
} catch (error) {
this.logger.error('Error sending email:', error);
throw new BadRequestException('Failed to send email');
}
}

// Send verification email with OTP
public async sendVerificationEmail(user: User, otp: string) {
const html = `<p>Hi ${user.firstname}</p>
<p>Welcome to <strong> Mediward</strong></p>
<p>Your OTP is: <strong>${otp}</strong></p>
<p>Regards,<br/>${this.configService.get('MAIL_SENDER_NAME')}</p>`;
const text = `Hi ${user.firstname}, Your OTP is: ${otp}`;

await this.sendMail({
from: {
name: this.configService.get('MAIL_SENDER_NAME'),
address: this.configService.get('MAIL_SENDER_EMAIL'),
},
to: [{ name: user.firstname || user.email, address: user.email }],
subject: 'Verify your account',
html,
text,
});
}

// Send password reset link
public async sendResetPasswordLink(user: User) {
if (!user.resetToken) throw new BadRequestException('No reset token found');

const url = `${this.configService.get('EMAIL_RESET_PASSWORD_URL')}/${user.resetToken}`;
const html = `<p>Hi ${user.firstname || user.email},</p>
<p>Reset your password using this link:</p>
<a href="${url}">${url}</a>
<p>Regards,<br/>${this.configService.get('MAIL_SENDER_NAME')}</p>`;
const text = `Hi ${user.firstname || user.email}, reset your password: ${url}`;

await this.sendMail({
from: {
name: this.configService.get('MAIL_SENDER_NAME'),
address: this.configService.get('MAIL_SENDER_EMAIL'),
},
to: [{ name: user.firstname || user.email, address: user.email }],
subject: 'Reset Password',
html,
text,
});
}

// Generic email sender
public async sendEmail(data: SendEmailDto) {
const { sender, recipients, subject, html, text } = data;

const safeRecipients =
typeof recipients === 'string'
? recipients
: recipients.map(r => ({ name: r.name || r.address, address: r.address }));

await this.sendMail({
from: sender ?? {
name: this.configService.get('MAIL_SENDER_NAME'),
address: this.configService.get('MAIL_SENDER_EMAIL'),
},
to: safeRecipients,
subject,
html,
text,
});
}





public async sendAppointmentConfirmationEmail(
user: User,
startTime: Date,
endTime: Date,
) {
const formattedStart = new Date(startTime).toLocaleString();
const formattedEnd = new Date(endTime).toLocaleString();

const html = `
<p>Hi ${user.firstname || user.email},</p>

<p>You have successfully booked an appointment at <strong>Mediward Clinic</strong>.</p>

<p><strong>Appointment Details:</strong></p>
<ul>
<li><strong>Start Time:</strong> ${formattedStart}</li>
<li><strong>End Time:</strong> ${formattedEnd}</li>
</ul>

<p>Please ensure you arrive at least <strong>15 minutes before</strong> your appointment time.</p>

<p>We look forward to seeing you.</p>

<p>Regards,<br/>${this.configService.get('MAIL_SENDER_NAME')}</p>
`;

const text = `Hi ${user.firstname || user.email},
You have successfully booked an appointment at Mediward Clinic.
Start: ${formattedStart}
End: ${formattedEnd}
Please arrive 15 minutes early.`;

await this.sendMail({
from: {
name: this.configService.get('MAIL_SENDER_NAME'),
address: this.configService.get('MAIL_SENDER_EMAIL'),
},
to: [{ name: user.firstname || user.email, address: user.email }],
subject: 'Appointment Confirmation - Mediward',
html,
text,
});
}
}