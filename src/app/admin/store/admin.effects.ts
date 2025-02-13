import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { adminActions } from "./admin.actions";
import { catchError, delay, map, of, switchMap } from "rxjs";
import { Store } from "@ngrx/store";
import { EventService } from "../../services/event.service";
import { MessageService } from "../../services/message.service";
import { FirebaseError } from "@angular/fire/app";
import { HttpErrorResponse } from "@angular/common/http";

export class AdminEffects {
    openModel$ = createEffect((actions$ = inject(Actions)) => {
        return actions$.pipe(
            ofType(adminActions.openModel),
            delay(100),
            map(() => adminActions.opneModuleCall())
        )
    });

    submitData$ = createEffect((actions$ = inject(Actions), service = inject(EventService), messageService = inject(MessageService)) => {
        return actions$.pipe(
            ofType(adminActions.submitData),
            switchMap((value) => {
                return service.addEvent(value.data).pipe(
                    map(() => {
                        messageService.success('Event added successfully!')
                        return adminActions.closeModel();
                    }),
                    catchError((err) => {
                        console.log(err)
                        if(err instanceof HttpErrorResponse) {
                            messageService.error(err.statusText);
                            return of(adminActions.success());
                        } else {
                            messageService.error(err.code.split('/')[1]);
                            return of(adminActions.success());
                        }
                    })
                )
            })
        )
    });

    closeModel$ = createEffect((actions$ = inject(Actions)) => {
        return actions$.pipe(
            ofType(adminActions.closeModel),
            delay(200),
            map(() => adminActions.closeModuleCall())
        )
    });
}