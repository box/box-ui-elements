import { getMetadataTemplateNamespaceFqn, isSameMetadataTemplate } from '../utils/metadataTemplateIdentity';

describe('metadataTemplateIdentity', () => {
    describe('getMetadataTemplateNamespaceFqn', () => {
        test('prefers scope when present', () => {
            expect(
                getMetadataTemplateNamespaceFqn({
                    templateKey: 'contract',
                    scope: 'enterprise_123',
                    namespace: 'enterprise_123.legal',
                }),
            ).toBe('enterprise_123');
        });

        test('falls back to namespace when scope is absent', () => {
            expect(
                getMetadataTemplateNamespaceFqn({
                    templateKey: 'contract',
                    namespace: 'enterprise_123.legal',
                }),
            ).toBe('enterprise_123.legal');
        });
    });

    describe('isSameMetadataTemplate', () => {
        test('matches by templateKey and scope when both define scope', () => {
            expect(
                isSameMetadataTemplate(
                    { templateKey: 'contract', scope: 'enterprise_123' },
                    { templateKey: 'contract', scope: 'enterprise_123' },
                ),
            ).toBe(true);
        });

        test('does not match different scopes with the same templateKey', () => {
            expect(
                isSameMetadataTemplate(
                    { templateKey: 'contract', scope: 'enterprise_123' },
                    { templateKey: 'contract', scope: 'enterprise_999' },
                ),
            ).toBe(false);
        });

        test('matches when scopes differ but namespace FQNs agree (browser scope vs editor namespace)', () => {
            expect(
                isSameMetadataTemplate(
                    { templateKey: 'contract', scope: 'enterprise_123', namespace: 'enterprise_123.legal' },
                    { templateKey: 'contract', scope: 'enterprise_123.legal' },
                ),
            ).toBe(true);
        });

        test('matches namespace-only templates by namespace FQN', () => {
            expect(
                isSameMetadataTemplate(
                    { templateKey: 'contract', namespace: 'enterprise_123.legal' },
                    { templateKey: 'contract', namespace: 'enterprise_123.legal' },
                ),
            ).toBe(true);
        });

        test('does not collapse distinct child-namespace templates that share a templateKey', () => {
            // Regression for review feedback: undefined === undefined must not match.
            expect(
                isSameMetadataTemplate(
                    { templateKey: 'contract', namespace: 'enterprise_123.legal' },
                    { templateKey: 'contract', namespace: 'enterprise_123.hr' },
                ),
            ).toBe(false);
            expect(
                isSameMetadataTemplate({ templateKey: 'contract' }, { templateKey: 'contract' }),
            ).toBe(false);
        });

        test('does not match when either templateKey is missing', () => {
            expect(
                isSameMetadataTemplate(
                    { templateKey: 'contract', scope: 'enterprise_123' },
                    { scope: 'enterprise_123' },
                ),
            ).toBe(false);
            expect(
                isSameMetadataTemplate({ scope: 'enterprise_123' }, { templateKey: 'contract', scope: 'enterprise_123' }),
            ).toBe(false);
        });

        test('matches when one side stores the FQN in scope and the other in namespace', () => {
            expect(
                isSameMetadataTemplate(
                    { templateKey: 'contract', namespace: 'enterprise_123.legal' },
                    { templateKey: 'contract', scope: 'enterprise_123.legal' },
                ),
            ).toBe(true);
        });
    });
});
