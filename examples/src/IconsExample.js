// @flow
import * as React from 'react';

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

    render() {
        const { icons } = this.props;
        const classes = `icon-set ${this.state.darkBackgroundEnabled ? 'dark' : ''}`;

        return (
            <div className="icons-example">
                <label htmlFor="dark-toggle">
                    <input
                        className="dark-toggle"
                        type="checkbox"
                        id="dark-toggle"
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
                                <Component />
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
