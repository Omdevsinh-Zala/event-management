import { createFeature, createReducer, on } from "@ngrx/store"
import { adminActions } from "./admin.actions"
import { EventData } from "../module"

interface InitialState {
    //For event form
    moduleLoading: boolean,
    modelCall: boolean,
    modelState: boolean,
    //For update event
    updateModuleLoading: boolean,
    updateModelCall: boolean,
    updateModelState: boolean,
    eventData: EventData[],
    eventsData: EventData[],
    eventsIdData: string[],
    eventLoading: boolean,
    //Event id
    eventId: string
    //Event button
    loading: boolean,
}

const initialState: InitialState = {
    moduleLoading: false,
    modelCall: false,
    loading: false,
    modelState: false,
    updateModelCall: false,
    updateModelState: false,
    updateModuleLoading: false,
    eventData: [],
    eventsData: [],
    eventsIdData: [],
    eventLoading: false,
    eventId: ''
}

const adminFeatures = createFeature({
    name: 'Admin',
    reducer: createReducer(
        initialState,
        on(adminActions.openModel, (state) => ({...state, moduleLoading: true, modelCall: true})),
        on(adminActions.opneModuleCall, (state) => ({...state, modelState: true})),
        on(adminActions.openUpdateEvent, (state, action) => ({...state, updateModuleLoading: true, updateModelCall: true, eventId: action.id})),
        on(adminActions.opneUpdateModuleCall, (state) => ({...state, updateModelState: true})),
        on(adminActions.submitData, (state, actions) => ({...state, eventData: [actions.data]})),
        on(adminActions.processData, (state) => ({...state, loading: true})),
        on(adminActions.closeModel, (state) => ({...state, modelState: false, eventLoading: true, eventData: []})),
        on(adminActions.closeModuleCall, (state) => ({...state, modelCall: false, moduleLoading: false, loading: false, eventLoading: false, eventData: []})),
        on(adminActions.closeUpdateEvent, (state) => ({...state, updateModelState: false, eventLoading: true, eventData: [], eventId: ''})),
        on(adminActions.closeUpdateModuleCall, (state) => ({...state, updateModelCall: false, updateModuleLoading: false, loading: false, eventLoading: false, eventData: []})),
        on(adminActions.getEventData, (state) => ({...state, eventLoading: true})),
        on(adminActions.getEventFormData, (state, action) => ({...state, eventData: [action.data]})),
        on(adminActions.sucessEventData, (state, action) => ({...state, eventLoading: false, eventsData: action.data, eventsIdData: action.ids})),
        on(adminActions.errorEventData, (state) => ({...state, eventLoading: false})),
        on(adminActions.error, (state) => ({...state, loading: false})),
        on(adminActions.removeEvent, (state, action) => ({...state, eventId: action.id})),
        on(adminActions.eventRemoveSuccess, (state) => ({...state, eventId: ''})),
        on(adminActions.eventRemoveError, (state) => ({...state})),
    )
})

export const { name: adminKey, reducer: adminReducer, selectAdminState, selectModelCall, selectModelState, selectModuleLoading, selectEventData, selectLoading, selectEventLoading, selectEventsData, selectEventsIdData, selectEventId, selectUpdateModelCall, selectUpdateModelState, selectUpdateModuleLoading } = adminFeatures
