import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IncomingMessage } from 'http';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../../shared/decorators/public.decorator';
import { AdminService } from '../services/admin.service';
import { Admin } from '../../../shared/entities/admin.entity';

@Injectable()
export class AdminAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly adminService: AdminService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = this.getRequest<IncomingMessage & { user?: Admin }>(
      context,
    );
    const url = request.url;

    try {
      const token = this.getToken(request);
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      const userId = payload.sub;
      const user: Admin | null = await this.adminService.findOne({
        id: userId,
      });
      if (!user) throw Error();

      user.password = '';

      request.user = user;

      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
  protected getRequest<T>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }
  protected getToken(
    request: IncomingMessage & { user?: Admin | undefined },
  ): string {
    const authorization = request.headers['authorization'];
    if (
      !authorization ||
      authorization.trim() === '' ||
      Array.isArray(authorization)
    ) {
      throw new UnauthorizedException();
    }
    const [_, token] = authorization.split(' ');
    return token;
  }
}
