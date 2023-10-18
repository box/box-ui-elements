import React, { useCallback, useState } from 'react';

import getProp from 'lodash/get';
import ContentAnswersModal from './ContentAnswersModal';
import ContentAnswersOpenButton from './ContentAnswersOpenButton';
// @ts-ignore: no ts definition
// eslint-disable-next-line import/named
import { BoxItem } from '../../common/types/core';

type ExternalProps = {
    show?: boolean;
};

type Props = {
    file: BoxItem;
};

const ContentAnswers = ({ file }: Props) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);

    const handleClick = useCallback(() => {
        setIsModalOpen(true);
    }, [setIsModalOpen]);

    const handleClose = useCallback(() => {
        setIsModalOpen(false);
    }, [setIsModalOpen]);

    const handleAsk = useCallback(() => {
        setIsHighlighted(true);
    }, [setIsHighlighted]);

    const currentExtension = getProp(file, 'extension');
    return (
        <div className="bdl-ContentAnswers">
            <ContentAnswersOpenButton
                data-testid="content-answers-open-button"
                fileExtension={currentExtension}
                isHighlighted={isHighlighted}
                isModalOpen={isModalOpen}
                onClick={handleClick}
            />
            <ContentAnswersModal
                data-testid="content-answers-modal"
                file={file}
                isOpen={isModalOpen}
                onAsk={handleAsk}
                onRequestClose={handleClose}
            />
        </div>
    );
};

export type ContentAnswersProps = ExternalProps;
export default ContentAnswers;
