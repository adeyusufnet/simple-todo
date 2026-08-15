import { useEffect, useMemo, useRef, useState } from "react";
import "../../index.css";
import CalendarIcon from "../../../public/images/icons/calendar.png"

const HOLIDAY_API = "https://date.nager.at/api/v3/PublicHolidays";

const pad = (value: any) => String(value).padStart(2, "0");

const formatDate = (date: any) => {
    if (!date) return "";

    return `${pad(date.getDate())}/${pad(
        date.getMonth() + 1
    )}/${date.getFullYear()}`;
};

const formatInputValue = (date: any) => {
    if (!date) return "";
    return formatDate(date);
};

const parseDate = (value: any) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
        return null;
    }

    const [day, month, year] = value.split("/").map(Number);

    const date = new Date(year, month - 1, day);

    // Validasi tanggal seperti 31/02/2026
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        return null;
    }

    return date;
};

const getToday = () => {
    const today = new Date();

    return new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );
};

const getMonthDays = (year: any, month: any) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Senin = 0 ... Minggu = 6
    const startDay = (firstDay.getDay() + 6) % 7;

    const days = [];

    // Empty cells sebelum tanggal 1
    for (let i = 0; i < startDay; i++) {
        days.push(null);
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
        days.push(new Date(year, month, day));
    }

    return days;
};

