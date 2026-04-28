import jsPDF from "jspdf";
import QRCode from "qrcode";
import type { CertRequestRow } from "./database.types";

// ─── Colour palette ───────────────────────────────────────────
const INDIGO  = [79,  70,  229] as const;
const PURPLE  = [124, 58,  237] as const;
const DARK    = [30,  27,  75]  as const;
const MUTED   = [107, 114, 128] as const;
const LIGHT   = [249, 250, 251] as const;
const WHITE   = [255, 255, 255] as const;
const GREEN   = [22,  163, 74]  as const;
const AMBER   = [217, 119, 6]   as const;

// ─── Helpers ──────────────────────────────────────────────────
function setFill(doc: jsPDF, c: readonly [number, number, number]) {
  doc.setFillColor(c[0], c[1], c[2]);
}
function setDraw(doc: jsPDF, c: readonly [number, number, number]) {
  doc.setDrawColor(c[0], c[1], c[2]);
}
function setTxt(doc: jsPDF, c: readonly [number, number, number]) {
  doc.setTextColor(c[0], c[1], c[2]);
}

// Draw a gradient-like top/bottom bar using two rects
function drawBar(doc: jsPDF, y: number, h: number, W: number) {
  setFill(doc, INDIGO);
  doc.rect(0, y, W / 2, h, "F");
  setFill(doc, PURPLE);
  doc.rect(W / 2, y, W / 2, h, "F");
}

// Corner bracket ornament
function drawCorner(doc: jsPDF, x: number, y: number, size: number, flipX: boolean, flipY: boolean) {
  setDraw(doc, [199, 210, 254]); // indigo-200
  doc.setLineWidth(1.2);
  const sx = flipX ? -1 : 1;
  const sy = flipY ? -1 : 1;
  doc.line(x, y, x + sx * size, y);
  doc.line(x, y, x, y + sy * size);
}

// Certificate body text per type
const BODY: Record<string, string> = {
  "Bonafide":
    "is a bonafide student of this institution and is currently pursuing studies for the academic year 2025–2026.",
  "Study Certificate":
    "has been a student of this institution and has successfully completed the prescribed course of study for the academic year 2025–2026.",
  "Fee Receipt":
    "has duly paid all prescribed tuition fees, examination fees, and other charges for the academic year 2025–2026.",
  "Fee Due Certificate":
    "has the following fee dues pending with this institution for the academic year 2025–2026.",
  "No Fee Due Certificate":
    "has fully cleared all prescribed fees and charges to this institution for the academic year 2025–2026. No fee dues are pending.",
};

