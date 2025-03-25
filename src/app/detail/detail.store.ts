import { inject, Injectable } from "@angular/core";
import { EventData } from "../admin/module";
import { ComponentStore } from "@ngrx/component-store";
import { delay, map, Observable, switchMap, tap } from "rxjs";
import { EventService } from "../services/event.service";
import { tapResponse } from "@ngrx/operators";
import { MessageService } from "../services/message.service";
import { Router } from "@angular/router";
import { FireStoreService } from "../services/fire-store.service";
import { DocumentData } from "@angular/fire/firestore";
import { LocalstorageService } from "../services/localstorage.service";

interface Initialstate {
    loading: boolean,
    eventData: EventData[],
    loadingParticiants: boolean,
    participantsData: DocumentData[],
    isAdmin: boolean
}

const initialstate: Initialstate = {
    loading: true,
    eventData: [],
    loadingParticiants: true,
    participantsData: [],
    isAdmin: false
}

@Injectable()
export class DetailStore extends ComponentStore<Initialstate> {
    constructor() {
        super(initialstate)
    }
    readonly loading$ = this.select((state) => state.loading);
    readonly eventData$ = this.select((state) => state.eventData);
    readonly paticipantsLoading$ = this.select((state) => state.loadingParticiants);
    readonly participantsData$ = this.select((state) => state.participantsData);
    readonly isAdmin$ = this.select((state) => state.isAdmin);

    private setLoading = this.updater((state, value: boolean) => ({...state, loading: value}));
    private setData = this.updater((state, value: EventData[]) => ({...state, eventData: value}));
    private setPartiLoading = this.updater((state, value: boolean) => ({...state, loadingParticiants: value}));
    private setPartiData = this.updater((state, value: DocumentData[]) => ({...state, participantsData: value}));
    private setAdmin = this.updater((state, value: boolean) => ({...state, isAdmin: value}));
    
    private eventService = inject(EventService);
    private messageService = inject(MessageService);
    private router = inject(Router);
    private fireStore = inject(FireStoreService);
    private localStorage = inject(LocalstorageService);

    private getEventData = this.effect((data$:Observable<string>) => {
        return data$.pipe(
            tap(() => this.setLoading(true)),
            delay(200),
            switchMap((data$) => {
                return this.eventService.getEvent(data$).pipe(
                    tapResponse({
                        next: (data) => {
                            if(data && typeof data !== 'string') {
                                this.setData([data])
                                this.setLoading(false);
                            } if (typeof data == 'string') {
                                this.messageService.error(data)
                                this.setLoading(false);
                                this.router.navigateByUrl('/event/admin')
                            }
                        },
                        error: (err) => {
                            this.setLoading(false);
                            this.router.navigateByUrl('/event/admin')
                        }
                    })
                )
            })
        )
    })

    private getParticipants$ = this.effect((data$:Observable<string>) => {
        return data$.pipe(
            tap(() => {
                this.setPartiLoading(true)
            }),
            switchMap((data$) => {
                return this.fireStore.getUserFromEvent(data$).pipe(
                    tapResponse({
                        next: (data) => {
                            if(data && data.length > 0) {
                                this.setPartiData(data)
                            } else {
                                this.setPartiData([])
                            }
                            this.setPartiLoading(false)
                        },
                        error: () => {
                            const data = JSON.parse(this.localStorage.getItem('user') || '[]');
                            if(data && data['role'] === 'admin' && data['email']) {
                                this.messageService.error('Error loading participants data');
                            }
                        }
                    })
                )
            })
        )
    })

    getLoggedUserData$ = this.effect((data$:Observable<void>) => {
        return data$.pipe(
            map(() => {
                const data = JSON.parse(this.localStorage.getItem('user') || '[]');
                if(data && data['role'] === 'admin' && data['email']) {
                    this.setAdmin(true)
                } else {
                    this.setAdmin(false)
                }
            })
        )
    })

    getParticipantsData(id: string) {
        this.getParticipants$(id)
    }

    checkUser() {
        this.getLoggedUserData$()
    }

    getEventData$(id: string) {
        this.getEventData(id);
    }
}