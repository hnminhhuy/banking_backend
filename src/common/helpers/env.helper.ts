import { Env } from '../utils/constants';

const getEnv = (): string => process.env.NODE_ENV || Env.DEVELOPMENT;
const isDevelopmentEnv = () => getEnv() != Env.PRODUCTION;

export { getEnv, isDevelopmentEnv };
