import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  Post,
  UnauthorizedException,
  UseFilters,
} from '@nestjs/common';
import OauthAuthorizerService from './oauth.authorizer.service';
import OauthLoginDto from './dto/oauth.login.dto';
import TypeormExceptionFilter from '../common/exceptions/typeorm.exception';
import OauthBodyLoginDto from './dto/oauth.body.login.dto';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Controller('oauth/authorizer')
@UseFilters(TypeormExceptionFilter)
export default class OauthAuthorizerController {
  constructor(private readonly authorizerService: OauthAuthorizerService) {}
  @Post('token')
  async authorize(
    @Headers('authorization') authorization: string,
    @Body() { scope }: OauthBodyLoginDto,
  ) {
    if (!authorization)
      throw new UnauthorizedException('La autenticación es requerida');

    if (!authorization.startsWith('Basic '))
      throw new UnauthorizedException('Tipo de autenticación es invalida');
    const base64Credentials = authorization.replace('Basic ', '');

    const [clientId, clientSecret] = Buffer.from(base64Credentials, 'base64')
      .toString('utf-8')
      .split(':');
    const dto: OauthLoginDto = {
      scope,
      clientId,
      clientSecret,
    };
    const validationErrors: ValidationError[] = await validate(
      plainToClass(OauthLoginDto, dto),
    );
    if (validationErrors.length > 0)
      throw new BadRequestException(
        validationErrors.map((valid) => valid.constraints),
      );

    return this.authorizerService.authenticateClient(dto);
  }
}
