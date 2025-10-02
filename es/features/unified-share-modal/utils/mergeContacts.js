function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const mergeContacts = (existingContacts, fetchedContacts) => {
  const contactsMap = Object.keys(fetchedContacts).reduce((map, email) => {
    const contact = fetchedContacts[email];
    // Since objects are case-sensitive, normalize the key to lowercase.
    map[email.toLowerCase()] = _objectSpread(_objectSpread({}, contact), {}, {
      text: contact.name,
      value: contact.email || contact.id
    });
    return map;
  }, {});
  return existingContacts.map(contact => {
    if (contact.id) {
      return contact;
    }
    return (
      // Normalize the getter in contactsMap so that matching existing contacts will be case-insensitive
      contact.value && contactsMap[contact.value.toLowerCase()] || {
        email: String(contact.value),
        id: String(contact.value),
        isExternalUser: true,
        text: String(contact.value),
        type: 'user',
        value: contact.value
      }
    );
  });
};
export default mergeContacts;
//# sourceMappingURL=mergeContacts.js.map