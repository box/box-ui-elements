/**
 * @flow
 * @file integration portal container
 * @author Box
 */

import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import ErrorMask from '../../components/error-mask/ErrorMask';
import LoadingIndicator from '../../components/loading-indicator/LoadingIndicator';
import messages from '../common/messages';
import IntegrationPortal from './IntegrationPortal';

type Props = {
    hasError: boolean,
    integrationWindow: any,
};

const IntegrationPortalContainer = ({ hasError, integrationWindow }: Props) => (
    <IntegrationPortal integrationWindow={integrationWindow}>
        <div className="be bcow bcow-portal-container">
            {hasError ? (
                <ErrorMask
                    errorHeader={<FormattedMessage {...messages.executeIntegrationOpenWithErrorHeader} />}
                    errorSubHeader={<FormattedMessage {...messages.executeIntegrationOpenWithErrorSubHeader} />}
                />
            ) : (
                <LoadingIndicator className="bcow-portal-loading-indicator" size="large" />
            )}
        </div>
    </IntegrationPortal>
);

export default IntegrationPortalContainer;
