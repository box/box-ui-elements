/**
 * @flow
 * @file File Keywords SkillData component
 * @author Box
 */

import React, { PureComponent } from 'react';
import FileKeyword from './Keyword';
import { Timeline } from '../Timeline';
import type { SkillData, SkillDataEntry } from '../../flowTypes';

type Props = {
    skill: SkillData
};

type State = {
    keyword?: SkillDataEntry
};

class FileKeywords extends PureComponent<void, Props, State> {
    props: Props;
    state: State = {};

    onClick = (keyword: SkillDataEntry) => {
        this.setState({ keyword });
    };

    render() {
        const { skill }: Props = this.props;
        const { entries, duration }: SkillData = skill;
        const { keyword }: State = this.state;
        return (
            <div className='buik-file-keywords'>
                {entries.map(
                    (entry: SkillDataEntry, index) =>
                        /* eslint-disable react/no-array-index-key */
                        <FileKeyword key={index} keyword={entry} onClick={this.onClick} />
                    /* eslint-enable react/no-array-index-key */
                )}
                {!!keyword &&
                    Array.isArray(keyword.appears) &&
                    keyword.appears.length > 0 &&
                    <div className='buik-timelines'>
                        <Timeline type={keyword.type} timeslices={keyword.appears} duration={duration} />
                    </div>}
            </div>
        );
    }
}

export default FileKeywords;
