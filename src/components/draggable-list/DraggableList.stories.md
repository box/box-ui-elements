`import DraggableList, { ButtonType } from 'box-ui-elements/es/components/draggable-list';`

This component exposes a draggable list for use in Box UI Elements. It was initially written for use with `MetadataView` components.

It doesn't own its own `state`. Any changes in the ordering of the elements in the list will require the parent component to update and keep track of the new order of the elements.

The getItems method in the example creates an array of objects with unique IDs. [The code for the example is available here.](https://github.com/box/box-ui-elements/blob/master/examples/src/DraggableListExamples.tsx)
