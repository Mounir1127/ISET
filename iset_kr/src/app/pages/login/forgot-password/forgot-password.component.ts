import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-forgot-password',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterModule],
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
    forgotForm: FormGroup;
    isLoading = false;
    successMessage = '';
    errorMessage = '';

    constructor(
        private fb: FormBuilder,
        private authService: AuthService
    ) {
        this.forgotForm = this.fb.group({
            email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@.*rnu\.tn$/)]]
        });
    }

    onSubmit() {
        if (this.forgotForm.invalid) return;

        this.isLoading = true;
        this.errorMessage = '';
        this.successMessage = '';

        const email = this.forgotForm.get('email')?.value;

        this.authService.forgotPassword(email)
            .pipe(finalize(() => this.isLoading = false))
            .subscribe({
                next: (response) => {
                    this.successMessage = response.message;
                    this.forgotForm.reset();
                },
                error: (error) => {
                    this.errorMessage = error.error?.message || 'Une erreur est survenue. Veuillez réessayer.';
                }
            });
    }

    get emailControl() {
        return this.forgotForm.get('email');
    }
}
