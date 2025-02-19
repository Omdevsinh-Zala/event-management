import { inject } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { adminActions } from "./admin.actions";
import { catchError, delay, map, of, switchMap } from "rxjs";
import { EventService } from "../../services/event.service";
import { MessageService } from "../../services/message.service";
import { FirebaseError } from "@angular/fire/app";
import { HttpErrorResponse } from "@angular/common/http";
import { LocalstorageService } from "../../services/localstorage.service";

export class AdminEffects {
    //To open event form model
    openModel$ = createEffect((actions$ = inject(Actions)) => {
        return actions$.pipe(
            ofType(adminActions.openModel),
            delay(100),
            map(() => adminActions.opneModuleCall())
        )
    });

    //To open update event form model
    openUpdateModel$ = createEffect((actions$ = inject(Actions)) => {
        return actions$.pipe(
            ofType(adminActions.openUpdateEvent),
            delay(100),
            map(() => adminActions.opneUpdateModuleCall())
        )
    });

    //To submit event form model data
    submitData$ = createEffect((actions$ = inject(Actions), service = inject(EventService), messageService = inject(MessageService), localStorage = inject(LocalstorageService)) => {
        return actions$.pipe(
            ofType(adminActions.submitData),
            switchMap((value) => {
                return service.addEvent(value.data).pipe(
                    map(() => {
                        localStorage.removeItem('ImageName');
                        localStorage.removeItem('EventDetails');
                        messageService.success('Event added successfully!')
                        return adminActions.closeModel();
                    }),
                    catchError((err) => {
                        console.log(err)
                        if(err instanceof HttpErrorResponse) {
                            messageService.error(err.statusText);
                            return of(adminActions.error());
                        } else {
                            messageService.error(err.code.split('/')[1]);
                            return of(adminActions.error());
                        }
                    })
                )
            })
        )
    });

    //Update event form
    updateEVentData$ = createEffect((action$ = inject(Actions), message = inject(MessageService), service = inject(EventService)) => {
        return action$.pipe(
            ofType(adminActions.updateData),
            switchMap((value) => {
                return service.updateData(value.id, value.eventData).pipe(
                    delay(200),
                    map(() => {
                        message.success('Data updated succesfully')
                        return adminActions.closeUpdateEvent();
                    }),
                    catchError((err:FirebaseError) => {
                        message.error(err.code.split('/')[1]);
                        return of(adminActions.error());
                    })
                )
            })
        )
    })

    //To close event form model data
    closeModel$ = createEffect((actions$ = inject(Actions)) => {
        return actions$.pipe(
            ofType(adminActions.closeModel),
            delay(200),
            map(() => adminActions.closeModuleCall())
        )
    });

    //To close update event form model data
    closeUpdateModel$ = createEffect((actions$ = inject(Actions)) => {
        return actions$.pipe(
            ofType(adminActions.closeUpdateEvent),
            delay(200),
            map(() => adminActions.closeUpdateModuleCall())
        )
    });

    //To get events data
    getEventData$ = createEffect((actions$ = inject(Actions), service = inject(EventService), message = inject(MessageService)) => {
        return actions$.pipe(
            ofType(adminActions.getEventData),
            switchMap(() => {
                return service.getEventData().pipe(
                    delay(1),
                    map((data) => {
                        if(data) {
                            const eventData = Object.values(data!);
                            const eventIds = Object.keys(data!)
                            return adminActions.sucessEventData({ data: eventData, ids: eventIds })
                        } else {
                            return adminActions.sucessEventData({ data: [], ids: [] })
                        }
                    }),
                    catchError((err:FirebaseError) => {
                        message.error(err.code.split('/')[1]);
                        return of(adminActions.errorEventData());
                    })
                )
            })
        )
    });

    //To get events form data after refresh
    initiateEventData$ = createEffect((actions$ = inject(Actions), localStorage = inject(LocalstorageService), message = inject(MessageService)) => {
        return actions$.pipe(
            ofType(adminActions.initiateEventFormData),
            map(() => {
                const data = JSON.parse(localStorage.getItem('EventDetails') || '[]');
                return adminActions.getEventFormData({ data: data });
            })
        )
    });

    //To remove event
    removeEvent$ = createEffect((action$ = inject(Actions), message = inject(MessageService), service = inject(EventService)) => {
        return action$.pipe(
            ofType(adminActions.removeEvent),
            switchMap((value) => {
                return service.removeEventData(value.id).pipe(
                    delay(300),
                    map(() => adminActions.eventRemoveSuccess()),
                    catchError((err:FirebaseError) => of(adminActions.eventRemoveError()))
                )
            })
        )
    })
}