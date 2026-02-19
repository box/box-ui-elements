// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Text, TextButton } from '@box/blueprint-web';

import { DEFAULT_MAX_APP_COUNT, SECURITY_CONTROLS_FORMAT } from '../constants';
import { getShortSecurityControlsMessage, getFullSecurityControlsMessages } from './utils';
import messages from './messages';
import PlainButton from '../../../components/plain-button';
import Label from '../../../components/label/Label';
import SecurityControlsItem from './SecurityControlsItem';
import SecurityControlsModal from './SecurityControlsModal';
import type { Controls, ControlsFormat } from '../flowTypes';

import './SecurityControls.scss';

const { FULL, SHORT, SHORT_WITH_BTN } = SECURITY_CONTROLS_FORMAT;

type Props = {
    classificationColor?: string,
    classificationName?: string,
    controls: Controls,
    controlsFormat: ControlsFormat,
    definition?: string,
    isRedesignEnabled?: boolean,
    itemName?: string,
    maxAppCount?: number,
    shouldRenderLabel?: boolean,
    shouldDisplayAppsAsIntegrations?: boolean,
};

type State = {
    isSecurityControlsModalOpen: boolean,
};

class SecurityControls extends React.Component<Props, State> {
    static defaultProps = {
        classificationName: '',
        definition: '',
        isRedesignEnabled: false,
        itemName: '',
        controls: {},
        controlsFormat: SHORT,
        maxAppCount: DEFAULT_MAX_APP_COUNT,
        shouldRenderLabel: false,
        shouldDisplayAppsAsIntegrations: false,
    };

    state = {
        isSecurityControlsModalOpen: false,
    };

    openModal = () => this.setState({ isSecurityControlsModalOpen: true });

    closeModal = () => this.setState({ isSecurityControlsModalOpen: false });

    render() {
        const {
            classificationColor,
            classificationName,
            controls,
            controlsFormat,
            definition,
            isRedesignEnabled,
            itemName,
            maxAppCount,
            shouldRenderLabel,
            shouldDisplayAppsAsIntegrations,
        } = this.props;

        let items = [];
        let modalItems;

        if (controlsFormat === FULL) {
            items = getFullSecurityControlsMessages(controls, maxAppCount, shouldDisplayAppsAsIntegrations);
        } else {
            items = getShortSecurityControlsMessage(controls, shouldDisplayAppsAsIntegrations);

            if (items.length && controlsFormat === SHORT_WITH_BTN) {
                modalItems = getFullSecurityControlsMessages(controls, maxAppCount, shouldDisplayAppsAsIntegrations);
            }
        }

        if (!items.length) {
            return null;
        }

        let itemsList = (
            <ul className="bdl-SecurityControls">
                {items.map(({ message, tooltipMessage }, index) => (
                    <SecurityControlsItem
                        key={index}
                        isRedesignEnabled={isRedesignEnabled}
                        message={message}
                        tooltipMessage={tooltipMessage}
                    />
                ))}
            </ul>
        );

        const { isSecurityControlsModalOpen } = this.state;
        const shouldShowSecurityControlsModal =
            controlsFormat === SHORT_WITH_BTN && !!itemName && !!classificationName && !!definition;

        const securityControlsModal = shouldShowSecurityControlsModal && (
            <SecurityControlsModal
                classificationColor={classificationColor}
                classificationName={classificationName}
                closeModal={this.closeModal}
                definition={definition}
                itemName={itemName}
                isSecurityControlsModalOpen={isSecurityControlsModalOpen}
                modalItems={modalItems}
            />
        );

        if (shouldRenderLabel) {
            itemsList = isRedesignEnabled ? (
                <div className="bdl-Classification-propertySection">
                    <Text
                        as="p"
                        className="bdl-Classification-sectionLabel"
                        color="textOnLightSecondary"
                        variant="bodyDefaultSemibold"
                    >
                        <FormattedMessage {...messages.securityControlsLabel} />
                    </Text>
                    {itemsList}
                    {shouldShowSecurityControlsModal && (
                        <TextButton className="bdl-SecurityControls-viewAllButton" onClick={this.openModal}>
                            <FormattedMessage {...messages.viewAll} />
                        </TextButton>
                    )}
                </div>
            ) : (
                <Label text={<FormattedMessage {...messages.securityControlsLabel} />}>{itemsList}</Label>
            );
        }

        return (
            <>
                {itemsList}
                {!isRedesignEnabled && shouldShowSecurityControlsModal && (
                    <PlainButton className="lnk" onClick={this.openModal} type="button">
                        <FormattedMessage {...messages.viewAll} />
                    </PlainButton>
                )}
                {securityControlsModal}
            </>
        );
    }
}

export type { Props as SecurityControlsProps };
export default SecurityControls;
