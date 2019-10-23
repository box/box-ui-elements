import PropTypes from 'prop-types';
import React, { Children, Component } from 'react';

import DatalistItem from '../../src/components/datalist-item';
import SelectorDropdown from '../../src/components/selector-dropdown';
import TextInput from '../../src/components/text-input';

const InputContainer = ({ inputProps, ...rest }) => <TextInput {...inputProps} {...rest} />;
InputContainer.propTypes = { inputProps: PropTypes.object };

class SelectorDropdownContainer extends Component {
    static propTypes = {
        initialItems: PropTypes.array.isRequired,
        placeholder: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            filterText: '',
            items: props.initialItems,
        };
    }

    handleUserInput = event => {
        this.filterByItem(event.target.value);
    };

    handleItemSelection = i => {
        this.setState({ filterText: this.state.items[i] });
    };

    filterByItem(item) {
        this.setState({ filterText: item });
        this.filterItems(item);
    }

    filterItems(filterText) {
        const { initialItems } = this.props;
        const filterTextLowerCase = filterText.toLowerCase();
        const items = [];

        initialItems.forEach(item => {
            if (item.toLowerCase().indexOf(filterTextLowerCase) !== -1) {
                items.push(item);
            }
        });

        this.setState({ items });
    }

    render() {
        const { placeholder, title } = this.props;
        const { filterText, items } = this.state;
        const dropdownTitle = <div>This is a Title</div>;

        return (
            <div style={{ paddingBottom: '330px' }}>
                <SelectorDropdown
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
                >
                    {Children.map(items, item => (
                        <DatalistItem key={item}>{item}</DatalistItem>
                    ))}
                </SelectorDropdown>
                <br />
                <h2>Selector Dropdown with title passed in</h2>
                <SelectorDropdown
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
                    title={dropdownTitle}
                >
                    {Children.map(items, item => (
                        <DatalistItem key={item}>{item}</DatalistItem>
                    ))}
                </SelectorDropdown>
                <br />
                <h2>Selector Dropdown with dropdown always open</h2>
                <SelectorDropdown
                    isAlwaysOpen
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
                >
                    {Children.map(items, item => (
                        <DatalistItem key={item}>{item}</DatalistItem>
                    ))}
                </SelectorDropdown>
            </div>
        );
    }
}

const SelectorDropdownExamples = () => (
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

SelectorDropdownExamples.displayName = 'SelectorDropdownExamples';

export default SelectorDropdownExamples;
