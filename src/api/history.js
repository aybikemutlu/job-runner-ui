const KEY = 'jr_history_v1';

export function pushHistory(item) {
  const cur = JSON.parse(localStorage.getItem(KEY) || '[]');
  const next = [item, ...cur.filter(x => x.run_id !== item.run_id)].slice(0, 100);
  localStorage.setItem(KEY, JSON.stringify(next));
}

export function getHistory() {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}

export function clearHistory() {
  localStorage.removeItem(KEY);
}
