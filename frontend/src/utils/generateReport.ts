import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { DashboardData } from '../types/dashboard';

function fmt(n: number) {
  return n.toLocaleString();
}
function fmtUSD(n: number) {
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${fmt(n)}`;
}
function fmtPct(n: number) {
  return `${n.toFixed(1)}%`;
}

export function generateReport(data: DashboardData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const s = data.overall_summary;
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 16;
  let y = 0;

  // ── helpers ──────────────────────────────────────────────────────────────
  const sectionTitle = (title: string) => {
    y += 8;
    doc.setFillColor(17, 17, 17);
    doc.rect(margin, y, pageW - margin * 2, 7, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), margin + 3, y + 4.8);
    doc.setTextColor(0, 0, 0);
    y += 11;
  };

  const checkPage = (needed = 30) => {
    if (y + needed > doc.internal.pageSize.getHeight() - 16) {
      doc.addPage();
      y = 16;
    }
  };

  // ── COVER HEADER ─────────────────────────────────────────────────────────
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, pageW, 38, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(255, 255, 255);
  doc.text('StartupIQ — Analytics Report', margin, 17);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(180, 180, 180);
  doc.text(
    `Generated on ${new Date().toLocaleDateString('en-IN', {
      day: '2-digit', month: 'long', year: 'numeric',
    })}   ·   Dataset: 66,368 startups (2000 – 2015)`,
    margin,
    26,
  );

  doc.setTextColor(0, 0, 0);
  y = 46;

  // ── 1. QUICK STATS ───────────────────────────────────────────────────────
  sectionTitle('1. Quick Stats');

  const kpis = [
    ['Total Startups',  fmt(s.total_startups)],
    ['Success Rate',    fmtPct(s.overall_success_rate_pct)],
    ['Total Funding',   fmtUSD(s.total_funding_usd)],
    ['Avg Funding',     fmtUSD(s.avg_funding_usd)],
    ['Avg Rounds',      s.avg_funding_rounds.toFixed(2)],
    ['Closure Rate',    fmtPct(s.closed_rate_pct)],
  ];

  const colW = (pageW - margin * 2) / 3;
  kpis.forEach(([label, value], i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = margin + col * colW;
    const boxY = y + row * 18;

    doc.setFillColor(248, 249, 250);
    doc.roundedRect(x + 1, boxY, colW - 3, 15, 2, 2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(17, 17, 17);
    doc.text(value, x + 4, boxY + 7.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(107, 114, 128);
    doc.text(label, x + 4, boxY + 12.5);
  });
  y += Math.ceil(kpis.length / 3) * 18 + 4;

  // ── 2. STATUS DISTRIBUTION ───────────────────────────────────────────────
  checkPage(60);
  sectionTitle('2. Status Distribution');

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Status', 'Count', 'Share %']],
    body: data.status_distribution.map(r => [
      r.status.charAt(0).toUpperCase() + r.status.slice(1),
      fmt(r.count),
      fmtPct(r.percentage),
    ]),
    headStyles: { fillColor: [17, 17, 17], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 249, 250] },
  });
  y = (doc as any).lastAutoTable.finalY + 4;

  // ── 3. TOP COUNTRIES ─────────────────────────────────────────────────────
  checkPage(80);
  sectionTitle('3. Top Countries by Startup Volume');

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['#', 'Country', 'Total Startups', 'Successful Exits', 'Success Rate']],
    body: data.top_countries.slice(0, 10).map((c, i) => [
      String(i + 1),
      c.country,
      fmt(c.startups),
      fmt(c.successful),
      fmtPct(c.success_rate_pct),
    ]),
    headStyles: { fillColor: [17, 17, 17], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 249, 250] },
    columnStyles: { 0: { cellWidth: 10 } },
  });
  y = (doc as any).lastAutoTable.finalY + 4;

  // ── 4. TOP INDUSTRIES ────────────────────────────────────────────────────
  checkPage(80);
  sectionTitle('4. Top Industries by Success Rate');

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Industry', 'Startups', 'Successful', 'Success Rate']],
    body: data.industry_success_rates.slice(0, 10).map(ind => [
      ind.industry,
      fmt(ind.startups),
      fmt(ind.successful),
      fmtPct(ind.success_rate_pct),
    ]),
    headStyles: { fillColor: [17, 17, 17], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 249, 250] },
  });
  y = (doc as any).lastAutoTable.finalY + 4;

  // ── 5. FUNDING ROUNDS ────────────────────────────────────────────────────
  checkPage(70);
  sectionTitle('5. Funding Rounds vs Success');

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Rounds', 'Startups', 'Successful', 'Success Rate']],
    body: data.funding_rounds_vs_success.map(r => [
      r.rounds,
      fmt(r.startups),
      fmt(r.successful),
      fmtPct(r.success_rate_pct),
    ]),
    headStyles: { fillColor: [17, 17, 17], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 249, 250] },
  });
  y = (doc as any).lastAutoTable.finalY + 4;

  // ── 6. FUNDING AMOUNT BUCKETS ────────────────────────────────────────────
  checkPage(70);
  sectionTitle('6. Funding Amount vs Success');

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Funding Bucket', 'Startups', 'Successful', 'Success Rate']],
    body: data.funding_buckets_vs_success.map(r => [
      r.bucket,
      fmt(r.startups),
      fmt(r.successful),
      fmtPct(r.success_rate_pct),
    ]),
    headStyles: { fillColor: [17, 17, 17], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 249, 250] },
  });
  y = (doc as any).lastAutoTable.finalY + 4;

  // ── 7. YEARLY TRENDS ─────────────────────────────────────────────────────
  checkPage(80);
  sectionTitle('7. Yearly Trends (2000 – 2015)');

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Year', 'Founded', 'Successful', 'Success Rate']],
    body: data.yearly_trends
      .filter(t => t.year >= 2000)
      .map(t => [
        String(t.year),
        fmt(t.startups),
        fmt(t.successful),
        fmtPct(t.success_rate_pct),
      ]),
    headStyles: { fillColor: [17, 17, 17], fontSize: 9 },
    bodyStyles: { fontSize: 8 },
    alternateRowStyles: { fillColor: [248, 249, 250] },
  });
  y = (doc as any).lastAutoTable.finalY + 4;

  // ── 8. AVG FUNDING BY STATUS ─────────────────────────────────────────────
  checkPage(50);
  sectionTitle('8. Average Funding by Status');

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Status', 'Average Funding (USD)']],
    body: data.average_funding_by_status.map(r => [
      r.status.charAt(0).toUpperCase() + r.status.slice(1),
      fmtUSD(r.avg_funding_usd),
    ]),
    headStyles: { fillColor: [17, 17, 17], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 249, 250] },
  });
  y = (doc as any).lastAutoTable.finalY + 4;

  // ── 9. TIME TO FUNDING ───────────────────────────────────────────────────
  checkPage(50);
  sectionTitle('9. Time to First Funding by Status');

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [['Status', 'Avg Years to Funding', 'Count']],
    body: data.time_to_first_funding.map(r => [
      r.status.charAt(0).toUpperCase() + r.status.slice(1),
      r.avg_years.toFixed(2),
      fmt(r.count),
    ]),
    headStyles: { fillColor: [17, 17, 17], fontSize: 9 },
    bodyStyles: { fontSize: 9 },
    alternateRowStyles: { fillColor: [248, 249, 250] },
  });

  // ── FOOTER on every page ─────────────────────────────────────────────────
  const totalPages = (doc as any).internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    const pageH = doc.internal.pageSize.getHeight();
    doc.setFillColor(240, 240, 240);
    doc.rect(0, pageH - 10, pageW, 10, 'F');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(120, 120, 120);
    doc.text('StartupIQ Analytics Dashboard  ·  Confidential', margin, pageH - 3.5);
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 3.5, { align: 'right' });
  }

  // ── SAVE ─────────────────────────────────────────────────────────────────
  const dateStr = new Date().toISOString().slice(0, 10);
  doc.save(`StartupIQ_Report_${dateStr}.pdf`);
}
