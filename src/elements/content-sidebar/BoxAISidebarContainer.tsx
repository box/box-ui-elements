/**
 * @file Box AI Sidebar Container
 * @author Box
 */
import * as React from 'react';
import noop from 'lodash/noop';
import { type QuestionType } from '@box/box-ai-content-answers';
import BoxAISidebar from './BoxAISidebar';



export interface BoxAISidebarContextValues {
    contentName: string,
    elementId: string,
    setCacheValue: (key: 'encodedSession' | 'questions', value: string | null | QuestionType[]) => void,
    cache: { encodedSession?: string | null, questions?: QuestionType[] },
    userInfo: { name: string, avatarUrl: string },
};

export const BoxAISidebarContext = React.createContext<BoxAISidebarContextValues>({
    setCacheValue: noop,
    cache: null,
    contentName: '',
    elementId: '',
    userInfo: { name: '', avatarUrl: ''},
});

export interface BoxAISidebarProps {
    elementId: string,
    contentName: string,
    cache: { encodedSession?: string | null, questions?: QuestionType[] },
    setCacheValue: (key: 'encodedSession' | 'questions', value: string | null | QuestionType[]) => void,
    userInfo: { name: '', avatarUrl: ''},
}

const  BoxAISidebarContainer = (props: BoxAISidebarProps) => {
    const { elementId, contentName, userInfo, cache, setCacheValue, ...rest } = props;
    const { questions } = cache;
    let questionsWithoutInProgress = questions;
    if (questions.length > 0 && !questions[questions.length -1].isCompleted) {
        // pass only fully completed questions to not show loading indicator of question where we canceled API request
        questionsWithoutInProgress = questionsWithoutInProgress.slice(0,-1);
    }
    return (
        <BoxAISidebarContext.Provider value={{elementId, contentName, userInfo, setCacheValue, cache}}>
            <BoxAISidebar restoredQuestions={questionsWithoutInProgress} restoredSession={cache.encodedSession} {...rest} />
        </BoxAISidebarContext.Provider>
    );
}

export default BoxAISidebarContainer;
