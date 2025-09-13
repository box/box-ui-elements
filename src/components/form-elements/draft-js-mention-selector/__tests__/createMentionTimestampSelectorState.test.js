import { convertToRaw } from 'draft-js';
import createMentionTimestampSelectorState from '../createMentionTimestampSelectorState';

describe('components/form-elements/draft-js-mention-selector/createMentionTimestampSelectorState', () => {
    test('restores mentions from string', () => {
        const stringWithMentions = `Hey @[123:Jim], do this`;
        const editorState = createMentionTimestampSelectorState(stringWithMentions);
        const contentStateRaw = convertToRaw(editorState.getCurrentContent());

        expect(contentStateRaw.blocks[0].text).toEqual('Hey @Jim, do this');
        expect(contentStateRaw.entityMap[0].type).toEqual('MENTION');
        expect(contentStateRaw.entityMap[0].data.id).toEqual('123');
    });

    test('restores multiline mentions from string', () => {
        const stringWithMentions = `Hey @[456:Pam], do this\nand talk to @[789:Dwight]`;
        const editorState = createMentionTimestampSelectorState(stringWithMentions);
        const contentStateRaw = convertToRaw(editorState.getCurrentContent());

        expect(contentStateRaw.entityMap[0].type).toEqual('MENTION');
        expect(contentStateRaw.entityMap[0].data.id).toEqual('456');

        expect(contentStateRaw.entityMap[1].type).toEqual('MENTION');
        expect(contentStateRaw.entityMap[1].data.id).toEqual('789');

        expect(contentStateRaw.blocks).toEqual(
            expect.arrayContaining([expect.objectContaining({ text: `Hey @Pam, do this` })]),
        );
        expect(contentStateRaw.blocks).toEqual(
            expect.arrayContaining([expect.objectContaining({ text: `and talk to @Dwight` })]),
        );
    });

    test('restores timestamp from string', () => {
        const stringWithTimestamp = `#[timestamp:10000,versionId:123] comment timestamp`;
        const editorState = createMentionTimestampSelectorState(stringWithTimestamp);
        const contentStateRaw = convertToRaw(editorState.getCurrentContent());

        expect(contentStateRaw.entityMap[0].type).toEqual('UNEDITABLE_TIMESTAMP_TEXT');
        expect(contentStateRaw.entityMap[0].data.timestampInMilliseconds).toEqual(10000);
        expect(contentStateRaw.entityMap[0].data.fileVersionId).toEqual('123');

        expect(contentStateRaw.blocks).toEqual(
            expect.arrayContaining([expect.objectContaining({ text: `0:00:10 comment timestamp` })]),
        );
    });

    test('doesnt restore timestamp from string if it doesnt match the the proper format', () => {
        const stringWithTimestamp = `#[Timestamp:10000,VersionId:123] comment timestamp`;
        const editorState = createMentionTimestampSelectorState(stringWithTimestamp);
        const contentStateRaw = convertToRaw(editorState.getCurrentContent());
        expect(contentStateRaw.entityMap).toEqual({});
    });

    test('restores mentions and timestamp from string', () => {
        const stringWithMentionsAndTimestamp = `#[timestamp:10000,versionId:123] Hey @[123:Jim] you and @[456:Pam] check this out`;
        const editorState = createMentionTimestampSelectorState(stringWithMentionsAndTimestamp);
        const contentStateRaw = convertToRaw(editorState.getCurrentContent());

        expect(contentStateRaw.entityMap[0].type).toEqual('UNEDITABLE_TIMESTAMP_TEXT');
        expect(contentStateRaw.entityMap[0].data.timestampInMilliseconds).toEqual(10000);
        expect(contentStateRaw.entityMap[0].data.fileVersionId).toEqual('123');

        expect(contentStateRaw.entityMap[1].type).toEqual('MENTION');
        expect(contentStateRaw.entityMap[1].data.id).toEqual('123');

        expect(contentStateRaw.entityMap[2].type).toEqual('MENTION');
        expect(contentStateRaw.entityMap[2].data.id).toEqual('456');

        expect(contentStateRaw.blocks).toEqual(
            expect.arrayContaining([expect.objectContaining({ text: `0:00:10 Hey @Jim you and @Pam check this out` })]),
        );
    });

    test('restores mentions and timestamp from multiline string', () => {
        const stringWithMentionsAndTimestamp = `#[timestamp:10000,versionId:123] Hey @[123:Jim] you and @[456:Pam] check this out\n it's so cool and @[1906:Brian] you too`;
        const editorState = createMentionTimestampSelectorState(stringWithMentionsAndTimestamp);
        const contentStateRaw = convertToRaw(editorState.getCurrentContent());
        expect(contentStateRaw.entityMap[0].type).toEqual('UNEDITABLE_TIMESTAMP_TEXT');
        expect(contentStateRaw.entityMap[0].data.timestampInMilliseconds).toEqual(10000);
        expect(contentStateRaw.entityMap[0].data.fileVersionId).toEqual('123');
        expect(contentStateRaw.entityMap[1].type).toEqual('MENTION');
        expect(contentStateRaw.entityMap[1].data.id).toEqual('123');
        expect(contentStateRaw.entityMap[2].type).toEqual('MENTION');
        expect(contentStateRaw.entityMap[2].data.id).toEqual('456');
        expect(contentStateRaw.entityMap[3].type).toEqual('MENTION');
        expect(contentStateRaw.entityMap[3].data.id).toEqual('1906');
        expect(contentStateRaw.blocks).toEqual(
            expect.arrayContaining([expect.objectContaining({ text: `0:00:10 Hey @Jim you and @Pam check this out` })]),
        );
        expect(contentStateRaw.blocks).toEqual(
            expect.arrayContaining([expect.objectContaining({ text: ` it's so cool and @Brian you too` })]),
        );
    });
});
