export type AdminActionState = {
  status: "idle" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

export const INITIAL_ADMIN_ACTION_STATE: AdminActionState = {
  status: "idle",
};
