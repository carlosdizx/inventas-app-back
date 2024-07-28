import {
  BadRequestException,
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import FirestoreService from '../service/firestore.service';
import User from '../../users/entities/user.entity';
import { AUTH } from '../constants/messages.constant';
import { JwtService } from '@nestjs/jwt';
import UserCrudService from '../../users/user.crud.service';

interface Log {
  userId: string;
  action: 'PUT' | 'POST' | 'PATCH';
  entity: string;
  changes: Record<string, any>;
  timestamp: Date;
}

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  constructor(
    private readonly firestoreService: FirestoreService,
    private readonly jwtService: JwtService,
    private readonly userCrudService: UserCrudService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const method = req.method;

    if (['PUT', 'POST', 'PATCH'].includes(method)) {
      res.on('finish', async () => {
        this.logger.debug('Logging data request');

        if (res.statusCode >= 200 && res.statusCode < 300) {
          const authorization = req.headers.authorization;

          if (authorization) {
            const [token] = authorization.split(' ').reverse();

            let payload;
            try {
              payload = this.jwtService.verify(token);
            } catch (error) {
              throw new UnauthorizedException(AUTH.INVALID);
            }

            const user = await this.userCrudService.findUserByIdAndEnterprise(
              payload.id,
            );

            const entity = req.path;
            const changes = req.body;

            const log: Log = {
              userId: user.id,
              action: method as 'PUT' | 'POST' | 'PATCH',
              entity,
              changes,
              timestamp: new Date(),
            };

            try {
              await this.firestoreService.addDocument(
                `logs-${user.enterprise?.id}`,
                log,
              );
            } catch (error) {
              this.logger.error('Error during register logging');
              this.logger.error(error);
            }
          }
        }
      });
    }

    next();
  }
}
