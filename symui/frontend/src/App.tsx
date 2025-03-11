import * as React from 'react';
import { CssBaseline, CssVarsProvider } from '@mui/joy';

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MD5 from './pages/Algorithms/MD5';
import AES from './pages/Algorithms/AES';
import Layout from './pages/Layout/Layout';
import JWT from './pages/Algorithms/JWT';
import Base64 from './pages/Algorithms/Base64';
import GPG from './pages/Algorithms/GPG';

function App() {
  return (
    <CssVarsProvider>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="md5" element={<MD5 />} />
            <Route path="aes" element={<AES />} />
            <Route path="jwt" element={<JWT />} />
            <Route path="base64" element={<Base64 />} />
            <Route path="gpg" element={<GPG />} />
          </Route>
          <Route path="*" element={<Navigate to="jwt" />}></Route>
        </Routes>
      </BrowserRouter>
    </CssVarsProvider>
  );
}

export default App;
