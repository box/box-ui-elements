/* eslint-disable no-unused-expressions */
import * as React from 'react';

import { Menu, SubmenuItem, MenuItem } from 'components/menu';
import ContextMenu from 'components/context-menu';

class ContextMenuWithSubmenuWithBoundariesElementExample extends React.Component {
    state = {
        rightBoundaryElement: null,
        bottomBoundaryElement: null,
    };

    render() {
        return (
            <ContextMenu>
                <div
                    className="context-menu-example-target"
                    style={{
                        height: 200,
                    }}
                    ref={ref => {
                        !this.state.rightBoundaryElement &&
                            this.setState({
                                rightBoundaryElement: ref,
                            });
                    }}
                >
                    Target Component - right click me
                </div>
                <Menu
                    setRef={ref => {
                        !this.state.bottomBoundaryElement &&
                            this.setState({
                                bottomBoundaryElement: ref,
                            });
                    }}
                >
                    <MenuItem>View Profile</MenuItem>
                    <MenuItem>View Profile</MenuItem>
                    {this.state.rightBoundaryElement && (
                        <SubmenuItem
                            rightBoundaryElement={this.state.rightBoundaryElement}
                            bottomBoundaryElement={this.state.bottomBoundaryElement}
                        >
                            Submenu
                            <Menu>
                                <MenuItem>View Profile</MenuItem>
                                <MenuItem>View Profile</MenuItem>
                                <MenuItem>View Profile</MenuItem>
                            </Menu>
                        </SubmenuItem>
                    )}
                    <MenuItem>Help</MenuItem>
                </Menu>
            </ContextMenu>
        );
    }
}

export default ContextMenuWithSubmenuWithBoundariesElementExample;
