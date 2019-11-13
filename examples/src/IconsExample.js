// @flow
import * as React from 'react';
import uniqueId from 'lodash/uniqueId';
import classNames from 'classnames';

type Props = {
    icons: Array<{
        component: React.ComponentType<{}>,
        name: string,
        propsDocumentation: React.ComponentType<{}>,
    }>,
};

type State = {
    darkBackgroundEnabled: boolean,
    expandedPropsComponent: string,
};

class IconsExample extends React.Component<Props, State> {
    constructor() {
        super();
        this.state = {
            darkBackgroundEnabled: false,
            expandedPropsComponent: '',
        };
    }

    darkToggleId = uniqueId('dark-toggle-');

    togglePropsSection = (iconName: string) => {
        if (iconName === this.state.expandedPropsComponent) {
            this.setState({ expandedPropsComponent: '' });
        } else {
            this.setState({ expandedPropsComponent: iconName });
        }
    };

    renderPropsSection = (iconName: string, PropsComponent: React.ComponentType<{}>) => {
        const isExpanded = iconName === this.state.expandedPropsComponent;
        if (!PropsComponent) {
            return null;
        }
        return (
            <div className="props-section">
                {isExpanded && (
                    <code className="props-code">
                        <PropsComponent />
                    </code>
                )}
                <button type="button" className="btn-toggle-props" onClick={() => this.togglePropsSection(iconName)}>
                    {isExpanded ? 'Hide Props' : 'View Props'}
                </button>
            </div>
        );
    };

    render() {
        const { icons } = this.props;

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
                <div className={classNames('icon-set', { dark: this.state.darkBackgroundEnabled })}>
                    {icons.map(icon => {
                        const Component = icon.component;
                        const PropsComponent = icon.propsDocumentation;
                        const isExpanded = icon.name === this.state.expandedPropsComponent;
                        return (
                            <div className={classNames('icon', { 'is-expanded': isExpanded })} key={icon.name}>
                                <Component />
                                {/* eslint-disable-next-line jsx-a11y/label-has-for */}
                                <label className="icon-label">{icon.name}</label>
                                {this.renderPropsSection(icon.name, PropsComponent)}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default IconsExample;
