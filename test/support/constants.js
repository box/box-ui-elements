export const testFileIds = {
    FILE_ID_DOC: '415542803939',
    FILE_ID_VIDEO: '416047501580',
    FILE_ID_SKILLS: '441214355821',
    FILE_ID_DOC_VERSIONED: '419633225047',
    FILE_ID_DOC_ANNOTATIONS: '733459462002',
    FIRST_FILE_NAME: 'Sample 3D.box3d',
};

// Only set cypress.env in cypress context, i.e. don't try to set Cypress.env when running Storybook on its own
if (typeof Cypress !== 'undefined') {
    Cypress.env(testFileIds);
}
