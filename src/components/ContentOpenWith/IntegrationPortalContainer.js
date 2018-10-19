/**
 * @flow
 * @file integration portal container
 * @author Box
 */

import * as React from 'react';
import ErrorMask from 'box-react-ui/lib/components/error-mask/ErrorMask';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import { FormattedMessage } from 'react-intl';
import messages from '../messages';
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
                    errorHeader={
                        <FormattedMessage
                            {...messages.executeIntegrationOpenWithErrorHeader}
                        />
                    }
                    errorSubHeader={
                        <FormattedMessage
                            {...messages.executeIntegrationOpenWithErrorSubHeader}
                        />
                    }
                />
            ) : (
                <LoadingIndicator
                    className="bcow-portal-loading-indicator"
                    size="large"
                />
            )}
        </div>
    </IntegrationPortal>
);

export default IntegrationPortalContainer;
