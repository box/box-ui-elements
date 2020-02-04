// @flow
import * as React from 'react';

import Avatar from '../../avatar/Avatar';
import Button from '../../button/Button';
import MenuItem from '../../menu/MenuItem';
import TextArea from '../../text-area/TextArea';

import Media from '../Media';
import notes from './Media.stories.md';

import { bdlGreenLight, bdlPurpleRain, bdlWatermelonRed, bdlYellorange } from '../../../styles/variables';

export const example = () => (
    <Media style={{ width: 300 }}>
        <Media.Figure>
            <Avatar size="large" />
        </Media.Figure>

        <Media.Body>
            <Media.Menu label="Options">
                <MenuItem>Edit</MenuItem>
                <MenuItem>Delete</MenuItem>
            </Media.Menu>
            <div>
                <b>Yo Yo Ma</b> commented on this file
            </div>
            <div>
                Please review the notes
                <br />a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
            </div>
        </Media.Body>
    </Media>
);

export const exampleExplanation = () => (
    <>
        <code>
            <span style={{ color: bdlGreenLight }}>Media</span>
            <span style={{ color: bdlPurpleRain }}>Media.Figure</span>
            <span style={{ color: bdlYellorange }}>Media.Body</span>
            <span style={{ color: bdlWatermelonRed }}>Media.Menu</span>
        </code>
        <br />
        <br />
        <Media style={{ width: 300, boxShadow: `0 0 2px 3px ${bdlGreenLight}`, padding: 5 }}>
            <Media.Figure style={{ boxShadow: `0 0 2px 3px ${bdlPurpleRain}` }}>
                <Avatar size="large" />
            </Media.Figure>

            <Media.Body style={{ boxShadow: `0 0 2px 3px ${bdlYellorange}`, padding: 3 }}>
                <Media.Menu style={{ boxShadow: `0 0 2px 3px ${bdlWatermelonRed}`, margin: 3, padding: 3 }}>
                    <MenuItem>Edit</MenuItem>
                    <MenuItem>Delete</MenuItem>
                </Media.Menu>
                <div>
                    <b>Yo Yo Ma</b> commented on this file
                </div>
                <div>
                    Please review the notes
                    <br />a b c d e f g h i j k l m n o p q r s t u v w x y z 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9
                </div>
            </Media.Body>
        </Media>
    </>
);

export const withNestedComponents = () => (
    <Media style={{ width: 300 }}>
        <Media.Figure>
            <Avatar />
        </Media.Figure>

        <Media.Body>
            <Media.Menu>
                <MenuItem>Edit</MenuItem>
                <MenuItem>Delete</MenuItem>
            </Media.Menu>
            <div>
                <b>Yo Yo Ma</b> commented on this file
            </div>
            <div>This is a nested media object</div>
            <ul style={{ margin: 0, padding: 0 }}>
                <Media as="li" style={{ marginTop: 10 }}>
                    <Media.Figure>
                        <Avatar />
                    </Media.Figure>

                    <Media.Body>
                        <div>
                            <b>Bjork</b> replied
                        </div>
                        <div>I must agree!</div>
                        <Media as="li" style={{ marginTop: 10 }}>
                            <Media.Figure>
                                <Avatar />
                            </Media.Figure>

                            <Media.Body>
                                <div>
                                    <b>Bono</b> replied
                                </div>
                                <div>Me too!</div>
                            </Media.Body>
                        </Media>
                    </Media.Body>
                </Media>
            </ul>
        </Media.Body>
    </Media>
);

export const withFormElements = () => (
    <Media style={{ width: 300 }}>
        <Media.Figure>
            <Avatar size="large" />
        </Media.Figure>

        <Media.Body>
            <Media.Menu>
                <MenuItem>Edit</MenuItem>
                <MenuItem>Delete</MenuItem>
            </Media.Menu>
            <div>
                <b>W.A. Mozart</b> commented on this file
            </div>
            <div>Everyone get ready to perform the symphony tonight!</div>
            <div>
                <Button>Reply</Button>
                <Button>Cancel</Button>
                <TextArea label="Response" />
            </div>
        </Media.Body>
    </Media>
);

export default {
    title: 'Components|Media/Media',
    component: Media,
    parameters: {
        notes,
    },
};
