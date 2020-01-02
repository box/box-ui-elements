// @flow
import * as React from 'react';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import type { Controls, ControlsFormat } from '../flowTypes';

import SecurityControlsItem from './SecurityControlsItem';
import { getShortSecurityControlsMessage, getFullSecurityControlsMessages } from './utils';
import { DEFAULT_MAX_APP_COUNT, SECURITY_CONTROLS_FORMAT } from '../constants';
import SecurityControlsModal from './SecurityControlsModal';
import PlainButton from '../../../components/plain-button';
import messages from './messages';

import './SecurityControls.scss';

const { FULL, SHORT, SHORT_WITH_BTN } = SECURITY_CONTROLS_FORMAT;

type Props = {
    classificationName?: string,
    controls: Controls,
    controlsFormat: ControlsFormat,
    definition?: string,
    itemName?: string,
    maxAppCount?: number,
};

type State = {
    isSecurityControlsModalOpen: boolean,
};

class SecurityControls extends React.Component<Props, State> {
    static defaultProps = {
        classificationName: '',
        controls: {},
        controlsFormat: SHORT,
        definition: '',
        itemName: '',
        maxAppCount: DEFAULT_MAX_APP_COUNT,
    };

    state = {
        isSecurityControlsModalOpen: false,
    };

    openModal = () => this.setState({ isSecurityControlsModalOpen: true });

    closeModal = () => this.setState({ isSecurityControlsModalOpen: false });

    render() {
        const { classificationName, controls, controlsFormat, definition, itemName, maxAppCount } = this.props;
        let items = [];
        let modalItems;

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

        const className = classNames('bdl-SecurityControls', {
            'bdl-SecurityControls--summarized': controlsFormat !== FULL,
        });

        return (
            <>
                <ul className={className}>
                    {items.map((item, index) => (
                        <SecurityControlsItem key={index} message={item} />
                    ))}
                </ul>
                {controlsFormat === SHORT_WITH_BTN && (
                    <>
                        <PlainButton className="lnk" onClick={this.openModal}>
                            <FormattedMessage {...messages.viewAll} />
                        </PlainButton>
                        <SecurityControlsModal
                            classificationName={classificationName}
                            closeModal={this.closeModal}
                            definition={definition}
                            itemName={itemName}
                            isSecurityControlsModalOpen={this.state.isSecurityControlsModalOpen}
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
