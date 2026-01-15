# API extra response fields Spike

## Background

We need to show latest version badge when a new file version is uploaded.

## Findings

Currently, file upload endpoints don’t return version number in standard response. See [standard File resource: File - Box Dev Docs](https://developer.box.com/reference/resources/file)

We need to use fields `query` parameter to add `version_number` field to response: [Request extra fields - Box Dev Docs](https://developer.box.com/guides/api-calls/request-extra-fields).

**Note**: when a specific field is requested no other fields are returned except for those requested and the base set of fields. For a file, this base set is comprised of the `etag, id, and type` values.

It means that we need to include all existing fields to fields parameter. I.e: `?fields=${standardFieldsCommaSeparated},version_number` .

## Next steps

1. Decide how to extend box-ui-elements/src/api/uploads to allow passing extra response fields.
2. Keep changes backward compatible.

## Where to start

We would need to cover both single shot and multiput uploads:

1. Plain upload: box-ui-elements/src/api/uploads/PlainUpload.js
2. Multiput: box-ui-elements/src/api/uploads/MultiputUpload.js
