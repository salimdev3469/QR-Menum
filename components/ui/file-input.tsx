import { ChangeEvent } from "react";

import { cn } from "@/lib/utils";

interface FileInputProps {
  accept?: string;
  multiple?: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function FileInput({ accept, multiple, onChange, className }: FileInputProps) {
  return (
    <input
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={onChange}
      className={cn(
        "block w-full cursor-pointer rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-600",
        className,
      )}
    />
  );
}
