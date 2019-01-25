import React from 'react';

import DropCloud from '../DropCloud';

describe('features/security-cloud-game/DropCloud', () => {
    test('should correctly render', () => {
        const component = shallow(<DropCloud cloudSize={100} position={{ x: 10, y: 20 }} />);

        expect(component.hasClass('drop-cloud')).toBe(true);
        expect(component.prop('style')).toEqual({
            top: '20px',
            left: '10px',
        });
        expect(component.find('IconCloud').length).toEqual(1);
        expect(component.find('IconCloud').prop('height')).toEqual(100);
        expect(component.find('IconCloud').prop('width')).toEqual(100);
        expect(component.find('IconCloud').prop('filter')).toBeDefined();
        expect(component.find('IconCloud').prop('filter').id).toEqual('inset-shadow');
    });
});
