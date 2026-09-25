import * as React from 'react';
import classNames from 'classnames';
import { Text } from '@box/blueprint-web';

import PlainButton from '../../components/plain-button/PlainButton';
import { ButtonType } from '../../components/button';
import IconCaretDown from '../../icons/general/IconCaretDown';
import { COLOR_999 } from '../../constants';

import './SidebarSection.scss';

type Props = {
    children?: React.ReactNode;
    className?: string;
    interactionTarget?: string;
    isOpen?: boolean;
    title?: React.ReactNode;
    titleVariant?: 'bodyDefault' | 'bodyDefaultBold';
};

// Deprecated. Use Collapsible.
const SidebarSection = ({
    children,
    className = '',
    interactionTarget,
    isOpen = true,
    title,
    titleVariant = 'bodyDefault',
}: Props) => {
    const [isSectionOpen, setIsSectionOpen] = React.useState(isOpen);

    const toggleVisibility = () => {
        setIsSectionOpen(current => !current);
    };

    return (
        <div
            className={classNames(
                'bcs-section',
                {
                    'bcs-section-open': isSectionOpen,
                },
                className,
            )}
        >
            {title && (
                <PlainButton
                    aria-expanded={isSectionOpen}
                    className="bcs-section-title"
                    data-resin-target={interactionTarget}
                    onClick={toggleVisibility}
                    type={ButtonType.BUTTON}
                >
                    <Text as="span" variant={titleVariant}>
                        {title}
                    </Text>
                    <IconCaretDown color={COLOR_999} width={8} />
                </PlainButton>
            )}
            {(isSectionOpen || !title) && <div className="bcs-section-content">{children}</div>}
        </div>
    );
};

export default SidebarSection;
