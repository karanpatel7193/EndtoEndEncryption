import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CryptoService } from './crypto.service';
import { from, mergeMap } from 'rxjs';

export const encryptionInterceptor: HttpInterceptorFn = (req, next) => {
  const cryptoService = inject(CryptoService);

  // Only encrypt specific endpoints
  if (req.url.includes('/api/secure') && req.method === 'POST') {
    return from(cryptoService.encryptData(req.body)).pipe(
      mergeMap(encrypted => {
        const encryptedRequest = req.clone({
          body: {
            encryptedData: encrypted.encryptedData,
            encryptedAESKey: encrypted.encryptedAESKey,
            iv: encrypted.iv
          },
          setHeaders: {
            'Content-Type': 'application/json',
            'X-Encrypted': 'true'
          }
        });
        return next(encryptedRequest);
      })
    );
  }

  return next(req);
};
