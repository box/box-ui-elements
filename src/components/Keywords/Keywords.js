/**
 * @flow
 * @file File Keywords Card component
 * @author Box
 */

import React, { PureComponent } from 'react';
import FileKeyword from './Keyword';
import { Timeline } from '../Timeline';
import type { Card, CardEntry } from '../../flowTypes';

type Props = {
    card: Card
};

type State = {
    keyword?: CardEntry
};

class FileKeywords extends PureComponent<void, Props, State> {
    props: Props;
    state: State = {};

    onClick = (keyword: CardEntry) => {
        this.setState({ keyword });
    };

    render() {
        const { card }: Props = this.props;
        const { entries, duration }: Card = card;
        const { keyword }: State = this.state;
        return (
            <div className='buik-file-keywords'>
                {entries.map((entry: CardEntry) =>
                    <FileKeyword key={entry.id} keyword={entry} onClick={this.onClick} />
                )}
                {!!keyword &&
                    Array.isArray(keyword.appears) &&
                    keyword.appears.length &&
                    <div className='buik-timelines'>
                        <Timeline type={keyword.type} timeslices={keyword.appears} duration={duration} />
                    </div>}
            </div>
        );
    }
}

export default FileKeywords;
