// @flow
import * as React from 'react';
import noop from 'lodash/noop';

type MenuContextValues = {
    closeMenu: Function;
};

export default React.createContext<MenuContextValues>({ closeMenu: noop });
