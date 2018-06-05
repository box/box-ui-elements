/**
 * @flow
 * @file Busy indicator for skill cards
 * @author Box
 */

import * as React from 'react';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator';
import './SkillsBusyIndicator.scss';

const SkillsBusyIndicator = () => (
    <div className='bcs-skills-is-busy'>
        <LoadingIndicator />
    </div>
);

export default SkillsBusyIndicator;
