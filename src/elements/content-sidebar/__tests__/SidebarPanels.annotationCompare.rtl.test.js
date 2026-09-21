// Integration test for the side-by-side version compare flow: clicking an annotation on the
// compared (older-version) pane emits `annotations_active_change` on the shared annotator
// event manager. The main pane's withAnnotations picks it up, withSidebarAnnotations pushes
// the annotation thread path, and every resulting onVersionChange call must carry
// `origin: 'annotation'` so a comparing ContentPreview can suppress them and keep the
// comparison open (see ContentPreview.onVersionChange).
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

    test('pushes the annotations path and tags all version changes with an annotation origin', () => {
        // Mirror the production SidebarPanels composition: withSidebarAnnotations inside,
        // withAnnotatorContext outside, router outermost.
        const SidebarChain = withRouter(withAnnotatorContext(withSidebarAnnotations(SidebarPanelsComponent)));

        let capturedOnAnnotator = null;
        const onVersionChange = jest.fn();

        // Versions panel is open on the compared (older) version, like when compare is open
        const history = createMemoryHistory({ initialEntries: ['/activity/versions/OLD'] });

        // Stand-in for ContentPreview: captures the onAnnotator injected by withAnnotations
        // and renders the sidebar chain, like ContentPreview renders ContentSidebar.
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

        // Stand-in for the main pane's annotator; delegates to the process-wide EventManager
        // singleton in production, so it receives events emitted by the compared pane's store.
        const annotator = new EventEmitter();
        act(() => {
            capturedOnAnnotator(annotator);
        });

        // Simulate the compared-pane annotation click: its store emits ACTIVE_CHANGE
        // with the compared (older) file version id.
        act(() => {
            annotator.emit('annotations_active_change', { annotationId: 'ann1', fileVersionId: 'OLD' });
        });

        // The sidebar must switch from the versions panel to the annotation thread
        expect(history.location.pathname).toBe('/activity/annotations/OLD/ann1');

        // SidebarPanels resets the version on leaving the versions route, and
        // withSidebarAnnotations reports the annotation's version; both must be tagged
        // with origin 'annotation' so a comparing ContentPreview suppresses them.
        expect(onVersionChange).toHaveBeenCalled();
        onVersionChange.mock.calls.forEach(([, additionalVersionInfo]) => {
            expect(additionalVersionInfo).toMatchObject({ origin: 'annotation' });
        });
        expect(onVersionChange).toHaveBeenCalledWith(null, { origin: 'annotation' });
        expect(onVersionChange).toHaveBeenCalledWith(
            oldVersion,
            expect.objectContaining({ currentVersionId: 'CURRENT', origin: 'annotation' }),
        );
    });
});
