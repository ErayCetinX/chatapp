import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../constant';

export type InterfaceTokenUser = {
	fullName: string;
	uuid: string;
	username: string;
	email: string;
};

export interface ProcessEnv {
  [key: string]: string | undefined
}

const token = {
  generate: ({
    uuid, username, email,isOnline
  }: {uuid:string; username:string; email:string, isOnline?: boolean}, expiresIn: string) => jwt.sign({
    // eslint-disable-next-line @typescript-eslint/naming-convention
    uuid, username, email,
  }, SECRET_KEY, {
    expiresIn,
  }),
};

export default token;