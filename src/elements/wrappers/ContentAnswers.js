/**
 * @flow
 * @file Base class for the Content Answers ES6 wrapper
 * @author Box
 */

import React from 'react';
import { render } from 'react-dom';
import ES6Wrapper from './ES6Wrapper';
import ContentAnswersReactComponent from '../content-answers';

class ContentAnswers extends ES6Wrapper {
    /** @inheritdoc */
    render() {
        render(<ContentAnswersReactComponent />, this.container);
    }
}

global.Box = global.Box || {};
global.Box.ContentAnswers = ContentAnswers;
export default ContentAnswers;