// ─── Main export ──────────────────────────────────────────────
export async function generateCertificatePDF(request: CertRequestRow): Promise<void> {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W   = doc.internal.pageSize.getWidth();   // 297
  const H   = doc.internal.pageSize.getHeight();  // 210
  const cx  = W / 2;
  const M   = 14;

  // ── Background ──────────────────────────────────────────────
  setFill(doc, LIGHT);
  doc.rect(0, 0, W, H, "F");

  // ── Top & bottom bars ────────────────────────────────────────
  drawBar(doc, 0, 5, W);
  drawBar(doc, H - 5, 5, W);

  // ── Corner ornaments ─────────────────────────────────────────
  const cs = 18;
  drawCorner(doc, M,     M,     cs, false, false);
  drawCorner(doc, W - M, M,     cs, true,  false);
  drawCorner(doc, M,     H - M, cs, false, true);
  drawCorner(doc, W - M, H - M, cs, true,  true);

  // ── Watermark ────────────────────────────────────────────────
  doc.setTextColor(237, 233, 254); // very light indigo
  doc.setFontSize(80);
  doc.setFont("helvetica", "bold");
  doc.text("CERTIFIED", cx, H / 2 + 20, { align: "center", angle: -15 });

  // ── Logo circle ──────────────────────────────────────────────
  setFill(doc, INDIGO);
  doc.circle(cx, 28, 8, "F");
  setTxt(doc, WHITE);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("CV", cx, 30.5, { align: "center" });

  // ── College name ─────────────────────────────────────────────
  setTxt(doc, DARK);
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("MLRIT CertVault", cx, 42, { align: "center" });

  setTxt(doc, MUTED);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("MARRI LAXMAN REDDY INSTITUTE OF TECHNOLOGY & MANAGEMENT", cx, 47, { align: "center" });

  // ── Divider ──────────────────────────────────────────────────
  setDraw(doc, [199, 210, 254]);
  doc.setLineWidth(0.5);
  doc.line(M + 20, 51, W - M - 20, 51);

  setTxt(doc, MUTED);
  doc.setFontSize(7);
  doc.text("OFFICE OF THE REGISTRAR", cx, 56, { align: "center" });

  // ── Certificate type ─────────────────────────────────────────
  setTxt(doc, INDIGO);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(request.type.toUpperCase(), cx, 66, { align: "center" });

  // Underline
  const tw = doc.getTextWidth(request.type.toUpperCase());
  setDraw(doc, INDIGO);
  doc.setLineWidth(0.6);
  doc.line(cx - tw / 2, 68, cx + tw / 2, 68);

  // ── Body ─────────────────────────────────────────────────────
  setTxt(doc, MUTED);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.text("This is to certify that", cx, 76, { align: "center" });

  // Student name
  setTxt(doc, DARK);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(request.student_name, cx, 85, { align: "center" });

  // Name underline
  const nw = doc.getTextWidth(request.student_name);
  setDraw(doc, PURPLE);
  doc.setLineWidth(0.4);
  doc.line(cx - nw / 2, 87, cx + nw / 2, 87);

  // Roll & dept
  setTxt(doc, MUTED);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Roll No. ${request.roll_number}   ·   Department of ${request.department}`,
    cx, 93, { align: "center" }
  );

  // Body text
  const body = BODY[request.type] ?? "is a registered student of this institution.";
  const lines = doc.splitTextToSize(body, 160);
  setTxt(doc, [75, 85, 99]);
  doc.setFontSize(9);
  doc.text(lines, cx, 101, { align: "center" });

  // ── Divider ──────────────────────────────────────────────────
  setDraw(doc, [229, 231, 235]);
  doc.setLineWidth(0.3);
  doc.line(M + 10, 118, W - M - 10, 118);

  // ── Footer row ───────────────────────────────────────────────
  const footerY = 130;

  // Left — token & date
  setTxt(doc, MUTED);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("TOKEN", M + 18, footerY);
  setTxt(doc, DARK);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text(request.token, M + 18, footerY + 5);

  const issued = new Date(request.updated_at).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
  });
  setTxt(doc, MUTED);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text("ISSUED ON", M + 18, footerY + 12);
  setTxt(doc, DARK);
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.text(issued, M + 18, footerY + 17);

  // Center — QR code (real, scannable)
  try {
    const verifyUrl = `${window.location.origin}/verify/${request.token}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: { dark: "#1e1b4b", light: "#ffffff" },
    });
    const qrSize = 32;
    doc.addImage(qrDataUrl, "PNG", cx - qrSize / 2, footerY - 6, qrSize, qrSize);
    setTxt(doc, MUTED);
    doc.setFontSize(6.5);
    doc.setFont("helvetica", "normal");
    doc.text("Scan to verify", cx, footerY + 28, { align: "center" });
  } catch {
    // fallback if QR fails
    setTxt(doc, MUTED);
    doc.setFontSize(7);
    doc.text("[QR Code]", cx, footerY + 10, { align: "center" });
  }

  // Right — signature
  const sigX = W - M - 40;
  doc.setFontSize(13);
  doc.setFont("helvetica", "bolditalic");
  setTxt(doc, INDIGO);
  doc.text("Dr. Ramesh Kumar", sigX, footerY + 5, { align: "center" });

  setDraw(doc, DARK);
  doc.setLineWidth(0.3);
  doc.line(sigX - 28, footerY + 8, sigX + 28, footerY + 8);

  setTxt(doc, MUTED);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.text("Principal", sigX, footerY + 13, { align: "center" });

  if (request.signature_id) {
    setFill(doc, [240, 253, 244]);
    setDraw(doc, [134, 239, 172]);
    doc.setLineWidth(0.3);
    doc.roundedRect(sigX - 22, footerY + 16, 44, 8, 2, 2, "FD");
    setTxt(doc, GREEN);
    doc.setFontSize(6.5);
    doc.text(`✓ ${request.signature_id}`, sigX, footerY + 21, { align: "center" });
  } else {
    setFill(doc, [255, 251, 235]);
    setDraw(doc, [252, 211, 77]);
    doc.setLineWidth(0.3);
    doc.roundedRect(sigX - 22, footerY + 16, 44, 8, 2, 2, "FD");
    setTxt(doc, AMBER);
    doc.setFontSize(6.5);
    doc.text("Pending Signature", sigX, footerY + 21, { align: "center" });
  }

  // ── Bottom footer text ────────────────────────────────────────
  setTxt(doc, WHITE);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.text(
    `Verify at: ${window.location.origin}/verify/${request.token}`,
    cx, H - 2, { align: "center" }
  );

  // ── Save ─────────────────────────────────────────────────────
  doc.save(`${request.token}.pdf`);
}
