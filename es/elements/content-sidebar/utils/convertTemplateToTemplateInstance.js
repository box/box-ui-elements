export const convertTemplateToTemplateInstance = (file, template) => {
  return {
    canEdit: !!file.permissions.can_upload,
    displayName: template.displayName,
    hidden: template.hidden,
    id: template.id,
    fields: template.fields,
    scope: template.scope,
    templateKey: template.templateKey,
    type: template.type
  };
};
//# sourceMappingURL=convertTemplateToTemplateInstance.js.map