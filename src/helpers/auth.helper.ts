import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = (
  password: string,
  storedHashedPassword: string,
) => {
  return bcrypt.compareSync(password, storedHashedPassword);
};
