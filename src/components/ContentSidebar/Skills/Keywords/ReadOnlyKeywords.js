/**
 * @flow
 * @file Read Only Keywords Card component
 * @author Box
 */

import * as React from 'react';
import PillCloud from 'box-react-ui/lib/components/pill-cloud/PillCloud';
import Timeline from '../Timeline';
import getPills from './keywordUtils';
import { SKILLS_TARGETS } from '../../../../interactionTargets';
import type { SkillCardEntry } from '../../../../flowTypes';
import type { Pill, Pills } from './flowTypes';
import './ReadOnlyKeywords.scss';

type Props = {
    duration?: number,
    keywords: Array<SkillCardEntry>,
    getPreviewer?: Function
};

type State = {
    selectedIndex: number
};

class ReadOnlyselecteds extends React.PureComponent<Props, State> {
    props: Props;
    state: State = {
        selectedIndex: -1
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
        const newIndex = pill.value;
        this.setState({ selectedIndex: selectedIndex === newIndex ? -1 : newIndex });
    };

    /**
     * Renders the keywords
     *
     * @private
     * @return {void}
     */
    render() {
        const { keywords, getPreviewer, duration }: Props = this.props;
        const { selectedIndex }: State = this.state;
        const options: Pills = getPills(keywords);
        const selected = keywords[selectedIndex];
        const pillCloudProps = selected ? { selectedOptions: [options[selectedIndex]] } : {};

        return (
            <React.Fragment>
                <PillCloud options={options} onSelect={this.onSelect} {...pillCloudProps} />
                {!!selected &&
                    Array.isArray(selected.appears) &&
                    selected.appears.length > 0 && (
                        <Timeline
                            text={selected.text}
                            timeslices={selected.appears}
                            duration={duration}
                            getPreviewer={getPreviewer}
                            interactionTarget={SKILLS_TARGETS.KEYWORDS.TIMELINE}
                        />
                    )}
            </React.Fragment>
        );
    }
}

export default ReadOnlyselecteds;
