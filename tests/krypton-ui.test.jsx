// @vitest-environment jsdom
import React from 'react';
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import App from '../src/App.jsx';
afterEach(cleanup);
const sec = (n) => fireEvent.click(screen.getByRole('button', { name: n }));
describe('new sections', () => {
  it('Types of Lasers shows the Kr+ case study; Fundamentals still works afterwards', () => {
    render(<App />); sec('02 Types of Lasers'); expect(screen.getByText(/Krypton ion laser \(Kr⁺\)/)).toBeTruthy(); expect(screen.getByText(/singly ionized/)).toBeTruthy();
    sec('01 Laser Fundamentals'); fireEvent.change(screen.getByLabelText('Pump rate Wp'), { target: { value: '0.03' } }); expect(screen.getByTestId('wp').textContent).toContain('0.0300');
  });
  it('line selection updates levels, photon energy and wavelength', () => {
    render(<App />); sec('03 Applications & Virtual Experiments'); expect(screen.getByTestId('kr-nm').textContent).toContain('647.');
    fireEvent.click(screen.getByRole('button', { name: '568.2 nm' })); expect(screen.getByTestId('kr-nm').textContent).toContain('568.'); expect(parseFloat(screen.getByTestId('kr-ev').textContent)).toBeCloseTo(2.182, 2);
    expect(screen.getByTestId('kr-up').textContent).toContain('136069.23');
  });
  it('clicking an energy level highlights its transitions', () => { render(<App />); sec('03 Applications & Virtual Experiments'); fireEvent.click(screen.getAllByRole('button').find((b) => /level 4p⁴\(³P\)5s ²P3\/2/.test(b.getAttribute('aria-label') || ''))); expect(screen.getByText(/Selected level/)).toBeTruthy(); });
});
