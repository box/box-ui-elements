`import useViewportSize from 'box-ui-elements/es/components/media-query/useViewportSize';`

The `useViewportSize` hook returns the current viewport dimensions. Dimensions are updated upon resize.
These properties can be used to implement custom functionality based on viewport size.

## Arguments

| Property           | Description                                                      |
| ------------------ | ---------------------------------------------------------------- |
| `debounceInterval` | (Optional) argument to set debounce interval. Defaults to 200 ms |

## Return props

| Property     | Description                   |
| ------------ | ----------------------------- |
| `viewHeight` | current viewport height in px |
| `viewWidth`  | current viewport width in px  |

## Demo

Change the window or viewport size in "Canvas", by resizing, or in browser developer tools
