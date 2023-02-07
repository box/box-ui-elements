/**
 * @flow
 * @file Header bar
 * @author Box
 */

import React from 'react';
import { injectIntl } from 'react-intl';
import Logo from './Logo';
import messages from '../messages';
import { VIEW_FOLDER, VIEW_SEARCH } from '../../../constants';
import type { View } from '../../../common/types/core';
import { Flyout, Overlay } from '../../../components/flyout';
import { DatePicker } from '../../../components';
import Button from '../../../components/button';

import IconAdvancedFilters from '../../../icons/general/IconAdvancedFilters';

import './Header.scss';

type Props = {
    fromDateQuery?: string,
    intl: any,
    isHeaderLogoVisible?: boolean,
    isSmall: boolean,
    logoUrl?: string,
    onSearch: Function,
    searchQuery: string,
    toDateQuery?: string,
    view: View,
};

// eslint-disable-next-line react/prop-types
const Header = ({ isHeaderLogoVisible = true, view, isSmall, onSearch, logoUrl, intl }: Props) => {
    const isFolder = view === VIEW_FOLDER;
    const isSearch = view === VIEW_SEARCH;

    const [values, setValues] = React.useState({ query: '', fromDate: null, toDate: null });
    const search = (query, fromDate, toDate) => onSearch(query, fromDate, toDate);

    const MAX_TIME = new Date('3000-01-01T00:00:00.000Z');
    const MIN_TIME = new Date(0);
    const TODAY = new Date();

    return (
        <div className="be-header">
            {isHeaderLogoVisible && <Logo isSmall={isSmall} url={logoUrl} />}
            <div className="be-search">
                <input
                    aria-label="search"
                    disabled={!isFolder && !isSearch}
                    onChange={e => {
                        setValues({ ...values, query: e.currentTarget.value });
                        if (e.currentTarget.value !== '') {
                            search(e.currentTarget.value, values.fromDate, values.toDate);
                        } else search(e.currentTarget.value, '', '');
                    }}
                    placeholder={intl.formatMessage(messages.searchPlaceholder)}
                    type="search"
                    value={values.query}
                />
            </div>
            <Flyout position="bottom-left">
                <Button>
                    <IconAdvancedFilters />
                </Button>
                <Overlay>
                    <div className="accessible-overlay-content">
                        <div>
                            <DatePicker
                                className="date-picker-example"
                                displayFormat={{
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                }}
                                hideOptionalLabel
                                label="From Date"
                                maxDate={values.toDate || MAX_TIME}
                                name="datepicker-from"
                                onChange={data => {
                                    setValues({ ...values, fromDate: data });
                                    search(values.query, data, values.toDate);
                                }}
                                placeholder="Choose a Date"
                                value={values.fromDate}
                            />
                            <DatePicker
                                className="date-picker-example"
                                displayFormat={{
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                }}
                                hideOptionalLabel
                                label="To Date"
                                minDate={values.fromDate || MIN_TIME}
                                maxDate={TODAY}
                                name="datepicker-to"
                                onChange={data => {
                                    setValues({ ...values, toDate: data });
                                    search(values.query, values.fromDate, data);
                                }}
                                placeholder="Choose a Date"
                                value={values.toDate}
                            />
                        </div>
                    </div>
                </Overlay>
            </Flyout>
        </div>
    );
};

export default injectIntl(Header);
