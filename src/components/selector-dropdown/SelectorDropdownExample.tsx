import * as React from 'react';
import { Children, Component } from 'react';

import DatalistItem from '../datalist-item';
import SelectorDropdown from './SelectorDropdown';
import TextInput, { TextInputProps } from '../text-input';

interface InputContainerProps extends Omit<TextInputProps, 'onInput'> {
    inputProps?: Partial<TextInputProps>;
    onInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputContainer: React.FC<InputContainerProps> = ({ inputProps = {}, ...rest }) => (
    <TextInput {...inputProps} {...rest} />
);

interface SelectorDropdownContainerProps {
    initialItems: string[];
    placeholder: string;
    title: string;
}

interface SelectorDropdownContainerState {
    filterText: string;
    items: string[];
    showTitle: boolean;
    remainOpen: boolean;
}

class SelectorDropdownContainer extends Component<SelectorDropdownContainerProps, SelectorDropdownContainerState> {
    constructor(props: SelectorDropdownContainerProps) {
        super(props);
        this.state = {
            filterText: '',
            items: props.initialItems,
            showTitle: false,
            remainOpen: false,
        };
    }

    handleShowTitle = () => {
        this.setState({ showTitle: !this.state.showTitle });
    };

    handleRemainOpen = () => {
        this.setState({ remainOpen: !this.state.remainOpen });
    };

    handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.filterByItem(event.target.value);
    };

    handleItemSelection = (i: number) => {
        this.setState({ filterText: this.state.items[i] });
    };

    filterByItem(item: string) {
        this.setState({ filterText: item });
        this.filterItems(item);
    }

    filterItems(filterText: string) {
        const { initialItems } = this.props;
        const filterTextLowerCase = filterText.toLowerCase();
        const items = initialItems.filter(item => item.toLowerCase().includes(filterTextLowerCase));
        this.setState({ items });
    }

    render() {
        const { placeholder, title } = this.props;
        const { filterText, items, showTitle, remainOpen } = this.state;
        const dropdownTitle = <div>This is a Title</div>;

        return (
            <div style={{ paddingBottom: '330px' }}>
                <label htmlFor="title-check">
                    <input
                        type="checkbox"
                        name="title-check"
                        id="title-check"
                        checked={showTitle}
                        onChange={this.handleShowTitle}
                    />
                    <span style={{ paddingLeft: '4px' }}>Add title to overlay</span>
                </label>
                <br />
                <label htmlFor="remain-open-check">
                    <input
                        type="checkbox"
                        name="remain-open-check"
                        id="remain-open-check"
                        checked={remainOpen}
                        onChange={this.handleRemainOpen}
                    />
                    <span style={{ paddingLeft: '4px' }}>Overlay should remain open</span>
                </label>
                <hr />
                <SelectorDropdown
                    isAlwaysOpen={remainOpen}
                    onSelect={this.handleItemSelection}
                    selector={
                        <InputContainer
                            label={title}
                            name="selectorDropdownInput"
                            onInput={this.handleUserInput}
                            placeholder={placeholder}
                            type="text"
                            value={filterText}
                        />
                    }
                    title={showTitle ? dropdownTitle : undefined}
                >
                    {Children.map(items, item => (
                        <DatalistItem key={item}>{item}</DatalistItem>
                    ))}
                </SelectorDropdown>
            </div>
        );
    }
}

const SelectorDropdownExample: React.FC = () => (
    <SelectorDropdownContainer
        initialItems={[
            'Illmatic',
            'The Marshall Mathers LP',
            'All Eyez on Me',
            'Ready To Die',
            'Enter the Wu-Tang',
            'The Eminem Show',
            'The Chronic',
            'Straight Outta Compton',
            'Reasonable Doubt',
            'Super long name that should be truncated, we should see the dots at the very end, adding some more text here, should truncate at any second now, please truncate soon',
        ]}
        placeholder="Select an album"
        title="Album"
    />
);

export default SelectorDropdownExample;
