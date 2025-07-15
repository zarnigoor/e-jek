import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './i18n'; // i18n konfiguratsiyasini import qilish
import Spinner from './components/ui/Spinner.tsx'; // Yuklanish spinneri

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Suspense fallback={<Spinner />}>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <App />
      </BrowserRouter>
    </Suspense>
  </React.StrictMode>
);