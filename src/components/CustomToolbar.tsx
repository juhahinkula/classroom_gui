import { Toolbar, ExportCsv, ToolbarButton } from '@mui/x-data-grid';
import Tooltip from '@mui/material/Tooltip';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default  function CustomToolbar() {
    return (
      <Toolbar>
        <Tooltip title="Download as CSV">
          <ExportCsv render={<ToolbarButton />}>
            <FileDownloadIcon fontSize="small" />
          </ExportCsv>
        </Tooltip>
      </Toolbar>
    );
  }  
