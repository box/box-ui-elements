import { hasSkills, isValidSkillsCard } from '../skillUtils';

describe('components/ContentSidebar/skillUtils/hasSkills', () => {
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
        expect(isValidSkillsCard({})).toBeFalsy();
        expect(hasSkills({ metadata: { global: { boxSkillsCards: {} } } })).toBeFalsy();
    });

    test('should return false when box skills cards empty', () => {
        expect(isValidSkillsCard({ entries: [] })).toBeTruthy();
        expect(hasSkills({ metadata: { global: { boxSkillsCards: { cards: [] } } } })).toBeFalsy();
    });

    test('should return true when box skills cards entries empty', () => {
        expect(
            hasSkills({
                metadata: {
                    global: {
                        boxSkillsCards: {
                            cards: [
                                {
                                    entries: []
                                }
                            ]
                        }
                    }
                }
            })
        ).toBeTruthy();
    });

    test('should return true when box skills cards has error', () => {
        expect(
            hasSkills({
                metadata: {
                    global: {
                        boxSkillsCards: {
                            cards: [
                                {
                                    error: 'error'
                                }
                            ]
                        }
                    }
                }
            })
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
                                    entries: [{}]
                                }
                            ]
                        }
                    }
                }
            })
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
                                    entries: []
                                },
                                {
                                    entries: [{}]
                                }
                            ]
                        }
                    }
                }
            })
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
                                    entries: []
                                },
                                {
                                    error: {}
                                }
                            ]
                        }
                    }
                }
            })
        ).toBeTruthy();
    });
});
