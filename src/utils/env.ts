/** Return true if we are currently running in a test or development environment. */
const isDevEnvironment = (): boolean =>
    Boolean(process && process.env && (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev'));

export default isDevEnvironment;
