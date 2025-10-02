import * as React from 'react';
import './GridViewSlider.scss';
export interface GridViewSliderProps {
    columnCount: number;
    gridMaxColumns: number;
    gridMinColumns: number;
    maxColumnCount: number;
    onChange: (newSliderValue: number) => void;
}
declare const GridViewSlider: ({ columnCount, gridMaxColumns, gridMinColumns, maxColumnCount, onChange, }: GridViewSliderProps) => React.JSX.Element;
export default GridViewSlider;
