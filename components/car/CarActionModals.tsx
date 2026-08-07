"use client";

import { useState, type FormEvent } from "react";
import {
  Checkbox,
  Input,
  Label,
  ListBox,
  Modal,
  Select,
  TextField,
  useOverlayState,
} from "@heroui/react";
import { ArrowIcon } from "@/components/icons";
import { Button, type ButtonVariant } from "@/components/ui/Button";

const VISIT_TIME_OPTIONS = [
  { id: "as-soon-as-possible", label: "Как можно скорее" },
  { id: "09-12", label: "09:00–12:00" },
  { id: "12-15", label: "12:00–15:00" },
  { id: "15-18", label: "15:00–18:00" },
  { id: "18-21", label: "18:00–21:00" },
];

const MESSENGERS = [
  { id: "telegram", label: "Telegram" },
  { id: "max", label: "MAX" },
  { id: "vk", label: "ВК" },
];

/** Доп. поля сверх обязательных «Имя» + «Телефон». */
type FieldKey = "visit" | "messengers";

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
  /** Какие доп. поля показывать (по умолчанию — только имя и телефон). */
  fields?: FieldKey[];
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
  fields = [],
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

  const showVisit = fields.includes("visit");
  const showMessengers = fields.includes("messengers");

  return (
    <>
      <Button size="m" variant={triggerVariant} onClick={state.open}>
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

                      {showVisit && (
                        <>
                          <div className="car-action-modal__field">
                            <label
                              className="car-action-modal__label"
                              htmlFor="visitDate"
                            >
                              Дата визита
                            </label>
                            <input
                              id="visitDate"
                              className="car-action-modal__input car-action-modal__input--date"
                              name="visitDate"
                              type="date"
                              required
                            />
                          </div>

                          <Select.Root
                            className="car-action-modal__field car-action-modal__select"
                            name="visitTime"
                            placeholder="Выберите время"
                            isRequired
                          >
                            <Label className="car-action-modal__label">
                              Время визита
                            </Label>
                            <Select.Trigger className="car-action-modal__select-trigger">
                              <Select.Value className="car-action-modal__select-value" />
                              <ArrowIcon
                                className="car-action-modal__select-chevron"
                                width={12}
                                height={12}
                              />
                            </Select.Trigger>
                            <Select.Popover
                              className="car-action-modal__select-popover"
                              placement="bottom"
                            >
                              <ListBox
                                className="car-action-modal__select-list"
                                aria-label="Время визита"
                              >
                                {VISIT_TIME_OPTIONS.map((option) => (
                                  <ListBox.Item
                                    key={option.id}
                                    id={option.id}
                                    textValue={option.label}
                                    className="car-action-modal__select-option"
                                  >
                                    <span>{option.label}</span>
                                    <ListBox.ItemIndicator className="car-action-modal__select-option-mark">
                                      ✓
                                    </ListBox.ItemIndicator>
                                  </ListBox.Item>
                                ))}
                              </ListBox>
                            </Select.Popover>
                          </Select.Root>
                        </>
                      )}

                      {showMessengers && (
                        <fieldset className="car-action-modal__field car-action-modal__field--full car-action-modal__messengers">
                          <legend className="car-action-modal__label">
                            Мессенджеры
                          </legend>
                          <span className="car-action-modal__hint">
                            Можно выбрать несколько
                          </span>
                          <div className="car-action-modal__messenger-list">
                            {MESSENGERS.map((messenger) => (
                              <Checkbox.Root
                                key={messenger.id}
                                className="car-action-modal__messenger"
                                name="messengers"
                                value={messenger.id}
                              >
                                <Checkbox.Content className="car-action-modal__messenger-content">
                                  <Checkbox.Control className="car-action-modal__messenger-box">
                                    <Checkbox.Indicator className="car-action-modal__messenger-mark" />
                                  </Checkbox.Control>
                                  <span className="car-action-modal__messenger-label">
                                    {messenger.label}
                                  </span>
                                </Checkbox.Content>
                              </Checkbox.Root>
                            ))}
                          </div>
                        </fieldset>
                      )}
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
        description="Оставьте имя и телефон — менеджер подтвердит наличие и забронирует автомобиль за вами."
        submitLabel="Забронировать"
        successTitle="Автомобиль забронирован"
        successText="Заявка принята. Менеджер Imperium Motors свяжется с вами в ближайшее время."
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
        fields={["visit", "messengers"]}
      />
    </>
  );
}
