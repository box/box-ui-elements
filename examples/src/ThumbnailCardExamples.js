// @flow
import React, { useState } from 'react';

import AccessibleSVG from '../../src/icons/accessible-svg';
import DropdownMenu from '../../src/components/dropdown-menu';
import { Menu, MenuItem } from '../../src/components/menu';
import MenuToggle from '../../src/components/dropdown-menu/MenuToggle';
import PlainButton from '../../src/components/plain-button/PlainButton';
import ThumbnailCard from '../../src/components/thumbnail-card';

const ThumbnailCardExamples = () => {
    const [isCardInFocus, setIsCardInFocus] = useState('');

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
    const thumbnail = <div>Thumbnail goes here</div>;

    const actionItem = (
        <DropdownMenu>
            <PlainButton
                onFocus={event => setIsCardInFocus(event.currentTarget.id)}
                onBlur={event => {
                    if (!event.relatedTarget.contains(event.currentTarget)) {
                        setIsCardInFocus('');
                    }
                }}
                tabIndex="0"
                className="action-item-button"
                type="button"
            >
                <MenuToggle>Hello</MenuToggle>
            </PlainButton>
            <Menu>
                <MenuItem>Menu item</MenuItem>
            </Menu>
        </DropdownMenu>
    );

    return (
        <div>
            <div>
                <h1>Single Card Example</h1>
                <br />
                <ThumbnailCard thumbnail={thumbnail} title={title} />
            </div>
            <br />
            <div>
                <h1>Single Card Example With Icon and Subtitle</h1>
                <ThumbnailCard icon={icon} subtitle={subtitle} thumbnail={thumbnail} title={title} />
            </div>
            <br />
            <div>
                <h1>Expand on Hover Example</h1>
                <br />
                <ThumbnailCard expandOnHover thumbnail={thumbnail} title={title} />
            </div>
            <br />
            <div>
                <h1>Expand on Hover with Action Item Example</h1>
                <br />
                <ThumbnailCard
                    actionItem={actionItem}
                    id={0}
                    className="is-card-in-focus"
                    setIsCardInFocus={setIsCardInFocus}
                    expandOnHover
                    thumbnail={thumbnail}
                    title={title}
                />
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
                            actionItem={actionItem}
                            className={isCardInFocus === i ? 'is-card-in-focus' : ''}
                            icon={icon}
                            id={i}
                            expandOnHover
                            setIsCardInFocus={setIsCardInFocus}
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
