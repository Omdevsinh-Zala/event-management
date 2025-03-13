import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { LoginService } from "../../services/login.service";
import { Router } from "@angular/router";
import { formActions } from "./form.actions";
import { catchError, delay, from, map, of, switchMap } from "rxjs";
import { FirebaseError } from "@angular/fire/app";
import { MessageService } from "../../services/message.service";
import { FireStoreService } from "../../services/fire-store.service";
import { fireStoreUser } from "../module";
import { AuthService } from "../../services/auth.service";
import { LocalstorageService } from "../../services/localstorage.service";

@Injectable()
export class FormsEfects {
    //For email and password register
    registerWithEmailEffets$ = createEffect((actions$ = inject(Actions), loginService = inject(LoginService), auth = inject(AuthService), message = inject(MessageService)) => {
        return actions$.pipe(
            ofType(formActions.registerUserWithEmailAndPassword),
            switchMap(( value ) => {
                return from(loginService.signupWithEmail(value.data)).pipe(
                    map(() => {
                        const data:fireStoreUser = {
                            email: value.data.email,
                            role: 'user',
                            uid: auth.getuid()
                        };
                        return formActions.registerUserWithFirstore({ data: data });
                    }),
                    catchError((err:FirebaseError) => {
                        message.error(err.code.split('/')[1]);
                        return of(formActions.error({ error: err.code.split('/')[1] }));
                    })
                )
            })
        )
    })

    //For fireStore register
    registerWithFireStore$ = createEffect((actions$ = inject(Actions), fireStoreService = inject(FireStoreService), router = inject(Router), message = inject(MessageService), localStorage = inject(LocalstorageService)) => {
        return actions$.pipe(
            ofType(formActions.registerUserWithFirstore),
            switchMap(( value ) => {
                return from(fireStoreService.addUser(value.data, value.data.uid)).pipe(
                    delay(1000),
                    map((data) => {
                        if(data) {
                            const userData = {
                                role: data['role']
                            }
                            localStorage.setItem('user', JSON.stringify(userData));
                        }
                        router.navigateByUrl('/home');
                        message.success('Registration Successfull');
                        return formActions.success({ message: 'Registration Successfull' });
                    }),
                    catchError((err:FirebaseError) => {
                        message.error(err.code.split('/')[1]);
                        return of(formActions.error({ error: err.code.split('/')[1] }));
                    })
                )
            })
        )
    })

    //For email and password login
    loginWithEmailEffects$ = createEffect((actions$ = inject(Actions), loginService = inject(LoginService), message = inject(MessageService)) => {
        return actions$.pipe(
            ofType(formActions.loginUserWithEmailAndPassword),
            switchMap(( value ) => {
                return from(loginService.loginWithEmail(value.data)).pipe(
                    map(() => {
                        return formActions.loginUserWithFirstore();
                    }),
                    catchError((err:FirebaseError) => {
                        message.error(err.code.split('/')[1]);
                        return of(formActions.error({ error: err.code.split('/')[1] }));
                    })
                )
            })
        )
    })

    //For login with firestore
    loginWithFireStore$ = createEffect((actions$ = inject(Actions), fireStoreService = inject(FireStoreService), router = inject(Router), message = inject(MessageService), authService = inject(AuthService), loginService = inject(LoginService)) => {
        return actions$.pipe(
            ofType(formActions.loginUserWithFirstore),
            switchMap(() => {
                return from(fireStoreService.getUsers(authService.getuid())).pipe(
                    map((data) => {
                        if(data) {
                            if(fireStoreService.loggedUser()!['role'] === 'admin') {
                                const userData = {
                                    email: data['email'],
                                    role: data['role'],
                                }
                                router.navigateByUrl('/admin');
                                localStorage.setItem('user', JSON.stringify(userData));
                            } else {
                                const userData = {
                                    role: data['role']
                                }
                                router.navigateByUrl('/home');
                                localStorage.setItem('user', JSON.stringify(userData));
                            }
                            message.success('Login Successfull');
                            return formActions.success({ message: 'Login Successfull' });
                        } else {
                            loginService.singOut();
                            message.error('Invalid credentials');
                            return formActions.error({ error: 'Invalid credentials' });
                        }
                    }),
                    catchError((err:FirebaseError) => {
                        message.error(err.code.split('/')[1]);
                        return of(formActions.error({ error: err.code.split('/')[1] }));
                    })
                )
            })
        )
    })

    // For Google register
    registerWithGoogleEffect$ = createEffect((actions$ = inject(Actions), loginService = inject(LoginService), auth = inject(AuthService), message = inject(MessageService)) => {
        return actions$.pipe(
            ofType(formActions.registerUserWithGoogle),
            switchMap(( value ) => {
                return from(loginService.registerWithGoogle()).pipe(
                    map((value) => {
                        if(value !== null) {
                            const data:fireStoreUser = {
                                email: value.email!,
                                role: 'user',
                                uid: auth.getuid()
                            };
                            return formActions.registerUserWithFirstore({ data: data });
                        } else {
                            message.error('Error loging in. Please ty again later')
                            return formActions.error({ error: 'Error loging in. Please ty again later'})
                        }
                    }),
                    catchError((err:FirebaseError) => {
                        message.error(err.code)
                        return of(formActions.error({ error: err.code.split('/')[1] }))
                    })
                )
            })
        )
    })

    //For login with google
    loginWithGoogleEffect$ = createEffect((actions$ = inject(Actions), loginService = inject(LoginService), message = inject(MessageService)) => {
        return actions$.pipe(
            ofType(formActions.loginUserWithGoogle),
            switchMap(( value ) => {
                return from(loginService.loginWithGoole()).pipe(
                    map(() => {
                        return formActions.loginUserWithFirstore();
                    }),
                    catchError((err:FirebaseError) => {
                        message.error(err.code)
                        return of(formActions.error({ error: err.code.split('/')[1] }))
                    })
                )
            })
        )
    })
}