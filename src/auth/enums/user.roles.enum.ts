export enum UserRoles {
  SUPER_ADMIN,
  OWNER,
  CASHIER,
  ACCOUNTANT,
  ADMIN,
}

export const ONLY_ROLES_ENTERPRISES: UserRoles[] = [
  UserRoles.OWNER,
  UserRoles.ADMIN,
  UserRoles.ACCOUNTANT,
  UserRoles.CASHIER,
];

export const ALL_ROLES_FOR_ENTERPRISE = (): UserRoles[] => {
  return Object.values(UserRoles)
    .filter((userRole) => typeof userRole === 'number')
    .filter((userRole) => userRole !== 0) as UserRoles[];
};
