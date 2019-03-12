// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';

type Props = {
    icons: Array<Object>,
};

type State = {
    darkBackgroundEnabled: boolean,
};

class IconsExample extends React.Component<Props, State> {
    constructor() {
        super();
        this.state = {
            darkBackgroundEnabled: false,
        };
    }

    darkToggleId = uniqueId('dark-toggle-');

    render() {
        const { icons } = this.props;
        const classes = `icon-set ${this.state.darkBackgroundEnabled ? 'dark' : ''}`;

        return (
            <div className="icons-example">
                <label htmlFor={this.darkToggleId}>
                    <input
                        className="dark-toggle"
                        type="checkbox"
                        id={this.darkToggleId}
                        value={this.state.darkBackgroundEnabled}
                        onChange={() => {
                            this.setState(state => {
                                return { darkBackgroundEnabled: !state.darkBackgroundEnabled };
                            });
                        }}
                    />
                    Enable dark background
                </label>
                <div className={classes}>
                    {icons.map(icon => {
                        const Component = icon.component;
                        return (
                            <div className="icon" key={icon.name}>
                                {icon.content ? icon.content() : <Component />}
                                {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                                <label className="icon-label">{icon.name}</label>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default IconsExample;
