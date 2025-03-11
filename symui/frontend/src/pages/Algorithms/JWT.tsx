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
} from '@mui/joy';
import { useAppDispatch, useAppSelector } from '../../store';
import { jwtSlice } from '../../store/jwt';
import {
  getActionJwtDecode,
  getActionJwtEncode,
} from '../../store/jwt/creators';

export default function JWT() {
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state.jwt.jwt);

  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 1, display: 'flex' }}>
          <Typography level="h1" sx={{ fontWeight: 800 }}>
            JWT
          </Typography>
        </Box>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 600 }}>JWT Key</FormLabel>
            <Input
              placeholder="JWT key"
              value={store.key}
              onChange={(e) =>
                dispatch(jwtSlice.actions.jwt_set_key(e.target.value))
              }
            />
          </FormControl>
          <Divider />
          <FormControl>
            <FormLabel sx={{ fontWeight: 600 }}>Plain Text</FormLabel>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              value={store.plainText}
              onChange={(e) =>
                dispatch(jwtSlice.actions.jwt_set_plain(e.target.value))
              }
            />
          </FormControl>
          <Divider />
          <FormControl>
            <FormLabel sx={{ fontWeight: 600 }}>Encoded Text</FormLabel>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              value={store.encoded}
              onChange={(e) =>
                dispatch(jwtSlice.actions.jwt_set_encoded(e.target.value))
              }
            />
          </FormControl>
        </Stack>
      </CardContent>
      <CardActions>
        <Button
          variant="outlined"
          color="neutral"
          onClick={() => {
            dispatch(
              getActionJwtEncode({
                plainText: store.plainText,
                key: store.key,
              }),
            );
          }}
        >
          Encode
        </Button>
        <Button
          variant="outlined"
          color="neutral"
          onClick={() => {
            dispatch(
              getActionJwtDecode({
                encoded: store.encoded,
                key: store.key,
              }),
            );
          }}
        >
          Decode
        </Button>
      </CardActions>
    </Card>
  );
}
