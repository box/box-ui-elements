/**
 * @file Mock metadata-template namespaces.
 *
 * Temporary stand-in while the backend `getNamespaces` endpoint does not
 * exist yet. Two top-level namespaces — `Apps` and `Extract` — sit under
 * a single mock enterprise root FQN (`MOCK_ENTERPRISE_ID`).
 *
 * The shared enterprise prefix is required for back-navigation: the
 * `MetadataTemplateBrowser` breadcrumb resolves the "Enterprise" crumb
 * by stripping the last dotted segment off the first path entry's FQN,
 * so every mock namespace id must dot-prefix the enterprise root for
 * that lookup to hit the level cache.
 *
 * Each entry carries a `templates` slot so future mocks can attach
 * per-namespace template lists without changing the shape consumed by
 * `useMetadataTemplateItemsService`.
 */
import { type MetadataNamespace, type MetadataTemplate } from '@box/metadata-editor';

/**
 * Mock enterprise root FQN. Used both as the `enterpriseId` passed to
 * `MetadataTemplateBrowser` and as the dotted prefix on every mock
 * namespace id, so the two stay in lock-step while the backend is mocked.
 */
export const MOCK_ENTERPRISE_ID = 'enterprise_123';

export interface MockMetadataTemplateNamespace extends MetadataNamespace {
    /**
     * Templates that conceptually belong under this namespace. Empty for
     * now — populated once we add mock per-namespace template data.
     */
    templates: MetadataTemplate[];
}

export const MOCK_METADATA_TEMPLATE_NAMESPACES: MockMetadataTemplateNamespace[] = [
    {
        id: `${MOCK_ENTERPRISE_ID}.Apps`,
        displayName: 'Box Apps',
        templates: [],
        canCreate: true,
    },
    {
        id: `${MOCK_ENTERPRISE_ID}.Extract`,
        displayName: 'Box Extract',
        templates: [],
        canCreate: true,
    },
];

export const MOCK_METADATA_TEMPLATE_NAMESPACE_IDS: ReadonlySet<string> = new Set(
    MOCK_METADATA_TEMPLATE_NAMESPACES.map(namespace => namespace.id),
);
