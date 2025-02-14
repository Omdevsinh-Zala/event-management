import { createFeature, createReducer, on } from "@ngrx/store"
import { adminActions } from "./admin.actions"
import { EventData } from "../module"

interface InitialState {
    moduleLoading: boolean,
    modelCall: boolean,
    loading: boolean,
    modelState: boolean,
    eventData: EventData[],
    eventsData: EventData[],
    eventsIdData: string[],
    eventLoading: boolean
}

const initialState: InitialState = {
    moduleLoading: false,
    modelCall: false,
    loading: false,
    modelState: false,
    eventData: [],
    eventsData: [],
    eventsIdData: [],
    eventLoading: false
}

const adminFeatures = createFeature({
    name: 'Admin',
    reducer: createReducer(
        initialState,
        on(adminActions.openModel, (state) => ({...state, moduleLoading: true, modelCall: true})),
        on(adminActions.opneModuleCall, (state) => ({...state, modelState: true})),
        on(adminActions.submitData, (state, actions) => ({...state, eventData: [actions.data]})),
        on(adminActions.processData, (state) => ({...state, loading: true})),
        on(adminActions.closeModel, (state) => ({...state, modelState: false, eventLoading: true, eventData: []})),
        on(adminActions.getEventData, (state) => ({...state, eventLoading: true})),
        on(adminActions.getEventFormData, (state, action) => ({...state, eventData: [action.data]})),
        on(adminActions.sucessEventData, (state, action) => ({...state, eventLoading: false, eventsData: action.data, eventsIdData: action.ids})),
        on(adminActions.errorEventData, (state) => ({...state, eventLoading: false})),
        on(adminActions.closeModuleCall, (state) => ({...state, modelCall: false, moduleLoading: false, loading: false, eventLoading: false, eventData: []})),
        on(adminActions.error, (state) => ({...state, loading: false}))
    )
})

export const { name: adminKey, reducer: adminReducer, selectAdminState, selectModelCall, selectModelState, selectModuleLoading, selectEventData, selectLoading, selectEventLoading, selectEventsData, selectEventsIdData } = adminFeatures
