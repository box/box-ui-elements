/**
 * @flow
 * @file File for some simple dom utilities
 * @author Box
 */

import omit from 'lodash/omit';
import getProp from 'lodash/get';
import type {
    FlattenedMetadataQueryResponseEntry,
    MetadataQueryResponse,
    MetadataQueryResponseEntry,
    MetadataQueryResponseEntryMetadata,
} from '../common/types/metadataQueries';
import { ITEM_TYPE_FILE } from '../common/constants';

const convertMetadata = (metadata: MetadataQueryResponseEntryMetadata) => {
    let md = {};

    Object.keys(metadata).forEach(scope => {
        Object.keys(metadata[scope]).forEach(templateKey => {
            const nonconformingInstance = metadata[scope][templateKey];
            const data = omit(nonconformingInstance, [
                '$id',
                '$parent',
                '$type',
                '$typeScope',
                '$typeVersion',
                '$version',
            ]);

            md = {
                data,
                id: nonconformingInstance.$id,
                metadataTemplate: {
                    type: 'metadata-template',
                    templateKey,
                },
            };
        });
    });

    return md;
};

const convertEntry = ({ item, metadata }: MetadataQueryResponseEntry): FlattenedMetadataQueryResponseEntry => {
    const { id, name, size } = item;

    return {
        id,
        metadata: convertMetadata(metadata),
        name,
        size,
    };
};

const convertEntries = (entries: Array<MetadataQueryResponseEntry>) =>
    entries
        .filter(entry => getProp(entry, 'item.type') === ITEM_TYPE_FILE) // return only file items
        .map<FlattenedMetadataQueryResponseEntry>(entry => convertEntry(entry));

const flattenResponse = ({ entries, next_marker }: MetadataQueryResponse) => {
    return {
        items: convertEntries(entries),
        nextMarker: next_marker,
    };
};

export default flattenResponse;
