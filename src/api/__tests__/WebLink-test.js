import noop from 'lodash/noop';
import WebLink from '../WebLink';
import * as fields from '../../utils/fields';
import Cache from '../../utils/Cache';
import { ERROR_CODE_FETCH_WEBLINK } from '../../constants';

let webLink;
let cache;

describe('api/WebLink', () => {
    beforeEach(() => {
        webLink = new WebLink({});
        cache = new Cache();
    });

    describe('getCacheKey()', () => {
        test('should return correct key', () => {
            expect(webLink.getCacheKey('foo')).toBe('web_link_foo');
        });
    });

    describe('getUrl()', () => {
        test('should return correct web link api url without id', () => {
            expect(webLink.getUrl()).toBe('https://api.box.com/2.0/web_links');
        });
        test('should return correct web link api url with id', () => {
            expect(webLink.getUrl('foo')).toBe('https://api.box.com/2.0/web_links/foo');
        });
    });

    describe('getWeblink()', () => {
        test('should not do anything if destroyed', async () => {
            webLink.isDestroyed = jest.fn().mockReturnValueOnce(true);
            webLink.getCache = jest.fn();
            webLink.getCacheKey = jest.fn();
            webLink.xhr = null;
            const success = jest.fn();
            const error = jest.fn();
            await webLink.getWeblink('id', success, error);
            expect(webLink.getCache).not.toHaveBeenCalled();
            expect(webLink.getCacheKey).not.toHaveBeenCalled();
            expect(success).not.toHaveBeenCalled();
            expect(error).not.toHaveBeenCalled();
        });

        test('should return cached webLink', async () => {
            cache.set('key', 'webLink');
            webLink.xhr = null;
            webLink.getCache = jest.fn().mockReturnValueOnce(cache);
            webLink.getCacheKey = jest.fn().mockReturnValueOnce('key');
            fields.findMissingProperties = jest.fn().mockReturnValueOnce([]);
            const success = jest.fn();
            await webLink.getWeblink('id', success);
            expect(webLink.getCacheKey).toHaveBeenCalledWith('id');
            expect(success).toHaveBeenCalledWith('webLink');
            expect(fields.findMissingProperties).toHaveBeenCalledWith('webLink', undefined);
        });

        test('should make xhr to get webLink when cached if missing fields', async () => {
            cache.set('key', { id: '123' });
            webLink.getCache = jest.fn().mockReturnValueOnce(cache);
            webLink.getCacheKey = jest.fn().mockReturnValueOnce('key');
            const optionFields = ['missing1', 'missing2'];
            fields.findMissingProperties = jest.fn().mockReturnValueOnce(optionFields);
            webLink.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: { foo: 'bar' } })),
            };

            const success = jest.fn();
            await webLink.getWeblink('id', success, noop, { fields: optionFields });
            expect(success).toHaveBeenCalledWith({
                id: '123',
                foo: 'bar',
            });
            expect(fields.findMissingProperties).toHaveBeenCalledWith({ id: '123' }, optionFields);
            expect(webLink.xhr.get).toHaveBeenCalledWith({
                url: 'https://api.box.com/2.0/web_links/id',
                params: {
                    fields: 'missing1,missing2',
                },
            });
        });

        test('should make xhr to get webLink and not call success callback when destroyed', async () => {
            fields.findMissingProperties = jest.fn().mockReturnValueOnce([]);
            webLink.isDestroyed = jest
                .fn()
                .mockReturnValueOnce(false)
                .mockReturnValueOnce(true);
            webLink.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.resolve({ data: { webLink: 'new webLink' } })),
            };

            const success = jest.fn();

            await webLink.getWeblink('id', success);
            expect(success).not.toHaveBeenCalled();
            expect(webLink.xhr.get).toHaveBeenCalledWith({
                url: 'https://api.box.com/2.0/web_links/id',
            });
        });

        test('should call error callback when xhr fails', async () => {
            const error = new Error('error');
            fields.findMissingProperties = jest.fn().mockReturnValueOnce([]);
            webLink.xhr = {
                get: jest.fn().mockReturnValueOnce(Promise.reject(error)),
            };

            const successCb = jest.fn();
            const errorCb = jest.fn();

            await webLink.getWeblink('id', successCb, errorCb);

            expect(successCb).not.toHaveBeenCalled();
            expect(errorCb).toHaveBeenCalledWith(error, ERROR_CODE_FETCH_WEBLINK);
            expect(webLink.xhr.get).toHaveBeenCalledWith({
                url: 'https://api.box.com/2.0/web_links/id',
            });
        });
    });
});
