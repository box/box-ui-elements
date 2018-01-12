/**
 * @flow
 * @file File Keywords SkillCard component
 * @author Box
 */

import React, { PureComponent } from 'react';
import FileKeyword from './Keyword';
import { Timeline } from '../Timeline';
import type { SkillCard, SkillCardEntry } from '../../flowTypes';

type Props = {
    skill: SkillCard,
    getPreviewer?: Function
};

type State = {
    keyword?: SkillCardEntry
};

class FileKeywords extends PureComponent<Props, State> {
    props: Props;
    state: State = {};

    onClick = (keyword: SkillCardEntry) => {
        this.setState({ keyword });
    };

    render() {
        const { skill, getPreviewer }: Props = this.props;
        const { entries, duration }: SkillCard = skill;
        const { keyword }: State = this.state;
        return (
            <div className='be-file-keywords'>
                {entries.map(
                    (entry: SkillCardEntry, index) => (
                        /* eslint-disable react/no-array-index-key */
                        <FileKeyword
                            key={index}
                            keyword={entry}
                            isSelected={keyword === entry}
                            onClick={this.onClick}
                        />
                    )
                    /* eslint-enable react/no-array-index-key */
                )}
                {!!keyword &&
                    Array.isArray(keyword.appears) &&
                    keyword.appears.length > 0 && (
                        <div className='be-timelines'>
                            <Timeline
                                type={keyword.type}
                                timeslices={keyword.appears}
                                duration={duration}
                                getPreviewer={getPreviewer}
                            />
                        </div>
                    )}
            </div>
        );
    }
}

export default FileKeywords;
