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
  FormHelperText,
} from '@mui/joy';
import { useAppDispatch, useAppSelector } from '../../store';
import InfoOutlined from '@mui/icons-material/InfoOutlined';
import { base64Slice } from '../../store/base64';
import {
  getActionBase64Decode,
  getActionBase64Encode,
} from '../../store/base64/creators';

export default function Base64() {
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state.base64.base64);
  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 1, display: 'flex' }}>
          <Typography level="h1" sx={{ fontWeight: 800 }}>
            Base64
          </Typography>
        </Box>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 600 }}>Input</FormLabel>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              value={store.plainText}
              onChange={(e) =>
                dispatch(base64Slice.actions.aes_set_plain(e.target.value))
              }
            />
          </FormControl>
          <Divider />
          <FormControl error={!!store.error}>
            <FormLabel sx={{ fontWeight: 600 }}>Output</FormLabel>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              value={store.encoded}
              onChange={(e) =>
                dispatch(base64Slice.actions.aes_set_encode(e.target.value))
              }
            />
            {!!store.error && (
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
            dispatch(getActionBase64Encode({ input: store.plainText }));
          }}
        >
          Encode
        </Button>

        <Button
          variant="outlined"
          color="neutral"
          onClick={() => {
            dispatch(getActionBase64Decode({ input: store.encoded }));
          }}
        >
          Decode
        </Button>
      </CardActions>
    </Card>
  );
}
