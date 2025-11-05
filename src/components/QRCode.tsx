import { useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';

interface QRCodeProps {
  data: string;
}

const QRCode = ({ data }: QRCodeProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      const qrCode = new QRCodeStyling({
        width: 128,
        height: 128,
        data,
        dotsOptions: { color: '#000000', type: 'extra-rounded' },
        backgroundOptions: { color: '#FFFFFF' },
      });
      ref.current.innerHTML = '';
      qrCode.append(ref.current);
    }
  }, [data]);

  return <div ref={ref} />;
};

export default QRCode;
