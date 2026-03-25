import yaml from 'js-yaml';
import { diffLines } from 'diff';

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
    return { entries: [], error: 'diffErrorLeft' };
  }
  try {
    right = JSON.parse(rightStr);
  } catch {
    return { entries: [], error: 'diffErrorRight' };
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

export interface LineDiff {
  type: 'added' | 'removed' | 'unchanged';
  line: string;
}

export function diffJsonLines(leftStr: string, rightStr: string): { lines: LineDiff[]; added: number; removed: number; error?: string } {
  let leftFormatted: string, rightFormatted: string;
  try {
    leftFormatted = JSON.stringify(JSON.parse(leftStr), null, 2);
  } catch {
    return { lines: [], added: 0, removed: 0, error: 'diffErrorLeft' };
  }
  try {
    rightFormatted = JSON.stringify(JSON.parse(rightStr), null, 2);
  } catch {
    return { lines: [], added: 0, removed: 0, error: 'diffErrorRight' };
  }

  const parts = diffLines(leftFormatted, rightFormatted);
  const lines: LineDiff[] = [];
  let added = 0;
  let removed = 0;

  for (const part of parts) {
    const type = part.added ? 'added' : part.removed ? 'removed' : 'unchanged';
    const partLines = part.value.replace(/\n$/, '').split('\n');
    if (part.added) added += partLines.length;
    if (part.removed) removed += partLines.length;
    for (const line of partLines) {
      lines.push({ type, line });
    }
  }

  return { lines, added, removed };
}
