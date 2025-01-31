import { createFeature, createReducer, on } from "@ngrx/store"
import { formActions } from "./form.actions"

interface InitialState {
    isEmailLoading: boolean,
    isGmailLoading: boolean,
    sigInProgress: boolean,
    message: string,
    error: string
}

const initialState:InitialState = {
    isEmailLoading: false,
    isGmailLoading: false,
    sigInProgress: false,
    message: '',
    error: ''
}

const formFeature = createFeature({
    name: 'Form',
    reducer: createReducer(
        initialState,
        on(formActions.registerUserWithEmailAndPassword, (state, action) => ({...state, isEmailLoading: true, sigInProgress: true})),
        on(formActions.registerUserWithGoogle, (state, action) => ({...state, isGmailLoading: true, sigInProgress: true})),
        on(formActions.loginUserWithEmailAndPassword, (state, action) => ({...state, isEmailLoading: true, sigInProgress: true})),
        on(formActions.loginUserWithGoogle, (state, action) => ({...state, isGmailLoading: true, sigInProgress: true})),
        on(formActions.success, (state, action) => ({...state, isEmailLoading: false, isGmailLoading:false, message: action.message, sigInProgress: false})),
        on(formActions.error, (state, action) => ({...state, isEmailLoading: false, isGmailLoading:false, error: action.error, sigInProgress: false}))
    )
})

export const { name: FormKey, reducer: FormReducer, selectError, selectFormState, selectIsEmailLoading, selectIsGmailLoading, selectSigInProgress, selectMessage } = formFeature