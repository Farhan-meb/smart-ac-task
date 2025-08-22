"use client";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, X } from "lucide-react";
import React, { useState } from "react";
import { Calendar } from "react-date-range";

interface DatePickerProps {
    date?: Date;
    onDateChange: (date: Date) => void;
    onClear?: () => void;
    placeholder?: string;
    className?: string;
    fullWidth?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
    date,
    onDateChange,
    onClear,
    placeholder = "Select date",
    className,
    fullWidth = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (selectedDate: Date) => {
        onDateChange(selectedDate);
        setIsOpen(false);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onClear?.();
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={`${
                        fullWidth ? "w-full" : date ? "w-44" : "w-36"
                    } h-9 justify-start text-left font-normal relative ${className}`}
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                        format(date, "MMM dd, yyyy")
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    {date && onClear && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 h-5 w-5 p-0 bg-red-50 hover:bg-red-100"
                            onClick={handleClear}
                        >
                            <X className="h-3 w-3 text-red-500 hover:text-red-700" />
                        </Button>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar date={date} onChange={handleSelect} color="#3d91ff" />
            </PopoverContent>
        </Popover>
    );
};
