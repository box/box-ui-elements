import * as React from 'react';
import * as variables from '../variables';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SpacingDemo = (props: any) => (
    <div
        style={{
            background: variables.bdlBoxBlue20,
            display: 'inline-block',
        }}
        {...props}
    />
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Box = (props: any) => (
    <div
        style={{ display: 'inline-block', background: variables.bdlBoxBlue, color: '#fff', fontWeight: 'bold' }}
        {...props}
    >
        {props.className} {props.children}
    </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ScaleBox = (props: any) => (
    <div style={{ background: variables.bdlBoxBlue20, color: '#000', paddingLeft: 4, paddingRight: 16 }} {...props}>
        {props.className.split('-').slice(-1)}
    </div>
);

const spacing = () => (
    <>
        <SpacingDemo>
            <Box className="bdl-u-ph-3 bdl-u-pv-4 bdl-u-m-3" />
        </SpacingDemo>
        <br />
        <br />
        <SpacingDemo>
            <Box className="bdl-u-ph-6 bdl-u-pv-3 bdl-u-m-6" />
            <Box className="bdl-u-ph-1 bdl-u-pt-1 bdl-u-pb-4 bdl-u-mr-3" />
            <Box className="bdl-u-ph-2 bdl-u-pv-5 bdl-u-mr-0" />
        </SpacingDemo>
    </>
);

const scale = () => (
    <Box>
        <ScaleBox className="bdl-u-ml-0" />
        <ScaleBox className="bdl-u-ml-px" />
        <ScaleBox className="bdl-u-ml-1" />
        <ScaleBox className="bdl-u-ml-2" />
        <ScaleBox className="bdl-u-ml-3" />
        <ScaleBox className="bdl-u-ml-4" />
        <ScaleBox className="bdl-u-ml-5" />
        <ScaleBox className="bdl-u-ml-6" />
        <ScaleBox className="bdl-u-ml-8" />
        <ScaleBox className="bdl-u-ml-10" />
        <ScaleBox className="bdl-u-ml-12" />
        <ScaleBox className="bdl-u-ml-16" />
        <ScaleBox className="bdl-u-ml-20" />
        <ScaleBox className="bdl-u-ml-24" />
        <ScaleBox className="bdl-u-ml-32" />
        <ScaleBox className="bdl-u-ml-40" />
        <ScaleBox className="bdl-u-ml-48" />
        <ScaleBox className="bdl-u-ml-56" />
        <ScaleBox className="bdl-u-ml-64" />
    </Box>
);

export { spacing, scale };

export default {
    title: 'Utility|Spacing',
    component: spacing,
    parameters: {},
    includeStories: [],
};
