import { inject, Injectable } from "@angular/core";
import { FireStoreService } from "../../services/fire-store.service";
import { AuthService } from "../../services/auth.service";
import { EventService } from "../../services/event.service";
import { EventData } from "../../admin/module";
import { delay, firstValueFrom, from, Observable, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { MessageService } from "../../services/message.service";
import { ComponentStore } from "@ngrx/component-store";

interface InitialState {
    loading: boolean,
    registerEventId: string,
    registerEventLoading: boolean,
    eventsData: EventData[],
    eventsIds: string[],
    eventData: EventData[],
    error: string
}

const initialState: InitialState = {
    loading: false,
    registerEventId: '',
    registerEventLoading: false,
    eventsData: [],
    eventsIds: [],
    eventData: [],
    error: ''
}

@Injectable()
export class HomeStore extends ComponentStore<InitialState> {
    constructor() {
        super(initialState);
    }
    readonly loading$ = this.select((state) => state.loading);
    readonly eventsIds$ = this.select((state) => state.eventsIds);
    readonly eventsData$ = this.select((state) => state.eventsData);
    readonly eventData$ = this.select((state) => state.eventData);
    readonly registerEventId$ = this.select((state) => state.registerEventId);
    readonly registerEventLoading$ = this.select((state) => state.registerEventLoading);

    private setLoading = this.updater((state, value: boolean) => ({...state, loading: value}));
    private setEventsIds = this.updater((state, data: string[]) => ({...state, eventsIds: data}));
    private setEventsData = this.updater((state, data: EventData[]) => ({...state, eventsData: data}));
    private setEventData = this.updater((state, data: EventData[]) => ({...state, eventData: data}));
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
                                this.setEventsData(Object.values(data));
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
            delay(100),
            switchMap((data) => {
                return this.eventService.updateData(data.id, data.data).pipe(
                    tapResponse({
                        next:() => {
                            this.setEventData([data.data]);
                            this.setRegisterEventId('');
                            this.setLoading(false)
                        },
                        error:(err: any) => {
                            this.message.error(err.code.split('/')[1] || err.code);
                            this.undoEventData()
                        }
                    })
                )
            })
        )
    })

    private removeEventDataFromUser$ = this.effect((data$:Observable<{ id: string, eventId: string, eventData: EventData }>) => {
        return data$.pipe(
            tap((data) => {
                this.setRegisterEventId(data.eventId)
                this.setRegisterEventLoading(true)
                this.setEventData([data.eventData]);
            }),
            delay(100),
            switchMap((data) => {
                return from(this.firebaseStore.removeEventData(data.id, data.eventId)).pipe(
                    tapResponse({
                        next:() => {
                            this.updateEventsData()
                        },
                        error:(err: any) => {
                            this.message.error(err.code.split('/')[1] || err.code);
                            this.setRegisterEventId('');
                            this.setRegisterEventLoading(false);
                        }
                    })
                )
            })
        )
    })

    private undoEventData$ =this.effect((data$:Observable<{ id: string, data: EventData }>) => {
        return data$.pipe(
            delay(100),
            switchMap((data) => {
                return from(this.firebaseStore.addEventData(this.auth.getuid(), data.id)).pipe(
                    tapResponse({
                        next:() => {
                            this.setRegisterEventId('');
                            this.setRegisterEventLoading(false);
                        },
                        error:(err: any) => {
                            this.message.error(err.code.split('/')[1] || err.code);
                            this.setRegisterEventId('');
                            this.setRegisterEventLoading(false);
                        }
                    })
                )
            })
        )
    })

    async updateEventsData() {
        const eventId = await firstValueFrom(this.registerEventId$)
        const eventData = await firstValueFrom(this.eventData$)
        this.regsterUser$({id:eventId, data:eventData[0]});
    }

    getEventData() {
        this.getEventsData();
    }

    removeEventDataFromUser(eventID: string, eventData:EventData) {
        this.removeEventDataFromUser$({ id: this.auth.getuid(), eventId: eventID, eventData: eventData });
    }

    async undoEventData() {
        const eventId = await firstValueFrom(this.registerEventId$);
        const id = this.auth.getuid();
        const eventData = await firstValueFrom(this.eventData$);
        const array = eventData[0].participants;
        array.push(id);
        const data: EventData = { ...eventData[0], participants: array }
        this.undoEventData$({id: eventId,data: data});
    }
} 