**Two-toned icons**

Use provided SASS mix-ins to modify styles of these icons. Each mix-in name is in the format `icon-name-style-override()`. For example, to style `<IconSharedLink />`

```scss
@import '~box-ui-elements/es/icons/two-toned/IconSharedLink.mixins';

.my-custom-classname {
    @include icon-shared-link-style-override($foregroundColor: #fff, $backgroundColor: #0061d5);
}
```

```jsx
const IconsExample = require('../../../examples/src/IconsExample').default;

const icons = [
    {
        name: 'IconChatBubble',
        content: () => {
            const IconChatBubble = require('./IconChatBubble').default;
            return (
                <div>
                    <style>
                        {`
                            .icon-chat-bubble-example .foreground-color {
                                fill: #efefef;
                            }

                            .icon-chat-bubble-example .background-color {
                                fill: #999;
                            }
                        `}
                    </style>
                    <IconChatBubble />
                    <IconChatBubble className="icon-chat-bubble-example" />
                </div>
            );
        },
    },
    {
        name: 'IconExclamationMark',
        content: () => {
            const IconExclamationMark = require('./IconExclamationMark').default;
            return (
                <div>
                    <style>
                        {`
                            .icon-exclamation-mark-example .foreground-color {
                                fill: #efefef;
                            }

                            .icon-exclamation-mark-example .background-color {
                                fill: #999;
                            }
                        `}
                    </style>
                    <IconExclamationMark />
                    <IconExclamationMark className="icon-exclamation-mark-example" />
                </div>
            );
        },
    },
    {
        name: 'IconSharedLink',
        content: () => {
            const IconSharedLink = require('./IconSharedLink').default;
            return (
                <div>
                    <style>
                        {`
                            .icon-shared-link-example .foreground-color {
                                fill: #fff;
                            }

                            .icon-shared-link-example .background-color {
                                fill: #0061d5;
                            }
                        `}
                    </style>
                    <IconSharedLink />
                    <IconSharedLink className="icon-shared-link-example" />
                </div>
            );
        },
    },
];

<IconsExample icons={icons} />;
```
