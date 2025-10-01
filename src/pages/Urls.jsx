import { useMemo, useState } from 'react';
import { getHistory } from '../api/history';
import { useQuery } from '@tanstack/react-query';
import { getRunResult } from '../api/runs';
import { getRunUrls } from '../api/urls';
import { Box, Typography, TextField, MenuItem, Alert } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useLocation } from 'react-router-dom';

export default function Urls() {
  const history = getHistory().filter(h => h.type === 'crawl');
  const loc = useLocation();
  const initial = loc.state?.runId || history[0]?.run_id || '';
  const [sel, setSel] = useState(initial);
  const [q, setQ] = useState('');
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });

  const resultQ = useQuery({
    queryKey: ['urls-summary', sel],
    queryFn: () => getRunResult(sel),
    enabled: !!sel
  });

  const serverQ = useQuery({
    queryKey: ['run-urls', sel, paginationModel.page, paginationModel.pageSize, q],
    queryFn: () => getRunUrls(sel, { page: paginationModel.page + 1, page_size: paginationModel.pageSize, q }),
    enabled: !!sel,
    retry: false
  });

  const summary = useMemo(() => {
    const r = resultQ.data;
    if (!r) return {};
    if (r.data && typeof r.data === 'object') return r.data;
    return r;
  }, [resultQ.data]);

  const rowsFromServer = useMemo(() => {
    const d = serverQ.data;
    if (!d) return [];
    if (Array.isArray(d)) return d.map((u, i) => ({ id: i + 1 + paginationModel.page * paginationModel.pageSize, url: String(u) }));
    if (Array.isArray(d?.items)) return d.items.map((u, i) => ({ id: i + 1 + paginationModel.page * paginationModel.pageSize, url: String(typeof u === 'string' ? u : u.url || JSON.stringify(u)) }));
    return [];
  }, [serverQ.data, paginationModel]);

  const totalFromServer = serverQ.data?.total ?? rowsFromServer.length;

  const serverFailed = !!serverQ.error;
  const serverUnavailable = serverFailed && (serverQ.error?.response?.status === 404 || serverQ.error?.response?.status === 501);

  const fallbackRows = useMemo(() => {
    const r = resultQ.data;
    let list = [];
    if (Array.isArray(r)) list = r;
    else if (Array.isArray(r?.urls)) list = r.urls;
    else if (Array.isArray(r?.data?.urls)) list = r.data.urls;
    return list.map((u, i) => ({ id: i + 1, url: String(typeof u === 'string' ? u : JSON.stringify(u)) }));
  }, [resultQ.data]);

  const rows = serverUnavailable ? fallbackRows : rowsFromServer;
  const rowCount = serverUnavailable ? fallbackRows.length : totalFromServer;

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>URL Tablosu</Typography>

      {'target_url' in summary && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Hedef: {String(summary.target_url)} | Toplam URL: {'total_urls' in summary ? String(summary.total_urls) : '-'}
        </Alert>
      )}

      {serverUnavailable && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Bu backend sürümünde URL listesi endpoint’i bulunamadı. Özet gösteriliyor.
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField select label="Run" value={sel} onChange={e => { setSel(e.target.value); setPaginationModel({ page: 0, pageSize: 10 }); }} sx={{ minWidth: 360 }}>
          {history.map(h => <MenuItem key={h.run_id} value={h.run_id}>{h.run_id}</MenuItem>)}
        </TextField>
        <TextField label="Filtre" value={q} onChange={e => { setQ(e.target.value); setPaginationModel(p => ({ ...p, page: 0 })); }} />
      </Box>

      <div style={{ height: 520, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={[{ field: 'url', headerName: 'URL', flex: 1 }]}
          paginationMode={serverUnavailable ? 'client' : 'server'}
          rowCount={rowCount}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[10, 25, 50]}
          disableColumnMenu
          loading={serverQ.isFetching}
        />
      </div>
    </Box>
  );
}
