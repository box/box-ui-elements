const hasRestrictedContacts = (contacts, restrictedEmails, restrictedGroups) => {
  if (!restrictedEmails.length && !restrictedGroups.length) {
    return false;
  }
  const hasRestrictedGroups = contacts.some(({
    id
  }) => restrictedGroups.includes(id));
  const hasRestrictedEmails = contacts.some(({
    value
  }) => restrictedEmails.includes(value));
  return hasRestrictedGroups || hasRestrictedEmails;
};
export default hasRestrictedContacts;
//# sourceMappingURL=hasRestrictedContacts.js.map