/**
 * @flow
 * @file Footer list component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PrimaryButton from '../../components/primary-button/PrimaryButton';
import Button from '../../components/button/Button';
import PlainButton from '../../components/plain-button/PlainButton';
import messages from '../common/messages';
import './Footer.scss';

type Props = {
    cancelButtonLabel?: string,
    children?: any,
    chooseButtonLabel?: string,
    hasHitSelectionLimit: boolean,
    onCancel: Function,
    onChoose: Function,
    onSelectedClick: Function,
    selectedCount: number,
};

const Footer = ({
    selectedCount,
    onSelectedClick,
    hasHitSelectionLimit,
    onCancel,
    onChoose,
    chooseButtonLabel,
    cancelButtonLabel,
    children,
}: Props) => (
    <footer className="bcp-footer">
        <div className="bcp-footer-left">
            <PlainButton onClick={onSelectedClick} type="button">
                <span className="bcp-selected-count">{selectedCount}</span>
                &nbsp;
                <FormattedMessage {...messages.selected} />
            </PlainButton>
            &nbsp;
            {hasHitSelectionLimit ? (
                <span className="bcp-selected-max">
                    <FormattedMessage {...messages.max} />
                </span>
            ) : null}
        </div>
        <div className="bcp-footer-right">
            {children}

            <div className="bcp-footer-actions">
                <Button onClick={onCancel} type="button">
                    {cancelButtonLabel || <FormattedMessage {...messages.cancel} />}
                </Button>
                <PrimaryButton onClick={onChoose} type="button">
                    {chooseButtonLabel || <FormattedMessage {...messages.choose} />}
                </PrimaryButton>
            </div>
        </div>
    </footer>
);

export default Footer;
