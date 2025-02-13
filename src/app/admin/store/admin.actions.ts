import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { EventData } from "../module";

 
 export const adminActions = createActionGroup({
    source: 'Admin',
    events: {
        opneModuleCall: emptyProps(),
        closeModuleCall: emptyProps(),
        openModel: emptyProps(),
        closeModel: emptyProps(),
        submitData: props<{  data:EventData }>(),
        success: emptyProps()
    }
 })