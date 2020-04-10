// @flow

type Stroke = {
    color: string,
    size: number,
};

type Rect = {
    fill?: {
        color: string,
    },
    height: number,
    stroke?: Stroke,
    type: 'rect',
    width: number,
    x: number,
    y: number,
};

type Page = {
    type: 'page',
    value: number,
};

type TargetRegion = {
    location: Page,
    shape?: Rect,
    type: 'region',
};

type Target = TargetRegion;

export type { Page, Rect, Stroke, Target };
