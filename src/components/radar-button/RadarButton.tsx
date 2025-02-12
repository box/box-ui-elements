import * as React from 'react';
import { Button as BlueprintButton } from '@box/blueprint-web';
import { type ButtonProps } from '@box/blueprint-web/lib-esm/button/types';
import RadarAnimation from '../radar';

type RadarButtonProps = ButtonProps & {
    showRadar?: boolean;
};

const RadarButton = React.forwardRef<HTMLButtonElement, RadarButtonProps>(({ showRadar, ...props }, ref) => {
    const button = <BlueprintButton {...props} ref={ref} />;
    return showRadar ? <RadarAnimation>{button}</RadarAnimation> : button;
});

RadarButton.displayName = 'RadarButton';

export default RadarButton;
