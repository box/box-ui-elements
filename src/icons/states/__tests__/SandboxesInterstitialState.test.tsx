import * as React from 'react';
import { shallow } from 'enzyme';
import SandboxesInterstitialState from '../SandboxesInterstitialState';

describe('icons/states/SandboxesInterstitialState', () => {
    test('should correctly render default icon with default colors', () => {
        const wrapper = shallow(<SandboxesInterstitialState />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified color', () => {
        const wrapper = shallow(<SandboxesInterstitialState primaryColor="#fcfcfc" secondaryColor="#eee" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with specified width and height and default viewBox value', () => {
        const wrapper = shallow(<SandboxesInterstitialState height={200} width={200} />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with title', () => {
        const wrapper = shallow(<SandboxesInterstitialState title="abcde" />);
        expect(wrapper).toMatchSnapshot();
    });

    test('should correctly render icon with custom class name', () => {
        const wrapper = shallow(<SandboxesInterstitialState className="interstitial" />);
        expect(wrapper).toMatchSnapshot();
    });
});
