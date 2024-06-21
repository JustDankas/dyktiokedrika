import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { inject } from '@angular/core';
import { map, of, switchMap, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const userSrv: UserService = inject(UserService);
  const router = inject(Router);
  return userSrv.getPermission().pipe(
    switchMap((res) => {
      if (res) {
        return of(true);
      } else {
        router.navigate(['/']);
        return of(false);
      }
    })
  );
};
