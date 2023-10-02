import React, { useState } from 'react';

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
    const fileName = file && file.name;
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClick = () => {
        setIsModalOpen(true);
    };

    const handleClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="bdl-ContentAnswers">
            <ContentAnswersOpenButton onClick={handleClick} />
            <ContentAnswersModal fileName={fileName} isOpen={isModalOpen} onRequestClose={handleClose} />
        </div>
    );
};

export type ContentAnswersProps = ExternalProps;
export default ContentAnswers;
