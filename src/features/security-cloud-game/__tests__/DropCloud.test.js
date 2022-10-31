import React from 'react';
import Logo from '../../../components/logo';

import DropCloud from '../DropCloud';

describe('features/security-cloud-game/DropCloud', () => {
    test('should correctly render', () => {
        const wrapper = shallow(<DropCloud cloudSize={100} position={{ x: 10, y: 20 }} />);

        expect(wrapper.hasClass('bdl-DropCloud')).toBe(true);
        expect(wrapper.prop('style')).toEqual({
            top: '20px',
            left: '10px',
        });
        expect(wrapper.exists('IconCloud')).toBe(true);
        expect(wrapper.find('IconCloud').prop('height')).toEqual(100);
        expect(wrapper.find('IconCloud').prop('width')).toEqual(100);
        expect(wrapper.find('IconCloud').prop('title').props.id).toEqual('boxui.securityCloudGame.target');
        expect(wrapper.find('IconCloud').prop('filter')).toBeDefined();
        expect(wrapper.find('IconCloud').prop('filter').id).toEqual('inset-shadow');
        expect(wrapper.find(Logo).prop('title')).toEqual('Box');
    });
});
