/**
 * @flow
 * @file Footer list component
 * @author Box
 */

import React from 'react';
import { Button, PrimaryButton, PlainButton } from '../Button';
import './Footer.scss';

type Props = {
    selectedCount: number,
    onSelectedClick: Function,
    hasHitSelectionLimit: boolean,
    getLocalizedMessage: Function,
    onChoose: Function,
    onCancel: Function,
    chooseButtonLabel?: string,
    cancelButtonLabel?: string
};

const Footer = ({
    selectedCount,
    onSelectedClick,
    hasHitSelectionLimit,
    onCancel,
    onChoose,
    getLocalizedMessage,
    chooseButtonLabel,
    cancelButtonLabel
}: Props) =>
    <div className='bcp-footer'>
        <div className='bcp-footer-left'>
            <PlainButton onClick={onSelectedClick}>
                <span className='bcp-selected-count'>{selectedCount}</span>
                &nbsp;
                <span>{getLocalizedMessage('buik.footer.selected')}</span>
            </PlainButton>
            &nbsp;
            {hasHitSelectionLimit
                ? <span className='bcp-selected-max'>
                    {getLocalizedMessage('buik.footer.selected.max')}
                </span>
                : null}
        </div>
        <div className='bcp-footer-right'>
            <Button onClick={onCancel}>
                {cancelButtonLabel || getLocalizedMessage('buik.footer.button.cancel')}
            </Button>
            <PrimaryButton onClick={onChoose}>
                {chooseButtonLabel || getLocalizedMessage('buik.footer.button.choose')}
            </PrimaryButton>
        </div>
    </div>;

export default Footer;
