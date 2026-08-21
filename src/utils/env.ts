/** Return true if we are currently running in a test or development environment. */
export default function isDevEnvironment(): boolean {
    return process?.env?.NODE_ENV === 'test' || process?.env?.NODE_ENV === 'dev';
}
