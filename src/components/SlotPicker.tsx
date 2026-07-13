import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

export const TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","14:00","14:30","15:00","15:30","16:00","16:30","17:00",
];

export function combineDateTime(date: Date, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  const dt = new Date(date);
  dt.setHours(h, m, 0, 0);
  return dt;
}

/** Live availability picker. excludeId lets you ignore your own appointment when rescheduling. */
export function SlotPicker({
  doctor,
  date,
  setDate,
  time,
  setTime,
  excludeId,
}: {
  doctor: string;
  date: Date | undefined;
  setDate: (d: Date | undefined) => void;
  time: string;
  setTime: (t: string) => void;
  excludeId?: string;
}) {
  const [taken, setTaken] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!doctor || !date) {
      setTaken(new Set());
      return;
    }
    let active = true;
    setLoading(true);
    const day = format(date, "yyyy-MM-dd");
    supabase
      .rpc("get_taken_slots", { _doctor: doctor, _day: day })
      .then(async ({ data, error }) => {
        if (!active) return;
        if (error) {
          setTaken(new Set());
        } else {
          const stamps = (data as string[]).map((s) => new Date(s).getTime());
          // If rescheduling, exclude the user's own appointment time
          let ownStamp: number | null = null;
          if (excludeId) {
            const { data: own } = await supabase
              .from("appointments")
              .select("appointment_at")
              .eq("id", excludeId)
              .maybeSingle();
            if (own?.appointment_at) ownStamp = new Date(own.appointment_at).getTime();
          }
          const set = new Set<string>();
          stamps.forEach((t) => {
            if (ownStamp && t === ownStamp) return;
            const d = new Date(t);
            set.add(`${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`);
          });
          setTaken(set);
        }
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [doctor, date, excludeId]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className={cn("w-full justify-start font-normal", !date && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                setDate(d);
                setTime("");
              }}
              disabled={(d) =>
                d < new Date(new Date().setHours(0, 0, 0, 0)) ||
                d > new Date(Date.now() + 1000 * 60 * 60 * 24 * 90)
              }
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      <div>
        <Label className="mb-2 block text-xs uppercase tracking-widest text-muted-foreground">
          Time {loading && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
        </Label>
        <div className="grid grid-cols-4 gap-2">
          {TIME_SLOTS.map((slot) => {
            const active = time === slot;
            const isPast = date ? combineDateTime(date, slot).getTime() <= Date.now() : false;
            const isTaken = taken.has(slot);
            const disabled = !date || isPast || isTaken;
            return (
              <button
                key={slot}
                type="button"
                disabled={disabled}
                onClick={() => setTime(slot)}
                title={isTaken ? "Booked" : undefined}
                className={cn(
                  "rounded-lg border px-2 py-2 text-xs font-medium transition-all",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : isTaken
                    ? "border-destructive/30 bg-destructive/10 text-destructive/70 line-through"
                    : "border-border/60 hover:border-primary/40",
                  disabled && !active && "opacity-40 cursor-not-allowed",
                )}
              >
                <Clock className="mx-auto mb-1 h-3 w-3" />
                {slot}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
