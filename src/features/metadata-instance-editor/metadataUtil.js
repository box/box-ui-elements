// @flow

const isHidden = (obj: MetadataTemplate | MetadataTemplateField): boolean => {
    return !!obj.isHidden || !!obj.hidden;
};

export default isHidden;
