import { useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      'reader',
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    scanner.render(
      (decodedText) => {
        onScan(decodedText);
        scanner.clear();
      },
      () => {
        // console.warn(error);
      }
    );

    return () => {
      scanner.clear().catch(err => console.error("Failed to clear scanner", err));
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-md overflow-hidden relative">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-bold">Scan Barcode</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">Close</button>
        </div>
        <div id="reader" className="w-full"></div>
        <div className="p-4 text-center text-sm text-gray-500">
          Center the barcode within the square to scan.
        </div>
      </div>
    </div>
  );
};

export default BarcodeScanner;
