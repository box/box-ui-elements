import React from 'react';

import Section from '../../src/components/section';
import SecurityCloudGame from '../../src/features/security-cloud-game';

const SecurityCloudGameExamples = () => {
    return (
        <div className="example-section clickjacking">
            <h3>Click-jacking Cloud Game</h3>
            <Section id="cloud game" title="">
                <div>
                    <SecurityCloudGame cloudSize={100} height={500} width={500} />
                </div>
            </Section>
        </div>
    );
};

export default SecurityCloudGameExamples;
