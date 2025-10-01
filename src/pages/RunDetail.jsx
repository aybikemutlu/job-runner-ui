import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getRun, getRunResult } from '../api/runs';
import { Box, Typography, Chip, Card, CardContent, Divider, Button, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import dayjs from 'dayjs';
import { useMemo } from 'react';

function isActive(status) {
  const s = String(status || '').toUpperCase();
  return s === 'PENDING' || s === 'RUNNING' || s === 'QUEUED';
}

export default function RunDetail() {
  const { id } = useParams();

  const runQ = useQuery({
    queryKey: ['run', id],
    queryFn: () => getRun(id),
    refetchInterval: q => isActive(q.state.data?.status) ? 2000 : false
  });

  const resultQ = useQuery({
    queryKey: ['run-result', id, runQ.data?.status],
    queryFn: () => getRunResult(id),
    enabled: !!runQ.data && !isActive(runQ.data.status)
  });

  const summary = useMemo(() => {
    const r = resultQ.data;
    if (!r) return {};
    if (r.data && typeof r.data === 'object') return r.data;
    return r;
  }, [resultQ.data]);

  const urls = useMemo(() => {
    const r = resultQ.data;
    if (!r) return [];
    if (Array.isArray(r)) return r;
    if (Array.isArray(r?.urls)) return r.urls;
    if (Array.isArray(r?.data?.urls)) return r.data.urls;
    return [];
  }, [resultQ.data]);

  const hasOutput = !!(resultQ.data && typeof resultQ.data.output === 'string');

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 1 }}>Run Detayı</Typography>
      {runQ.isLoading ? <Typography>Yükleniyor...</Typography> : (
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Typography>ID: {id}</Typography>
                <Typography>Durum: <Chip label={String(runQ.data?.status || '-')} color={isActive(runQ.data?.status) ? 'secondary' : 'primary'} /></Typography>
                <Typography>Tip: {runQ.data?.type || '-'}</Typography>
                <Typography>Başlangıç: {runQ.data?.started_at ? dayjs(runQ.data.started_at).format('YYYY-MM-DD HH:mm:ss') : '-'}</Typography>
                <Typography>Bitiş: {runQ.data?.finished_at ? dayjs(runQ.data.finished_at).format('YYYY-MM-DD HH:mm:ss') : '-'}</Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'flex-end' }}>
                <Button component={Link} to="/urls" state={{ runId: id }} variant="outlined">URL’leri Gör</Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Typography variant="h6" sx={{ mb: 1 }}>Sonuç</Typography>
      {resultQ.isFetching && <Typography>Sonuç bekleniyor...</Typography>}
      {resultQ.data && (
        <Card>
          <CardContent>
            {'target_url' in summary && (
              <>
                <Typography sx={{ mb: 0.5 }}>Hedef: {String(summary.target_url)}</Typography>
                {'total_urls' in summary && <Typography sx={{ mb: 1 }}>Toplam URL: {String(summary.total_urls)}</Typography>}
                <Divider sx={{ my: 1.5 }} />
              </>
            )}

            {hasOutput && (
              <>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>Output</Typography>
                <Box sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid #eee', borderRadius: 1, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas' }}>
                  {resultQ.data.output}
                </Box>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            {urls.length > 0 && (
              <>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>Bulunan URL’ler</Typography>
                <div style={{ height: 420, width: '100%' }}>
                  <DataGrid
                    rows={urls.map((u, i) => ({ id: i + 1, url: typeof u === 'string' ? u : JSON.stringify(u) }))}
                    columns={[{ field: 'url', headerName: 'URL', flex: 1 }]}
                    pageSizeOptions={[10, 25, 50]}
                    initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
                    disableColumnMenu
                  />
                </div>
                <Divider sx={{ my: 2 }} />
              </>
            )}

            {!hasOutput && urls.length === 0 && (
              <>
                <Typography sx={{ mb: 1, fontWeight: 600 }}>Ham JSON</Typography>
                <Box sx={{ p: 2, bgcolor: 'background.paper', border: '1px solid #eee', borderRadius: 1, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas' }}>
                  {JSON.stringify(resultQ.data, null, 2)}
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
