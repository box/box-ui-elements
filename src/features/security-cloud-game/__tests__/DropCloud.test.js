import React from 'react';
import logo from '../../../components/logo';

import DropCloud from '../DropCloud';

describe('features/security-cloud-game/DropCloud', () => {
    test('should correctly render', () => {
        const wrapper = shallow(<DropCloud cloudSize={100} position={{ x: 10, y: 20 }} />);

        expect(wrapper.hasClass('bdl-DropCloud')).toBe(true);
        expect(wrapper.prop('style')).toEqual({
            top: '20px',
            left: '10px',
        });
        expect(wrapper.find('IconCloud').length).toEqual(1);
        expect(wrapper.find('IconCloud').prop('height')).toEqual(100);
        expect(wrapper.find('IconCloud').prop('width')).toEqual(100);
        expect(wrapper.find('IconCloud').prop('title').props.id).toEqual('boxui.securityCloudGame.target');
        expect(wrapper.find('IconCloud').prop('filter')).toBeDefined();
        expect(wrapper.find('IconCloud').prop('filter').id).toEqual('inset-shadow');
        expect(wrapper.find(logo).prop('title')).toEqual('Box');
    });
});
