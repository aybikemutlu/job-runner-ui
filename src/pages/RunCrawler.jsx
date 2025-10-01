import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { enqueueCrawl } from '../api/jobs';
import { pushHistory } from '../api/history';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';

export default function RunCrawler() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: { url: '' } });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const m = useMutation({
    mutationFn: enqueueCrawl,
    onSuccess: (data) => {
      const run_id = data.run_id || data.id || data.runId;
      if (!run_id) { enqueueSnackbar('run_id dönmedi', { variant: 'error' }); return; }
      pushHistory({ run_id, type: 'crawl', created_at: new Date().toISOString() });
      navigate(`/runs/${run_id}`);
    },
    onError: (err) => enqueueSnackbar(err.userMessage || 'Crawl kuyruğa eklenemedi', { variant: 'error' })
  });

  function normalize(u) {
    const s = String(u || '').trim();
    if (!s) return s;
    if (s.startsWith('http://') || s.startsWith('https://')) return s;
    return `https://${s}`;
  }

  return (
    <Box component="form" onSubmit={handleSubmit(v => m.mutate({ start_url: normalize(v.url) }))} sx={{ maxWidth: 640 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Crawler Çalıştır</Typography>
      <Stack spacing={2}>
        <TextField label="URL" {...register('url', { required: true })} />
        <Button type="submit" variant="contained" disabled={isSubmitting || m.isLoading}>Çalıştır</Button>
      </Stack>
    </Box>
  );
}
