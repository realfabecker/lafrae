import * as React from 'react';
import { useEffect, useState } from 'react';
import {
  Card,
  Box,
  Typography,
  CardContent,
  Chip,
  Stack,
  Button,
  Modal,
  DialogTitle,
  DialogContent,
  ModalDialog,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
  ChipDelete,
} from '@mui/joy';
import { DeleteForever } from '@mui/icons-material';
import { Add } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  getActionGpgAddKey,
  getActionGpgListKeys,
} from '../../store/gpg/creators';
import { ActionStatus, GpgKey } from '../../core/entities/entities';

const GpgAddKey = (opts: { open: boolean; onClose: () => void }) => {
  const dispatch = useAppDispatch();
  const store = useAppSelector((store) => store.gpg.gpg);
  return (
    <Modal open={opts.open} onClose={opts.onClose}>
      <ModalDialog>
        <DialogTitle>Add Key</DialogTitle>
        <DialogContent>Fill in the information about the key</DialogContent>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const json = Object.fromEntries(
              (new FormData(e.currentTarget) as any).entries(),
            );
            dispatch(
              getActionGpgAddKey({
                email: json.email,
                weeks: Number(json.expiresIn),
              }),
            ).then(() => opts.onClose());
          }}
        >
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>E-mail</FormLabel>
              <Input name={'email'} type={'email'} autoFocus required />
            </FormControl>
            <FormControl>
              <FormLabel>Expires in</FormLabel>
              <Select name={'expiresIn'} defaultValue={5}>
                <Option value={5}>5 weeks</Option>
              </Select>
            </FormControl>
            <Button
              type="submit"
              disabled={store.status === ActionStatus.PENDING}
            >
              {store.status === ActionStatus.PENDING
                ? 'Generating...'
                : 'Generate'}
            </Button>
          </Stack>
        </form>
      </ModalDialog>
    </Modal>
  );
};

const GpgListItem = ({ item }: { item: GpgKey }) => {
  const isExpired = (time: number) => Date.now() > time * 1000;
  return (
    <Card variant="outlined" key={item.pub.keyid}>
      <CardContent>
        <Stack spacing={2}>
          <Typography level="title-sm" id="card-description">
            {item.uid.uid}
          </Typography>
          <Stack direction="row" spacing={2}>
            <Chip
              variant="outlined"
              color={isExpired(item.pub.expires) ? 'danger' : 'primary'}
              size="sm"
              sx={{ pointerEvents: 'none', padding: '0.25rem' }}
            >
              {isExpired(item.pub.expires) ? 'Expired ' : 'Expires '}
              {new Date(item.pub.expires * 1000).toISOString().slice(0, 10)}
            </Chip>
            <Chip
              variant={'outlined'}
              color={'danger'}
              endDecorator={
                <ChipDelete color={'danger'} variant={'plain'}>
                  <DeleteForever />
                </ChipDelete>
              }
            >
              Delete
            </Chip>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

const GpgListKeys = () => {
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state.gpg.gpg);

  useEffect(() => {
    dispatch(getActionGpgListKeys({}));
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 2,
      }}
    >
      {(store?.keys || []).map((key) => (
        <GpgListItem key={key.pub.keyid} item={key} />
      ))}
    </Box>
  );
};

export default function GPG() {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Stack direction={'column'} spacing={2}>
      <GpgAddKey
        open={open}
        onClose={() => {
          setOpen(false);
          dispatch(getActionGpgListKeys({}));
        }}
      />
      <Stack direction={'row'} justifyContent="space-between">
        <Typography level="h1" sx={{ fontWeight: 800 }}>
          GPG
        </Typography>
        <Button startDecorator={<Add />} onClick={() => setOpen(true)}>
          Key
        </Button>
      </Stack>
      <GpgListKeys />
    </Stack>
  );
}
