import React from 'react';
import { shallow } from 'enzyme';
import LoadingIndicator from 'box-react-ui/lib/components/loading-indicator/LoadingIndicator';
import LoadingIndicatorWrapper from 'box-react-ui/lib/components/loading-indicator/LoadingIndicatorWrapper';
import MetadataInstanceEditor from 'box-react-ui/lib/features/metadata-instance-editor/MetadataInstanceEditor';
import InlineError from 'box-react-ui/lib/components/inline-error/InlineError';
import { MetadataSidebarComponent as MetadataSidebar } from '../MetadataSidebar';

describe('components/ContentSidebar/Metadata/MetadataSidebar', () => {
    const getWrapper = (props) => shallow(<MetadataSidebar {...props} />);

    test('should render Metadata sidebar component when instances and templates are available', () => {
        const getEditors = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getEditors
            })
        };
        const wrapper = getWrapper({
            file: {},
            api
        });
        wrapper.setState({ templates: [], editors: [] });
        expect(wrapper.find(LoadingIndicatorWrapper)).toHaveLength(1);
        expect(wrapper.find(MetadataInstanceEditor)).toHaveLength(1);
        expect(wrapper.find(LoadingIndicator)).toHaveLength(0);
        expect(wrapper.find(InlineError)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
        expect(getEditors).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });

    test('should render loading indicator component when templates are not available', () => {
        const getEditors = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getEditors
            })
        };
        const wrapper = getWrapper({
            file: {},
            api
        });
        wrapper.setState({ editors: [] });
        expect(wrapper.find(LoadingIndicatorWrapper)).toHaveLength(0);
        expect(wrapper.find(MetadataInstanceEditor)).toHaveLength(0);
        expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
        expect(wrapper.find(InlineError)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
        expect(getEditors).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });

    test('should render loading indicator component when instances are not available', () => {
        const getEditors = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getEditors
            })
        };
        const wrapper = getWrapper({
            file: {},
            api
        });
        wrapper.setState({ templates: [] });
        expect(wrapper.find(LoadingIndicatorWrapper)).toHaveLength(0);
        expect(wrapper.find(MetadataInstanceEditor)).toHaveLength(0);
        expect(wrapper.find(LoadingIndicator)).toHaveLength(1);
        expect(wrapper.find(InlineError)).toHaveLength(0);
        expect(wrapper).toMatchSnapshot();
        expect(getEditors).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });

    test('should render error when there was an error', () => {
        const getEditors = jest.fn();
        const api = {
            getMetadataAPI: jest.fn().mockReturnValueOnce({
                getEditors
            })
        };
        const wrapper = getWrapper({
            file: {},
            getViewer: jest.fn(),
            api
        });
        wrapper.setState({ hasError: true });
        expect(wrapper.find(LoadingIndicatorWrapper)).toHaveLength(0);
        expect(wrapper.find(MetadataInstanceEditor)).toHaveLength(0);
        expect(wrapper.find(LoadingIndicator)).toHaveLength(0);
        expect(wrapper.find(InlineError)).toHaveLength(1);
        expect(wrapper).toMatchSnapshot();
        expect(getEditors).toHaveBeenCalled();
        expect(api.getMetadataAPI).toHaveBeenCalled();
    });
});
