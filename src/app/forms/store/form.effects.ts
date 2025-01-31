import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { LoginService } from "../../services/login.service";
import { Router } from "@angular/router";
import { formActions } from "./form.actions";
import { catchError, delay, from, map, of, switchMap, timeInterval, timeout } from "rxjs";
import { FirebaseError } from "@angular/fire/app";
import { MessageService } from "../../services/message.service";

@Injectable()
export class FormsEfects {
    //For email and password register
    registerWithEmailEffets$ = createEffect((actions$ = inject(Actions), loginService = inject(LoginService), router = inject(Router), message = inject(MessageService)) => {
        return actions$.pipe(
            ofType(formActions.registerUserWithEmailAndPassword),
            switchMap(( value ) => {
                return from(loginService.signupWithEmail(value.data)).pipe(
                    delay(2000),
                    map(() => {
                        router.navigateByUrl('/login')
                        message.success('Registration Successfull')
                        return formActions.success({ message: 'Registration Successfull' })
                    }),
                    catchError((err:FirebaseError) => {
                        message.error(err.code.split('/')[1])
                        return of(formActions.error({ error: err.code.split('/')[1] }))
                    })
                )
            })
        )
    })

    //For email and password login
    loginWithEmailEffects$ = createEffect((actions$ = inject(Actions), loginService = inject(LoginService), router = inject(Router), message = inject(MessageService)) => {
        return actions$.pipe(
            ofType(formActions.loginUserWithEmailAndPassword),
            switchMap(( value ) => {
                return from(loginService.loginWithEmail(value.data)).pipe(
                    delay(2000),
                    map(() => {
                        router.navigateByUrl('/home')
                        message.success('Login Successfull')
                        return formActions.success({ message: 'Login Successfull' })
                    }),
                    catchError((err:FirebaseError) => {
                        message.error(err.code.split('/')[1])
                        return of(formActions.error({ error: err.code.split('/')[1] }))
                    })
                )
            })
        )
    })

    //For google sign in
    // registerWithGoogleEffect$ = createEffect((actions$ = inject(Actions), loginService = inject(LoginService), router = inject(Router)) => {
    //     return actions$.pipe(
    //         ofType(formActions.registerUserWithGoogle),
    //         switchMap(( value ) => {
    //             return from(loginService.loginWithGoogle()).pipe(
    //                 // delay(2000),
    //                 map(() => {
    //                     router.navigateByUrl('/login')
    //                     return formActions.success({ message: 'Registration Successfull' })
    //                 }),
    //                 catchError((err:FirebaseError) => {
    //                     return of(formActions.error({ error: err.code.split('/')[1] }))
    //                 })
    //             )
    //         })
    //     )
    // })
}