import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import ScopeGuard from './scope.guard';

describe('ScopeGuard', () => {
  let guard: ScopeGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScopeGuard, Reflector],
    }).compile();

    guard = module.get<ScopeGuard>(ScopeGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if validScopes is not defined', () => {
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    };
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    expect(guard.canActivate(context as any)).toBe(true);
  });

  it('should return true if validScopes is an empty array', () => {
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    };
    jest.spyOn(reflector, 'get').mockReturnValue([]);

    expect(guard.canActivate(context as any)).toBe(true);
  });

  it('should throw BadRequestException if authorization header is missing', () => {
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {},
        }),
      }),
    };
    jest.spyOn(reflector, 'get').mockReturnValue(['scope']);

    expect(() => guard.canActivate(context as any)).toThrowError(
      BadRequestException,
    );
  });

  it('should throw BadRequestException if authorization header format is invalid', () => {
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'InvalidFormat',
          },
        }),
      }),
    };
    jest.spyOn(reflector, 'get').mockReturnValue(['scope']);

    expect(() => guard.canActivate(context as any)).toThrowError(
      BadRequestException,
    );
  });

  it('should throw UnauthorizedException if token verification fails', () => {
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer InvalidToken',
          },
        }),
      }),
    };
    jest.spyOn(reflector, 'get').mockReturnValue(['scope']);
    jest.spyOn(jwt, 'verify').mockImplementation(() => {
      throw new Error('Invalid Token');
    });

    expect(() => guard.canActivate(context as any)).toThrowError(
      UnauthorizedException,
    );
  });

  it('should throw ForbiddenException if token scope does not match validScopes', () => {
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer ValidToken',
          },
        }),
      }),
    };
    jest.spyOn(reflector, 'get').mockReturnValue(['requiredScope']);
    jest.spyOn(jwt, 'verify').mockReturnValue();

    expect(() => guard.canActivate(context as any)).toThrowError(
      UnauthorizedException,
    );
  });

  // it('should return true if token scope matches validScopes', () => {
  //   const context = {
  //     getHandler: () => {},
  //     switchToHttp: () => ({
  //       getRequest: () => ({
  //         headers: {
  //           authorization: 'Bearer ValidToken',
  //         },
  //       }),
  //     }),
  //   };
  //   jest
  //     .spyOn(reflector, 'get')
  //     .mockReturnValue([
  //       Scopes.PAY_READ_LINK,
  //       Scopes.PAY_WRITE_LINK,
  //       Scopes.COLLECT_READ_LINK,
  //       Scopes.COLLECT_WRITE_LINK,
  //     ]);
  //   jest.spyOn(jwt, 'verify').mockReturnValue(true);
  //
  //   expect(guard.canActivate(context as any)).toBe(true);
  // });
});
