"use client";

import { useState, type FormEvent } from "react";
import {
  Input,
  Label,
  Modal,
  TextArea,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { Button, type ButtonVariant } from "@/components/ui/Button";

type CarActionModalProps = {
  carTitle: string;
  price: string;
  triggerLabel: string;
  triggerVariant: ButtonVariant;
  title: string;
  description: string;
  submitLabel: string;
  successTitle: string;
  successText: string;
  messageLabel: string;
  messagePlaceholder: string;
};

function CarActionModal({
  carTitle,
  price,
  triggerLabel,
  triggerVariant,
  title,
  description,
  submitLabel,
  successTitle,
  successText,
  messageLabel,
  messagePlaceholder,
}: CarActionModalProps) {
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
      <Button size="l" variant={triggerVariant} onClick={state.open}>
        {triggerLabel}
      </Button>

      <Modal state={state}>
        <Modal.Backdrop
          variant="blur"
          className="car-action-modal__backdrop"
        >
          <Modal.Container
            placement="center"
            scroll="inside"
            size="md"
            className="car-action-modal__container"
          >
            <Modal.Dialog className="car-action-modal__dialog">
              <Modal.CloseTrigger
                className="car-action-modal__close"
                aria-label="Закрыть окно"
              />

              {submitted ? (
                <div className="car-action-modal__success">
                  <span
                    className="car-action-modal__success-icon"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <Modal.Heading className="car-action-modal__success-title">
                    {successTitle}
                  </Modal.Heading>
                  <p className="car-action-modal__success-text">
                    {successText}
                  </p>
                  <Button
                    size="l"
                    variant="primary-surface"
                    onClick={state.close}
                  >
                    Готово
                  </Button>
                </div>
              ) : (
                <form
                  className="car-action-modal__form"
                  onSubmit={handleSubmit}
                >
                  <Modal.Header className="car-action-modal__header">
                    <Modal.Heading className="car-action-modal__title">
                      {title}
                    </Modal.Heading>
                    <p className="car-action-modal__description">
                      {description}
                    </p>
                  </Modal.Header>

                  <Modal.Body className="car-action-modal__body">
                    <div className="car-action-modal__vehicle">
                      <span>Выбранный автомобиль</span>
                      <strong>{carTitle}</strong>
                      <b>{price}</b>
                    </div>

                    <div className="car-action-modal__fields">
                      <TextField
                        className="car-action-modal__field"
                        isRequired
                      >
                        <Label className="car-action-modal__label">
                          Имя
                        </Label>
                        <Input
                          className="car-action-modal__input"
                          name="name"
                          autoComplete="name"
                          placeholder="Как к вам обращаться"
                        />
                      </TextField>

                      <TextField
                        className="car-action-modal__field"
                        isRequired
                      >
                        <Label className="car-action-modal__label">
                          Телефон
                        </Label>
                        <Input
                          className="car-action-modal__input"
                          name="phone"
                          type="tel"
                          inputMode="tel"
                          autoComplete="tel"
                          placeholder="+7 999 000-00-00"
                        />
                      </TextField>

                      <TextField className="car-action-modal__field">
                        <Label className="car-action-modal__label">
                          {messageLabel}
                        </Label>
                        <TextArea
                          className="car-action-modal__textarea"
                          name="message"
                          placeholder={messagePlaceholder}
                        />
                      </TextField>
                    </div>

                    <p className="car-action-modal__legal">
                      Нажимая кнопку, вы соглашаетесь на обработку персональных
                      данных.
                    </p>
                  </Modal.Body>

                  <Modal.Footer className="car-action-modal__footer">
                    <Button
                      size="l"
                      variant="secondary-outlined"
                      onClick={state.close}
                    >
                      Отмена
                    </Button>
                    <Button
                      size="l"
                      variant="primary-surface"
                      type="submit"
                    >
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

export function CarActionModals({
  carTitle,
  price,
}: {
  carTitle: string;
  price: string;
}) {
  return (
    <>
      <CarActionModal
        carTitle={carTitle}
        price={price}
        triggerLabel="Забронировать"
        triggerVariant="primary-surface"
        title="Забронировать автомобиль"
        description="Оставьте контакты — менеджер подтвердит наличие автомобиля и свяжется с вами для согласования деталей."
        submitLabel="Отправить заявку"
        successTitle="Автомобиль забронирован"
        successText="Заявка принята. Менеджер Imperium Motors свяжется с вами в ближайшее время."
        messageLabel="Комментарий"
        messagePlaceholder="Укажите удобное время для звонка"
      />
      <CarActionModal
        carTitle={carTitle}
        price={price}
        triggerLabel="Онлайн-показ"
        triggerVariant="secondary-outlined"
        title="Записаться на онлайн-показ"
        description="Покажем автомобиль по видеосвязи, ответим на вопросы и подробно разберем комплектацию."
        submitLabel="Записаться"
        successTitle="Онлайн-показ запланирован"
        successText="Заявка принята. Менеджер свяжется с вами и согласует удобное время и формат звонка."
        messageLabel="Удобное время и мессенджер"
        messagePlaceholder="Например: сегодня после 18:00, Telegram"
      />
    </>
  );
}
