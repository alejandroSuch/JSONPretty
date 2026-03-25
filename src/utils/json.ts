import yaml from 'js-yaml';

export interface JsonError {
  message: string;
  line?: number;
}

export function parseJson(input: string): { data: unknown; error?: JsonError } {
  try {
    const data = JSON.parse(input);
    return { data };
  } catch (e) {
    const msg = (e as Error).message;
    const lineMatch = msg.match(/position (\d+)/);
    let line: number | undefined;
    if (lineMatch) {
      const pos = parseInt(lineMatch[1], 10);
      line = input.substring(0, pos).split('\n').length;
    }
    return { data: null, error: { message: msg, line } };
  }
}

export function formatJson(input: string): { output: string; error?: JsonError } {
  const { data, error } = parseJson(input);
  if (error) return { output: '', error };
  return { output: JSON.stringify(data, null, 2) };
}

export function validateJson(input: string): { valid: boolean; error?: JsonError } {
  const { error } = parseJson(input);
  return { valid: !error, error };
}

export function jsonToYaml(input: string): { output: string; error?: JsonError } {
  const { data, error } = parseJson(input);
  if (error) return { output: '', error };
  return { output: yaml.dump(data, { indent: 2 }) };
}

export function jsonToCsv(input: string): { output: string; error?: string } {
  const { data, error } = parseJson(input);
  if (error) return { output: '', error: error.message };

  if (!Array.isArray(data) || data.length === 0) {
    return { output: '', error: 'csvNotSupported' };
  }

  const first = data[0];
  if (typeof first !== 'object' || first === null || Array.isArray(first)) {
    return { output: '', error: 'csvNotSupported' };
  }

  const headers = Object.keys(first);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    if (typeof row !== 'object' || row === null || Array.isArray(row)) {
      return { output: '', error: 'csvNotSupported' };
    }
    const values = headers.map((h) => {
      const val = (row as Record<string, unknown>)[h];
      const str = val === null || val === undefined ? '' : String(val);
      return str.includes(',') || str.includes('"') || str.includes('\n')
        ? `"${str.replace(/"/g, '""')}"`
        : str;
    });
    csvRows.push(values.join(','));
  }

  return { output: csvRows.join('\n') };
}

export interface DiffEntry {
  key: string;
  type: 'added' | 'removed' | 'changed' | 'unchanged';
  left?: string;
  right?: string;
}

export function diffJson(leftStr: string, rightStr: string): { entries: DiffEntry[]; error?: string } {
  let left: unknown, right: unknown;
  try {
    left = JSON.parse(leftStr);
  } catch {
    return { entries: [], error: 'Left: invalid JSON' };
  }
  try {
    right = JSON.parse(rightStr);
  } catch {
    return { entries: [], error: 'Right: invalid JSON' };
  }

  if (typeof left !== 'object' || left === null || typeof right !== 'object' || right === null) {
    return {
      entries: [{
        key: '(root)',
        type: JSON.stringify(left) === JSON.stringify(right) ? 'unchanged' : 'changed',
        left: JSON.stringify(left, null, 2),
        right: JSON.stringify(right, null, 2),
      }],
    };
  }

  const leftObj = left as Record<string, unknown>;
  const rightObj = right as Record<string, unknown>;
  const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);
  const entries: DiffEntry[] = [];

  for (const key of allKeys) {
    const inLeft = key in leftObj;
    const inRight = key in rightObj;
    if (inLeft && !inRight) {
      entries.push({ key, type: 'removed', left: JSON.stringify(leftObj[key], null, 2) });
    } else if (!inLeft && inRight) {
      entries.push({ key, type: 'added', right: JSON.stringify(rightObj[key], null, 2) });
    } else if (JSON.stringify(leftObj[key]) !== JSON.stringify(rightObj[key])) {
      entries.push({ key, type: 'changed', left: JSON.stringify(leftObj[key], null, 2), right: JSON.stringify(rightObj[key], null, 2) });
    } else {
      entries.push({ key, type: 'unchanged', left: JSON.stringify(leftObj[key], null, 2), right: JSON.stringify(rightObj[key], null, 2) });
    }
  }

  return { entries };
}
