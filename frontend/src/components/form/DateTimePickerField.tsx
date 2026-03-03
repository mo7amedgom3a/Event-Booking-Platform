import { useState, useId } from 'react';
import { Input } from '@/components/ui/input';
import { getTimeString, timeToId } from '@/utils/formatters';

export const DateTimePickerField = ({ value, onChange, placeholder = "Schedule appointment" }: { value: string, onChange: (v: string) => void, placeholder?: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  const idPrefix = useId();

  let initialDate = "";
  let initialTime = "12:00 AM"; 
  if (value) {
    const d = new Date(value);
    if (!isNaN(d.getTime())) {
      initialDate = d.toISOString().split('T')[0];
      initialTime = getTimeString(d);
    }
  }

  const [tempDate, setTempDate] = useState(initialDate);
  const [tempTime, setTempTime] = useState(initialTime);

  const times = [
    "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", 
    "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM"
  ];

  const handleOpen = () => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setTempDate(d.toISOString().split('T')[0]);
        setTempTime(getTimeString(d));
      }
    } else {
      setTempDate("");
      setTempTime("12:00 AM");
    }
    setIsOpen(true);
  };

  const onSave = () => {
    if (tempDate && tempTime) {
      const match = tempTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let h = parseInt(match[1], 10);
        const m = parseInt(match[2], 10);
        const ampm = match[3].toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        const formattedDate = `${tempDate}T${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`;
        onChange(formattedDate);
      }
    } else if (tempDate) {
      onChange(`${tempDate}T00:00:00`);
    } else {
      onChange("");
    }
    setIsOpen(false);
  };

  const displayValue = value ? new Date(value).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }) : placeholder;

  return (
    <>
      <button 
        type="button" 
        onClick={handleOpen}
        className="inline-flex w-full items-center justify-center text-foreground bg-secondary box-border border border-border hover:bg-secondary/80 focus:ring-4 focus:ring-primary/20 shadow-sm font-medium leading-5 rounded-md text-sm px-4 py-2.5 focus:outline-none"
      >
         <svg className="w-4 h-4 me-1.5 -ms-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/></svg>
         {displayValue}
      </button>

      {isOpen && (
        <div className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full bg-black/50 backdrop-blur-sm">
          <div className="relative p-4 w-full max-w-[23rem] max-h-full">
            <div className="relative bg-background rounded-md shadow-lg border border-border">
              <div className="flex items-center justify-between p-4 border-b rounded-t border-border">
                  <h3 className="font-medium text-foreground">
                      Schedule appointment
                  </h3>
                 <button type="button" onClick={() => setIsOpen(false)} className="text-foreground bg-transparent hover:bg-secondary hover:text-foreground rounded-md text-sm w-9 h-9 ms-auto inline-flex justify-center items-center">
                      <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/></svg>
                      <span className="sr-only">Close modal</span>
                  </button>
              </div>
              <div className="p-4 pt-0">
                  <div className="mx-auto flex justify-center my-5">
                    <Input 
                      type="date" 
                      value={tempDate} 
                      onChange={(e) => setTempDate(e.target.value)} 
                      className="w-full bg-secondary border-border"
                    />
                  </div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                  Pick your time
                  </label>
                  <ul className="grid w-full grid-cols-3 gap-2 mb-5">
                      {times.map((t) => (
                        <li key={t}>
                            <input 
                              type="radio" 
                              id={`time-${idPrefix}-${timeToId(t)}`} 
                              className="hidden peer" 
                              name={`timetable-${idPrefix}`}
                              checked={tempTime === t}
                              onChange={() => setTempTime(t)}
                            />
                            <label htmlFor={`time-${idPrefix}-${timeToId(t)}`}
                            className="inline-flex items-center justify-center w-full p-2 text-sm font-medium text-center bg-background border rounded-md cursor-pointer text-primary border-primary peer-checked:border-primary peer-checked:bg-primary hover:text-primary-foreground peer-checked:text-primary-foreground hover:bg-primary/90">
                            {t}
                            </label>
                        </li>
                      ))}
                  </ul>
                  <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={onSave} className="text-primary-foreground bg-primary border border-transparent hover:bg-primary/90 shadow-sm font-medium rounded-md text-sm px-4 py-2.5 focus:outline-none">Save</button>
                      <button type="button" onClick={() => setIsOpen(false)} className="text-foreground bg-secondary border border-border hover:bg-secondary/80 shadow-sm font-medium rounded-md text-sm px-4 py-2.5 focus:outline-none">Discard</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
