import { deriveMetadataTemplateKey } from '../metadataTemplateIdentity';

describe('elements/content-sidebar/utils/metadataTemplateIdentity', () => {
    describe('deriveMetadataTemplateKey()', () => {
        test.each`
            displayName             | expected
            ${'NDA'}                | ${'nda'}
            ${'Invoice Details'}    | ${'invoiceDetails'}
            ${'Invoice 2026'}       | ${'invoice2026'}
            ${'  Job Requisition'}  | ${'jobRequisition'}
            ${'Q3 2026 Report'}     | ${'q32026Report'}
            ${'Legal / Contracts'}  | ${'legalContracts'}
            ${'Product 製品'}       | ${'product'}
            ${'---'}                | ${''}
            ${''}                   | ${''}
            ${'日本語テンプレート'} | ${''}
            ${'قالب'}               | ${''}
            ${'🎉🎉'}               | ${''}
        `('should derive $expected from $displayName', ({ displayName, expected }) => {
            expect(deriveMetadataTemplateKey(displayName)).toBe(expected);
        });
    });
});
