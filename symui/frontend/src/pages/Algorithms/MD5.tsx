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
import { getActionMd5Hash } from '../../store/md5/creators';
import { useState } from 'react';
import InfoOutlined from '@mui/icons-material/InfoOutlined';

export default function MD5() {
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state.md5.md5);
  const [plainText, setPlainText] = useState('');
  return (
    <Card>
      <CardContent>
        <Box sx={{ mb: 1, display: 'flex' }}>
          <Typography level="h1" sx={{ fontWeight: 800 }}>
            MD5
          </Typography>
        </Box>
        <Stack spacing={4}>
          <FormControl>
            <FormLabel sx={{ fontWeight: 600 }}>Input</FormLabel>
            <Textarea
              size="sm"
              minRows={4}
              sx={{ mt: 1.5 }}
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
            />
          </FormControl>
          <Divider />
          <FormControl error={!!store.error}>
            <FormLabel sx={{ fontWeight: 600 }}>Output</FormLabel>
            <Textarea
              size="sm"
              minRows={4}
              sx={{
                mt: 1.5,
                color: store.error ? 'danger.500' : 'common.black',
              }}
              readOnly
              value={store.hashed}
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
            dispatch(getActionMd5Hash({ input: plainText }));
          }}
        >
          Hash
        </Button>
      </CardActions>
    </Card>
  );
}
