/**
 * @flow
 * @file Dynamic import of the optional box-content-preview peer
 * @author Box
 */

export type BoxContentPreviewModule = { Preview?: any };

export async function loadBoxContentPreview(): Promise<BoxContentPreviewModule> {
    const [previewModule] = await Promise.all([
        import(/* webpackChunkName: "box-content-preview" */ 'box-content-preview'),
        import(/* webpackChunkName: "box-content-preview" */ 'box-content-preview/styles.css'),
    ]);
    return previewModule;
}
