// @flow
import * as React from 'react';
import { FormattedMessage } from 'react-intl';

import { DEFAULT_MAX_APP_COUNT, SECURITY_CONTROLS_FORMAT } from '../constants';
import { getAppsTooltip, getShortSecurityControlsMessage, getFullSecurityControlsMessages } from './utils';
import messages from './messages';
import PlainButton from '../../../components/plain-button';
import SecurityControlsItem from './SecurityControlsItem';
import SecurityControlsModal from './SecurityControlsModal';
import type { Controls, ControlsFormat } from '../flowTypes';

import './SecurityControls.scss';

const { FULL, SHORT, SHORT_WITH_BTN } = SECURITY_CONTROLS_FORMAT;

type Props = {
    classificationName?: string,
    controls: Controls,
    controlsFormat: ControlsFormat,
    definition?: string,
    fillColor?: string,
    itemName?: string,
    maxAppCount?: number,
    strokeColor?: string,
};

type State = {
    isSecurityControlsModalOpen: boolean,
};

class SecurityControls extends React.Component<Props, State> {
    static defaultProps = {
        classificationName: '',
        definition: '',
        itemName: '',
        controls: {},
        controlsFormat: SHORT,
        maxAppCount: DEFAULT_MAX_APP_COUNT,
    };

    state = {
        isSecurityControlsModalOpen: false,
    };

    openModal = () => this.setState({ isSecurityControlsModalOpen: true });

    closeModal = () => this.setState({ isSecurityControlsModalOpen: false });

    render() {
        const {
            classificationName,
            controls,
            controlsFormat,
            definition,
            fillColor,
            itemName,
            maxAppCount,
            strokeColor,
        } = this.props;

        let items = [];
        let modalItems;
        let appNames;

        if (controlsFormat === FULL) {
            items = getFullSecurityControlsMessages(controls, maxAppCount);
        } else {
            const shortMessage = getShortSecurityControlsMessage(controls);
            items = shortMessage ? [shortMessage] : [];

            if (items.length && controlsFormat === SHORT_WITH_BTN) {
                modalItems = getFullSecurityControlsMessages(controls, maxAppCount);
            }
        }

        if (!items.length) {
            return null;
        }

        // get applications name list for use in classify modal and security controls modal
        if (controlsFormat !== SHORT) {
            appNames = getAppsTooltip(controls, maxAppCount);
        }

        const { isSecurityControlsModalOpen } = this.state;
        const shouldShowSecurityControlsModal =
            controlsFormat === SHORT_WITH_BTN && !!itemName && !!classificationName && !!definition;

        return (
            <>
                <ul className="bdl-SecurityControls">
                    {items.map(item => (
                        <SecurityControlsItem key={item.id} message={item} appNames={appNames} />
                    ))}
                </ul>
                {shouldShowSecurityControlsModal && (
                    <>
                        <PlainButton className="lnk" onClick={this.openModal} type="button">
                            <FormattedMessage {...messages.viewAll} />
                        </PlainButton>
                        <SecurityControlsModal
                            appNames={appNames}
                            fillColor={fillColor}
                            strokeColor={strokeColor}
                            classificationName={classificationName}
                            closeModal={this.closeModal}
                            definition={definition}
                            itemName={itemName}
                            isSecurityControlsModalOpen={isSecurityControlsModalOpen}
                            modalItems={modalItems}
                        />
                    </>
                )}
            </>
        );
    }
}

export type { Props as SecurityControlsProps };
export default SecurityControls;
