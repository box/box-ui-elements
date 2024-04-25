import * as React from 'react';

import { bdlBoxBlue } from '../../styles/variables';

import Header from './Header';
import notes from './Header.stories.md';

export const regular = () => (
    <Header color={bdlBoxBlue}>
        <h1 style={{ color: '#fff' }}>Lorem Ipsum</h1>
    </Header>
);

export default {
    title: 'Components/Header',
    component: Header,
    parameters: {
        notes,
    },
};
