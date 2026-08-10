"use client";

import { useMemo, useState } from "react";
import { Clock, UserRound } from "lucide-react";

import {
  AnnouncementFormModal,
  type AnnouncementFormValues,
} from "@/components/pm/announcements/announcement-form-modal";
import { FilterChips } from "@/components/pm/ui/filter-chips";
import { Pill } from "@/components/pm/ui/pill";
import {
  PmPageHeader,
  PmPrimaryButton,
} from "@/components/pm/ui/pm-page-header";
import {
  ANNOUNCEMENT_PRIORITY_TONE,
  CATEGORY_FILTERS,
  announcements as seed,
  nextAnnouncementId,
  type Announcement,
} from "@/lib/pm/announcements-data";

const FILTERS = ["All", ...CATEGORY_FILTERS] as const;

function Meta({
  icon: Icon,
  children,
}: {
  icon: typeof UserRound;
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5 text-[13px] text-muted">
      <Icon aria-hidden="true" className="h-3.5 w-3.5 text-gray-400" />
      {children}
    </span>
  );
}

export function AnnouncementsView() {
  const [list, setList] = useState<Announcement[]>(seed);
  const [filter, setFilter] = useState<string>("All");
  const [formOpen, setFormOpen] = useState(false);

  const visible = useMemo(
    () =>
      filter === "All"
        ? list
        : list.filter((item) => item.category === filter),
    [list, filter],
  );

  function handleCreate(values: AnnouncementFormValues) {
    setList((current) => [
      {
        id: nextAnnouncementId(current),
        title: values.title.trim(),
        content: values.content.trim(),
        category: values.category,
        priority: values.priority,
        target: values.target,
        postedBy: "Property Manager",
        postedAt: "—",
      },
      ...current,
    ]);
    setFormOpen(false);
  }

  return (
    <div className="space-y-6">
      <PmPageHeader
        title="Announcements"
        subtitle="Post and manage community announcements"
        action={
          <PmPrimaryButton
            label="Post Announcement"
            onClick={() => setFormOpen(true)}
          />
        }
      />

      <FilterChips
        label="Filter announcements by category"
        options={FILTERS}
        value={filter}
        onChange={setFilter}
      />

      {visible.length === 0 ? (
        <p className="rounded-lg border border-hairline bg-white px-6 py-12 text-center text-[15px] text-muted">
          No announcements in this category.
        </p>
      ) : (
        <ul className="space-y-4">
          {visible.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-hairline bg-white px-6 py-5"
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <Pill tone={ANNOUNCEMENT_PRIORITY_TONE[item.priority]}>
                  {item.priority}
                </Pill>
                <Pill>{item.category}</Pill>
                <span className="text-[13px] text-muted">{item.target}</span>
              </div>

              <h2 className="mt-3 text-[17px] font-bold text-ink">
                {item.title}
              </h2>

              <p className="mt-2 text-[15px] leading-relaxed text-gray-600">
                {item.content}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1.5">
                <Meta icon={UserRound}>{item.postedBy}</Meta>
                <Meta icon={Clock}>{item.postedAt}</Meta>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AnnouncementFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
