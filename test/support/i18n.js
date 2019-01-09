import IntlMessageFormat from 'intl-messageformat';
import memoize from 'lodash/memoize';
import messages from '../../i18n/en-US';

const getFormatter = memoize(messageId => new IntlMessageFormat(messages[messageId], 'en-US'));

/**
 *
 * @param {string} messageId id of message in i18n file
 * @param {Object} variables substitutions for translation, e.g. counts for plurals
 * @example cy.getByText(localize('be.greeting', {name: 'Alex'})).click()
 */
const localize = (messageId, variables = {}) => {
    return getFormatter(messageId).format(variables);
};

export { localize, localize as l };
