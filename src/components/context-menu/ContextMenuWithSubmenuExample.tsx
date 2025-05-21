import * as React from 'react';

import { Menu, SubmenuItem, MenuItem } from '../menu';
import ContextMenu from './ContextMenu';

class ContextMenuWithSubmenuExample extends React.Component {
    state = {
        rightBoundaryElement: undefined,
        bottomBoundaryElement: undefined,
    };

    render() {
        return (
            <ContextMenu>
                <div
                    ref={ref => {
                        if (!this.state.rightBoundaryElement) {
                            this.setState({
                                rightBoundaryElement: ref,
                            });
                        }
                    }}
                    className="context-menu-example-target"
                    style={{
                        height: 200,
                    }}
                >
                    Target Component - right click me
                </div>
                <Menu
                    setRef={(ref: React.RefObject<HTMLDivElement>) => {
                        if (!this.state.bottomBoundaryElement) {
                            this.setState({
                                bottomBoundaryElement: ref,
                            });
                        }
                    }}
                >
                    <MenuItem>View Profile</MenuItem>
                    <MenuItem>View Profile</MenuItem>
                    {this.state.rightBoundaryElement && (
                        <SubmenuItem
                            bottomBoundaryElement={this.state.bottomBoundaryElement}
                            rightBoundaryElement={this.state.rightBoundaryElement}
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

export default ContextMenuWithSubmenuExample;
