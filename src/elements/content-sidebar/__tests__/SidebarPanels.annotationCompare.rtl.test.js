// Compared-pane thread click must tag every onVersionChange with triggeredBy: 'annotation'.
import * as React from 'react';
import { EventEmitter } from 'events';
import { Router, withRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, act } from '../../../test-utils/testing-library';
import { SidebarPanelsComponent } from '../SidebarPanels';
import withSidebarAnnotations from '../withSidebarAnnotations';
import withAnnotations from '../../common/annotator-context/withAnnotations';
import withAnnotatorContext from '../../common/annotator-context/withAnnotatorContext';

jest.mock('../SidebarUtils');

describe('compared-pane annotation click -> sidebar switches to the annotation thread', () => {
    const file = {
        id: 'f1',
        file_version: { id: 'CURRENT' },
    };

    const oldVersion = { type: 'file_version', id: 'OLD' };
    const feedAPI = {
        getCachedItems: jest.fn().mockReturnValue({ items: [oldVersion] }),
    };
    const api = { getFeedAPI: () => feedAPI };

    test('pushes the annotations path and tags all version changes as triggered by an annotation', () => {
        const SidebarChain = withRouter(withAnnotatorContext(withSidebarAnnotations(SidebarPanelsComponent)));

        let capturedOnAnnotator = null;
        const onVersionChange = jest.fn();

        const history = createMemoryHistory({ initialEntries: ['/activity/versions/OLD'] });

        const Inner = props => {
            capturedOnAnnotator = props.onAnnotator;
            return (
                <Router history={history}>
                    <SidebarChain
                        api={api}
                        customSidebarPanels={[]}
                        elementId="test"
                        file={file}
                        fileId="f1"
                        hasActivity
                        hasVersions
                        isOpen
                        onVersionChange={onVersionChange}
                    />
                </Router>
            );
        };

        const Wrapped = withAnnotations(Inner);
        render(<Wrapped onAnnotator={jest.fn()} onPreviewDestroy={jest.fn()} />);

        expect(capturedOnAnnotator).toEqual(expect.any(Function));

        const annotator = new EventEmitter();
        act(() => {
            capturedOnAnnotator(annotator);
        });

        act(() => {
            annotator.emit('annotations_active_change', { annotationId: 'ann1', fileVersionId: 'OLD' });
        });

        expect(history.location.pathname).toBe('/activity/annotations/OLD/ann1');

        expect(onVersionChange).toHaveBeenCalled();
        onVersionChange.mock.calls.forEach(([, additionalVersionInfo]) => {
            expect(additionalVersionInfo).toMatchObject({ triggeredBy: 'annotation' });
        });
        expect(onVersionChange).toHaveBeenCalledWith(null, { triggeredBy: 'annotation' });
        expect(onVersionChange).toHaveBeenCalledWith(
            oldVersion,
            expect.objectContaining({ currentVersionId: 'CURRENT', triggeredBy: 'annotation' }),
        );
    });
});
