import IntlMessageFormat from 'intl-messageformat';
import memoize from 'lodash/memoize';
import messages from '../../i18n/en-US';

const getFormatter = memoize(messageId => new IntlMessageFormat(messages[messageId], 'en-US'));

/**
 * Run localization formatter with variable substitution
 * This is the same formatter that powers react-intl
 * *
 * @param {string} messageId id of message in i18n file
 * @param {Object} variables substitutions for translation, e.g. counts for plurals
 * @example usually aliased as "l()"
 * @example cy.contains(l('be.greeting', {name: 'Alex'})).click()
 */
const localize = (messageId, variables = {}) => {
    return getFormatter(messageId).format(variables);
};

export default localize;
