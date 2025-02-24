import { inject, Injectable } from "@angular/core";
import { FireStoreService } from "../../services/fire-store.service";
import { AuthService } from "../../services/auth.service";
import { EventService } from "../../services/event.service";
import { EventData } from "../../admin/module";
import { delay, Observable, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { MessageService } from "../../services/message.service";
import { ComponentStore } from "@ngrx/component-store";

interface InitialState {
    loading: boolean,
    registerEventId: string,
    registerEventLoading: boolean,
    eventsData: EventData[],
    eventsIds: string[],
    error: string
}

const initialState: InitialState = {
    loading: false,
    registerEventId: '',
    registerEventLoading: false,
    eventsData: [],
    eventsIds: [],
    error: ''
}

@Injectable()
export class EventsStore extends ComponentStore<InitialState> {
    constructor() {
        super(initialState);
    }
    readonly loading$ = this.select((state) => state.loading);
    readonly eventsIds$ = this.select((state) => state.eventsIds);
    readonly eventData$ = this.select((state) => state.eventsData);
    readonly registerEventId$ = this.select((state) => state.registerEventId);
    readonly registerEventLoading$ = this.select((state) => state.registerEventLoading);

    private setLoading = this.updater((state, value: boolean) => ({...state, loading: value}));
    private setEventsIds = this.updater((state, data: string[]) => ({...state, eventsIds: data}));
    private setEventData = this.updater((state, data: EventData[]) => ({...state, eventsData: data}));
    private setRegisterEventId = this.updater((state, data: string) => ({...state, registerEventId: data}));
    private setRegisterEventLoading = this.updater((state, value: boolean) => ({...state, registerEventLoading: value}));

    private firebaseStore = inject(FireStoreService);
    private auth = inject(AuthService);
    private eventService = inject(EventService);
    private message=inject(MessageService);

    private getEventsData = this.effect((data$:Observable<void>) => {
        return data$.pipe(
            tap(() => this.setLoading(true)),
            switchMap(() => {
                return this.eventService.getEventData().pipe(
                    tapResponse({
                        next:(data) => {
                            if(data) {
                                this.setEventsIds(Object.keys(data));
                                this.setEventData(Object.values(data));
                                this.setLoading(false);
                            }
                        },
                        error:(err: any) => {
                            this.message.error(err)
                        }
                    })
                )
            })
        )
    });

    private regsterUser$ = this.effect((data$:Observable<{ id: string, data:EventData }>) => {
        return data$.pipe(
            tap((data) => {
                this.setRegisterEventId(data.id)
                this.setRegisterEventLoading(true)
            }),
            delay(500),
            switchMap((data) => {
                return this.eventService.updateData(data.id, data.data).pipe(
                    tapResponse({
                        next:() => {
                            this.setRegisterEventId('');
                            this.setRegisterEventLoading(false);
                        },
                        error:(err: any) => {
                            this.message.error(err.message);
                            this.setRegisterEventId('');
                            this.setRegisterEventLoading(false);
                        }
                    })
                )
            })
        )
    })

    addEventsData(id: string, data:EventData) {
        this.regsterUser$({id:id, data:data});
    }

    getEventData() {
        this.getEventsData();
    }
}