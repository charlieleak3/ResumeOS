import React from 'react';
import { DatePeriod } from '../types';

interface DatePeriodSelectorProps {
  value?: DatePeriod;
  theme: any;
  onChange: (period: DatePeriod) => void;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const YEARS = Array.from({ length: 40 }, (_, i) => (new Date().getFullYear() - i).toString());

export const DatePeriodSelector: React.FC<DatePeriodSelectorProps> = ({
  value = { startMonth: 'Jan', startYear: '2023', endMonth: 'Dec', endYear: '2025', isCurrent: false },
  theme,
  onChange,
}) => {
  const updateField = (field: keyof DatePeriod, val: any) => {
    onChange({ ...value, [field]: val });
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', backgroundColor: theme.bgMain, padding: '0.2rem 0.4rem', borderRadius: '4px', border: `1px solid ${theme.borderColor}` }}>
      {/* Start Month & Year */}
      <select value={value.startMonth} onChange={(e) => updateField('startMonth', e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: '0.78rem', color: theme.textPrimary, cursor: 'pointer' }}>
        {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
      </select>
      <select value={value.startYear} onChange={(e) => updateField('startYear', e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: '0.78rem', color: theme.textPrimary, cursor: 'pointer' }}>
        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
      </select>

      <span style={{ color: theme.textSecondary }}>–</span>

      {/* End Month & Year OR Present */}
      {value.isCurrent ? (
        <span style={{ fontWeight: 'bold', color: theme.accentColor, padding: '0 0.3rem', fontSize: '0.78rem' }}>Present</span>
      ) : (
        <>
          <select value={value.endMonth} onChange={(e) => updateField('endMonth', e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: '0.78rem', color: theme.textPrimary, cursor: 'pointer' }}>
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select value={value.endYear} onChange={(e) => updateField('endYear', e.target.value)} style={{ border: 'none', background: 'transparent', fontSize: '0.78rem', color: theme.textPrimary, cursor: 'pointer' }}>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </>
      )}

      {/* Current Position Checkbox */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', color: theme.textSecondary }}>
        <input
          type="checkbox"
          checked={value.isCurrent}
          onChange={(e) => updateField('isCurrent', e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
        Current
      </label>
    </div>
  );
};