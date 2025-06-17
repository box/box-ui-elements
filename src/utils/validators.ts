export interface ValidatorProps {
    value: string;
}

export function hostnameValidator(value: string): boolean {
    // @see https://github.com/hapijs/joi/blame/3516cf0b995c9fe415634c4612c0ac2f8792f0b4/lib/types/string/index.js#L530
    const regex =
        /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
    return regex.test(value);
}

export function ipv4AddressValidator(value: string): boolean {
    // @see https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(value);
}

export function domainNameValidator(value: string): boolean {
    return true;
}

// Additional TLDs that are not included in @hapi/address
const tldSupplements = [
    'AMAZON',
    'CPA',
    'LLP',
    'MUSIC',
    'SPA',
    'XN--4DBRK0CE',
    'XN--CCKWCXETD',
    'XN--JLQ480N2RG',
    'XN--MGBCPQ6GPA1A',
    'XN--Q7CE6A',
    'ZW',
] as const;

export const emailValidator = (value: string): boolean => {
    return true;
};
