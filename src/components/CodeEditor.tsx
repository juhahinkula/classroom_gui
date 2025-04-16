import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { styled } from '@mui/material/styles';
import { createHtmlCode, transpileTsxToJsx } from '../utils';
import SaveIcon from '@mui/icons-material/Save';

type CodeEditorProps = {
  open: boolean;
  onClose: () => void;
  code: string;
  repositoryUrl: string;
}

const StyledDialogContent = styled(DialogContent)({
  width: '800px',
  height: '600px',
  padding: 0,
  overflow: 'hidden'
});

function CodeEditor({ open, onClose, code, repositoryUrl}: CodeEditorProps) {
  const [editorCode, setEditorCode] = useState(code);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [fileName, setFileName] = useState("student-code.tsx");

  useEffect(() => {
    setEditorCode(code);
  }, [code]);

  const getHtmlCode = () => {
    // Check if the code is ts !!!!
    const transpiledCode = transpileTsxToJsx(code);
  
    const htmlCode = createHtmlCode(transpiledCode);
    setEditorCode(htmlCode);
    setIsHtmlMode(true);
    setFileName("student-code.html");
  };

  const changeTsCode = () => {
    setEditorCode(code);
    setIsHtmlMode(false);
    setFileName("student-code.tsx");
  };

  const saveToFile = () => {
    const blob = new Blob([editorCode], { type: 'text/html' });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    document.body.appendChild(link);
    link.click();
    
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle>
        Student Code: {repositoryUrl}
      </DialogTitle>
      <StyledDialogContent>
        <CodeMirror
          value={editorCode}
          height="100%"
          theme="dark"
          extensions={[isHtmlMode ? html() : javascript({ jsx: true })]}
          onChange={(value) => setEditorCode(value)}
          editable={true}
        />
      </StyledDialogContent>
      <DialogActions>
        {
          import.meta.env.VITE_TS_MODE == "true" &&
          <>
        <Button onClick={changeTsCode} >Original</Button>
        <Button onClick={getHtmlCode}>HTML</Button>
        <Button 
          onClick={saveToFile}
          startIcon={<SaveIcon />} 
          color="primary"
          disabled={!isHtmlMode}
        >
          Save HTML
        </Button>
        </>
        }
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CodeEditor;