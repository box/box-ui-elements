/**
 * @flow
 * @file Content Answers Component
 * @author Box
 */

import React from 'react';

import './ContentAnswers.scss';

type Props = {};
type State = {};

class ContentAnswers extends React.PureComponent<Props, State> {
    render() {
        return <div data-testid="content-answers" />;
    }
}

export { ContentAnswers as ContentAnswersComponent };
export default ContentAnswers;
