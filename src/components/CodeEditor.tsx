import { useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import CodeMirror from '@uiw/react-codemirror';
import { javascript, typescriptLanguage } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { createHtmlCode, transpileTsxToJsx } from '../utils';
import SaveIcon from '@mui/icons-material/Save';
import GithubRepoTree from './GitHubRepoTree';

type CodeEditorProps = {
  open: boolean;
  onClose: () => void;
  code: string;
  repositoryUrl: string;
  repositoryName: string;
}

function CodeEditor({ open, onClose, code, repositoryUrl, repositoryName}: CodeEditorProps) {
  const [editorCode, setEditorCode] = useState(code);
  const [isHtmlMode, setIsHtmlMode] = useState(false);
  const [fileName, setFileName] = useState("student-code.tsx");
 
  useEffect(() => {
    setEditorCode(code);
  }, [code]);

  const getHtmlCode = () => {
    // Add check if the file is TypeScript
    const transpiledCode = transpileTsxToJsx(code);
  
    const htmlCode = createHtmlCode(transpiledCode);
    setEditorCode(htmlCode);
    setIsHtmlMode(true);
    setFileName("student-code.html");
  };

  const setSourceCode = (code: string) => {
    setEditorCode(code);  
  }

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
        Student Code
      </DialogTitle>
      <DialogContent sx={{ height: '90%' }}>
        <Stack 
          flexDirection="row" 
          spacing={2} 
          sx={{ 
            height: '100%', 
            width: '100%', 
          }}
        >
          <GithubRepoTree 
            repoUrl={repositoryUrl} 
            setSourceCode={setSourceCode}
            repositoryName={repositoryName}
          />
          <CodeMirror
            value={editorCode}
            height="100%"
            width="90%"
            theme="light"
            extensions={[isHtmlMode ? html() : javascript({ jsx: true })]}
            onChange={(value) => setEditorCode(value)}
            editable={true}
            style={{ flex: 3 }}
          />
        </Stack>
      </DialogContent>
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