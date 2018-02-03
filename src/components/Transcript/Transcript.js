/**
 * @flow
 * @file Transcript component
 * @author Box
 */

import React, { Component } from 'react';
import PlainButton from 'box-react-ui/lib/components/plain-button/PlainButton';
import IconExpand from 'box-react-ui/lib/icons/general/IconExpand';
import TranscriptData from './TranscriptData';
import TranscriptDialog from './TranscriptDialog';
import isValidStartTime from './timeSliceUtil';
import { COLOR_DOWNTOWN_GREY } from '../../constants';
import type { SkillCard } from '../../flowTypes';
import './Transcript.scss';

type Props = {
    skill: SkillCard,
    getPreviewer?: Function,
    rootElement: HTMLElement,
    appElement: HTMLElement
};

type State = {
    isModalOpen: boolean
};

class Transcript extends Component<Props, State> {
    props: Props;
    state: State = { isModalOpen: false };

    /**
     * Handles showing or hiding of transcript modal
     *
     * @private
     * @return {void}
     */
    toggleModal = (): void => {
        this.setState((prevState) => ({
            isModalOpen: !prevState.isModalOpen
        }));
    };

    render() {
        const { skill: { entries, title }, getPreviewer, rootElement, appElement }: Props = this.props;
        const { isModalOpen }: State = this.state;

        if (entries.length === 1 && !isValidStartTime(entries[0].appears)) {
            return <span className='be-transcript'>{entries[0].text}</span>;
        }

        const height = Math.min(300, entries.length * 50);

        return (
            <div style={{ height }}>
                <PlainButton type='button' className='be-transcript-expand' onClick={this.toggleModal}>
                    <IconExpand color={COLOR_DOWNTOWN_GREY} />
                </PlainButton>
                <TranscriptData data={entries} getPreviewer={getPreviewer} />
                <TranscriptDialog
                    title={title}
                    isOpen={isModalOpen}
                    onCancel={this.toggleModal}
                    data={entries}
                    rootElement={rootElement}
                    appElement={appElement}
                />
            </div>
        );
    }
}

export default Transcript;
