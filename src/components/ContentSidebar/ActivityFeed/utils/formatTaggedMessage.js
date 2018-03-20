/**
 * @flow
 * @file Util for formatting tagged messages
 */

import React, { ReactNode } from 'react';
import { Link } from 'box-react-ui/lib/components/link';
import Mention from '../comment/Mention';

/**
 * Formats a message a string and replaces the following:
 * - all occurrence of mention patterns with a Mention component
 * - all occurrence of urls with a Link component
 * Ex mention format: @[123:Hello World]
 * @param {String} taggedMessage The message string to format
 * @param {String} itemID The id of the tagged message
 * @param {Boolean} shouldReturnString The boolean value whether it should return string
 * @returns {String|ReactNode}
 */
const formatTaggedMessage = (
    taggedMessage: string,
    itemID: string,
    shouldReturnString: boolean
): ReactNode | string => {
    // this regex matches one of the following regular expressions:
    // mentions: ([@＠﹫]\[[0-9]+:[^\]]+])
    // urls: (?:\b)((?:(?:ht|f)tps?:\/\/)[\w\._\-]+(:\d+)?(\/[\w\-_\.~\+\/#\?&%=:\[\]@!$'\(\)\*;,]*)?)
    // NOTE: There are useless escapes in the regex below, should probably remove them when safe
    // eslint-disable-next-line no-useless-escape
    const splitRegex = /((?:[@＠﹫]\[[0-9]+:[^\]]+])|(?:\b(?:(?:ht|f)tps?:\/\/)[\w\._\-]+(?::\d+)?(?:\/[\w\-_\.~\+\/#\?&%=:\[\]@!$'\(\)\*;,]*)?))/gim;
    const contentItems = taggedMessage.split(splitRegex).map((text: string, contentIndex: number) => {
        // attempt mention match
        const mentionMatch = text.match(/([@＠﹫])\[([0-9]+):([^\]]+)]/i);
        if (mentionMatch) {
            const [, trigger, id, name] = mentionMatch;
            if (shouldReturnString) {
                return `${trigger}${name}`;
            }
            return <Mention id={Number(id)} key={`${contentIndex}-${itemID}`}>{`${trigger}${name}`}</Mention>;
        }

        if (!shouldReturnString) {
            // attempt url match
            // NOTE: There are useless escapes in the regex below, should probably remove them when safe
            const urlMatch = text.match(
                // eslint-disable-next-line no-useless-escape
                /((?:(?:ht|f)tps?:\/\/)[\w\._\-]+(?::\d+)?(?:\/[\w\-_\.~\+\/#\?&%=:\[\]@!$'\(\)\*;,]*)?)/i
            );
            if (urlMatch) {
                const [, url] = urlMatch;
                return (
                    <Link key={`${contentIndex}-${itemID}`} href={url}>
                        {url}
                    </Link>
                );
            }
        }

        return text;
    });

    return shouldReturnString ? contentItems.join('') : contentItems;
};

export default formatTaggedMessage;
