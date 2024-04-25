/* eslint-disable import/no-extraneous-dependencies */
import 'core-js/es/map';
import 'core-js/es/set';
import 'raf/polyfill';
import 'mutationobserver-shim';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';

Enzyme.configure({ adapter: new Adapter() });

// make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.mount = mount;

// testing utility functions

// accepts a Cheerio jQuery-style wrapper or Enzyme mount wrapper
global.queryAllByTestId = (wrapper, testid) => wrapper.find(`[data-testid="${testid}"]`);
