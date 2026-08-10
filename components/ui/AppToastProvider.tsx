"use client";

import type { MouseEventHandler } from "react";
import {
  Toast,
  ToastContent,
  ToastProvider,
  ToastTitle,
} from "@heroui/react";
import { Button } from "@/components/ui/Button";

/** Общая область уведомлений HeroUI, оформленная проектными токенами. */
export function AppToastProvider() {
  return (
    <ToastProvider
      className="ui-toast-region"
      placement="bottom"
      maxVisibleToasts={3}
      width="min(420px, calc(100vw - 32px))"
      aria-label="Уведомления"
    >
      {({ toast }) => {
        const content = toast.content;
        const action = content.actionProps;
        const actionContent =
          typeof action?.children === "function" ? null : action?.children;

        return (
          <Toast
            toast={toast}
            variant={content.variant}
            className="ui-toast"
          >
            <ToastContent>
              <ToastTitle>{content.title}</ToastTitle>
            </ToastContent>
            {actionContent != null && (
              <Button
                bare
                ripple={false}
                className="ui-toast__action"
                onClick={
                  action?.onClick as
                    | MouseEventHandler<HTMLButtonElement>
                    | undefined
                }
              >
                {actionContent}
              </Button>
            )}
          </Toast>
        );
      }}
    </ToastProvider>
  );
}
