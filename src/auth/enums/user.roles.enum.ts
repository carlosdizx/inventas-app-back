export enum UserRoles {
  SUPER_ADMIN,
  OWNER,
  CASHIER,
  ACCOUNTANT,
  ADMIN,
}

export const ONLY_ENTERPRISES_ROLES: UserRoles[] = [
  UserRoles.OWNER,
  UserRoles.ADMIN,
  UserRoles.ACCOUNTANT,
  UserRoles.CASHIER,
];

export const ONLY_ADMIN_ENTERPRISES_ROLES: UserRoles[] = [
  UserRoles.OWNER,
  UserRoles.ADMIN,
];
