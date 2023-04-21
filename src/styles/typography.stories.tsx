import * as React from 'react';
import './typography.stories.scss';

export const lato = () => (
    <div className="typography">
        <div className="heading">
            <h1>Lato 2.0</h1>
        </div>
        <div className="weights">
            <div className="regular">
                <div className="preview">Aa</div>
                <div className="weight">Regular</div>
            </div>
            <div className="bold">
                <div className="preview">Aa</div>
                <div className="weight">Bold</div>
            </div>
        </div>
    </div>
);

export const heading = () => (
    <div className="typography">
        <div className="heading">
            <label>H1</label>
            <h1>Project Symphony</h1>
        </div>
        <div className="heading">
            <label>H2</label>
            <h2>Project Symphony</h2>
        </div>
        <div className="heading">
            <label>H3</label>
            <h3>Project Symphony</h3>
        </div>
        <div className="heading">
            <label>H4</label>
            <h4>Project Symphony</h4>
        </div>
        <div className="heading">
            <label>H5</label>
            <h5>Project Symphony</h5>
        </div>
        <div className="heading">
            <label>H6</label>
            <h6>Project Symphony</h6>
        </div>
    </div>
);

export const text = () => (
    <div className="typography">
        <div>
            <label>BODY</label>
            <span className="body">Project Symphony</span>
        </div>
        <div>
            <label>INPUT LABEL</label>
            <span className="input-label">Project Symphony</span>
        </div>
        <div>
            <label>INPUT TEXT</label>
            <span className="input-text">Project Symphony</span>
        </div>
    </div>
);

export default {
    title: 'Theming|Typography',
};
