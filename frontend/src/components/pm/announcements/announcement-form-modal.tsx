"use client";

import { useState } from "react";

import { SelectField } from "@/components/pm/ui/select-field";
import { FieldLabel, controlClasses } from "@/components/ui/field";
import { InputField } from "@/components/ui/input-field";
import { Modal } from "@/components/ui/modal";
import {
  ANNOUNCEMENT_CATEGORIES,
  ANNOUNCEMENT_PRIORITIES,
  ANNOUNCEMENT_TARGETS,
  type AnnouncementCategory,
  type AnnouncementPriority,
} from "@/lib/pm/announcements-data";

export type AnnouncementFormValues = {
  title: string;
  content: string;
  category: AnnouncementCategory;
  priority: AnnouncementPriority;
  target: string;
};

const EMPTY: AnnouncementFormValues = {
  title: "",
  content: "",
  category: "Community",
  priority: "Medium",
  target: "All Residents",
};

export function AnnouncementFormModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: AnnouncementFormValues) => void;
}) {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState("");

  function set<K extends keyof AnnouncementFormValues>(
    key: K,
    value: AnnouncementFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!values.title.trim() || !values.content.trim()) {
      setError("Title and content are required.");
      return;
    }
    onSubmit(values);
    setValues(EMPTY);
    setError("");
  }

  return (
    <Modal open={open} onClose={onClose} title="Post Announcement">
      <form onSubmit={handleSubmit}>
        <div className="space-y-5 px-8 py-7">
          <InputField
            id="an-title"
            label="Title"
            required
            placeholder="Announcement title"
            value={values.title}
            onChange={(event) => set("title", event.target.value)}
            error={error}
          />

          <div>
            <FieldLabel htmlFor="an-content" required>
              Content
            </FieldLabel>
            <textarea
              id="an-content"
              rows={5}
              value={values.content}
              onChange={(event) => set("content", event.target.value)}
              placeholder="Announcement content..."
              className={`${controlClasses()} resize-y px-3.5 py-3`}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <SelectField
              id="an-category"
              label="Category"
              value={values.category}
              onChange={(value) =>
                set("category", value as AnnouncementCategory)
              }
              options={ANNOUNCEMENT_CATEGORIES}
            />
            <SelectField
              id="an-priority"
              label="Priority"
              value={values.priority}
              onChange={(value) =>
                set("priority", value as AnnouncementPriority)
              }
              options={ANNOUNCEMENT_PRIORITIES}
            />
            <SelectField
              id="an-target"
              label="Target"
              value={values.target}
              onChange={(value) => set("target", value)}
              options={ANNOUNCEMENT_TARGETS}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-hairline px-8 py-5">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-hairline px-5 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark focus-visible:ring-2 focus-visible:ring-brand/40 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            Post Announcement
          </button>
        </div>
      </form>
    </Modal>
  );
}
