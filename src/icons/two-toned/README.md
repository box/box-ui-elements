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
const propsDocumentation = require('../../../examples/src/IconsExampleTwoTonedIconDocs').default;

const icons = [
    {
        name: 'IconChatBubble',
        component: () => {
            const IconChatBubble = require('./IconChatBubble').default;
            return (
                <div>
                    <style>
                        {`
                            .icon-chat-bubble-example .foreground-color {
                                fill: #efefef;
                            }

                            .icon-chat-bubble-example .background-color {
                                fill: #999999;
                            }
                        `}
                    </style>
                    <IconChatBubble />
                    <IconChatBubble className="icon-chat-bubble-example" />
                </div>
            );
        },
        propsDocumentation,
    },
    {
        name: 'IconExclamationMark',
        component: () => {
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
        propsDocumentation,
    },
    {
        name: 'IconLightning',
        component: () => {
            const IconLightning = require('./IconLightning').default;
            return (
                <div>
                    <style>
                        {`
                            .icon-lightning-example .foreground-color {
                                fill: #efefef;
                            }

                            .icon-lightning-example .background-color {
                                fill: #999;
                            }
                        `}
                    </style>
                    <IconLightning />
                    <IconLightning className="icon-lightning-example" />
                </div>
            );
        },
        propsDocumentation,
    },
    {
        name: 'IconSharedLink',
        component: () => {
            const IconSharedLink = require('./IconSharedLink').default;
            return (
                <div>
                    <style>
                        {`
                            .icon-shared-link-example .foreground-color {
                                fill: #ffffff;
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
        propsDocumentation,
    },
    {
        name: 'IconTaskGeneral',
        component: () => {
            const IconTaskGeneral = require('./IconTaskGeneral').default;
            return (
                <div>
                    <style>
                        {`
                            .icon-task-general-example .foreground-color {
                                fill: #ffffff;
                            }

                            .icon-task-general-example .background-color {
                                fill: #26c281;
                            }
                        `}
                    </style>
                    <IconTaskGeneral />
                    <IconTaskGeneral className="icon-task-general-example" />
                </div>
            );
        },
        propsDocumentation,
    },
    {
        name: 'IconTaskApproval',
        component: () => {
            const IconTaskApproval = require('./IconTaskApproval').default;
            return (
                <div>
                    <style>
                        {`
                            .icon-task-approval-example .foreground-color {
                                fill: #ffffff;
                            }

                            .icon-task-approval-example .background-color {
                                fill: #f5b31b;
                            }
                        `}
                    </style>
                    <IconTaskApproval />
                    <IconTaskApproval className="icon-task-approval-example" />
                </div>
            );
        },
        propsDocumentation,
    },
    {
        name: 'IconWorkflow',
        component: () => {
            const IconWorkflow = require('./IconWorkflow').default;
            return (
                <div>
                    <style>
                        {`
                            .icon-workflow-example .foreground-color {
                                fill: #909090;
                            }

                            .icon-workflow-example .background-color {
                                fill: transparent;
                            }
                        `}
                    </style>
                    <IconWorkflow height={24} width={24} />
                    <IconWorkflow className="icon-workflow-example" height={24} width={24} />
                </div>
            );
        },
        propsDocumentation,
    },
    {
        name: 'IconCollectionItemLink',
        component: () => {
            const IconCollectionItemLink = require('./IconCollectionItemLink').default;
            return (
                <div>
                    <style>
                        {`
                            .icon-workflow-example .foreground-color {
                                fill: #909090;
                            }

                            .icon-workflow-example .background-color {
                                fill: #ccc;
                            }
                        `}
                    </style>
                    <IconCollectionItemLink height={24} width={24} />
                    <IconCollectionItemLink className="icon-workflow-example" height={24} width={24} />
                </div>
            );
        },
        propsDocumentation,
    },
];

<IconsExample icons={icons} />;
```
