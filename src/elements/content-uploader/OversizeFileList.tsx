import * as React from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useIntl } from 'react-intl';

import getFileSize from '../../utils/getFileSize';
import messages from './messages';

export type OversizeFile = {
    name: string;
    size: number;
};

export interface OversizeFileListProps {
    oversizeFiles: ReadonlyArray<OversizeFile>;
}

const OversizeFileList = ({ oversizeFiles }: OversizeFileListProps) => {
    const { formatMessage, locale } = useIntl();
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const rowVirtualizer = useVirtualizer({
        count: oversizeFiles.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => 20,
        overscan: 1,
        gap: 12,
    });

    return (
        <div
            aria-label={formatMessage(messages.largeFileWarningFileListAriaLabel)}
            className="bcu-LargeFileWarningModal-fileListContainer"
            ref={scrollRef}
            role="list"
        >
            <div className="bcu-LargeFileWarningModal-fileListInner" style={{ height: rowVirtualizer.getTotalSize() }}>
                {rowVirtualizer.getVirtualItems().map(item => {
                    const file = oversizeFiles[item.index];

                    return (
                        <div
                            key={`${file.name}-${file.size}-${item.index}`}
                            ref={rowVirtualizer.measureElement}
                            className="bcu-LargeFileWarningModal-fileListRow"
                            data-index={item.index}
                            role="listitem"
                            style={{ transform: `translateY(${item.start}px)` }}
                        >
                            <span className="bcu-LargeFileWarningModal-fileName" title={file.name}>
                                {file.name}
                            </span>
                            <span className="bcu-LargeFileWarningModal-fileSize">{getFileSize(file.size, locale)}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default OversizeFileList;
