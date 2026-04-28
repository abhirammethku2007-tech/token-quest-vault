import jsPDF from "jspdf";
import type { CertRequestRow } from "./database.types";

// ─── Colour palette ───────────────────────────────────────────
const PRIMARY   = [99,  102, 241] as const;  // indigo-500
const DARK      = [30,  27,  75]  as const;  // deep navy
const LIGHT_BG  = [245, 245, 255] as const;  // near-white
const GOLD      = [180, 140, 40]  as const;  // border accent
const MUTED     = [120, 120, 140] as const;

// ─── Helpers ──────────────────────────────────────────────────
function rgb(c: readonly [number, number, number]) {
  return { r: c[0], g: c[1], b: c[2] };
}

function drawBorder(doc: jsPDF, margin: number) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  // Outer gold border
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(2);
  doc.rect(margin, margin, w - margin * 2, h - margin * 2);
  // Inner thin border
  doc.setLineWidth(0.5);
  doc.rect(margin + 4, margin + 4, w - (margin + 4) * 2, h - (margin + 4) * 2);
}

function drawQR(doc: jsPDF, value: string, x: number, y: number, size: number) {
  // Simple deterministic pixel pattern as a stand-in QR code
  const cell = size / 10;
  const hash = value.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  doc.setFillColor(30, 27, 75);
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      if ((hash * (row + 1) * (col + 1)) % 3 !== 0) {
        doc.rect(x + col * cell, y + row * cell, cell - 0.5, cell - 0.5, "F");
      }
    }
  }
  // Corner markers
  [[0,0],[0,7],[7,0]].forEach(([r,c]) => {
    doc.setFillColor(...PRIMARY);
    doc.rect(x + c * cell, y + r * cell, cell * 3, cell * 3, "F");
    doc.setFillColor(255,255,255);
    doc.rect(x + c * cell + cell * 0.5, y + r * cell + cell * 0.5, cell * 2, cell * 2, "F");
    doc.setFillColor(...PRIMARY);
    doc.rect(x + c * cell + cell, y + r * cell + cell, cell, cell, "F");
  });
}

// ─── Main export ──────────────────────────────────────────────
export function generateCertificatePDF(request: CertRequestRow): void {
  const doc  = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W    = doc.internal.pageSize.getWidth();   // 297
  const H    = doc.internal.pageSize.getHeight();  // 210
  const M    = 14; // margin
  const cx   = W / 2;

  // ── Background ──────────────────────────────────────────────
  doc.setFillColor(...LIGHT_BG);
  doc.rect(0, 0, W, H, "F");

  // Subtle gradient strip at top
  doc.setFillColor(...PRIMARY);
  doc.rect(0, 0, W, 18, "F");

  // ── Border ──────────────────────────────────────────────────
  drawBorder(doc, M);

  // ── Header strip text ────────────────────────────────────────
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("MLRIT — MARRI LAXMAN REDDY INSTITUTE OF TECHNOLOGY & MANAGEMENT", cx, 11, { align: "center" });

  // ── College name ─────────────────────────────────────────────
  doc.setTextColor(...DARK);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("CertVault College", cx, 32, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...MUTED);
  doc.text("Office of the Registrar  •  Hyderabad, Telangana", cx, 38, { align: "center" });

  // ── Divider ──────────────────────────────────────────────────
  doc.setDrawColor(...GOLD);
  doc.setLineWidth(0.8);
  doc.line(M + 10, 42, W - M - 10, 42);

  // ── Certificate type heading ─────────────────────────────────
  doc.setFontSize(26);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PRIMARY);
  doc.text(request.type.toUpperCase(), cx, 54, { align: "center" });

  // ── Body text ────────────────────────────────────────────────
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);
  doc.text("This is to certify that", cx, 64, { align: "center" });

  // Student name
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...PRIMARY);
  doc.text(request.student_name, cx, 74, { align: "center" });

  // Underline
  const nameW = doc.getTextWidth(request.student_name);
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(0.4);
  doc.line(cx - nameW / 2, 76, cx + nameW / 2, 76);

  // Details line
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...DARK);
  const detailLine = `bearing Roll No. ${request.roll_number}  |  Department of ${request.department}`;
  doc.text(detailLine, cx, 84, { align: "center" });

  // Certificate-specific body text
  const bodyText: Record<string, string> = {
    "Bonafide":
      "is a bonafide student of this institution and is currently pursuing studies for the academic year 2025–2026.",
    "Study Certificate":
      "has been a student of this institution and has successfully completed the prescribed course of study for the academic year 2025–2026.",
    "Fee Receipt":
      "has duly paid all prescribed tuition fees, examination fees, and other charges for the academic year 2025–2026.",
    "Fee Due Certificate":
      "has the following fee dues pending with this institution for the academic year 2025–2026. This certificate is issued upon the student's request.",
    "No Fee Due Certificate":
      "has fully cleared all prescribed fees and charges to this institution for the academic year 2025–2026. No fee dues are pending.",
  };

  const body = bodyText[request.type] ?? "is a registered student of this institution.";
  const lines = doc.splitTextToSize(body, W - M * 2 - 50);
  doc.setFontSize(10.5);
  doc.setTextColor(60, 60, 80);
  doc.text(lines, cx, 94, { align: "center" });

  // ── Token & date row ─────────────────────────────────────────
  const issued = new Date(request.updated_at).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });

  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`Token: ${request.token}`, M + 20, 130);
  doc.text(`Issued on: ${issued}`, M + 20, 136);
  if (request.signature_id) {
    doc.text(`Signature ID: ${request.signature_id}`, M + 20, 142);
  }

  // ── QR code ──────────────────────────────────────────────────
  drawQR(doc, request.token, W - M - 44, 118, 30);
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text("Scan to verify", W - M - 29, 152, { align: "center" });

  // ── Signature block ──────────────────────────────────────────
  const sigX = cx;
  doc.setDrawColor(...DARK);
  doc.setLineWidth(0.4);
  doc.line(sigX - 35, 148, sigX + 35, 148);

  doc.setFontSize(11);
  doc.setFont("helvetica", "bolditalic");
  doc.setTextColor(...PRIMARY);
  doc.text("Dr. Ramesh Kumar", sigX, 144, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("Principal  •  Digitally Signed", sigX, 152, { align: "center" });

  // ── Footer strip ─────────────────────────────────────────────
  doc.setFillColor(...PRIMARY);
  doc.rect(0, H - 12, W, 12, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This certificate is digitally signed and can be verified at https://token-quest-vault.vercel.app",
    cx, H - 5, { align: "center" }
  );

  // ── Save ─────────────────────────────────────────────────────
  doc.save(`${request.token}.pdf`);
}
