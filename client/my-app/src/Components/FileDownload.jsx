import React from 'react';
import { Download } from 'lucide-react';
import api from '../services/api';

const FileDownload = ({ challengeId }) => {
  const handleDownload = async (e) => {
    e.preventDefault();
    try {
      const response = await api.get(`/challenge/${challengeId}/download`, {
        responseType: 'blob',
      });
      
      // Extract filename from header if possible, else default
      let filename = 'challenge_file';
      const disposition = response.headers['content-disposition'];
      if (disposition && disposition.indexOf('attachment') !== -1) {
        const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = filenameRegex.exec(disposition);
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('File download failed', error);
      alert('Failed to download file.');
    }
  };

  return (
    <a href="#" className="download-btn" onClick={handleDownload} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
      <Download size={18} />
      <span>Download Associated File</span>
    </a>
  );
};

export default FileDownload;
