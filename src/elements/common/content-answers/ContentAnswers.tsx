import React, { useCallback, useState } from 'react';

import getProp from 'lodash/get';
import { SuggestedQuestionType } from '@box/box-ai-content-answers';
import ContentAnswersModal from './ContentAnswersModal';
import ContentAnswersOpenButton from './ContentAnswersOpenButton';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { BoxItem } from '../../common/types/core';

type ExternalProps = {
    show?: boolean;
    isCitationsEnabled?: boolean;
    isMarkdownEnabled?: boolean;
    suggestedQuestions?: SuggestedQuestionType[];
};

type Props = {
    file: BoxItem;
};

export type ContentAnswersProps = ExternalProps & Props;

const ContentAnswers = ({ file, ...rest }: Omit<ContentAnswersProps, 'show'>) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [hasQuestions, setHasQuestions] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    const handleClick = useCallback(() => {
        setIsModalOpen(true);
    }, [setIsModalOpen]);

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
        if (hasQuestions) {
            setIsHighlighted(true);
        }
    }, [hasQuestions]);

    const handleAsk = useCallback(() => {
        setHasQuestions(true);
    }, []);

    const currentExtension = getProp(file, 'extension');
    return (
        <div className="bdl-ContentAnswers">
            <ContentAnswersOpenButton
                fileExtension={currentExtension}
                isHighlighted={isHighlighted}
                isModalOpen={isModalOpen}
                onClick={handleClick}
            />
            <ContentAnswersModal
                file={file}
                isOpen={isModalOpen}
                onAsk={handleAsk}
                onRequestClose={handleClose}
                {...rest}
            />
        </div>
    );
};

export default ContentAnswers;
