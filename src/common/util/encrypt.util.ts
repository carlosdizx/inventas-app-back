import * as bcrypt from 'bcryptjs';

const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> =>
  await bcrypt.hash(password, saltRounds);

export const comparePasswords = async (
  password: string,
  hashedPassword: string,
): Promise<boolean> => await bcrypt.compare(password, hashedPassword);
