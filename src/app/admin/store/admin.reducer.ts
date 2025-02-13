import { createFeature, createReducer, on } from "@ngrx/store"
import { adminActions } from "./admin.actions"
import { EventData } from "../module"

interface InitialState {
    moduleLoading: boolean,
    modelCall: boolean,
    loading: boolean
    modelState: boolean,
    eventData: EventData[]
}

const initialState: InitialState = {
    moduleLoading: false,
    modelCall: false,
    loading: false,
    modelState: false,
    eventData: []
}

const adminFeatures = createFeature({
    name: 'Admin',
    reducer: createReducer(
        initialState,
        on(adminActions.openModel, (state) => ({...state, moduleLoading: true, modelCall: true})),
        on(adminActions.opneModuleCall, (state) => ({...state, modelState: true})),
        on(adminActions.submitData, (state, actions) => ({...state, eventData: [actions.data], loading: true})),
        on(adminActions.closeModel, (state) => ({...state, modelState: false})),
        on(adminActions.closeModuleCall, (state) => ({...state, modelCall: false, moduleLoading: false, loading: false})),
        on(adminActions.success, (state) => ({...state, loading: false}))
    )
})

export const { name: adminKey, reducer: adminReducer, selectAdminState, selectModelCall, selectModelState, selectModuleLoading, selectEventData, selectLoading } = adminFeatures
