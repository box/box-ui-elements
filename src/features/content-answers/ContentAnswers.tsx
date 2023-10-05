import React, { useState } from 'react';

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

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    const currentExtension = getProp(file, 'extension');
    return (
        <div className="bdl-ContentAnswers">
            <ContentAnswersOpenButton
                data-testid="content-answers-open-button"
                fileExtension={currentExtension}
                onClick={handleClick}
            />
            <ContentAnswersModal
                data-testid="content-answers-modal"
                file={file}
                isOpen={isModalOpen}
                onRequestClose={handleClose}
            />
        </div>
    );
};

export type ContentAnswersProps = ExternalProps;
export default ContentAnswers;
