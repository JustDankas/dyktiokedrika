import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { of, switchMap } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const userSrv: UserService = inject(UserService);
  const router = inject(Router);
  return userSrv.getPermission().pipe(
    switchMap((res) => {
      //@ts-ignore
      if (res && res.role === 'admin') {
        return of(true);
      } else {
        router.navigate(['/']);
        return of(false);
      }
    })
  );
};
