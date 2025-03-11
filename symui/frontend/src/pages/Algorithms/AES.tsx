import * as React from 'react';
import {
  Card,
  Box,
  Typography,
  Divider,
  Stack,
  Textarea,
  FormControl,
  FormLabel,
  CardContent,
  CardActions,
  Button,
  Input,
  FormHelperText,
} from '@mui/joy';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { useAppDispatch, useAppSelector } from '../../store';
import {
  getActionAesDecrypt,
  getActionAesEncrypt,
} from '../../store/aes/creators';
import { aesSlice } from '../../store/aes';

export default function AES() {
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state.aes.aes);

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 1, display: 'flex' }}>
          <Typography level="h1" sx={{ fontWeight: 800 }}>
            AES 128 CTR
          </Typography>
        </Box>
        <Stack spacing={4}>
          <FormControl
            error={!!(store?.key?.length && store.key.length !== 16)}
          >
            <FormLabel sx={{ fontWeight: 600 }}>AES Key</FormLabel>
            <Input
              placeholder="AES key"
              value={store.key}
              onChange={(e) =>
                dispatch(aesSlice.actions.aes_set_key(e.target.value))
              }
            />
            {!!(store?.key?.length && store.key.length !== 16) && (
              <FormHelperText>
                <InfoOutlined />
                The AES key argument should have 16 bytes for AES-128.
              </FormHelperText>
            )}
          </FormControl>
          <Divider />
          <FormControl error={store.errorType === 'decrypt'}>
            <FormLabel sx={{ fontWeight: 600 }}>Plain Text</FormLabel>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              value={store.plainText}
              onChange={(e) =>
                dispatch(aesSlice.actions.aes_set_plain(e.target.value))
              }
            />
            {store.errorType === 'decrypt' && (
              <FormHelperText>
                <InfoOutlined />
                {store.error}
              </FormHelperText>
            )}
          </FormControl>
          <Divider />
          <FormControl error={store.errorType === 'encrypt'}>
            <FormLabel sx={{ fontWeight: 600 }}>Cipher Text</FormLabel>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              value={store.cipherText}
              onChange={(e) =>
                dispatch(aesSlice.actions.aes_set_cipher(e.target.value))
              }
            />
            {store.errorType === 'encrypt' && (
              <FormHelperText>
                <InfoOutlined />
                {store.error}
              </FormHelperText>
            )}
          </FormControl>
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          color="neutral"
          onClick={() => {
            dispatch(
              getActionAesEncrypt({
                plainText: store.plainText,
                key: store.key,
              }),
            );
          }}
        >
          Encrypt
        </Button>
        <Button
          variant="outlined"
          color="neutral"
          onClick={() => {
            dispatch(
              getActionAesDecrypt({
                cipherText: store.cipherText,
                key: store.key,
              }),
            );
          }}
        >
          Decrypt
        </Button>
      </CardActions>
    </Card>
  );
}
