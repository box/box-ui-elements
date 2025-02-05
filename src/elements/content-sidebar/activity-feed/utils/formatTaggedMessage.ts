import * as React from 'react';
import { Link } from '../../../../components/link';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import UserLink from '../common/user-link';
import type { GetProfileUrlCallback } from '../../../common/flowTypes';

type ContentItem = string | React.ReactElement;

const splitRegex =
    /((?:[@＠﹫]\[[0-9]+:[^\]]+])|(?:\b(?:(?:ht|f)tps?:\/\/)[\w._-]+(?::\d+)?(?:\/[\w\-_~+/#?&%=:[\]@!$'()*;,]*)?))/gim;

const formatTaggedMessage = (
    tagged_message: string,
    itemID: string,
    shouldReturnString: boolean,
    getUserProfileUrl?: GetProfileUrlCallback,
): React.ReactNode | string => {
    const contentItems: ContentItem[] = tagged_message
        .split(splitRegex)
        .map((text: string, contentIndex: number): ContentItem => {
            const contentKey = `${contentIndex}-${itemID}`;
            const mentionMatch = text.match(/([@＠﹫])\[([0-9]+):([^\]]+)]/i);
            if (mentionMatch) {
                const [, trigger, id, name] = mentionMatch;
                if (shouldReturnString) {
                    return `${trigger}${name}`;
                }

                return React.createElement(UserLink, {
                    key: contentKey,
                    className: 'bcs-comment-mention',
                    'data-resin-target': ACTIVITY_TARGETS.MENTION,
                    getUserProfileUrl,
                    id,
                    name: `${trigger}${name}`,
                });
            }

            if (!shouldReturnString) {
                const urlMatch = text.match(
                    /((?:(?:ht|f)tps?:\/\/)[\w._-]+(?::\d+)?(?:\/[\w\-_~+/#?&%=:[\]@!$'()*;,]*)?)/i,
                );
                if (urlMatch) {
                    const [, url] = urlMatch;
                    return React.createElement(
                        Link,
                        {
                            key: contentKey,
                            className: 'bcs-ActivityMessage-link',
                            href: url,
                        },
                        url,
                    );
                }
            }

            return text;
        });

    return shouldReturnString ? contentItems.join('') : contentItems;
};

export default formatTaggedMessage;
