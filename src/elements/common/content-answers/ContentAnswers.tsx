import React, { useCallback, useState } from 'react';
import getProp from 'lodash/get';

import ContentAnswersModal, { ExternalProps as ContentAnswersModalExternalProps } from './ContentAnswersModal';
import ContentAnswersOpenButton from './ContentAnswersOpenButton';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { BoxItem } from '../../common/types/core';

interface ExternalProps extends ContentAnswersModalExternalProps {
    show?: boolean;
}

interface Props {
    file: BoxItem;
}

const ContentAnswers = ({
    file,
    onAsk,
    onRequestClose,
    ...rest
}: Omit<ContentAnswersModalExternalProps & Props, 'show'>) => {
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

        if (onRequestClose) {
            onRequestClose();
        }
    }, [hasQuestions, onRequestClose]);

    const handleAsk = useCallback(() => {
        setHasQuestions(true);
        if (onAsk) {
            onAsk();
        }
    }, [onAsk]);

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

export type ContentAnswersProps = ExternalProps;
export default ContentAnswers;
