import React from 'react';

import BoxAi from '../../icon/line/BoxAi';
import Media from '../../components/media';

import './ContentAnswersGridCard.scss';

type Props = {
    children: React.ReactNode;
};

const ContentAnswersGridCard = ({ children }: Props) => {
    return (
        <Media className="bdl-ContentAnswersGridCard" data-testid="content-answers-grid-card">
            <Media.Figure>
                <div className="bdl-BoxAIIcon-iconAvatar">
                    <BoxAi height={16} width={16} />
                </div>
            </Media.Figure>
            <Media.Body>
                <div className="bdl-ContentAnswersGridCard-body">{children}</div>
            </Media.Body>
        </Media>
    );
};

export default ContentAnswersGridCard;
