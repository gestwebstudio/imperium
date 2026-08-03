"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import {
  Input,
  Label,
  Modal,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { Button, type ButtonVariant } from "@/components/ui/Button";

export type LeadModalProps = {
  title: string;
  description: string;
  submitLabel: string;
  successTitle: string;
  successText: string;
  /** Показать поле «Комментарий» (textarea). */
  comment?: boolean;
  commentLabel?: string;
  commentPlaceholder?: string;
  /** Кнопка-триггер (оформление как у обычной кнопки страницы). */
  triggerLabel: string;
  triggerVariant?: ButtonVariant;
  triggerSize?: "s" | "m" | "l";
  triggerClassName?: string;
  triggerInverse?: boolean;
  triggerEndIcon?: ReactNode;
};

/**
 * Универсальное окно-заявка (имя + телефон, опц. комментарий) для CTA-кнопок сайта.
 * Стили — глобальные (styles/lead-modal.css). Кнопку рендерит вызывающая сторона
 * через `trigger`, чтобы сохранить её оформление на каждой странице.
 */
export function LeadModal({
  title,
  description,
  submitLabel,
  successTitle,
  successText,
  comment = false,
  commentLabel = "Комментарий",
  commentPlaceholder = "Коротко опишите запрос",
  triggerLabel,
  triggerVariant = "primary-surface",
  triggerSize = "l",
  triggerClassName,
  triggerInverse,
  triggerEndIcon,
}: LeadModalProps) {
  const [submitted, setSubmitted] = useState(false);
  const state = useOverlayState({
    onOpenChange(isOpen) {
      if (!isOpen) setSubmitted(false);
    },
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <>
      <Button
        size={triggerSize}
        variant={triggerVariant}
        inverse={triggerInverse}
        className={triggerClassName}
        endIcon={triggerEndIcon}
        onClick={state.open}
      >
        {triggerLabel}
      </Button>

      <Modal state={state}>
        <Modal.Backdrop variant="blur" className="lead-modal__backdrop">
          <Modal.Container
            placement="center"
            scroll="inside"
            size="md"
            className="lead-modal__container"
          >
            <Modal.Dialog className="lead-modal__dialog">
              <Modal.CloseTrigger
                className="lead-modal__close"
                aria-label="Закрыть окно"
              />

              {submitted ? (
                <div className="lead-modal__success">
                  <span className="lead-modal__success-icon" aria-hidden="true">
                    ✓
                  </span>
                  <Modal.Heading className="lead-modal__success-title">
                    {successTitle}
                  </Modal.Heading>
                  <p className="lead-modal__success-text">{successText}</p>
                  <Button
                    size="l"
                    variant="primary-surface"
                    onClick={state.close}
                  >
                    Готово
                  </Button>
                </div>
              ) : (
                <form className="lead-modal__form" onSubmit={handleSubmit}>
                  <Modal.Header className="lead-modal__header">
                    <Modal.Heading className="lead-modal__title">
                      {title}
                    </Modal.Heading>
                    <p className="lead-modal__description">{description}</p>
                  </Modal.Header>

                  <Modal.Body className="lead-modal__body">
                    <div className="lead-modal__fields">
                      <TextField className="lead-modal__field" isRequired>
                        <Label className="lead-modal__label">Имя</Label>
                        <Input
                          className="lead-modal__input"
                          name="name"
                          autoComplete="name"
                          placeholder="Как к вам обращаться"
                        />
                      </TextField>

                      <TextField className="lead-modal__field" isRequired>
                        <Label className="lead-modal__label">Телефон</Label>
                        <Input
                          className="lead-modal__input"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+7 999 000-00-00"
                        />
                      </TextField>

                      {comment && (
                        <div className="lead-modal__field lead-modal__field--full">
                          <label className="lead-modal__label" htmlFor="lead-comment">
                            {commentLabel}
                          </label>
                          <textarea
                            id="lead-comment"
                            className="lead-modal__input lead-modal__textarea"
                            name="comment"
                            rows={3}
                            placeholder={commentPlaceholder}
                          />
                        </div>
                      )}
                    </div>

                    <p className="lead-modal__legal">
                      Нажимая кнопку, вы соглашаетесь на обработку персональных
                      данных.
                    </p>
                  </Modal.Body>

                  <Modal.Footer className="lead-modal__footer">
                    <Button
                      size="l"
                      variant="secondary-outlined"
                      onClick={state.close}
                    >
                      Отмена
                    </Button>
                    <Button size="l" variant="primary-surface" type="submit">
                      {submitLabel}
                    </Button>
                  </Modal.Footer>
                </form>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal.Backdrop>
      </Modal>
    </>
  );
}

export default LeadModal;
