import React, {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  Bell,
  Plus,
  Trash2,
  X,
  Save,
  Loader2,
  UserPlus,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { certificateReminderService } from "../../api/certificateReminderService";

const CHANNEL_OPTIONS = [
  "PulseApp",

];

const createReminder = () => ({
  idReminder: 0,
  daysBeforeSurveillance: 30,
  channel: "PulseApp",
  customContacts: [],
  isExisting: false,
});

const createContact = () => ({
  idCustom: 0,
  idReminder: 0,
  fullName: "",
  contact: "",
  isActive: true,
});

const CertificateReminderPanel = ({
  certificate,
  onClose,
}) => {
  const [reminders, setReminders] = useState([]);
  const [deletedReminderIds, setDeletedReminderIds] =
    useState([]);
  const [deletedContactIds, setDeletedContactIds] =
    useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadReminders = useCallback(async () => {
    if (!certificate?.idCertificate) {
      return;
    }

    try {
      setLoading(true);

      const response =
        await certificateReminderService.getByCertificateId(
          certificate.idCertificate
        );

      const rows = Array.isArray(response?.data)
        ? response.data
        : [];

      const mappedReminders = rows.map((item) => {
        const idReminder =
          item.idReminder ??
          item.IDReminder ??
          0;

        const contactRows =
          item.customContacts ??
          item.CustomContacts ??
          [];

        const contacts = Array.isArray(contactRows)
          ? contactRows.map((contact) => ({
              idCustom:
                contact.idCustom ??
                contact.IDCustom ??
                0,

              idReminder:
                contact.idReminder ??
                contact.IDReminder ??
                idReminder,

              fullName:
                contact.fullName ??
                contact.FullName ??
                "",

              contact:
                contact.contact ??
                contact.Contact ??
                "",

              isActive:
                contact.isActive ??
                contact.IsActive ??
                true,
            }))
          : [];

        return {
          idReminder,
          idCertificate:
            certificate.idCertificate,

          daysBeforeSurveillance: Number(
            item.daysBeforeSurveillance ??
              item.DaysBeforeSurveillance ??
              30
          ),

          channel:
            item.channel ??
            item.Channel ??
            "PulseApp",

          customContacts: contacts,
          isExisting: idReminder > 0,
        };
      });

      setReminders(mappedReminders);
      setDeletedReminderIds([]);
      setDeletedContactIds([]);
    } catch (error) {
      console.error(
        "Load reminders error:",
        error
      );

      toast.error("Failed to load reminders.");
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, [certificate?.idCertificate]);

  useEffect(() => {
    loadReminders();
  }, [loadReminders]);

  const updateReminder = (
    reminderIndex,
    field,
    value
  ) => {
    setReminders((previous) =>
      previous.map((reminder, index) =>
        index === reminderIndex
          ? {
              ...reminder,
              [field]:
                field ===
                "daysBeforeSurveillance"
                  ? Number(value)
                  : value,
            }
          : reminder
      )
    );
  };

  const addReminder = () => {
    setReminders((previous) => [
      ...previous,
      createReminder(),
    ]);
  };

  const removeReminder = (reminderIndex) => {
    const reminder =
      reminders[reminderIndex];

    if (!reminder) {
      return;
    }

    if (
      reminder.idReminder &&
      reminder.idReminder > 0
    ) {
      setDeletedReminderIds((previous) => {
        if (
          previous.includes(
            reminder.idReminder
          )
        ) {
          return previous;
        }

        return [
          ...previous,
          reminder.idReminder,
        ];
      });
    }

    setReminders((previous) =>
      previous.filter(
        (_, index) => index !== reminderIndex
      )
    );
  };

  const addContact = (reminderIndex) => {
    setReminders((previous) =>
      previous.map((reminder, index) =>
        index === reminderIndex
          ? {
              ...reminder,
              customContacts: [
                ...(reminder.customContacts || []),
                {
                  ...createContact(),
                  idReminder:
                    reminder.idReminder || 0,
                },
              ],
            }
          : reminder
      )
    );
  };

  const updateContact = (
    reminderIndex,
    contactIndex,
    field,
    value
  ) => {
    setReminders((previous) =>
      previous.map((reminder, index) => {
        if (index !== reminderIndex) {
          return reminder;
        }

        const contacts = [
          ...(reminder.customContacts || []),
        ];

        contacts[contactIndex] = {
          ...contacts[contactIndex],
          [field]: value,
        };

        return {
          ...reminder,
          customContacts: contacts,
        };
      })
    );
  };

  const deleteContact = (
    reminderIndex,
    contactIndex
  ) => {
    const reminder =
      reminders[reminderIndex];

    const contact =
      reminder?.customContacts?.[contactIndex];

    if (!contact) {
      return;
    }

    if (
      contact.idCustom &&
      contact.idCustom > 0
    ) {
      setDeletedContactIds((previous) => {
        if (
          previous.includes(contact.idCustom)
        ) {
          return previous;
        }

        return [
          ...previous,
          contact.idCustom,
        ];
      });
    }

    setReminders((previous) =>
      previous.map((item, index) =>
        index === reminderIndex
          ? {
              ...item,
              customContacts:
                item.customContacts.filter(
                  (_, currentIndex) =>
                    currentIndex !== contactIndex
                ),
            }
          : item
      )
    );
  };

  const validateForm = () => {
    if (
      reminders.length === 0 &&
      deletedReminderIds.length === 0
    ) {
      toast.error("Add at least one reminder.");
      return false;
    }

    for (
      let reminderIndex = 0;
      reminderIndex < reminders.length;
      reminderIndex++
    ) {
      const reminder =
        reminders[reminderIndex];

      if (
        !reminder.daysBeforeSurveillance ||
        reminder.daysBeforeSurveillance < 1
      ) {
        toast.error(
          `Enter valid days for Reminder ${
            reminderIndex + 1
          }.`
        );

        return false;
      }

      if (!reminder.channel?.trim()) {
        toast.error(
          `Select a channel for Reminder ${
            reminderIndex + 1
          }.`
        );

        return false;
      }

      for (
        let contactIndex = 0;
        contactIndex <
        (reminder.customContacts || []).length;
        contactIndex++
      ) {
        const contact =
          reminder.customContacts[contactIndex];

        const name =
          contact.fullName?.trim() || "";

        const number =
          contact.contact?.trim() || "";

        if (!name && !number) {
          continue;
        }

        if (!name) {
          toast.error(
            `Enter contact name for Reminder ${
              reminderIndex + 1
            }.`
          );

          return false;
        }

        if (!number) {
          toast.error(
            `Enter contact number for Reminder ${
              reminderIndex + 1
            }.`
          );

          return false;
        }

        const cleanNumber =
          number.replace(/\D/g, "");

        if (cleanNumber.length < 8) {
          toast.error(
            `Enter a valid contact number for Reminder ${
              reminderIndex + 1
            }.`
          );

          return false;
        }
      }
    }

    return true;
  };

  const saveReminders = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        idCertificate:
          certificate.idCertificate,

        reminders: reminders.map((reminder) => ({
          idReminder:
            reminder.idReminder || 0,

          idCertificate:
            certificate.idCertificate,

          daysBeforeSurveillance:
            Number(
              reminder.daysBeforeSurveillance
            ),

          channel: reminder.channel,

          customContacts: (
            reminder.customContacts || []
          ).map((contact) => ({
            idCustom:
              contact.idCustom || 0,

            idReminder:
              contact.idReminder ||
              reminder.idReminder ||
              0,

            fullName:
              contact.fullName?.trim() || "",

            contact:
              contact.contact?.trim() || "",

            isActive: true,
          })),
        })),

        deletedReminderIds,
        deletedContactIds,
      };

      const response =
        await certificateReminderService.add(
          payload
        );

      if (response?.success === false) {
        throw new Error(
          response.message ||
            "Reminders could not be saved."
        );
      }

      toast.success(
        "Reminders and contacts saved successfully."
      );

      setDeletedReminderIds([]);
      setDeletedContactIds([]);

      onClose();
    } catch (error) {
      console.error(
        "Save reminders error:",
        error
      );

      toast.error(
        error?.message ||
          "Reminders could not be saved."
      );
    } finally {
      setSaving(false);
    }
  };

  if (!certificate) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <header className="flex shrink-0 items-center justify-between border-b border-border bg-card px-6 py-5">
          <div className="flex min-w-0 items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bell size={23} />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold text-foreground">
                Certificate Reminder
              </h2>

              <p className="truncate text-sm text-muted-foreground">
                {certificate.certificateName ||
                  "Certificate"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={21} />
          </button>
        </header>

        {/* Body */}
        <main className="min-h-0 flex-1 overflow-y-auto bg-muted/10 p-5 md:p-6">
          {loading ? (
            <div className="flex min-h-[260px] items-center justify-center gap-3 text-muted-foreground">
              <Loader2
                size={22}
                className="animate-spin text-primary"
              />
              Loading reminders...
            </div>
          ) : reminders.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <Bell
                size={34}
                className="mx-auto mb-3 text-muted-foreground"
              />

              <h3 className="font-bold text-foreground">
                No reminders configured
              </h3>

              <p className="mt-1 text-sm text-muted-foreground">
                Add a reminder for this certificate.
              </p>

              <button
                type="button"
                onClick={addReminder}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
              >
                <Plus size={17} />
                Add Reminder
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {reminders.map(
                (reminder, reminderIndex) => (
                  <section
                    key={
                      reminder.idReminder ||
                      `new-${reminderIndex}`
                    }
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm"
                  >
                    {/* Reminder heading */}
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-primary/10 px-2 text-xs font-bold text-primary">
                          {String(
                            reminderIndex + 1
                          ).padStart(2, "0")}
                        </span>

                        <div>
                          <h3 className="text-sm font-bold text-foreground">
                            Reminder{" "}
                            {reminderIndex + 1}
                          </h3>

                          {reminder.isExisting && (
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-emerald-600">
                              <CheckCircle2
                                size={13}
                              />
                              Existing reminder
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeReminder(
                            reminderIndex
                          )
                        }
                        disabled={saving}
                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Delete reminder"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    {/* Reminder fields */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px_minmax(0,1fr)]">
                      <label className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Days Before
                        </span>

                        <input
                          type="number"
                          min="1"
                          value={
                            reminder.daysBeforeSurveillance
                          }
                          onChange={(event) =>
                            updateReminder(
                              reminderIndex,
                              "daysBeforeSurveillance",
                              event.target.value
                            )
                          }
                          disabled={saving}
                          className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          Notification Channel
                        </span>

                        <select
                          value={reminder.channel}
                          onChange={(event) =>
                            updateReminder(
                              reminderIndex,
                              "channel",
                              event.target.value
                            )
                          }
                          disabled={saving}
                          className="h-12 w-full rounded-xl border border-border bg-background px-4 text-sm font-semibold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {CHANNEL_OPTIONS.map(
                            (channel) => (
                              <option
                                key={channel}
                                value={channel}
                              >
                                {channel}
                              </option>
                            )
                          )}
                        </select>
                      </label>
                    </div>

                    {/* Contacts */}
                    <div className="mt-5 rounded-2xl border border-border bg-muted/20 p-4">
                      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-bold text-foreground">
                            <UserPlus
                              size={17}
                              className="text-primary"
                            />
                            Notification Contacts
                          </h4>

                          <p className="mt-1 text-xs text-muted-foreground">
                            Add the registered contact for this reminder.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            addContact(
                              reminderIndex
                            )
                          }
                          disabled={saving}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-primary px-3.5 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Plus size={16} />
                          Add Contact
                        </button>
                      </div>

                      {reminder.customContacts
                        ?.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-border bg-background/60 px-4 py-5 text-center text-xs text-muted-foreground">
                          No contacts added.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {reminder.customContacts.map(
                            (
                              contact,
                              contactIndex
                            ) => (
                              <div
                                key={
                                  contact.idCustom ||
                                  `contact-${reminderIndex}-${contactIndex}`
                                }
                                className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]"
                              >
                                <input
                                  type="text"
                                  placeholder="Full name"
                                  value={
                                    contact.fullName
                                  }
                                  onChange={(event) =>
                                    updateContact(
                                      reminderIndex,
                                      contactIndex,
                                      "fullName",
                                      event.target.value
                                    )
                                  }
                                  disabled={saving}
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
                                />

                                <input
                                  type="tel"
                                  placeholder="Contact number"
                                  value={
                                    contact.contact
                                  }
                                  onChange={(event) =>
                                    updateContact(
                                      reminderIndex,
                                      contactIndex,
                                      "contact",
                                      event.target.value
                                    )
                                  }
                                  disabled={saving}
                                  className="h-11 w-full rounded-xl border border-border bg-background px-3.5 text-sm font-medium text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-70"
                                />

                                <button
                                  type="button"
                                  onClick={() =>
                                    deleteContact(
                                      reminderIndex,
                                      contactIndex
                                    )
                                  }
                                  disabled={saving}
                                  className="flex h-11 w-full items-center justify-center rounded-xl border border-red-200 px-4 text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 md:w-11 md:px-0"
                                  title="Delete contact"
                                >
                                  <Trash2
                                    size={17}
                                  />

                                  <span className="ml-2 text-sm md:hidden">
                                    Remove
                                  </span>
                                </button>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </section>
                )
              )}

              <button
                type="button"
                onClick={addReminder}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Plus size={17} />
                Add Reminder
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="flex shrink-0 flex-col-reverse gap-3 border-t border-border bg-card px-5 py-4 sm:flex-row sm:items-center sm:justify-end md:px-6">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="h-11 rounded-xl border border-border px-5 text-sm font-semibold text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={saveReminders}
            disabled={saving || loading}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-6 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={17}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={17} />
                Save Reminder
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
};

export default CertificateReminderPanel;