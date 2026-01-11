import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core'
import { provideRouter, Router } from '@angular/router'
import { HttpStatusCode, provideHttpClient, withInterceptors } from '@angular/common/http'
import { routes } from './app.routes'
import { AuthInterceptor } from './interceptors/auth-interceptor'
import { AuthService } from './services/AuthService'
import { catchError, firstValueFrom, of, retry, switchMap, tap, throwError } from 'rxjs'
import { ShiftService } from './services/ShiftService'

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAppInitializer(() => {
        const auth = inject(AuthService)
        const shiftService = inject(ShiftService)
        const router = inject(Router)

        console.log("AppInit");
        return auth.access().pipe(
            tap(() => {
                console.log("AppInit->access->success")
                shiftService.get_shift_hours()
            }),
            catchError(err => {
                console.error("AppInit->access->error");
                if ([HttpStatusCode.Forbidden, HttpStatusCode.Unauthorized].includes(err.status)) {
                    return auth.refresh().pipe(
                        tap(() => console.log("AppInit->refresh->success")),
                        switchMap(() => {
                            return auth.access().pipe(
                                tap(() => {
                                    console.log("AppInit->refresh->access->success")
                                    shiftService.get_shift_hours()
                                }),
                                catchError(err => {
                                    console.error("AppInit->refresh->access->error")
                                    router.navigate(["/login"])
                                    return of();
                                })
                            )
                        }),
                        catchError(err => {
                            console.error("AppInit->refresh->error")
                            router.navigate(["/login"])
                            return of();
                        })
                    );
                }
                router.navigate(["/login"])
                return of();
            })
        );
    }),
    provideHttpClient(
      withInterceptors([AuthInterceptor])
    ),
  ]
};
