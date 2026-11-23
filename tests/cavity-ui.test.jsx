// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from '../src/App.jsx';
afterEach(cleanup);
const slide = (l, v) => fireEvent.change(screen.getByLabelText(l), { target: { value: String(v) } }), txt = (id) => screen.getByTestId(id).textContent, count = () => parseInt(txt('lasing-count'), 10);
describe('cavity panel', () => {
  it('cavity length sets the mode spacing c/2L', () => { render(<App />); slide('Cavity length L (cm)', 60); expect(txt('fsr')).toContain('0.2498'); slide('Cavity length L (cm)', 30); expect(txt('fsr')).toContain('0.4997'); });
  it('tuning switches between constructive and destructive interference', () => { render(<App />); slide('Cavity tuning δ (fraction of FSR)', 0); expect(txt('buildup')).toContain('constructive'); slide('Cavity tuning δ (fraction of FSR)', 0.5); expect(txt('buildup')).toContain('destructive'); expect(txt('buildup')).not.toContain('constructive'); });
  it('pump and gain bandwidth change which modes can oscillate', () => {
    render(<App />); slide('Pump rate Wp', 0.001); expect(count()).toBe(0); slide('Pump rate Wp', 0.02); slide('Gain bandwidth (GHz, illustrative)', 0.5); const a = count(); slide('Gain bandwidth (GHz, illustrative)', 6); expect(count()).toBeGreaterThan(a);
  });
  it('the real mode number and both figures are drawn', () => { render(<App />); expect(txt('mode-n')).toMatch(/5\.639e\+5/); expect(screen.getByRole('img', { name: /forward, backward and standing wave/ })).toBeTruthy(); expect(screen.getByRole('img', { name: /Gain curve and allowed cavity modes/ })).toBeTruthy(); });
  it('lasing-mode ticks appear only when modes are above threshold', () => { const { container } = render(<App />); slide('Pump rate Wp', 0.001); expect(container.querySelectorAll('[data-kind="lasing"]').length).toBe(0); slide('Pump rate Wp', 0.03); expect(container.querySelectorAll('[data-kind="lasing"]').length).toBeGreaterThan(0); });
});
