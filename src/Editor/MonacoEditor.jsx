'use client';
import { useRef, useEffect, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import useIDEStore from '@/store/ideStore';
import { useFileSystem } from '@/hooks/useFileSystem';
import {
  JS_SNIPPET_EXPANSIONS,
  REACT_SNIPPET_EXPANSIONS,
  HTML_EMMET_EXPANSIONS,
  EMMET_MAP,
} from '@/lib/emmet';

const MONACO_DARK = {
  base: 'vs-dark',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#1e1e1e',
    'editor.foreground': '#cccccc',
    'editorLineNumber.foreground': '#858585',
    'editorCursor.foreground': '#aeafad',
    'editor.selectionBackground': '#264f78',
    'editor.lineHighlightBackground': '#2d2d2d',
  },
};

const MONACO_LIGHT = {
  base: 'vs',
  inherit: true,
  rules: [],
  colors: {
    'editor.background': '#ffffff',
  },
};

const MONACO_AQUA = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'keyword', foreground: '00d4ff' },
    { token: 'string', foreground: '7ec8e3' },
    { token: 'comment', foreground: '5a8fa8', fontStyle: 'italic' },
  ],
  colors: {
    'editor.background': '#0d1117',
    'editor.foreground': '#c9e8ff',
    'editorLineNumber.foreground': '#5a8fa8',
    'editor.selectionBackground': '#1a3a5c',
    'editor.lineHighlightBackground': '#0f1f35',
    'editorCursor.foreground': '#00d4ff',
  },
};

