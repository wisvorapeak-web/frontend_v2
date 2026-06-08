"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { motion } from "framer-motion";
import { Clock, MapPin, User, CalendarDays } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { fetchApi } from "@/lib/api";

export default function SchedulePage() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [eventDates, setEventDates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<string>("");

  useEffect(() => {
    Promise.all([
      fetchApi('/schedules'),
      fetchApi('/eventdates')
    ]).then(([schedData, dateData]) => {
      setSchedules(schedData.filter((s: any) => s.is_active !== false));
      // Try to get conference days from event dates, or just use generic days
      const confDates = dateData.filter((d: any) => d.is_active !== false && d.event?.toLowerCase().includes('day')).sort((a: any, b: any) => a.display_order - b.display_order);
      setEventDates(confDates);
      
      if (confDates.length > 0) {
        setSelectedDay(confDates[0].event);
      } else {
        setSelectedDay("Day 1");
      }
      
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return "";
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return "";
    }
  };

  // If no dates specified in DB specifically for "Day 1", etc., we just show all schedules. 
  // Ideally, schedule model has a date or day field. Since it doesn't appear to, we'll just show all schedules for now,
  // or group them if they have a date field.
  const displaySchedules = useMemo(() => {
    // If schedules have a 'date' field, we could filter. If not, just show all.
    // For now, we'll just sort them by startTime (assuming string format allows simple sort, or we don't sort)
    return schedules;
  }, [schedules, selectedDay]);

  const daysList = eventDates.length > 0 
    ? eventDates.map(d => ({ name: d.event, label: `${d.event} ${formatDate(d.date) ? '- ' + formatDate(d.date) : ''}` }))
    : [{ name: 'Day 1', label: 'Day 1 - Nov 18' }, { name: 'Day 2', label: 'Day 2 - Nov 19' }];

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <section className="pt-40 pb-20 bg-midnight relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-midnight via-midnight/90 to-summit/40 z-0" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-white mb-6">
              Conference <span className="text-transparent bg-clip-text bg-gradient-to-r from-ascendix to-ice">Schedule</span>
            </h1>
            <p className="text-lg text-white/70 font-light leading-relaxed">
              Plan your experience. Sessions covering the most critical topics in food tech and sustainable agriculture.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 relative flex-grow">
        <div className="container mx-auto px-6 max-w-5xl">
          
          {/* Day Selector */}
          <div className="flex flex-wrap gap-4 justify-center mb-16">
            {daysList.map((day, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedDay(day.name)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors border ${selectedDay === day.name ? 'bg-primary text-primary-foreground border-primary' : 'bg-card text-foreground border-border hover:border-primary/50'}`}
              >
                <CalendarDays size={18} />
                {day.label}
              </button>
            ))}
          </div>

          {/* Timeline */}
          {loading ? (
             <div className="text-center py-20 text-muted-foreground">Loading schedule...</div>
          ) : displaySchedules.length === 0 ? (
             <div className="text-center py-20 text-muted-foreground">No sessions scheduled for this day yet.</div>
          ) : (
            <div className="space-y-6">
              {displaySchedules.map((session, idx) => (
                <motion.div
                  key={session._id || idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-primary to-secondary group-hover:w-3 transition-all" />
                  
                  <div className="flex flex-col md:flex-row gap-6 pl-4">
                    <div className="md:w-1/4 flex-shrink-0">
                      <div className="flex items-center gap-2 text-primary font-heading font-bold text-lg mb-1">
                        <Clock size={18} />
                        {session.startTime} - {session.endTime}
                      </div>
                      <span className="inline-block px-3 py-1 bg-muted text-muted-foreground text-xs font-semibold rounded-full uppercase tracking-wider mt-2">
                        {session.type || "Session"}
                      </span>
                    </div>
                    
                    <div className="md:w-3/4">
                      <h3 className="text-xl md:text-2xl font-heading font-bold text-foreground mb-3">{session.title}</h3>
                      {session.description && (
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{session.description}</p>
                      )}
                      <div className="flex flex-wrap gap-4">
                        {session.speaker && (
                          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                            <User size={16} />
                            {session.speaker}
                          </div>
                        )}
                        {session.location && (
                          <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                            <MapPin size={16} />
                            {session.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
        </div>
      </section>

      <Footer />
    </main>
  );
}
