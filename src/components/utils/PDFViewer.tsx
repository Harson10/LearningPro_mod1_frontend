import React from 'react';

interface PDFViewerProps {
  pdfUrl: string;
  width?: string;
  height?: string;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ pdfUrl, width = '100%', height = '450px' }) => {
  return (
    <iframe
      src={pdfUrl}
      width={width}
      height={height}
      style={{ border: 'none' }}
      title="PDF Viewer"
    />
  );
};

export default PDFViewer;
