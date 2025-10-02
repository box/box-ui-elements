// @flow
/**
 * Message
 * Message is uniquely identified by namespace and name
 */
export const contextual: 'contextual' = 'contextual';
export const programmatic: 'enduserapp' = 'enduserapp'; // SEE NOTE BELOW

export const messageNamespaces = { contextual, programmatic };
export type MessageNamespace = $Values<typeof messageNamespaces>;

export type MessageName = string;

export type MessageIdentifier = {|
    name: MessageName,
    namespace: MessageNamespace,
|};