export default function MonacoEditor({ file }) {
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const {
    theme, fontSize, fontFamily, tabSize, wordWrap, minimap,
    lineNumbers, indentGuides, bracketPairColorization,
    smoothScrolling, formatOnSave, stickyScroll, editorZoom,
    setEditorZoom, autoSave, setFileContent, fileContents, addToast,
    setPreviewUrl, previewVisible,
  } = useIDEStore();
  const { writeFile } = useFileSystem();
  const saveTimeout = useRef(null);

  const getMonacoTheme = () => {
    if (theme === 'aqua') return 'aqua-theme';
    if (theme === 'light') return 'light-theme';
    return 'dark-theme';
  };

  const handleEditorDidMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register themes
    monaco.editor.defineTheme('dark-theme', MONACO_DARK);
    monaco.editor.defineTheme('light-theme', MONACO_LIGHT);
    monaco.editor.defineTheme('aqua-theme', MONACO_AQUA);
    monaco.editor.setTheme(getMonacoTheme());

    // Ctrl+S save
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, async () => {
      await saveFile(editor.getValue());
    });

    // Ctrl+Shift+P — handled globally
    // Format on save (Shift+Alt+F)
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF, () => {
      editor.getAction('editor.action.formatDocument')?.run();
    });

    // Ctrl+/ toggle comment
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Slash, () => {
      editor.getAction('editor.action.commentLine')?.run();
    });

    // Ctrl+D select next occurrence
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyD, () => {
      editor.getAction('editor.action.addSelectionToNextFindMatch')?.run();
    });

    // Ctrl+G go to line
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG, () => {
      editor.getAction('editor.action.gotoLine')?.run();
    });

    // Alt+Up/Down move line
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.UpArrow, () => {
      editor.getAction('editor.action.moveLinesUpAction')?.run();
    });
    editor.addCommand(monaco.KeyMod.Alt | monaco.KeyCode.DownArrow, () => {
      editor.getAction('editor.action.moveLinesDownAction')?.run();
    });

    // Ctrl+Shift+K delete line
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyK, () => {
      editor.getAction('editor.action.deleteLines')?.run();
    });

    // Register Emmet/snippet completions
    registerCompletions(monaco, file.language);

    // Ctrl+Scroll zoom
    editor.getDomNode()?.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -1 : 1;
        const newZoom = Math.min(200, Math.max(50, editorZoom + delta * 2));
        setEditorZoom(newZoom);
      }
    }, { passive: false });

  }, [file.language, theme]);

  const saveFile = useCallback(async (content) => {
    if (!file.handle) return;
    if (formatOnSave && editorRef.current) {
      await editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
    const finalContent = editorRef.current?.getValue() || content;
    const success = await writeFile(file.handle, finalContent);
    if (success) {
      setFileContent(file.path, finalContent);
      addToast({ type: 'success', message: `Saved: ${file.name}`, duration: 1500 });
      if (previewVisible) {
        updatePreview(finalContent, file.name);
      }
    }
  }, [file, writeFile, setFileContent, addToast, formatOnSave, previewVisible]);

  const updatePreview = useCallback((content, filename) => {
    if (filename.endsWith('.html')) {
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
    }
  }, [setPreviewUrl]);

  const handleChange = useCallback((value) => {
    setFileContent(file.path, value);
    // Auto save
    if (autoSave) {
      clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => saveFile(value), 2000);
    }
  }, [file.path, autoSave, saveFile, setFileContent]);

  // Update theme when changed
  useEffect(() => {
    if (monacoRef.current && editorRef.current) {
      monacoRef.current.editor.setTheme(getMonacoTheme());
    }
  }, [theme]);

  // Update font size for zoom
  const actualFontSize = Math.round(fontSize * (editorZoom / 100));

  const content = fileContents[file.path] ?? file.content ?? '';

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      {/* Breadcrumb */}
      <div
        className="flex items-center px-3 py-1 text-xs flex-shrink-0"
        style={{
          background: 'var(--panel)',
          borderBottom: '1px solid var(--border)',
          color: 'var(--text-muted)',
        }}
      >
        {file.path.split('/').map((part, i, arr) => (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="material-icons" style={{ fontSize: 12 }}>chevron_right</span>}
            <span style={{ color: i === arr.length - 1 ? 'var(--text)' : 'var(--text-muted)' }}>{part}</span>
          </span>
        ))}
      </div>

      <Editor
        height="100%"
        language={file.language || 'plaintext'}
        value={content}
        theme={getMonacoTheme()}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          fontSize: actualFontSize,
          fontFamily,
          fontLigatures: true,
          tabSize,
          wordWrap: wordWrap ? 'on' : 'off',
          minimap: { enabled: minimap },
          lineNumbers: lineNumbers ? 'on' : 'off',
          renderIndentGuides: indentGuides,
          bracketPairColorization: { enabled: bracketPairColorization },
          smoothScrolling,
          stickyScroll: { enabled: stickyScroll },
          cursorSmoothCaretAnimation: 'on',
          cursorBlinking: 'smooth',
          padding: { top: 8 },
          scrollBeyondLastLine: false,
          automaticLayout: true,
          suggest: { showKeywords: true, showSnippets: true },
          quickSuggestions: { other: true, comments: true, strings: true },
          acceptSuggestionOnEnter: 'on',
          tabCompletion: 'on',
          emptySelectionClipboard: true,
          multiCursorModifier: 'alt',
          formatOnPaste: true,
          renderLineHighlight: 'all',
          occurrencesHighlight: true,
          folding: true,
          foldingStrategy: 'indentation',
          showFoldingControls: 'mouseover',
          links: true,
          colorDecorators: true,
        }}
      />
    </div>
  );
}

function registerCompletions(monaco, language) {
  const allExpansions = { ...JS_SNIPPET_EXPANSIONS, ...REACT_SNIPPET_EXPANSIONS };

  const langs = language === 'javascript' || language === 'typescript'
    ? ['javascript', 'typescript']
    : [language];

  // JS/TS/React snippets
  if (['javascript', 'typescript'].includes(language)) {
    monaco.languages.registerCompletionItemProvider(language, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: Object.entries(allExpansions).map(([trigger, body]) => ({
            label: trigger,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: body,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Snippet',
            range,
          })),
        };
      },
    });
  }

  // HTML emmets
  if (language === 'html') {
    monaco.languages.registerCompletionItemProvider('html', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        return {
          suggestions: Object.entries(HTML_EMMET_EXPANSIONS).map(([trigger, body]) => ({
            label: trigger,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: body,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: 'Emmet',
            documentation: `Expands to HTML boilerplate`,
            range,
          })),
        };
      },
    });
  }
}
