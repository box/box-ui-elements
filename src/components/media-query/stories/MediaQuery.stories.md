`import useMediaQuery from 'box-ui-elements/es/components/media-query/useMediaQuery';`

The `useMediaQuery` hook returns properties composed of specific media queries and view dimensions.
These properties can be used to implement custom component rendering or behavior.

## Return props

| Property     | Description                            |
| ------------ | -------------------------------------- |
| `anyHover`   | `hover`, `none`                        |
| `anyPointer` | `none`, `coarse`, `fine`               |
| `hover`      | `hover`, `none`                        |
| `pointer`    | `none`, `coarse`, `fine`               |
| `size`       | `small`, `medium`, `large`, `x-large`  |
| `viewHeight` | view height in px of last query change |
| `viewWidth`  | view width in px of last query change  |

## `size` properties

| Size      | Query                                        |
| --------- | -------------------------------------------- |
| `small`   | `(max-width: 374px)`                         |
| `medium`  | `(min-width: 375px) and (max-width: 767px)`  |
| `large`   | `(min-width: 768px) and (max-width: 1023px)` |
| `x-large` | `(min-width: 1024px)`                        |

## Demo

Change device size in "Canvas" or in browser developer tools
