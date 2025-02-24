const Enzyme = require('enzyme');
const { mount, shallow } = require('enzyme');
const Adapter = require('@cfaester/enzyme-adapter-react-18');

// Configure Enzyme with React 18 adapter
Enzyme.configure({ adapter: new Adapter() });

// Make Enzyme functions available globally
global.shallow = shallow;
global.mount = mount;
global.Enzyme = Enzyme;

// Testing utility functions
global.queryAllByTestId = (wrapper, testid) => wrapper.find(`[data-testid="${testid}"]`);
