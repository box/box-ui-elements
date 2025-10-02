export const CREATE = 'create';
export let Action = /*#__PURE__*/function (Action) {
  Action["CREATE_START"] = "create_start";
  Action["CREATE_END"] = "create_end";
  Action["DELETE_START"] = "delete_start";
  Action["DELETE_END"] = "delete_end";
  Action["SET_ACTIVE"] = "set_active";
  Action["UPDATE_START"] = "update_start";
  Action["UPDATE_END"] = "update_end";
  Action["REPLY_CREATE_START"] = "reply_create_start";
  Action["REPLY_CREATE_END"] = "reply_create_end";
  Action["REPLY_DELETE_START"] = "reply_delete_start";
  Action["REPLY_DELETE_END"] = "reply_delete_end";
  Action["REPLY_UPDATE_START"] = "reply_update_start";
  Action["REPLY_UPDATE_END"] = "reply_update_end";
  return Action;
}({});

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-enable @typescript-eslint/no-explicit-any */

export let Status = /*#__PURE__*/function (Status) {
  Status["ERROR"] = "error";
  Status["PENDING"] = "pending";
  Status["SUCCESS"] = "success";
  return Status;
}({});
//# sourceMappingURL=types.js.map