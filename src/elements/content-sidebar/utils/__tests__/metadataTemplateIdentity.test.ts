import { deriveMetadataTemplateKey, resolveCreateMetadataTemplateKey } from '../metadataTemplateIdentity';

describe('elements/content-sidebar/utils/metadataTemplateIdentity', () => {
    describe('deriveMetadataTemplateKey()', () => {
        test.each`
            displayName             | expected
            ${'NDA'}                | ${'nda'}
            ${'Invoice Details'}    | ${'invoiceDetails'}
            ${'  Job Requisition'}  | ${'jobRequisition'}
            ${'Q3 2026 Report'}     | ${'q32026Report'}
            ${'Legal / Contracts'}  | ${'legalContracts'}
            ${'---'}                | ${''}
            ${''}                   | ${''}
            ${'日本語テンプレート'} | ${''}
            ${'قالب'}               | ${''}
            ${'🎉🎉'}               | ${''}
        `('should derive $expected from $displayName', ({ displayName, expected }) => {
            expect(deriveMetadataTemplateKey(displayName)).toBe(expected);
        });
    });

    describe('resolveCreateMetadataTemplateKey()', () => {
        test('should prefer an explicit templateKey', () => {
            expect(
                resolveCreateMetadataTemplateKey({ displayName: 'Invoice Details', templateKey: 'custom_key' }),
            ).toBe('custom_key');
        });

        test('should derive from displayName when templateKey is empty', () => {
            expect(resolveCreateMetadataTemplateKey({ displayName: 'Invoice Details', templateKey: '' })).toBe(
                'invoiceDetails',
            );
        });

        test('should return empty when neither an explicit key nor ASCII letters/digits exist', () => {
            expect(resolveCreateMetadataTemplateKey({ displayName: '日本語', templateKey: '  ' })).toBe('');
        });
    });
});
