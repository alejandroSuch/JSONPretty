import { useState, useCallback, DragEvent } from 'react';
import { useTranslation } from 'react-i18next';

function isJsonFile(file: File): boolean {
  return file.type === 'application/json' || file.name.endsWith('.json');
}

export function useFileDrop(onFileContent: (content: string) => void) {
  const { t } = useTranslation();
  const [isDragging, setIsDragging] = useState(false);
  const [dropError, setDropError] = useState('');

  const onDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDropError('');

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    if (!isJsonFile(file)) {
      setDropError(t('invalidFileType'));
      setTimeout(() => setDropError(''), 3000);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onFileContent(reader.result as string);
    };
    reader.readAsText(file);
  }, [onFileContent, t]);

  return { isDragging, dropError, onDragOver, onDragLeave, onDrop };
}
