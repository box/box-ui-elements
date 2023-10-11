import React from 'react';
import Media from '../../components/media';
import Avatar from '../../components/avatar';

// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { User } from '../../../common/types/core';

import './Question.scss';

type Props = {
    currentUser: User;
    prompt: string;
};

const Question = ({ currentUser, prompt }: Props) => {
    const { id, name } = currentUser || {};

    return (
        <div className="bdl-Question" data-testid="content-answers-question">
            <Media>
                <Media.Figure>
                    <Avatar id={id} name={name} />
                </Media.Figure>
                <Media.Body>{prompt}</Media.Body>
            </Media>
        </div>
    );
};
export default Question;
