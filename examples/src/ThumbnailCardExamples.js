// @flow
import * as React from 'react';

import AccessibleSVG from '../../src/icons/accessible-svg';
import ThumbnailCard from '../../src/components/thumbnail-card';
import PrimaryButton from '../../src/components/primary-button';

const ThumbnailCardExamples = () => {
    const icon = (
        <div
            style={{
                alignItems: 'center',
                display: 'flex',
                marginRight: '15px',
            }}
        >
            <AccessibleSVG height={32} viewBox="0 0 14 14" width={32}>
                <path
                    color="#000000"
                    d="M7 11.5l-4 2.1c-.2.1-.4 0-.5-.1v-.2l.8-4.4L.1 5.8c-.1-.1-.1-.4 0-.5.1-.1.1-.1.2-.1l4.4-.6 2-4c.1-.2.3-.2.5-.2.1 0 .1.1.2.2l2 4 4.4.6c.2 0 .3.2.3.4 0 .1 0 .1-.1.2l-3.2 3.1.8 4.4c0 .2-.1.4-.3.4h-.2L7 11.5z"
                />
            </AccessibleSVG>
        </div>
    );
    const subtitle = <div>I&#39;m a subtitle!</div>;
    const title = <div>Hello World!</div>;
    const longTitle = 'Super long title goes here here here';
    const thumbnail = <div>Thumbnail goes here</div>;
    const actionItem = <PrimaryButton>Click Me</PrimaryButton>;

    return (
        <div>
            <div>
                <h1>Single Card Example</h1>
                <ThumbnailCard thumbnail={thumbnail} title={title} />
            </div>
            <br />
            <div>
                <h1>Single Card Example With Icon and Subtitle</h1>
                <ThumbnailCard icon={icon} subtitle={subtitle} thumbnail={thumbnail} title={title} />
            </div>
            <br />
            <div>
                <h1>Highlight on Hover Example</h1>
                <ThumbnailCard highlightOnHover thumbnail={thumbnail} title={title} />
            </div>
            <div>
                <h1>Action Item Example</h1>
                <ThumbnailCard actionItem={actionItem} thumbnail={thumbnail} title={title} />
            </div>
            <div>
                <h1>Show Tooltip on Title Hover Example</h1>
                <ThumbnailCard actionItem={actionItem} thumbnail={thumbnail} title={longTitle} />
            </div>
            <br />
            <div>
                <h1>Multiple Cards Example</h1>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'nowrap',
                    }}
                >
                    {new Array(3).fill(true).map((_, i) => (
                        <ThumbnailCard
                            key={`thumbnailcard-${i}`}
                            icon={icon}
                            highlightOnHover
                            subtitle={subtitle}
                            thumbnail={thumbnail}
                            title={title}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ThumbnailCardExamples;
