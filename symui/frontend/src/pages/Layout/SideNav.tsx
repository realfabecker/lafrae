import * as React from 'react';

import { Box } from '@mui/joy';
import List from '@mui/joy/List';
import ListSubheader from '@mui/joy/ListSubheader';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemContent from '@mui/joy/ListItemContent';
import { useNavigate } from 'react-router';

export default function SideNav() {
  const navigate = useNavigate();
  return (
    <Box component="nav" className="Navigation" sx={{ display: 'initial' }}>
      <List size="sm" sx={{ '--ListItem-radius': '8px', '--List-gap': '4px' }}>
        <ListItem nested>
          <ListSubheader sx={{ letterSpacing: '2px', fontWeight: '800' }}>
            Algorithms
          </ListSubheader>
          <List>
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <Box
                    sx={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '99px',
                      bgcolor: 'primary.500',
                    }}
                  />
                </ListItemDecorator>
                <ListItemContent onClick={() => navigate('/jwt')}>
                  JWT
                </ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <Box
                    sx={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '99px',
                      bgcolor: 'primary.500',
                    }}
                  />
                </ListItemDecorator>
                <ListItemContent onClick={() => navigate('/aes')}>
                  AES
                </ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <Box
                    sx={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '99px',
                      bgcolor: 'primary.500',
                    }}
                  />
                </ListItemDecorator>
                <ListItemContent onClick={() => navigate('/md5')}>
                  MD5
                </ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <Box
                    sx={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '99px',
                      bgcolor: 'primary.500',
                    }}
                  />
                </ListItemDecorator>
                <ListItemContent onClick={() => navigate('/base64')}>
                  Base64
                </ListItemContent>
              </ListItemButton>
            </ListItem>
            <ListItem>
              <ListItemButton>
                <ListItemDecorator>
                  <Box
                    sx={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '99px',
                      bgcolor: 'primary.500',
                    }}
                  />
                </ListItemDecorator>
                <ListItemContent onClick={() => navigate('/gpg')}>
                  GPG
                </ListItemContent>
              </ListItemButton>
            </ListItem>
          </List>
        </ListItem>
      </List>
    </Box>
  );
}
