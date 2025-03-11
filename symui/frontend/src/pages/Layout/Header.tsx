import * as React from 'react';
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Button from '@mui/joy/Button';
import LockIcon from '@mui/icons-material/Lock';

export default function Header() {
  return (
    <Box
      component="header"
      className="Header"
      sx={[
        {
          p: 2,
          gap: 2,
          bgcolor: 'background.surface',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gridColumn: '1 / -1',
          borderBottom: '1px solid',
          borderColor: 'divider',
          position: 'sticky',
          top: 0,
          zIndex: 1100,
        },
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          flexGrow: 1,
          justifyContent: 'space-between',
        }}
      >
        <Stack
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={1}
          sx={{ display: { sm: 'flex' } }}
        >
          <LockIcon />
          <Button
            variant="plain"
            color="neutral"
            aria-pressed="true"
            component="a"
            size="sm"
            sx={{ alignSelf: 'center' }}
          >
            SymUI
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}
