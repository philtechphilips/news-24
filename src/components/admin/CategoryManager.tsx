"use client";

import { useActionState, useState } from "react";
import { createCategory, deleteCategory, renameCategory } from "@/app/admin/actions";
import type { ApiCategory, FormState } from "@/lib/api-types";
import { PencilIcon, PlusIcon, TrashIcon } from "../icons";
import ConfirmSubmit from "./ConfirmSubmit";
import { btnIcon, btnPrimary, btnSecondary, Card, inputClass } from "./ui";

type Row = ApiCategory & { postCount: number };

export default function CategoryManager({ categories }: { categories: Row[] }) {
  const [state, formAction, pending] = useActionState(createCategory, {} as FormState);
  const message = state.fields?.name ?? state.error;

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <form action={formAction} className="flex flex-col gap-3 sm:flex-row">
          <label htmlFor="new-category" className="sr-only">
            Category name
          </label>
          <input
            id="new-category"
            name="name"
            required
            minLength={2}
            maxLength={255}
            placeholder="New category, e.g. Technology"
            className={`${inputClass} flex-1`}
          />
          <button type="submit" disabled={pending} className={btnPrimary}>
            <PlusIcon size={16} /> {pending ? "Adding…" : "Add category"}
          </button>
        </form>
        {message && <p className="mt-2 text-sm text-brand">{message}</p>}
      </Card>

      {categories.length === 0 ? (
        <Card className="px-6 py-14 text-center">
          <p className="font-display text-xl">No categories yet</p>
          <p className="mt-2 text-sm text-muted">Add your first one above.</p>
        </Card>
      ) : (
        <Card className="divide-y divide-ink/5">
          {categories.map((category) => (
            <CategoryRow key={category.id} category={category} />
          ))}
        </Card>
      )}
    </div>
  );
}

function CategoryRow({ category }: { category: Row }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, pending] = useActionState(
    async (prev: FormState, formData: FormData) => {
      const result = await renameCategory(prev, formData);
      if (result.ok) setEditing(false);
      return result;
    },
    {} as FormState,
  );
  const message = state.fields?.name ?? state.error;

  if (editing) {
    return (
      <form action={formAction} className="px-5 py-3.5">
        <input type="hidden" name="id" value={category.id} />
        <div className="flex flex-col gap-2 sm:flex-row">
          <label htmlFor={`rename-${category.id}`} className="sr-only">
            New name for {category.name}
          </label>
          <input
            id={`rename-${category.id}`}
            name="name"
            defaultValue={category.name}
            required
            minLength={2}
            maxLength={255}
            autoFocus
            className={`${inputClass} flex-1`}
          />
          <div className="flex gap-2">
            <button type="submit" disabled={pending} className={btnPrimary}>
              {pending ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(false)} className={btnSecondary}>
              Cancel
            </button>
          </div>
        </div>
        {message && <p className="mt-2 text-sm text-brand">{message}</p>}
      </form>
    );
  }

  return (
    <div className="flex items-center gap-4 px-5 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{category.name}</p>
        <p className="text-xs text-muted">
          {category.postCount} {category.postCount === 1 ? "post" : "posts"}
        </p>
      </div>
      <button
        type="button"
        onClick={() => setEditing(true)}
        aria-label={`Rename ${category.name}`}
        title="Rename"
        className={btnIcon}
      >
        <PencilIcon size={16} />
      </button>
      <form action={deleteCategory}>
        <input type="hidden" name="id" value={category.id} />
        <ConfirmSubmit
          label={`Delete ${category.name}`}
          message={
            category.postCount
              ? `Delete “${category.name}”? Its ${category.postCount} posts will become uncategorised.`
              : `Delete “${category.name}”?`
          }
          className={`${btnIcon} hover:bg-brand-soft hover:text-brand`}
        >
          <TrashIcon size={16} />
        </ConfirmSubmit>
      </form>
    </div>
  );
}
