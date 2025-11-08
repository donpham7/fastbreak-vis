// DatePicker.jsx
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/dist/style.css";

export function DatePicker({
    value,
    onChange,
    placeholder = "Pick a date",
    disabled,
}) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover.Root open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
                <button
                    type="button"
                    disabled={disabled}
                    className="inline-flex items-center justify-between w-[240px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 hover:bg-gray-50 disabled:opacity-50"
                >
                    <span>
                        {value ? format(value, "yyyy-MM-dd") : placeholder}
                    </span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path
                            d="M5 8l5 5 5-5"
                            fill="none"
                            stroke="currentColor"
                        />
                    </svg>
                </button>
            </Popover.Trigger>

            <Popover.Portal>
                <Popover.Content
                    sideOffset={6}
                    className="rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
                >
                    <DayPicker
                        mode="single"
                        selected={value}
                        onSelect={(d) => {
                            if (d) {
                                onChange?.(d);
                                setOpen(false);
                            }
                        }}
                        // Optional: limit range, e.g. from 2000 to 2030
                        fromYear={2000}
                        toYear={2030}
                        captionLayout="dropdown"
                    />
                    <Popover.Arrow className="fill-white" />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
}
