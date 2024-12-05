/**
 * @file Box AI Sidebar Container
 * @author Box
 */
import * as React from 'react';
import BoxAISidebar from './BoxAISidebar';


export interface BoxAISidebarContextValues {
    contentName: string,
    elementId: string,
    userInfo: { name: string, avatarUrl: string },
};

export const BoxAISidebarContext = React.createContext<BoxAISidebarContextValues>({
    contentName: '',
    elementId: '',
    userInfo: { name: '', avatarUrl: ''},
});

export interface BoxAISidebarProps {
    elementId: string,
    contentName: string,
    userInfo: { name: '', avatarUrl: ''},
}

const  BoxAISidebarContainer = (props: BoxAISidebarProps) => {
    const { elementId, contentName, userInfo } = props;
    return (
        <BoxAISidebarContext.Provider value={{elementId, contentName, userInfo}}>
            <BoxAISidebar {...props} />
        </BoxAISidebarContext.Provider>
    );
}

export default BoxAISidebarContainer;
