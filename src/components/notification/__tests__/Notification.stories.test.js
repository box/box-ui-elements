describe('components/notification/Notification', () => {
    const NOTIFICATION_STORIES = [
        'components-notifications-notification--basic',
        'components-notifications-notification--info',
        'components-notifications-notification--warn',
        'components-notifications-notification--error',
    ];

    test.each(NOTIFICATION_STORIES)('looks visually correct when using story %s', async id => {
        const image = await BoxVisualTestUtils.takeScreenshot(id);
        return expect(image).toMatchImageSnapshot();
    });
});
