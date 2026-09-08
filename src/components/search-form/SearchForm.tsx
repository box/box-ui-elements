import * as React from 'react';
import { injectIntl, IntlShape } from 'react-intl';
import classNames from 'classnames';
import omit from 'lodash/omit';

import SearchActions from './SearchActions';

import messages from './messages';

import './SearchForm.scss';

export interface SearchFormProps
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'className' | 'name' | 'onChange' | 'onSubmit' | 'value'
    > {
    /** Form submit action */
    action: string;
    /** Custom class name for the search input container */
    className?: string;
    /** Called with the search input element when its ref changes */
    getSearchInput?: (input: HTMLInputElement | null) => void;
    /** Ref attached to the search input container */
    innerRef?: React.Ref<HTMLDivElement>;
    /** Internationalization utilities */
    intl: IntlShape;
    /** Whether to show a loading indicator instead of search actions */
    isLoading?: boolean;
    /** The way to send the form data, get or post */
    method: 'get' | 'post';
    /** Name of the text input */
    name: string;
    /** On change handler for the search input */
    onChange?: (value: string) => void;
    /** On submit handler for the search input */
    onSubmit?: (value: string, event: React.FormEvent<HTMLFormElement>) => void;
    /** Extra query parameters in addition to the form data */
    queryParams: Record<string, string>;
    /** Whether to prevent propagation of search clear action */
    shouldPreventClearEventPropagation?: boolean;
    /** If the clear button is shown when input field is not empty */
    useClearButton: boolean;
    /** The value of the input if controlled */
    value?: string;
}

interface SearchFormState {
    isEmpty: boolean;
}

type SearchFormDefaultProps = Pick<SearchFormProps, 'action' | 'method' | 'name' | 'queryParams' | 'useClearButton'>;

type SearchFormConfig = Omit<SearchFormProps, keyof SearchFormDefaultProps | 'intl'> & Partial<SearchFormDefaultProps>;

class SearchFormBase extends React.Component<SearchFormProps, SearchFormState> {
    static readonly defaultProps: SearchFormDefaultProps = {
        action: '',
        method: 'get',
        name: 'search',
        queryParams: {},
        useClearButton: false,
    };

    state = {
        isEmpty: true,
    };

    static getDerivedStateFromProps(props: SearchFormProps): Partial<SearchFormState> | null {
        const { value } = props;

        if (value && !!value.trim()) {
            return {
                isEmpty: true,
            };
        }

        return null;
    }

    onClearHandler = (event: React.SyntheticEvent<HTMLButtonElement>) => {
        const { onChange, shouldPreventClearEventPropagation } = this.props;
        if (shouldPreventClearEventPropagation) {
            event.stopPropagation();
        }

        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.setState({ isEmpty: true });

        if (onChange) {
            onChange('');
        }
    };

    onChangeHandler = (event: React.FormEvent<HTMLFormElement>) => {
        const { value } = event.target as HTMLInputElement;
        const { onChange } = this.props;
        this.setState({ isEmpty: !value?.trim().length });

        if (onChange) {
            onChange(value);
        }
    };

    onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        const form = event.target as HTMLFormElement;
        const { value } = form.elements[0] as HTMLInputElement;
        const { onSubmit } = this.props;

        if (onSubmit) {
            onSubmit(value, event);
        }
    };

    setInputRef = (element: HTMLInputElement | null) => {
        this.searchInput = element;

        if (this.props.getSearchInput) {
            this.props.getSearchInput(this.searchInput);
        }
    };

    searchInput: HTMLInputElement | null | undefined;

    render() {
        const {
            action,
            className,
            innerRef,
            intl,
            isLoading,
            method,
            name,
            queryParams,
            onSubmit,
            useClearButton,
            ...rest
        } = this.props;
        const { isEmpty } = this.state;

        const inputProps = omit(rest, ['getSearchInput', 'onChange', 'required', 'shouldPreventClearEventPropagation']);

        const { formatMessage } = intl;
        const classes = classNames(className, 'search-input-container');
        const formClassNames = classNames('search-form', {
            'is-empty': isEmpty,
            'use-clear-button': useClearButton,
        });
        const hiddenInputs = Object.keys(queryParams).map((param, index) => (
            <input key={index} name={param} type="hidden" value={queryParams[param]} />
        ));

        // @NOTE Prevent errors from React about controlled inputs
        const onChangeStub = () => undefined;

        return (
            <div ref={innerRef} className={classes}>
                <form
                    action={action}
                    className={formClassNames}
                    method={method}
                    onChange={this.onChangeHandler}
                    onSubmit={this.onSubmitHandler}
                    role="search"
                >
                    <input
                        ref={this.setInputRef}
                        aria-label={formatMessage(messages.searchLabel)}
                        autoComplete="off"
                        className="search-input"
                        name={name}
                        onChange={onChangeStub}
                        type="search"
                        {...inputProps}
                    />
                    <SearchActions
                        hasSubmitAction={!!onSubmit}
                        isLoading={isLoading}
                        loadingIndicatorProps={{
                            className: 'search-form-loading-indicator',
                        }}
                        onClear={this.onClearHandler}
                    />
                    {hiddenInputs}
                </form>
            </div>
        );
    }
}

const SearchFormBaseIntl = injectIntl(SearchFormBase) as React.ComponentType<SearchFormConfig>;
export { SearchFormBaseIntl };

const SearchForm = React.forwardRef<HTMLDivElement, SearchFormConfig>((props, ref) => (
    <SearchFormBaseIntl {...props} innerRef={ref} />
));
SearchForm.displayName = 'SearchForm';

export default SearchForm;
