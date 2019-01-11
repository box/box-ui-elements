import { hasSkills, isValidSkillsCard } from '../skillUtils';

describe('elements/content-sidebar/skillUtils', () => {
    describe('isValidSkillsCard()', () => {
        test('should return false when no box skills cards', () => {
            expect(isValidSkillsCard({}, {})).toBeFalsy();
        });

        test('should return true when box skills cards empty', () => {
            expect(isValidSkillsCard({}, { entries: [] })).toBeTruthy();
        });

        test('should return true when file version doesnt exist on skills', () => {
            expect(isValidSkillsCard({ file_version: { id: 'fvid' } }, { entries: [] })).toBeTruthy();
        });

        test('should return false when file version doesnt match with skills', () => {
            expect(isValidSkillsCard({ file_version: { id: 'fvid' } }, { file_version: {}, entries: [] })).toBeFalsy();
        });

        test('should return true when file version matches with skills', () => {
            expect(
                isValidSkillsCard({ file_version: { id: 'fvid' } }, { file_version: { id: 'fvid' }, entries: [] }),
            ).toBeTruthy();
        });
    });
    describe('hasSkills()', () => {
        test('should return false when no file', () => {
            expect(hasSkills()).toBeFalsy();
        });

        test('should return false when no metadata', () => {
            expect(hasSkills({})).toBeFalsy();
        });

        test('should return false when no global metadata', () => {
            expect(hasSkills({ metadata: {} })).toBeFalsy();
        });

        test('should return false when no global metadata box skills template', () => {
            expect(hasSkills({ metadata: { global: {} } })).toBeFalsy();
        });

        test('should return false when no box skills cards', () => {
            expect(hasSkills({ metadata: { global: { boxSkillsCards: {} } } })).toBeFalsy();
        });

        test('should return false when box skills cards empty', () => {
            expect(
                hasSkills({
                    metadata: { global: { boxSkillsCards: { cards: [] } } },
                }),
            ).toBeFalsy();
        });

        test('should return true when box skills cards entries empty', () => {
            expect(
                hasSkills({
                    metadata: {
                        global: {
                            boxSkillsCards: {
                                cards: [
                                    {
                                        entries: [],
                                    },
                                ],
                            },
                        },
                    },
                }),
            ).toBeTruthy();
        });

        test('should return true when box skills cards has status error', () => {
            expect(
                hasSkills({
                    metadata: {
                        global: {
                            boxSkillsCards: {
                                cards: [
                                    {
                                        status: 'error',
                                    },
                                ],
                            },
                        },
                    },
                }),
            ).toBeTruthy();
        });

        test('should return true when box skills cards entries have data', () => {
            expect(
                hasSkills({
                    metadata: {
                        global: {
                            boxSkillsCards: {
                                cards: [
                                    {
                                        entries: [{}],
                                    },
                                ],
                            },
                        },
                    },
                }),
            ).toBeTruthy();
        });

        test('should return true when even one box skills cards entries have data', () => {
            expect(
                hasSkills({
                    metadata: {
                        global: {
                            boxSkillsCards: {
                                cards: [
                                    {
                                        entries: [],
                                    },
                                    {
                                        entries: [{}],
                                    },
                                ],
                            },
                        },
                    },
                }),
            ).toBeTruthy();
        });

        test('should return true when even one box skills cards entries has error', () => {
            expect(
                hasSkills({
                    metadata: {
                        global: {
                            boxSkillsCards: {
                                cards: [
                                    {
                                        entries: [],
                                    },
                                    {
                                        error: {},
                                    },
                                ],
                            },
                        },
                    },
                }),
            ).toBeTruthy();
        });
    });
});
