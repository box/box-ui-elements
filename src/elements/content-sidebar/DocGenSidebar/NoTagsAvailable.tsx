import * as React from 'react';
import NoTagsIcon from './NoTagsIcon';

const NoTagsAvailable = () => (
    <div className="docgen-empty-state">
        <NoTagsIcon className="docgen-empty-state--icon" />
        <div>This document has no tags</div>
        <p>To use tags, please add them in tag editor.</p>
        <a href="/">Find out more how to add tags</a>
    </div>
);

export default NoTagsAvailable;
