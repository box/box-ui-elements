/* eslint-disable import/no-extraneous-dependencies */
import 'core-js/es6/map';
import 'core-js/es6/set';
import 'raf/polyfill';
import 'mutationobserver-shim';
import Enzyme, { mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

// make Enzyme functions available in all test files without importing
global.shallow = shallow;
global.mount = mount;
