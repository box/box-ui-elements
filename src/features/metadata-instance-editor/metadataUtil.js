// @flow
import type { Template, TemplateField } from './flowTypes';

const isHidden = (obj: Template | TemplateField): boolean => {
    return !!obj.isHidden || !!obj.hidden;
};

export default isHidden;
