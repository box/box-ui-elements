/* eslint-disable no-unused-expressions */

import React from 'react';
import { mount, shallow } from 'enzyme';
import Sort from '../Sort';
import DropdownMenu from '../../DropdownMenu';
import { Menu, MenuItem } from '../../Menu';
import { Button } from '../../Button';
import { SORT_ASC, SORT_DESC } from '../../../constants';

const sandbox = sinon.sandbox.create();
let getLocalizedMessage;

describe('picker/components/Sort', () => {
    beforeEach(() => {
        getLocalizedMessage = sandbox.stub();
        getLocalizedMessage.withArgs('buik.sort.option.name.asc').returns('Name: A → Z');
        getLocalizedMessage.withArgs('buik.sort.option.name.desc').returns('Name: Z → A');
        getLocalizedMessage.withArgs('buik.sort.option.date.asc').returns('Date: Oldest → Newest');
        getLocalizedMessage.withArgs('buik.sort.option.date.desc').returns('Date: Newest → Oldest');
        getLocalizedMessage.withArgs('buik.sort.option.size.asc').returns('Size: Smallest → Largest');
        getLocalizedMessage.withArgs('buik.sort.option.size.desc').returns('Size: Largest → Smallest');
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
    });

    it('should render a button and menu with 6 menu items', () => {
        const wrapper = shallow(
            <Sort
                isLoaded={false}
                sortBy='name'
                sortDirection={SORT_ASC}
                getLocalizedMessage={getLocalizedMessage}
                onSortChange={sandbox.stub()}
            />
        );
        expect(wrapper.find(Button)).to.have.length(1);
        expect(wrapper.find(DropdownMenu)).to.have.length(1);
        expect(wrapper.find(Menu)).to.have.length(1);
        expect(wrapper.find(MenuItem)).to.have.length(6);
    });

    it('should render a select with 6 options', () => {
        const wrapper = shallow(
            <Sort
                isLoaded={false}
                sortBy='name'
                sortDirection={SORT_ASC}
                getLocalizedMessage={getLocalizedMessage}
                onSortChange={sandbox.stub()}
            />
        );
        const options = wrapper.find(MenuItem);
        expect(options).to.have.length(6);

        expect(options.at(0).childAt(0).text()).to.equal('<IconCheck />');
        expect(options.at(0).childAt(1).text()).to.equal('Name: A → Z');

        expect(options.at(1).childAt(0).text()).to.equal('');
        expect(options.at(1).childAt(1).text()).to.equal('Name: Z → A');

        expect(options.at(2).childAt(0).text()).to.equal('');
        expect(options.at(2).childAt(1).text()).to.equal('Date: Oldest → Newest');

        expect(options.at(3).childAt(0).text()).to.equal('');
        expect(options.at(3).childAt(1).text()).to.equal('Date: Newest → Oldest');

        expect(options.at(4).childAt(0).text()).to.equal('');
        expect(options.at(4).childAt(1).text()).to.equal('Size: Smallest → Largest');

        expect(options.at(5).childAt(0).text()).to.equal('');
        expect(options.at(5).childAt(1).text()).to.equal('Size: Largest → Smallest');
    });

    it('should pass correct parameters when clicked', () => {
        const sort = sandbox.stub();
        const wrapper = shallow(
            <Sort
                isLoaded={false}
                sortBy='name'
                sortDirection={SORT_ASC}
                getLocalizedMessage={getLocalizedMessage}
                onSortChange={sort}
            />
        );
        const options = wrapper.find(MenuItem);

        options.at(0).simulate('click');
        expect(sort.withArgs('name', SORT_ASC)).to.be.called;

        options.at(1).simulate('click');
        expect(sort.withArgs('name', SORT_DESC)).to.be.called;

        options.at(2).simulate('click');
        expect(sort.withArgs('modified_at', SORT_ASC)).to.be.called;

        options.at(3).simulate('click');
        expect(sort.withArgs('modified_at', SORT_DESC)).to.be.called;

        options.at(4).simulate('click');
        expect(sort.withArgs('size', SORT_ASC)).to.be.called;

        options.at(5).simulate('click');
        expect(sort.withArgs('size', SORT_DESC)).to.be.called;
    });

    it('should render a select with correct option selected', () => {
        const wrapper = shallow(
            <Sort
                isLoaded={false}
                sortBy='modified_at'
                sortDirection={SORT_DESC}
                getLocalizedMessage={getLocalizedMessage}
                onSortChange={sandbox.stub()}
            />
        );
        const options = wrapper.find(MenuItem);
        expect(options).to.have.length(6);

        expect(options.at(3).childAt(0).text()).to.equal('<IconCheck />');
        expect(options.at(3).childAt(1).text()).to.equal('Date: Newest → Oldest');
    });

    it('should render a disabled button when isLoaded is false', () => {
        const wrapper = shallow(
            <Sort
                isLoaded={false}
                sortBy='name'
                sortDirection={SORT_ASC}
                getLocalizedMessage={getLocalizedMessage}
                onSortChange={sandbox.stub()}
            />
        );
        expect(wrapper.find(Button).prop('isDisabled')).to.equal(true);
    });

    it('should render a non-disabled button when isLoaded is true', () => {
        const wrapper = mount(
            <Sort
                isLoaded
                sortBy='name'
                sortDirection={SORT_ASC}
                getLocalizedMessage={getLocalizedMessage}
                onSortChange={sandbox.stub()}
            />
        );
        expect(wrapper.find(Button).prop('isDisabled')).to.equal(false);
    });
});
