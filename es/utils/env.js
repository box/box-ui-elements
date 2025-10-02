/**
 * 
 * @file File for some simple environment-related utilities
 * @author Box
 */

/**
 * Return true if we are currently running in a test or development
 * environment.
 *
 * @return {boolean} true if we are running in a test or dev environment
 */
export default function isDevEnvironment() {
  return process && process.env && (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'dev');
}
//# sourceMappingURL=env.js.map