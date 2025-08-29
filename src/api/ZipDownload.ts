/**
 * @file ZipDownload class for creating and downloading ZIP archives using Box TypeScript SDK
 * @author Box
 */

import { BoxClient, BoxDeveloperTokenAuth } from 'box-typescript-sdk-gen';
import { ZipDownloadRequest } from 'box-typescript-sdk-gen/lib/schemas/zipDownloadRequest.generated.d.ts.js';

export interface ZipDownloadItem {
    id: string;
    type: 'file' | 'folder';
}

export interface ZipDownloadOptions {
    token: string;
    downloadFileName?: string;
}

export interface ZipDownloadResponse {
    downloadUrl?: string;
    statusUrl?: string;
    expiresAt?: string;
    state?: 'in_progress' | 'failed' | 'succeeded';
    totalCount?: number;
    downloadedCount?: number;
    skippedCount?: number;
}

/**
 * ZipDownload class for creating and downloading ZIP archives from Box items
 * Uses the box-typescript-sdk-gen for modern TypeScript support
 */
export default class ZipDownloadAPI {
    private client: BoxClient;

    private options: ZipDownloadOptions;

    /**
     * Constructor
     * @param options - Configuration options including auth token
     */
    constructor(options: ZipDownloadOptions) {
        this.options = options;

        // Initialize Box client with developer token authentication
        const auth = new BoxDeveloperTokenAuth({ token: options.token });
        this.client = new BoxClient({
            auth,
        });
    }

    /**
     * Create a ZIP download request and initiate the download
     * @param items - Array of file and folder items to include in ZIP
     * @returns Promise resolving to the ZIP download response
     */
    async createZipDownload(items: ZipDownloadItem[]): Promise<ZipDownloadResponse> {
        if (!items || items.length === 0) {
            throw new Error('Items array cannot be empty');
        }

        // Create the ZIP download request
        const zipRequest: ZipDownloadRequest = {
            items,
            downloadFileName: this.options.downloadFileName,
        };

        try {
            // Create the ZIP download using the Box SDK
            const zipDownload = await this.client.zipDownloads.createZipDownload(zipRequest);

            // Only download if we have a download URL
            if (zipDownload.downloadUrl) {
                this.downloadZipFile(zipDownload.downloadUrl);
            }

            return zipDownload as unknown as ZipDownloadResponse;
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to create ZIP download: ${errorMessage}`);
        }
    }

    /**
     * Download the ZIP file bytestream to the user's device using window.open
     * @param url - The URL of the ZIP file to download
     */
    private downloadZipFile(url: string): void {
        try {
            // Open in new tab - user can save from there
            window.open(url, '_blank', 'noopener,noreferrer');

            window.focus();

            // Clean up after a delay to allow the download to start
            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 1000);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            throw new Error(`Failed to download ZIP file: ${errorMessage}`);
        }
    }
}
