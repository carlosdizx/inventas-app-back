import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ForbiddenException, BadRequestException } from '@nestjs/common';
import ClientRoleGuard from './client-role.guard';

describe('ClientRoleGuard', () => {
  let guard: ClientRoleGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClientRoleGuard, Reflector],
    }).compile();

    guard = module.get<ClientRoleGuard>(ClientRoleGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should return true if validRoles is not defined', () => {
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: {} }),
      }),
    };
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    expect(guard.canActivate(context as any)).toBe(true);
  });

  it('should return true if validRoles is an empty array', () => {
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: {} }),
      }),
    };
    jest.spyOn(reflector, 'get').mockReturnValue([]);

    expect(guard.canActivate(context as any)).toBe(true);
  });

  it('should throw BadRequestException if user is not defined', () => {
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({}),
      }),
    };
    jest.spyOn(reflector, 'get').mockReturnValue(['role']);

    expect(() => guard.canActivate(context as any)).toThrowError(
      BadRequestException,
    );
  });

  it('should throw ForbiddenException if user does not have required role', () => {
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: { roles: ['otherRole'] } }),
      }),
    };
    jest.spyOn(reflector, 'get').mockReturnValue(['requiredRole']);

    expect(() => guard.canActivate(context as any)).toThrowError(
      ForbiddenException,
    );
  });

  it('should return true if user has required role', () => {
    const context = {
      getHandler: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user: { roles: ['requiredRole'] } }),
      }),
    };
    jest.spyOn(reflector, 'get').mockReturnValue(['requiredRole']);

    expect(guard.canActivate(context as any)).toBe(true);
  });
});
