import { Component, inject, OnInit } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, map, of, switchMap, take } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { delay } from 'rxjs/operators';

@Component({
    templateUrl: './auth-by-token.page.html',
    styleUrls: ['./auth-by-token.page.scss'],
    standalone: true,
    imports: [
        MatProgressSpinner
    ]
})
export class AuthByTokenPage implements OnInit {
    private readonly _authService = inject(AuthService);
    private readonly _activatedRoute = inject(ActivatedRoute);
    private readonly _snackBar = inject(MatSnackBar);
    private readonly _router = inject(Router);

    public ngOnInit(): void {
        this._activatedRoute.queryParamMap
            .pipe(
                map(params => params.get('token')),
                switchMap(token => {
                    if (token) {
                        return this._authService.loginWithTelegram(token);
                    } else {
                        return of(false);
                    }
                }),
                take(1)
            ).subscribe((success) => {
                if (success){
                    this._snackBar.open('Авторизация успешна', 'Закрыть', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                    this._router.navigate(['/cabinet']);
                } else {
                    this._snackBar.open('Ошибка авторизации', 'Закрыть', {
                        duration: 3000,
                        horizontalPosition: 'center',
                        verticalPosition: 'top'
                    });
                    this._router.navigate(['/']);
                }
            });
    }
}
