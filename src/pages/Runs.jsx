import { useEffect, useMemo, useState } from 'react';
import { getHistory, clearHistory } from '../api/history';
import { useQueries } from '@tanstack/react-query';
import { getRun } from '../api/runs';
import { Box, Button, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link as RLink } from 'react-router-dom';
import dayjs from 'dayjs';

export default function Runs() {
  const [items, setItems] = useState([]);

  useEffect(() => { setItems(getHistory()); }, []);

  const queries = useQueries({
    queries: items.map(it => ({
      queryKey: ['run', it.run_id],
      queryFn: () => getRun(it.run_id),
      staleTime: 1000
    }))
  });

  const rows = useMemo(() => items.map((it, idx) => {
    const data = queries[idx]?.data || {};
    return {
      id: it.run_id,
      run_id: it.run_id,
      type: it.type || data.type || '-',
      status: data.status || '-',
      created_at: it.created_at,
      link: `/runs/${it.run_id}`
    };
  }), [items, queries]);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>Çalıştırma Geçmişi</Typography>
      <Box sx={{ mb: 1, display: 'flex', gap: 1 }}>
        <Button variant="outlined" onClick={() => { clearHistory(); setItems([]); }}>Temizle</Button>
      </Box>
      <div style={{ height: 520, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={[
            { field: 'run_id', headerName: 'Run ID', width: 300, renderCell: p => <RLink to={p.row.link}>{p.value}</RLink> },
            { field: 'type', headerName: 'Tip', width: 120 },
            { field: 'status', headerName: 'Durum', width: 120 },
            { field: 'created_at', headerName: 'Oluşturma', flex: 1, valueFormatter: v => v && dayjs(v).format('YYYY-MM-DD HH:mm:ss') }
          ]}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10, page: 0 } } }}
          disableColumnMenu
        />
      </div>
    </Box>
  );
}
