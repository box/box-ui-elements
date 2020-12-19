### Description

This component requires an array of `categories`. Each category is an object with the properties `value` and `displayText`. You can identify the initial selected category by passing in the optional prop `currentCategory`. To get the value of the selected category when the user selects a new category, use the `onSelect` event handler to update state.

### Examples

```
const categories = [
    {
        value: 'all',
        displayText: 'All',
    },
    {
        value: 'legal',
        displayText: 'Legal',
    },
    {
        value: 'marketing',
        displayText: 'Marketing',
    },
    {
        value: 'hr',
        displayText: 'HR',
    },
    {
        value: 'bizops',
        displayText: 'Business Operations',
    },
    {
        value: 'sales',
        displayText: 'Sales',
    },
    {
        value: 'finance',
        displayText: 'Finance',
    },
];

const CategorySelectorContainer = () => {
    const [category, setCategory] = React.useState(categories[0].value);

    return (
        <CategorySelector
            currentCategory={category}
            categories={categories}
            onSelect={(value) => setCategory(value)}
        />
    );
}

<CategorySelectorContainer />
```
