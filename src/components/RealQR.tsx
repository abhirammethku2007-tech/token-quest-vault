import { QRCodeSVG } from "qrcode.react";

interface RealQRProps {
  value: string;
  size?: number;
}

/** Real scannable QR code linking to the certificate verification page */
export function RealQR({ value, size = 96 }: RealQRProps) {
  const verifyUrl = `${window.location.origin}/verify/${value}`;
  return (
    <div className="rounded-lg bg-white p-1.5 shadow-sm inline-block">
      <QRCodeSVG
        value={verifyUrl}
        size={size}
        bgColor="#ffffff"
        fgColor="#1e1b4b"
        level="M"
        includeMargin={false}
      />
    </div>
  );
}
