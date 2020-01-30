describe('components/notification/NotificationsWrapper', () => {
    const NOTIFICATIONSWRAPPER_STORY = 'components-notifications-notificationswrapper--example';

    test(`looks visually correct when using story ${NOTIFICATIONSWRAPPER_STORY}`, async () => {
        const image = await BoxVisualTestUtils.takeScreenshot(NOTIFICATIONSWRAPPER_STORY);
        return expect(image).toMatchImageSnapshot();
    });

    test.each`
        selector          | description
        ${'.btn'}         | ${'timed notification'}
        ${'.btn-primary'} | ${'persistent notification'}
    `('shows a $description', async ({ selector }) => {
        const image = await BoxVisualTestUtils.takeScreenshotAfterInput(NOTIFICATIONSWRAPPER_STORY, selector);
        return expect(image).toMatchImageSnapshot();
    });
});
