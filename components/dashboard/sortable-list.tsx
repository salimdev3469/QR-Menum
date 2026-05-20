"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableItemData {
  id: string;
  label: string;
  rightText?: string;
}

interface SortableListProps {
  items: SortableItemData[];
  onReorder: (ids: string[]) => Promise<void>;
}

function SortableItem({ item }: { item: SortableItemData }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-grab rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-500"
          {...attributes}
          {...listeners}
        >
          sürükle
        </button>
        <p className="text-sm font-medium text-slate-800">{item.label}</p>
      </div>
      {item.rightText ? <span className="text-xs text-slate-500">{item.rightText}</span> : null}
    </div>
  );
}

export function SortableList({ items, onReorder }: SortableListProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = items.findIndex((item) => item.id === active.id);
    const newIndex = items.findIndex((item) => item.id === over.id);

    const nextOrder = arrayMove(items, oldIndex, newIndex).map((item) => item.id);
    await onReorder(nextOrder);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((item) => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
