# DraggableList

This component exposes a draggable list for use in box-ui-elements.
It was initially written for use with MetadataView components.

It doesn't own its own `state`. Any changes in the ordering of the elements in the list will require the parent component to update and keep track of what order the elements are now in.


### Examples
**Draggable List with Checkboxes**
```
const DraggableListExamples = require('examples').DraggableListExamples;

const isDraggableViaHandle = true;
<DraggableListExamples isDraggableViaHandle={isDraggableViaHandle} />
```

// Note: the list data structure requires an ID/Uniqueness, the getItems method in DraggableListExamples creates an array of objects with unique ids
 
