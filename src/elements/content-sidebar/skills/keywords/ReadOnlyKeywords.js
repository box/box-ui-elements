/**
 * @flow
 * @file Read Only Keywords Card component
 * @author Box
 */

import * as React from 'react';
import PillCloud from '../../../../components/pill-cloud/PillCloud';
import { SKILLS_TARGETS, INTERACTION_TARGET } from '../../../common/interactionTargets';
import Timeline from '../timeline';
import getPills from './keywordUtils';
import type { Pill, Pills } from './flowTypes';
import type { SkillCardEntry } from '../../../../common/types/skills';
import './ReadOnlyKeywords.scss';

type Props = {
    duration?: number,
    getViewer?: Function,
    keywords: Array<SkillCardEntry>,
};

type State = {
    selectedIndex: number,
};

class ReadOnlyselecteds extends React.PureComponent<Props, State> {
    props: Props;

    state: State = {
        selectedIndex: -1,
    };

    /**
     * Shows the time line by selecting the keyword
     *
     * @private
     * @param {Object} pill - keyword
     * @return {void}
     */
    onSelect = (pill: Pill) => {
        const { selectedIndex }: State = this.state;
        const newIndex: number = ((pill.value: any): number);
        this.setState({
            selectedIndex: selectedIndex === newIndex ? -1 : newIndex,
        });
    };

    /**
     * Renders the keywords
     *
     * @private
     * @return {void}
     */
    render() {
        const { keywords, getViewer, duration }: Props = this.props;
        const { selectedIndex }: State = this.state;
        const options: Pills = getPills(keywords);
        const selected = keywords[selectedIndex];
        const pillCloudProps = selected ? { selectedOptions: [options[selectedIndex]] } : {};

        return (
            <>
                <PillCloud
                    onSelect={this.onSelect}
                    options={options}
                    {...pillCloudProps}
                    buttonProps={{
                        [INTERACTION_TARGET]: SKILLS_TARGETS.KEYWORDS.SELECT,
                    }}
                />
                {!!selected && Array.isArray(selected.appears) && selected.appears.length > 0 && (
                    <Timeline
                        duration={duration}
                        getViewer={getViewer}
                        interactionTarget={SKILLS_TARGETS.KEYWORDS.TIMELINE}
                        text={selected.text}
                        timeslices={selected.appears}
                    />
                )}
            </>
        );
    }
}

export default ReadOnlyselecteds;
