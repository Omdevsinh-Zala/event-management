import { inject, Injectable } from "@angular/core";
import { EventData } from "../admin/module";
import { ComponentStore } from "@ngrx/component-store";
import { delay, map, Observable, switchMap, tap } from "rxjs";
import { EventService } from "../services/event.service";
import { tapResponse } from "@ngrx/operators";
import { MessageService } from "../services/message.service";
import { Router } from "@angular/router";

interface Initialstate {
    loading: boolean,
    eventData: EventData[]
}

const initialstate: Initialstate = {
    loading: true,
    eventData: []
}

@Injectable()
export class DetailStore extends ComponentStore<Initialstate> {
    constructor() {
        super(initialstate)
    }
    readonly loading$ = this.select((state) => state.loading);
    readonly eventData$ = this.select((state) => state.eventData);

    private setLoading = this.updater((state, value: boolean) => ({...state, loading: value}));
    private setData = this.updater((state, value: EventData[]) => ({...state, eventData: value}));
    
    private eventService = inject(EventService);
    private messageService = inject(MessageService);
    private router = inject(Router);

    private getEventData = this.effect((data$:Observable<string>) => {
        return data$.pipe(
            tap(() => this.setLoading(true)),
            delay(200),
            switchMap((data$) => {
                return this.eventService.getEvent(data$).pipe(
                    tapResponse({
                        next: (data) => {
                            if(data && typeof data !== 'string') {
                                console.log(data)
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

    getEventData$(id: string) {
        this.getEventData(id);
    }
}