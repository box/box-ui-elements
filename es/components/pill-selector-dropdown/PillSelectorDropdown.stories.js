/* eslint-disable react-hooks/rules-of-hooks */
import * as React from 'react';
import ContactDatalistItem from '../contact-datalist-item';
import PillSelectorDropdown from './PillSelectorDropdown';
import notes from './PillSelectorDropdown.notes.md';
import './PillSelectorDropdown.stories.scss';
const users = [{
  id: 0,
  name: 'bob@foo.bar'
}, {
  id: 1,
  name: 'sally@foo.bar',
  isExternalUser: true
}, {
  id: 2,
  name: 'jean@foo.bar'
}, {
  id: 3,
  name: 'longlonglonglonglonglonglonglonglonglonglonglongemail@foo.bar'
}, {
  id: 4,
  name: 'anotherlonglonglonglonglonglonglonglonglonglonglonglongemail@foo.bar'
}, {
  id: 5,
  name: 'aaa@foo.bar'
}, {
  id: 6,
  name: 'bbb@foo.bar'
}, {
  id: 7,
  name: 'ccc@foo.bar'
}];
function generateProps({
  setError,
  selectedOptions,
  setSelectedOptions,
  selectorOptions,
  setSelectorOptions
}) {
  const handleInput = value => {
    const newSelectorOptions = [];
    if (value !== '') {
      users.forEach(user => {
        if (user.name.toLowerCase().indexOf(value.toLowerCase()) !== -1) {
          selectorOptions.push({
            displayText: user.name,
            value: user.id
          });
        }
      });
    }
    // As user is typing, reset error and update selectorOptions
    setSelectorOptions(newSelectorOptions);
    setError('');
  };
  const handleSelect = pills => {
    setSelectedOptions([...selectedOptions, ...pills]);
  };
  const handleRemove = (option, index) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions.splice(index, 1);
    setSelectedOptions(newSelectedOptions);
  };
  const validator = text => {
    // email input validation
    const pattern = /^[^\s<>@,]+@[^\s<>@,/\\]+\.[^\s<>@,]+$/i;
    return pattern.test(text);
  };
  const validateForError = text => {
    const count = selectedOptions.length;
    let error = '';
    if (!text && count === 0) {
      error = 'Field Required';
    } else if (text && !validator(text)) {
      error = 'Invalid Email Address';
    }
    setError(error);
  };
  return {
    handleInput,
    handleRemove,
    handleSelect,
    validator,
    validateForError
  };
}
export const empty = () => {
  const [error, setError] = React.useState('');
  const [selectedOptions, setSelectedOptions] = React.useState([]);
  const [selectorOptions, setSelectorOptions] = React.useState([]);
  const {
    handleInput,
    handleRemove,
    handleSelect,
    validator,
    validateForError
  } = generateProps({
    setError,
    selectedOptions,
    setSelectedOptions,
    selectorOptions,
    setSelectorOptions
  });
  return /*#__PURE__*/React.createElement(PillSelectorDropdown, {
    allowCustomPills: true,
    error: error,
    placeholder: "Names or email addresses",
    onInput: handleInput,
    onRemove: handleRemove,
    onSelect: handleSelect,
    selectedOptions: selectedOptions,
    selectorOptions: selectorOptions,
    validateForError: validateForError,
    validator: validator
  }, selectorOptions.map(option => /*#__PURE__*/React.createElement(ContactDatalistItem, {
    key: option.value,
    name: option.displayText
  }, option.displayText)));
};
export const withPills = () => {
  const [error, setError] = React.useState('');
  const [selectedOptions, setSelectedOptions] = React.useState([{
    displayText: users[2].name,
    value: users[2].name
  }, {
    displayText: users[1].name,
    value: users[1].name
  }, {
    displayText: users[4].name,
    value: users[4].name
  }]);
  const [selectorOptions, setSelectorOptions] = React.useState([]);
  const {
    handleInput,
    handleRemove,
    handleSelect,
    validator,
    validateForError
  } = generateProps({
    setError,
    selectedOptions,
    setSelectedOptions,
    selectorOptions,
    setSelectorOptions
  });
  return /*#__PURE__*/React.createElement(PillSelectorDropdown, {
    allowCustomPills: true,
    error: error,
    placeholder: "Names or email addresses",
    onInput: handleInput,
    onRemove: handleRemove,
    onSelect: handleSelect,
    selectedOptions: selectedOptions,
    selectorOptions: selectorOptions,
    validateForError: validateForError,
    validator: validator
  }, selectorOptions.map(option => /*#__PURE__*/React.createElement(ContactDatalistItem, {
    key: option.value,
    name: option.value
  }, option.displayText)));
};
export const showRoundedPills = () => {
  const [error, setError] = React.useState('');
  const [selectedOptions, setSelectedOptions] = React.useState([{
    displayText: users[2].name,
    value: users[2].name
  }, {
    displayText: users[1].name,
    value: users[1].name
  }, {
    displayText: users[4].name,
    value: users[4].name
  }]);
  const [selectorOptions, setSelectorOptions] = React.useState([]);
  const {
    handleInput,
    handleRemove,
    handleSelect,
    validator,
    validateForError
  } = generateProps({
    setError,
    selectedOptions,
    setSelectedOptions,
    selectorOptions,
    setSelectorOptions
  });
  return /*#__PURE__*/React.createElement(PillSelectorDropdown, {
    allowCustomPills: true,
    error: error,
    placeholder: "Names or email addresses",
    onInput: handleInput,
    onRemove: handleRemove,
    onSelect: handleSelect,
    selectedOptions: selectedOptions,
    selectorOptions: selectorOptions,
    showRoundedPills: true,
    validateForError: validateForError,
    validator: validator
  }, selectorOptions.map(option => /*#__PURE__*/React.createElement(ContactDatalistItem, {
    key: option.value,
    name: option.value
  }, option.displayText)));
};
export const showAvatars = () => {
  const [error, setError] = React.useState('');
  const [selectedOptions, setSelectedOptions] = React.useState([{
    text: users[2].name,
    value: users[2].name,
    id: users[2].id
  }, {
    text: users[1].name,
    value: users[1].name,
    id: users[1].id,
    isExternalUser: users[1].isExternalUser
  }, {
    text: users[3].name,
    value: users[3].name,
    id: users[3].id
  }]);
  const [selectorOptions, setSelectorOptions] = React.useState([]);
  const {
    handleInput,
    handleRemove,
    handleSelect,
    validator,
    validateForError
  } = generateProps({
    setError,
    selectedOptions,
    setSelectedOptions,
    selectorOptions,
    setSelectorOptions
  });
  return /*#__PURE__*/React.createElement(PillSelectorDropdown, {
    allowCustomPills: true,
    error: error,
    placeholder: "Names or email addresses",
    onInput: handleInput,
    onRemove: handleRemove,
    onSelect: handleSelect,
    selectedOptions: selectedOptions,
    selectorOptions: selectorOptions,
    showAvatars: true,
    showRoundedPills: true,
    validateForError: validateForError,
    validator: validator
  }, selectorOptions.map(option => /*#__PURE__*/React.createElement(ContactDatalistItem, {
    key: option.value,
    name: option.value
  }, option.displayText)));
};
export const customPillStyles = () => {
  /**
   * NOTE: For consistent styling, use bdl-RoundPill mixin when creating custom pill classes.
   *
   * Example:
   *
   *    .bdl-RoundPill {
   *       &.is-custom {
   *         @include bdl-RoundPill($border-color: $bdl-watermelon-red-50, $selected-border-color: $bdl-watermelon-red-50);
   *       }
   *     }
   *
   *
   */
  const getPillClassName = ({
    value
  }) => {
    switch (value) {
      case '2':
        return 'is-custom';
      default:
        return '';
    }
  };
  const [error, setError] = React.useState('');
  const [selectedOptions, setSelectedOptions] = React.useState([{
    displayText: 'default@example.com',
    value: '1'
  }, {
    displayText: 'custom@example.com',
    value: '2'
  }]);
  const [selectorOptions, setSelectorOptions] = React.useState([]);
  const {
    handleInput,
    handleRemove,
    handleSelect,
    validator,
    validateForError
  } = generateProps({
    setError,
    selectedOptions,
    setSelectedOptions,
    selectorOptions,
    setSelectorOptions
  });
  return /*#__PURE__*/React.createElement(PillSelectorDropdown, {
    allowCustomPills: true,
    error: error,
    getPillClassName: getPillClassName,
    placeholder: "Names or email addresses",
    onInput: handleInput,
    onRemove: handleRemove,
    onSelect: handleSelect,
    selectedOptions: selectedOptions,
    selectorOptions: selectorOptions,
    showRoundedPills: true,
    validateForError: validateForError,
    validator: validator
  }, selectorOptions.map(option => /*#__PURE__*/React.createElement(ContactDatalistItem, {
    key: option.value,
    name: option.displayText
  }, option.displayText)));
};
export default {
  title: 'Components/PillSelectorDropdown',
  component: PillSelectorDropdown,
  parameters: {
    notes
  }
};
//# sourceMappingURL=PillSelectorDropdown.stories.js.map