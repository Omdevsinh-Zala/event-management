import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { fireStoreUser, RegisterUser } from "../module";


export const formActions = createActionGroup({
    source: 'Form',
    events: {
        registerUserWithEmailAndPassword: props<{ data: RegisterUser }>(),
        loginUserWithEmailAndPassword: props<{ data: RegisterUser }>(),
        registerUserWithGoogle: emptyProps(),
        loginUserWithGoogle: emptyProps(),
        registerUserWithFirstore: props<{data: fireStoreUser}>(),
        LoginUserWithFirstore: emptyProps(),
        success: props<{message:string}>(),
        error: props<{error: string}>()
    }
})