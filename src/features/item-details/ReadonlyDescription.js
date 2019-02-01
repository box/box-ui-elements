import React from 'react';
import PropTypes from 'prop-types';
import processString from 'react-process-string';

const NEWLINE_REGEX = /(\r\n|\n\r|\n|\r)/g;
// eslint-disable-next-line no-useless-escape
const URL_REGEX = /\b(ht|f)tps?:\/\/[\w\._\-]+(:\d+)?(\/[\w\-_\.~\+\/#\?&%=:\[\]@!\$'\(\)\*;,]*)?/gim;

const ReadonlyDescription = ({ value }) =>
    processString([
        {
            regex: NEWLINE_REGEX,
            // eslint-disable-next-line react/display-name
            fn: key => <br key={key} />,
        },
        {
            regex: URL_REGEX,
            // eslint-disable-next-line react/display-name
            fn: (key, result) => (
                <a key={key} href={result[0]} rel="noopener noreferrer" target="_blank">
                    {result[0]}
                </a>
            ),
        },
    ])(value);

ReadonlyDescription.propTypes = {
    value: PropTypes.string,
};

export default ReadonlyDescription;