const dateKey = (date: any) => {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
        date.getDate()
    )}`;
};

const isSameDate = (a: any, b: any) => {
    if (!a || !b) return false;

    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
};

interface DatePickerProps {
    value: any;
    defaultValue: any;
    label: any;
    placeholder: string;
    disabled: boolean;
    required: boolean;
    minDate: any;
    maxDate: any
    onChange: any;
}

export default function DatePickerComponent({
    value,
    onChange,
    defaultValue,
    label = "Tanggal",
    placeholder = "DD/MM/YYYY",
    disabled = false,
    required = false,
    minDate,
    maxDate,
}: DatePickerProps) {
    const initialDate =
        value ??
        defaultValue ??
        getToday();

    const [selectedDate, setSelectedDate] = useState(
        initialDate instanceof Date ? initialDate : getToday()
    );

    const [inputValue, setInputValue] = useState(
        initialDate instanceof Date
            ? formatInputValue(initialDate)
            : ""
    );

    const [currentMonth, setCurrentMonth] = useState(
        initialDate instanceof Date
            ? new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
            : new Date()
    );

    const [holidays, setHolidays] = useState<any>({});
    const [holidayLoading, setHolidayLoading] = useState(false);
    const [error, setError] = useState("");

    const [isOpen, setIsOpen] = useState(false);

    const containerRef = useRef(null);

    /*
     * Fetch hari libur berdasarkan tahun yang sedang dilihat.
     */
    useEffect(() => {
        const year = currentMonth.getFullYear();

        let cancelled = false;

        async function fetchHolidays() {
            setHolidayLoading(true);

            try {
                const response = await fetch(`
                    ${HOLIDAY_API} / ${year} / ID
                `);

                if (!response.ok) {
                    throw new Error("Gagal mengambil data hari libur");
                }

                const data = await response.json();

                if (cancelled) return;

                const mapped: any = {};

                data?.forEach((holiday: any) => {
                    mapped[holiday.date] = holiday.localName || holiday.name;
                });

                setHolidays((prev: any) => ({
                    ...prev,
                    ...mapped,
                }));
            } catch (err) {
                console.error("Holiday API error:", err);
            } finally {
                if (!cancelled) {
                    setHolidayLoading(false);
                }
            }
        }

        fetchHolidays();

        return () => {
            cancelled = true;
        };
    }, [currentMonth.getFullYear()]);

    /*
     * Sinkronisasi kalau value dikontrol dari parent.
     */
    useEffect(() => {
        if (value === undefined) return;

        if (value instanceof Date) {
            setSelectedDate(value);
            setInputValue(formatInputValue(value));
            setCurrentMonth(
                new Date(value.getFullYear(), value.getMonth(), 1)
            );
        } else if (!value) {
            setSelectedDate(null);
            setInputValue("");
        }
    }, [value]);

    /*
     * Close calendar ketika klik di luar component.
     */
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (
                containerRef.current &&
                !containerRef?.current?.contains(event?.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const days = useMemo(() => {
        return getMonthDays(
            currentMonth.getFullYear(),
            currentMonth.getMonth()
        );
    }, [currentMonth]);

    const isDateOutOfRange = (date: any) => {
        if (!date) return false;

        if (minDate && date < minDate) return true;
        if (maxDate && date > maxDate) return true;

        return false;
    };

    const selectDate = (date: any) => {
        if (!date || isDateOutOfRange(date)) return;

        const formatted = formatDate(date);

        setSelectedDate(date);
        setInputValue(formatted);
        setError("");
        setIsOpen(false);

        onChange?.(date);
    };

    const handleInputChange = (event: any) => {
        let value = event.target.value;

        // Hanya angka
        value = value.replace(/\D/g, "");

        // Maksimal 8 digit
        value = value.slice(0, 8);

        // Tambahkan /
        if (value.length > 4) {
            value = `${value.slice(0, 2)}/${value.slice(
                2,
                4
            )}/${value.slice(4)}`;
        } else if (value.length > 2) {
            value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }

        setInputValue(value);
        setError("");
    };

    const validateInput = () => {
        if (!inputValue) {
            if (required) {
                setError("Tanggal wajib diisi");
                return false;
            }

            return true;
        }

        if (inputValue.length !== 10) {
            setError("Format tanggal harus DD/MM/YYYY");
            return false;
        }

        const date = parseDate(inputValue);

        if (!date) {
            setError("Tanggal tidak valid");
            return false;
        }

        if (isDateOutOfRange(date)) {
            setError("Tanggal berada di luar batas yang diperbolehkan");
            return false;
        }

        setSelectedDate(date);
        setCurrentMonth(
            new Date(date.getFullYear(), date.getMonth(), 1)
        );

        onChange?.();

        return true;
    };

    const handleInputBlur = () => {
        validateInput();
    };

    const handleKeyDown = (event: any) => {
        if (event.key === "Enter") {
            validateInput();
        }

        if (event.key === "Escape") {
            setIsOpen(false);
        }
    };

    const previousMonth = () => {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1
            )
        );
    };

    const nextMonth = () => {
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1
            )
        );
    };

    const monthLabel = currentMonth.toLocaleDateString(
        "id-ID",
        {
            month: "long",
            year: "numeric",
        }
    );

    return (
        <div
            className="date-picker"
            ref={containerRef}
        >
            {label && (
                <label className="date-picker__label">
                    {label}

                    {required && (
                        <span className="date-picker__required">
                            *
                        </span>
                    )}
                </label>
            )}

            <div
                className={`date-picker__input-wrapper ${error
                    ? "date-picker__input-wrapper--error"
                    : ""
                    } ${disabled
                        ? "date-picker__input-wrapper--disabled"
                        : ""
                    }`}
            >
                <input
                    type="text"
                    value={inputValue}
                    placeholder={placeholder}
                    disabled={disabled}
                    inputMode="numeric"
                    className="date-picker__input"
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(true)}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error ? "date-picker-error" : undefined
                    }
                />

                <button
                    type="button"
                    className="date-picker__calendar-button"
                    disabled={disabled}
                    onClick={() => setIsOpen((prev) => !prev)}
                    aria-label="Buka kalender"
                >
                    <img src={CalendarIcon} alt="calendar" />
                </button>
            </div>

            {error && (
                <div
                    id="date-picker-error"
                    className="date-picker__error"
                >
                    {error}
                </div>
            )}

            {isOpen && !disabled && (
                <div className="date-picker__calendar">
                    <div className="date-picker__header">
                        <button
                            type="button"
                            onClick={previousMonth}
                            className="date-picker__nav"
                            aria-label="Bulan sebelumnya"
                        >
                            ‹
                        </button>

                        <div className="date-picker__month">
                            {monthLabel}
                        </div>

                        <button
                            type="button"
                            onClick={nextMonth}
                            className="date-picker__nav"
                            aria-label="Bulan berikutnya"
                        >
                            ›
                        </button>
                    </div>

                    <div className="date-picker__weekdays">
                        {[
                            "Sen",
                            "Sel",
                            "Rab",
                            "Kam",
                            "Jum",
                            "Sab",
                            "Min",
                        ].map((day) => (
                            <div key={day}>
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="date-picker__days">
                        {days?.map((date, index) => {
                            if (!date) {
                                return (
                                    <div
                                        key={`empty - ${index}`}
                                        className="date-picker_day date-picker_day--empty"
                                    />
                                );
                            }

                            const key = dateKey(date);
                            const holidayName = holidays[key];
                            const isHoliday = Boolean(holidayName);
                            const isSelected = isSameDate(
                                date,
                                selectedDate
                            );
                            const isToday = isSameDate(
                                date,
                                getToday()
                            );
                            const isDisabled =
                                isDateOutOfRange(date);

                            return (
                                <button
                                    key={key}
                                    type="button"
                                    disabled={isDisabled}
                                    title={
                                        isHoliday
                                            ? holidayName
                                            : undefined
                                    }
                                    className={[
                                        "date-picker__day",
                                        isSelected
                                            ? "date-picker__day--selected"
                                            : "",
                                        isToday
                                            ? "date-picker__day--today"
                                            : "",
                                        isHoliday
                                            ? "date-picker__day--holiday"
                                            : "",
                                        isDisabled
                                            ? "date-picker__day--disabled"
                                            : "",
                                    ]
                                        .filter(Boolean)
                                        .join(" ")}
                                    onClick={() => selectDate(date)}
                                >
                                    {date.getDate()}
                                </button>
                            );
                        })}
                    </div>

                    {holidayLoading && (
                        <div className="date-picker__loading">
                            Memuat hari libur...
                        </div>
                    )}

                    <div className="date-picker__legend">
                        <span className="date-picker__legend-dot" />
                        Hari libur nasional
                    </div>
                </div>
            )}
        </div>
    );
}