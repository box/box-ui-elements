import openUrlInsideIframe from '../iframe';

describe('openUrlInsideIframe', () => {
    test('should create new iframe', () => {
        const url = 'http://box.com/foobar';
        const firstIframe = openUrlInsideIframe(url);
        expect(firstIframe).toEqual(document.querySelector('#boxdownloadiframe'));
        expect(firstIframe.src).toEqual(url);

        const url2 = 'http://box.com/foobar2';
        const secondIframe = openUrlInsideIframe(url2);
        expect(secondIframe).toEqual(document.querySelector('#boxdownloadiframe'));
        expect(secondIframe.src).toEqual(url2);

        expect(secondIframe).toEqual(firstIframe);
    });
});
