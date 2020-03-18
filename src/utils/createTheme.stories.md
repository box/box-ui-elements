```js
import { createTheme } from 'box-ui-elements/es/utils/createTheme';
import styled, { ThemeProvider } from 'styled-components';

const hexColor = '#123456';
const theme = createTheme(hexColor);

<ThemeProvider theme={theme}>
  <MyApp />
</ThemeProvider>;
```
