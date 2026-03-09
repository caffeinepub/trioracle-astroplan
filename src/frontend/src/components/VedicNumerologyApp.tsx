import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  BookmarkPlus,
  Calculator,
  ChevronDown,
  ChevronUp,
  Trash2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import React, { useCallback, useMemo, useState } from "react";

// ─────────────────────────────────────────────
interface DOB {
  day: number;
  month: number;
  year: number;
}

interface NatalChartData {
  counts: Record<number, number>;
  basicNumber: number;
  destinyNumber: number;
  monthNumber: number;
}

interface DasaPeriod {
  dasaNumber: number;
  startYear: number;
  endYear: number;
}

interface SavedChart {
  id: string;
  name: string;
  dob: DOB;
  savedAt: string;
}

interface YearChartData {
  year: number;
  yearNumber: number;
  labelStart: string;
  labelEnd: string;
}

// ─────────────────────────────────────────────
// Utility: reduce to single digit 1-9
// ─────────────────────────────────────────────
function reduceDigits(n: number): number {
  if (n <= 0) return 0;
  let val = n;
  while (val > 9) {
    val = String(val)
      .split("")
      .reduce((acc, d) => acc + Number.parseInt(d, 10), 0);
  }
  return val;
}

// ─────────────────────────────────────────────
// Natal Chart Calculation
// ─────────────────────────────────────────────
function computeNatalChart(dob: DOB): NatalChartData {
  const { day, month, year } = dob;

  const basicNumber = reduceDigits(day);
  const monthNumber = reduceDigits(month);

  // Year: only last 2 digits, skip zeros
  const yearStr = String(year).padStart(4, "0");
  const lastTwo = yearStr.slice(-2);
  const yearDigits: number[] = [];
  for (const ch of lastTwo) {
    const digit = Number.parseInt(ch, 10);
    if (digit !== 0) yearDigits.push(digit);
  }

  // Destiny: sum ALL digits of full DOB (dd + mm + yyyy)
  const allDigits = String(day)
    .padStart(2, "0")
    .split("")
    .map(Number)
    .concat(String(month).padStart(2, "0").split("").map(Number))
    .concat(String(year).padStart(4, "0").split("").map(Number));
  const rawDestiny = allDigits.reduce((a, b) => a + b, 0);
  const destinyNumber = reduceDigits(rawDestiny);

  const counts: Record<number, number> = {};
  const add = (num: number) => {
    if (num < 1 || num > 9) return;
    counts[num] = (counts[num] || 0) + 1;
  };

  add(basicNumber);
  add(monthNumber);
  yearDigits.forEach(add);
  add(destinyNumber);

  return { counts, basicNumber, destinyNumber, monthNumber };
}

// ─────────────────────────────────────────────
// Dasa 45-year Cycle
// ─────────────────────────────────────────────
function computeDasaTimeline(dob: DOB): DasaPeriod[] {
  const { day, month, year } = dob;
  const basicNumber = reduceDigits(day);

  const sequence: number[] = [];
  let dasaNum = basicNumber;
  let total = 0;
  while (total < 45) {
    const duration = dasaNum;
    if (total + duration > 45) break;
    sequence.push(dasaNum);
    total += duration;
    dasaNum = dasaNum === 9 ? 1 : dasaNum + 1;
  }

  const periods: DasaPeriod[] = [];
  let cursor = new Date(year, month - 1, day);

  for (const num of sequence) {
    const startYear = cursor.getFullYear();
    const endDate = new Date(cursor);
    endDate.setFullYear(endDate.getFullYear() + num);
    const endYear = endDate.getFullYear();
    periods.push({ dasaNumber: num, startYear, endYear });
    cursor = endDate;
  }

  return periods;
}

function getCurrentDasa(periods: DasaPeriod[]): DasaPeriod | null {
  const now = new Date().getFullYear();
  return (
    periods.find((p) => now >= p.startYear && now < p.endYear) ||
    periods[periods.length - 1] ||
    null
  );
}

// ─────────────────────────────────────────────
// Day-of-week number mapping
// ─────────────────────────────────────────────
const DOW_NUMBERS: Record<number, number> = {
  0: 1, // Sunday
  1: 2, // Monday
  2: 9, // Tuesday
  3: 5, // Wednesday
  4: 3, // Thursday
  5: 6, // Friday
  6: 8, // Saturday
};

