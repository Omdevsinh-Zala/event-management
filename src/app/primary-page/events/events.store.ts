import { inject, Injectable } from "@angular/core";
import { FireStoreService } from "../../services/fire-store.service";
import { AuthService } from "../../services/auth.service";
import { EventService } from "../../services/event.service";
import { EventData } from "../../admin/module";
import { delay, firstValueFrom, from, Observable, of, switchMap, tap } from "rxjs";
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
    eventData:[],
    error: ''
}

@Injectable()
export class EventsStore extends ComponentStore<InitialState> {
    constructor() {
        super(initialState);
    }
    readonly loading$ = this.select((state) => state.loading);
    readonly eventsIds$ = this.select((state) => state.eventsIds);
    readonly eventsData$ = this.select((state) => state.eventsData);
    readonly registerEventId$ = this.select((state) => state.registerEventId);
    readonly registerEventLoading$ = this.select((state) => state.registerEventLoading);
    readonly eventData$ = this.select((state) => state.eventData);

    private setLoading = this.updater((state, value: boolean) => ({...state, loading: value}));
    private setEventsIds = this.updater((state, data: string[]) => ({...state, eventsIds: data}));
    private setEventsData = this.updater((state, data: EventData[]) => ({...state, eventsData: data}));
    private setRegisterEventId = this.updater((state, data: string) => ({...state, registerEventId: data}));
    private setRegisterEventLoading = this.updater((state, value: boolean) => ({...state, registerEventLoading: value}));
    private setEventData = this.updater((state, data: EventData[]) => ({...state, eventData: data}));

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
                            if(data !== null) {
                                this.setEventsIds(Object.keys(data));
                                this.setEventsData(Object.values(data));
                            }
                            this.setLoading(false);
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
            delay(100),
            switchMap((value) => {
                return this.eventService.updateData(value.id, value.data).pipe(
                    tapResponse({
                        next:() => {
                            const data = {
                                events: value.data.participants
                            }
                            this.setEventData([value.data]);
                            this.addEventDataToUser();
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

    private addEventDataToUser$ = this.effect((data$:Observable<{ id: string, eventID: string }>) => {
        return data$.pipe(
            tap((data) => {
                this.setRegisterEventLoading(true)
            }),
            delay(100),
            switchMap((data) => {
                return from(this.firebaseStore.addEventData(data.id, data.eventID)).pipe(
                    tapResponse({
                        next:(data) => {
                            this.setRegisterEventId('');
                            this.setRegisterEventLoading(false);
                        },
                        error:(err: any) => {
                            this.message.error(err.code.split('/')[1] || err.code);
                            this.removeEventData();
                        }
                    })
                )
            })
        )
    })

    private removeEventData$ = this.effect((data$:Observable<{ id: string, data:EventData }>) => {
        return data$.pipe(
            tap((data) => {
                this.setRegisterEventId(data.id)
                this.setRegisterEventLoading(true)
            }),
            delay(100),
            switchMap((data) => {
                return of(this.eventService.updateData(data.id, data.data)).pipe(
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

    addEventsData(id: string, data:EventData) {
        this.regsterUser$({id:id, data:data});
    }

    async addEventDataToUser() {
        const eventId = await firstValueFrom(this.registerEventId$);
        this.addEventDataToUser$({id: this.auth.getuid(), eventID: eventId});
    }

    async removeEventData() {
        const data = await firstValueFrom(this.eventData$)
        const id = await firstValueFrom(this.registerEventId$);
        let newData: EventData;
        const updatedParticipants = data[0].participants.filter((uid) => uid !== this.auth.getuid());
        newData = { 
            title: data[0].title,
            bannerImage: data[0].bannerImage,
            images: data[0].images,
            description: data[0].description,
            place: data[0].place,
            date: data[0].date,
            participants: updatedParticipants
        };
        this.removeEventData$({ id: id, data: newData });
    }

    getEventData() {
        this.getEventsData();
    }
}