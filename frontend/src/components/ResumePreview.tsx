import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';

interface ResumePreviewProps {
  resumeHtml: string;
  isLoading?: boolean;
  onRegenerate?: () => void;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({
  resumeHtml,
  isLoading = false,
  onRegenerate,
}) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Resume</title>
            <style>
              @media print {
                body { margin: 0; padding: 20px; }
                .no-print { display: none; }
              }
            </style>
          </head>
          <body>
            ${resumeHtml}
            <div class="no-print" style="margin-top: 20px; text-align: center;">
              <button onclick="window.print()">Print Resume</button>
              <button onclick="window.close()">Close</button>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const handleDownload = () => {
    const blob = new Blob([resumeHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'resume.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = async () => {
    try {
      // You can implement PDF generation here using libraries like jsPDF or html2pdf
      // For now, we'll just show an alert
      alert('PDF download feature coming soon!');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<VisibilityIcon />}
          onClick={() => setPreviewOpen(true)}
          disabled={isLoading || !resumeHtml}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            },
          }}
        >
          Preview Resume
        </Button>

        {onRegenerate && (
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={onRegenerate}
            disabled={isLoading}
            sx={{
              borderColor: '#667eea',
              color: '#667eea',
              '&:hover': {
                borderColor: '#5a67d8',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
              },
            }}
          >
            Regenerate
          </Button>
        )}

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
          disabled={isLoading || !resumeHtml}
          sx={{
            borderColor: '#10b981',
            color: '#10b981',
            '&:hover': {
              borderColor: '#059669',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
            },
          }}
        >
          Download HTML
        </Button>

        <Button
          variant="outlined"
          startIcon={<PrintIcon />}
          onClick={handlePrint}
          disabled={isLoading || !resumeHtml}
          sx={{
            borderColor: '#f59e0b',
            color: '#f59e0b',
            '&:hover': {
              borderColor: '#d97706',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
            },
          }}
        >
          Print
        </Button>
      </Box>

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!isLoading && !resumeHtml && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Generate a resume to preview it here.
        </Alert>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            maxHeight: '90vh',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">Resume Preview</Typography>
          <Box>
            <Tooltip title="Print">
              <IconButton onClick={handlePrint} size="small">
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton onClick={handleDownload} size="small">
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Close">
              <IconButton onClick={() => setPreviewOpen(false)} size="small">
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </DialogTitle>
        <DialogContent sx={{ p: 0, overflow: 'hidden' }}>
          <Box
            sx={{
              height: '100%',
              overflow: 'auto',
              p: 2,
              backgroundColor: '#f8fafc',
            }}
          >
            {resumeHtml ? (
              <Box
                dangerouslySetInnerHTML={{ __html: resumeHtml }}
                sx={{
                  backgroundColor: 'white',
                  borderRadius: 2,
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  minHeight: '100%',
                }}
              />
            ) : (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <Typography color="text.secondary">No resume content to preview</Typography>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ResumePreview;
