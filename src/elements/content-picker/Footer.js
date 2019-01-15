/**
 * @flow
 * @file Footer list component
 * @author Box
 */

import React from 'react';
import { FormattedMessage } from 'react-intl';
import PrimaryButton from 'box-react-ui/lib/components/primary-button/PrimaryButton';
import Button from 'box-react-ui/lib/components/button/Button';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import messages from '../common/messages';
import './Footer.scss';

type Props = {
    selectedCount: number,
    onSelectedClick: Function,
    hasHitSelectionLimit: boolean,
    onChoose: Function,
    onCancel: Function,
    chooseButtonLabel?: string,
    cancelButtonLabel?: string,
    children?: any,
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
            <PlainButton type="button" onClick={onSelectedClick}>
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
                <Button type="button" onClick={onCancel}>
                    {cancelButtonLabel || <FormattedMessage {...messages.cancel} />}
                </Button>
                <PrimaryButton type="button" onClick={onChoose}>
                    {chooseButtonLabel || <FormattedMessage {...messages.choose} />}
                </PrimaryButton>
            </div>
        </div>
    </footer>
);

export default Footer;