// ─────────────────────────────────────────────
// Year Number Calculation
// ─────────────────────────────────────────────
function computeYearNumber(dob: DOB, targetYear: number): YearChartData {
  const { day, month } = dob;
  const lastTwo = Number.parseInt(String(targetYear).slice(-2), 10);
  const birthDateThisYear = new Date(targetYear, month - 1, day);
  const dow = birthDateThisYear.getDay();
  const dowNum = DOW_NUMBERS[dow] ?? 1;
  const raw = day + month + lastTwo + dowNum;
  const yearNumber = reduceDigits(raw);

  const startDate = new Date(targetYear, month - 1, day);
  const endDate = new Date(targetYear + 1, month - 1, day);
  const fmt = (d: Date) =>
    `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;

  return {
    year: targetYear,
    yearNumber,
    labelStart: fmt(startDate),
    labelEnd: fmt(endDate),
  };
}

// ─────────────────────────────────────────────
// Chart Grid Component
// ─────────────────────────────────────────────
const GRID_LAYOUT: number[][] = [
  [3, 1, 9],
  [6, 7, 5],
  [2, 8, 4],
];

interface ChartGridProps {
  natalCounts: Record<number, number>;
  dasaNumber?: number | null;
  yearNumber?: number | null;
  size?: "sm" | "md" | "lg";
}

function ChartGrid({
  natalCounts,
  dasaNumber,
  yearNumber,
  size = "md",
}: ChartGridProps) {
  const cellSize =
    size === "sm"
      ? "w-14 h-14 text-base"
      : size === "lg"
        ? "w-24 h-24 sm:w-28 sm:h-28 text-2xl"
        : "w-20 h-20 sm:w-24 sm:h-24 text-xl";

  return (
    <div
      className="inline-grid grid-cols-3 gap-1.5"
      aria-label="Natal Chart Grid"
    >
      {GRID_LAYOUT.map((row) =>
        row.map((cellNum) => {
          const natCount = natalCounts[cellNum] || 0;
          const hasDasa = dasaNumber === cellNum;
          const hasYear = yearNumber === cellNum;

          const dasaDisplay = hasDasa
            ? natCount > 0
              ? String(cellNum).repeat(2)
              : String(cellNum)
            : null;

          const yearDisplay = hasYear ? String(cellNum) : null;

          return (
            <div
              key={`cell-${cellNum}`}
              className={`${cellSize} border-2 border-gold/60 bg-white/70 rounded-lg flex flex-col items-center justify-center relative overflow-hidden shadow-xs`}
              aria-label={`Cell ${cellNum}`}
            >
              {/* Natal numbers — dark, large */}
              {natCount > 0 && (
                <span className="font-bold font-serif text-charcoal leading-none tracking-tight">
                  {String(cellNum).repeat(natCount)}
                </span>
              )}

              {/* Dasa overlay — white, top-right */}
              {dasaDisplay && (
                <span
                  className="absolute top-1 right-1 font-bold text-xs leading-none"
                  style={{
                    color: "#ffffff",
                    textShadow: "0 1px 3px rgba(0,0,0,0.7)",
                  }}
                  title={`Dasa: ${dasaDisplay}`}
                >
                  {dasaDisplay}
                </span>
              )}

              {/* Year number — green, bottom-left */}
              {yearDisplay && (
                <span
                  className="absolute bottom-1 left-1 font-bold text-xs leading-none"
                  style={{ color: "#2a9d8f" }}
                  title={`Year: ${yearDisplay}`}
                >
                  {yearDisplay}
                </span>
              )}

              {/* Empty cell hint */}
              {natCount === 0 && !hasDasa && !hasYear && (
                <span className="text-gold/20 font-serif text-lg">
                  {cellNum}
                </span>
              )}
            </div>
          );
        }),
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// Main App Component
// ─────────────────────────────────────────────
interface VedicNumerologyAppProps {
  onClose: () => void;
}

export default function VedicNumerologyApp({
  onClose,
}: VedicNumerologyAppProps) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [yearInput, setYearInput] = useState("");
  const [yearRangeStart, setYearRangeStart] = useState("");
  const [yearRangeEnd, setYearRangeEnd] = useState("");
  const [saveName, setSaveName] = useState("");
  const [showSaveInput, setShowSaveInput] = useState(false);
  const [expandedDasa, setExpandedDasa] = useState(false);
  const [calculatedDOB, setCalculatedDOB] = useState<DOB | null>(null);
  const [error, setError] = useState("");

  const [savedCharts, setSavedCharts] = useState<SavedChart[]>(() => {
    try {
      const raw = localStorage.getItem("vedic-numerology-charts");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const [selectedSaved, setSelectedSaved] = useState<SavedChart | null>(null);

  const handleCalculate = () => {
    setError("");
    const d = Number.parseInt(day, 10);
    const m = Number.parseInt(month, 10);
    const y = Number.parseInt(yearInput, 10);

    if (!day || !month || !yearInput) {
      setError("Please enter a complete date of birth.");
      return;
    }
    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1 || y > 9999) {
      setError("Please enter a valid date.");
      return;
    }
    const testDate = new Date(y, m - 1, d);
    if (
      testDate.getFullYear() !== y ||
      testDate.getMonth() !== m - 1 ||
      testDate.getDate() !== d
    ) {
      setError("Invalid date — please check the day/month/year.");
      return;
    }

    setCalculatedDOB({ day: d, month: m, year: y });
    if (!yearRangeStart) setYearRangeStart(String(y));
    if (!yearRangeEnd) setYearRangeEnd(String(y + 9));
  };

  const natalData = useMemo(
    () => (calculatedDOB ? computeNatalChart(calculatedDOB) : null),
    [calculatedDOB],
  );

  const dasaPeriods = useMemo(
    () => (calculatedDOB ? computeDasaTimeline(calculatedDOB) : []),
    [calculatedDOB],
  );

  const currentDasa = useMemo(() => getCurrentDasa(dasaPeriods), [dasaPeriods]);

  const yearCharts = useMemo(() => {
    if (!calculatedDOB) return [];
    const rs = Number.parseInt(yearRangeStart, 10);
    const re = Number.parseInt(yearRangeEnd, 10);
    if (!rs || !re || rs > re) return [];
    const range = Math.min(re - rs + 1, 100);
    return Array.from({ length: range }, (_, i) =>
      computeYearNumber(calculatedDOB, rs + i),
    );
  }, [calculatedDOB, yearRangeStart, yearRangeEnd]);

  const handleSave = useCallback(() => {
    if (!calculatedDOB || !saveName.trim()) return;
    const chart: SavedChart = {
      id: `${Date.now()}`,
      name: saveName.trim(),
      dob: calculatedDOB,
      savedAt: new Date().toLocaleDateString(),
    };
    const updated = [chart, ...savedCharts];
    setSavedCharts(updated);
    localStorage.setItem("vedic-numerology-charts", JSON.stringify(updated));
    setSaveName("");
    setShowSaveInput(false);
  }, [calculatedDOB, saveName, savedCharts]);

  const handleDeleteSaved = useCallback(
    (id: string) => {
      const updated = savedCharts.filter((c) => c.id !== id);
      setSavedCharts(updated);
      localStorage.setItem("vedic-numerology-charts", JSON.stringify(updated));
      if (selectedSaved?.id === id) setSelectedSaved(null);
    },
    [savedCharts, selectedSaved],
  );

  const handleLoadSaved = useCallback((chart: SavedChart) => {
    setSelectedSaved(chart);
    setCalculatedDOB(chart.dob);
    setDay(String(chart.dob.day));
    setMonth(String(chart.dob.month));
    setYearInput(String(chart.dob.year));
    const rs = chart.dob.year;
    setYearRangeStart(String(rs));
    setYearRangeEnd(String(rs + 9));
  }, []);

  const dobLabel = calculatedDOB
    ? `${String(calculatedDOB.day).padStart(2, "0")}/${String(calculatedDOB.month).padStart(2, "0")}/${calculatedDOB.year}`
    : null;

  // Silence unused variable warning from selectedSaved being set but only read for deletion
  void selectedSaved;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-cream-bg overflow-y-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.3 }}
        data-ocid="numerology.modal"
      >
        {/* Header Bar */}
        <div className="sticky top-0 z-10 bg-cream-bg/95 backdrop-blur-sm border-b border-gold/20 px-4 py-3 flex items-center justify-between shadow-xs">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 text-charcoal/70 hover:text-gold-dark transition-colors text-sm font-medium"
            data-ocid="numerology.close_button"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="text-center">
            <h1 className="font-serif text-lg sm:text-xl font-bold text-gold-dark">
              Vedic Numerology
            </h1>
            <p className="text-xs text-charcoal/50">Natal Chart Calculator</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-charcoal/40 hover:text-charcoal/70 transition-colors"
            data-ocid="numerology.close_button"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main Content */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Tabs defaultValue="new">
            <TabsList className="grid w-full grid-cols-2 max-w-xs mx-auto mb-6 bg-lavender/30">
              <TabsTrigger value="new" data-ocid="numerology.tab">
                New
              </TabsTrigger>
              <TabsTrigger value="saved" data-ocid="numerology.tab">
                Saved ({savedCharts.length})
              </TabsTrigger>
            </TabsList>

            {/* ── NEW TAB ── */}
            <TabsContent value="new">
              {/* DOB Input Form */}
              <div className="bg-white/60 border border-gold/20 rounded-xl p-5 mb-6 shadow-xs">
                <h2 className="font-serif text-lg font-semibold text-gold-dark mb-4">
                  Enter Date of Birth
                </h2>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div>
                    <Label
                      htmlFor="dob-day"
                      className="text-xs text-charcoal/60 mb-1 block"
                    >
                      Day (DD)
                    </Label>
                    <Input
                      id="dob-day"
                      type="number"
                      min={1}
                      max={31}
                      placeholder="05"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      className="text-center font-mono"
                      data-ocid="numerology.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="dob-month"
                      className="text-xs text-charcoal/60 mb-1 block"
                    >
                      Month (MM)
                    </Label>
                    <Input
                      id="dob-month"
                      type="number"
                      min={1}
                      max={12}
                      placeholder="02"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      className="text-center font-mono"
                      data-ocid="numerology.input"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="dob-year"
                      className="text-xs text-charcoal/60 mb-1 block"
                    >
                      Year (YYYY)
                    </Label>
                    <Input
                      id="dob-year"
                      type="number"
                      min={1}
                      max={9999}
                      placeholder="1998"
                      value={yearInput}
                      onChange={(e) => setYearInput(e.target.value)}
                      className="text-center font-mono"
                      data-ocid="numerology.input"
                    />
                  </div>
                </div>

                {error && (
                  <p
                    className="text-red-500 text-sm mb-3"
                    data-ocid="numerology.error_state"
                  >
                    {error}
                  </p>
                )}

                <Button
                  onClick={handleCalculate}
                  className="w-full btn-gold border-none"
                  data-ocid="numerology.primary_button"
                >
                  <Calculator size={16} className="mr-2" />
                  Calculate Chart
                </Button>
              </div>

              {/* ── Results ── */}
              {natalData && calculatedDOB && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* ── NATAL CHART ── */}
                  <div className="bg-white/70 border-2 border-gold/40 rounded-xl p-5 mb-5 shadow-spiritual">
                    <div className="text-center mb-4">
                      <span className="inline-block bg-gold/15 text-gold-dark text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full">
                        Natal Chart
                      </span>
                      <p className="text-sm text-charcoal/60 mt-1">
                        {dobLabel}
                      </p>
                    </div>

                    {/* Key Numbers Summary */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                      {[
                        {
                          label: "Basic",
                          value: natalData.basicNumber,
                          desc: "Birth date vibration",
                        },
                        {
                          label: "Month",
                          value: natalData.monthNumber,
                          desc: "Birth month energy",
                        },
                        {
                          label: "Destiny",
                          value: natalData.destinyNumber,
                          desc: "Life path number",
                        },
                        {
                          label: "Dasa",
                          value: currentDasa?.dasaNumber ?? "-",
                          desc: currentDasa
                            ? `${currentDasa.startYear}–${currentDasa.endYear}`
                            : "",
                        },
                      ].map(({ label, value, desc }) => (
                        <div
                          key={label}
                          className="bg-cream-bg/80 border border-gold/20 rounded-lg p-3 text-center"
                        >
                          <p className="text-xs text-charcoal/50 mb-1">
                            {label}
                          </p>
                          <p className="font-serif text-2xl font-bold text-gold-dark">
                            {value}
                          </p>
                          <p className="text-xs text-charcoal/40 mt-0.5">
                            {desc}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* The Grid */}
                    <div className="flex flex-col items-center gap-4">
                      <ChartGrid
                        natalCounts={natalData.counts}
                        dasaNumber={currentDasa?.dasaNumber}
                        yearNumber={null}
                        size="lg"
                      />

                      {/* Legend */}
                      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-charcoal/60">
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded bg-charcoal inline-block" />
                          Natal numbers
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded inline-block"
                            style={{
                              background: "rgba(80,80,80,0.8)",
                              border: "1px solid white",
                            }}
                          />
                          Dasa (white, top-right)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span
                            className="w-3 h-3 rounded inline-block"
                            style={{ background: "#2a9d8f" }}
                          />
                          Year number (green, bottom-left)
                        </span>
                      </div>
                    </div>

                    {currentDasa && (
                      <div className="mt-4 bg-gold/8 border border-gold/20 rounded-lg px-4 py-2.5 text-sm text-center">
                        <span className="font-medium text-gold-dark">
                          Current Dasa: {currentDasa.dasaNumber}
                        </span>
                        <span className="text-charcoal/60 ml-2">
                          {currentDasa.startYear} – {currentDasa.endYear}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── DASA TIMELINE ── */}
                  <div className="bg-white/70 border border-gold/30 rounded-xl p-5 mb-5 shadow-xs">
                    <button
                      type="button"
                      className="w-full flex items-center justify-between"
                      onClick={() => setExpandedDasa((v) => !v)}
                      data-ocid="numerology.toggle"
                    >
                      <h3 className="font-serif text-base font-semibold text-gold-dark">
                        45-Year Dasa Cycle
                      </h3>
                      {expandedDasa ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </button>

                    <AnimatePresence>
                      {expandedDasa && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                            {dasaPeriods.map((p, idx) => {
                              const isActive =
                                currentDasa?.dasaNumber === p.dasaNumber &&
                                currentDasa?.startYear === p.startYear;
                              return (
                                <div
                                  key={`${idx}-${p.dasaNumber}-${p.startYear}`}
                                  className={`rounded-lg px-3 py-2 text-center text-sm border ${
                                    isActive
                                      ? "bg-gold/20 border-gold/60 font-bold"
                                      : "bg-cream-bg/60 border-gold/15"
                                  }`}
                                >
                                  <div className="font-serif text-lg font-bold text-gold-dark">
                                    {p.dasaNumber}
                                  </div>
                                  <div className="text-xs text-charcoal/50">
                                    {p.startYear}–{p.endYear}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ── YEAR NUMBER CHARTS ── */}
                  <div className="bg-white/70 border border-gold/30 rounded-xl p-5 mb-5 shadow-xs">
                    <h3 className="font-serif text-base font-semibold text-gold-dark mb-4">
                      Year Number Charts
                    </h3>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <Label className="text-xs text-charcoal/60 mb-1 block">
                          From Year
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          max={9999}
                          value={yearRangeStart}
                          onChange={(e) => setYearRangeStart(e.target.value)}
                          className="font-mono text-center"
                          data-ocid="numerology.input"
                        />
                      </div>
                      <div>
                        <Label className="text-xs text-charcoal/60 mb-1 block">
                          To Year (max +100)
                        </Label>
                        <Input
                          type="number"
                          min={1}
                          max={9999}
                          value={yearRangeEnd}
                          onChange={(e) => setYearRangeEnd(e.target.value)}
                          className="font-mono text-center"
                          data-ocid="numerology.input"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      {yearCharts.length === 0 && (
                        <p
                          className="text-sm text-charcoal/50 text-center py-4"
                          data-ocid="numerology.empty_state"
                        >
                          Enter a valid year range to see year charts.
                        </p>
                      )}
                      {yearCharts.map((yc) => {
                        const yrSpecificDasa =
                          dasaPeriods.find(
                            (p) =>
                              yc.year >= p.startYear && yc.year < p.endYear,
                          ) || null;

                        return (
                          <div
                            key={yc.year}
                            className="border border-gold/20 rounded-xl overflow-hidden"
                            data-ocid="numerology.panel"
                          >
                            <div className="bg-gold/10 px-4 py-2 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-gold-dark text-sm">
                                  YEAR {yc.year}–{yc.year + 1}
                                </span>
                                <span className="text-xs text-charcoal/50 ml-2">
                                  {yc.labelStart} – {yc.labelEnd}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-charcoal/50">
                                  Year #:
                                </span>
                                <span
                                  className="font-bold"
                                  style={{ color: "#2a9d8f" }}
                                >
                                  {yc.yearNumber}
                                </span>
                                {yrSpecificDasa && (
                                  <span className="text-charcoal/40 ml-1">
                                    · Dasa: {yrSpecificDasa.dasaNumber}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="p-4 flex justify-center">
                              <ChartGrid
                                natalCounts={natalData.counts}
                                dasaNumber={yrSpecificDasa?.dasaNumber}
                                yearNumber={yc.yearNumber}
                                size="sm"
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ── SAVE CHART ── */}
                  <div className="bg-white/60 border border-gold/20 rounded-xl p-5 mb-5">
                    <h3 className="font-serif text-base font-semibold text-gold-dark mb-3">
                      Save This Chart
                    </h3>

                    {!showSaveInput ? (
                      <Button
                        variant="outline"
                        onClick={() => setShowSaveInput(true)}
                        className="border-gold/40 text-gold-dark hover:bg-gold/10"
                        data-ocid="numerology.save_button"
                      >
                        <BookmarkPlus size={15} className="mr-2" />
                        Save Chart
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Chart name (e.g. My Chart)"
                          value={saveName}
                          onChange={(e) => setSaveName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSave()}
                          className="flex-1"
                          data-ocid="numerology.input"
                        />
                        <Button
                          onClick={handleSave}
                          disabled={!saveName.trim()}
                          className="btn-gold border-none"
                          data-ocid="numerology.submit_button"
                        >
                          Save
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => {
                            setShowSaveInput(false);
                            setSaveName("");
                          }}
                          data-ocid="numerology.cancel_button"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </TabsContent>

            {/* ── SAVED TAB ── */}
            <TabsContent value="saved">
              {savedCharts.length === 0 ? (
                <div
                  className="text-center py-16"
                  data-ocid="numerology.empty_state"
                >
                  <p className="text-4xl mb-3">📊</p>
                  <p className="text-charcoal/60">No saved charts yet.</p>
                  <p className="text-sm text-charcoal/40 mt-1">
                    Calculate a chart and save it to access it later.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedCharts.map((chart, idx) => {
                    const dobForChart = chart.dob;
                    const chartNatal = computeNatalChart(dobForChart);
                    const chartDasas = computeDasaTimeline(dobForChart);
                    const chartCurrDasa = getCurrentDasa(chartDasas);

                    return (
                      <motion.div
                        key={chart.id}
                        className="bg-white/70 border-2 border-gold/30 rounded-xl p-5 shadow-xs"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        data-ocid={`numerology.item.${idx + 1}`}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-serif text-lg font-bold text-gold-dark">
                              {chart.name}
                            </h3>
                            <p className="text-sm text-charcoal/60">
                              DOB: {String(chart.dob.day).padStart(2, "0")}/
                              {String(chart.dob.month).padStart(2, "0")}/
                              {chart.dob.year}
                            </p>
                            <p className="text-xs text-charcoal/40">
                              Saved: {chart.savedAt}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteSaved(chart.id)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                            aria-label="Delete saved chart"
                            data-ocid="numerology.delete_button"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="flex flex-col items-center gap-3">
                          <ChartGrid
                            natalCounts={chartNatal.counts}
                            dasaNumber={chartCurrDasa?.dasaNumber}
                            yearNumber={null}
                            size="sm"
                          />

                          <div className="text-sm text-center">
                            <span className="text-charcoal/60">Basic: </span>
                            <span className="font-bold text-gold-dark">
                              {chartNatal.basicNumber}
                            </span>
                            <span className="text-charcoal/40 mx-2">·</span>
                            <span className="text-charcoal/60">Destiny: </span>
                            <span className="font-bold text-gold-dark">
                              {chartNatal.destinyNumber}
                            </span>
                            {chartCurrDasa && (
                              <>
                                <span className="text-charcoal/40 mx-2">·</span>
                                <span className="text-charcoal/60">Dasa: </span>
                                <span className="font-bold text-gold-dark">
                                  {chartCurrDasa.dasaNumber} (
                                  {chartCurrDasa.startYear}–
                                  {chartCurrDasa.endYear})
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full mt-3 border-gold/30 text-gold-dark hover:bg-gold/10 text-sm"
                          onClick={() => handleLoadSaved(chart)}
                          data-ocid="numerology.button"
                        >
                          Load &amp; Edit This Chart
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
