import * as React from 'react';

interface ThumbnailCardThumbnailProps {
    /** Content rendered inside the thumbnail viewport */
    thumbnail: React.ReactNode;
}

const ThumbnailCardThumbnail = ({ thumbnail }: ThumbnailCardThumbnailProps) => (
    <div className="thumbnail-card-thumbnail-container">
        <div className="thumbnail-card-thumbnail-viewport">{thumbnail}</div>
    </div>
);

export default ThumbnailCardThumbnail;
