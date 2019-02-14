import * as React from 'react';

import { Menu, SubmenuItem, MenuItem } from '../../src/components/menu';

class SubmenuWithBoundariesElementExample extends React.Component {
    state = {
        rightBoundaryElement: null,
    };

    render() {
        return (
            <div
                ref={ref => {
                    // eslint-disable-next-line
                    !this.state.rightBoundaryElement &&
                        this.setState({
                            rightBoundaryElement: ref,
                        });
                }}
                style={{
                    height: '200px',
                    paddingLeft: '700px',
                }}
            >
                <div
                    style={{
                        maxWidth: '220px',
                    }}
                >
                    <Menu>
                        <MenuItem>View Profile</MenuItem>
                        {this.state.rightBoundaryElement && (
                            <SubmenuItem rightBoundaryElement={this.state.rightBoundaryElement}>
                                Submenu
                                <Menu>
                                    <MenuItem>View Profile</MenuItem>
                                    <MenuItem>Help</MenuItem>
                                </Menu>
                            </SubmenuItem>
                        )}
                        <MenuItem>Help</MenuItem>
                    </Menu>
                </div>
            </div>
        );
    }
}

export default SubmenuWithBoundariesElementExample;
