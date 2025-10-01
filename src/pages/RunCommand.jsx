import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { enqueueCommand } from '../api/jobs';
import { pushHistory } from '../api/history';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, Stack } from '@mui/material';

export default function RunCommand() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({ defaultValues: { command: '' } });
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const m = useMutation({
    mutationFn: enqueueCommand,
    onSuccess: (data) => {
      const run_id = data.run_id || data.id || data.runId;
      if (!run_id) { enqueueSnackbar('run_id dönmedi', { variant: 'error' }); return; }
      pushHistory({ run_id, type: 'command', created_at: new Date().toISOString() });
      navigate(`/runs/${run_id}`);
    },
    onError: () => enqueueSnackbar('Komut kuyruğa eklenemedi', { variant: 'error' })
  });

  return (
    <Box component="form" onSubmit={handleSubmit(v => m.mutate(v))} sx={{ maxWidth: 640 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Komut Çalıştır</Typography>
      <Stack spacing={2}>
        <TextField label="Komut" {...register('command', { required: true })} />
        <Button type="submit" variant="contained" disabled={isSubmitting || m.isLoading}>Çalıştır</Button>
      </Stack>
    </Box>
  );
}
