'use client';
import { useCallback } from 'react';
import useIDEStore from '@/store/ideStore';

export function useFileSystem() {
  const { setFolderHandle, setFileTree, folderHandle, addToast } = useIDEStore();

  const openFolder = useCallback(async () => {
    try {
      const handle = await window.showDirectoryPicker({ mode: 'readwrite' });
      const tree = await buildFileTree(handle);
      setFolderHandle(handle, handle.name);
      setFileTree(tree);
      addToast({ type: 'success', message: `Opened: ${handle.name}` });
      return { handle, tree };
    } catch (err) {
      if (err.name !== 'AbortError') {
        addToast({ type: 'error', message: 'Could not open folder' });
      }
    }
  }, [setFolderHandle, setFileTree, addToast]);

  const buildFileTree = async (dirHandle, path = '') => {
    const entries = [];
    for await (const [name, handle] of dirHandle.entries()) {
      if (name.startsWith('.') && name !== '.env' && name !== '.gitignore') continue;
      const entryPath = path ? `${path}/${name}` : name;
      if (handle.kind === 'directory') {
        const children = await buildFileTree(handle, entryPath);
        entries.push({ name, path: entryPath, kind: 'directory', handle, children });
      } else {
        entries.push({ name, path: entryPath, kind: 'file', handle });
      }
    }
    return entries.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  };

  const readFile = useCallback(async (fileHandle) => {
    try {
      const file = await fileHandle.getFile();
      return await file.text();
    } catch (err) {
      addToast({ type: 'error', message: 'Could not read file' });
      return '';
    }
  }, [addToast]);

  const writeFile = useCallback(async (fileHandle, content) => {
    try {
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      return true;
    } catch (err) {
      addToast({ type: 'error', message: 'Could not save file' });
      return false;
    }
  }, [addToast]);

  const createFile = useCallback(async (dirHandle, name) => {
    try {
      const fileHandle = await dirHandle.getFileHandle(name, { create: true });
      addToast({ type: 'success', message: `Created: ${name}` });
      return fileHandle;
    } catch (err) {
      addToast({ type: 'error', message: 'Could not create file' });
    }
  }, [addToast]);

  const createFolder = useCallback(async (dirHandle, name) => {
    try {
      const newDir = await dirHandle.getDirectoryHandle(name, { create: true });
      addToast({ type: 'success', message: `Created folder: ${name}` });
      return newDir;
    } catch (err) {
      addToast({ type: 'error', message: 'Could not create folder' });
    }
  }, [addToast]);

  const deleteEntry = useCallback(async (parentHandle, name, recursive = true) => {
    try {
      await parentHandle.removeEntry(name, { recursive });
      addToast({ type: 'success', message: `Deleted: ${name}` });
      return true;
    } catch (err) {
      addToast({ type: 'error', message: 'Could not delete' });
      return false;
    }
  }, [addToast]);

  const refreshTree = useCallback(async () => {
    if (!folderHandle) return;
    const tree = await buildFileTree(folderHandle);
    setFileTree(tree);
  }, [folderHandle, setFileTree]);

  return { openFolder, readFile, writeFile, createFile, createFolder, deleteEntry, refreshTree, buildFileTree };
}
