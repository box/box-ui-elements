const isRestrictedContact = (contact, restrictedEmails, restrictedGroups) => {
  let isRestrictedEmail = false;
  let isRestrictedGroup = false;
  if (contact.id && contact.type === 'group') {
    isRestrictedGroup = restrictedGroups.includes(Number(contact.id));
  } else {
    isRestrictedEmail = restrictedEmails.includes(String(contact.value));
  }
  return isRestrictedEmail || isRestrictedGroup;
};
export default isRestrictedContact;
//# sourceMappingURL=isRestrictedContact.js.map