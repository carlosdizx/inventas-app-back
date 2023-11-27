import { UserRoles } from "../enums/user.roles.enum";

export default interface JwtPayload {
  id: string;
  roles?: UserRoles[];
}
