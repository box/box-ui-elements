// @flow
import Address from '@hapi/address';

function hostnameValidator(value: string): boolean {
    // @see https://github.com/hapijs/joi/blame/3516cf0b995c9fe415634c4612c0ac2f8792f0b4/lib/types/string/index.js#L530
    const regex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9-]*[A-Za-z0-9])$/;
    return regex.test(value);
}

function ipv4AddressValidator(value: string): boolean {
    // @see https://www.oreilly.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    const regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return regex.test(value);
}

function domainNameValidator(value: string): boolean {
    return Address.domain.isValid(value);
}

function emailValidator(value: string): boolean {
    return Address.email.isValid(value);
}

export { domainNameValidator, emailValidator, hostnameValidator, ipv4AddressValidator };
