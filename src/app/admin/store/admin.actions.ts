import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { EventData } from "../module";

 
 export const adminActions = createActionGroup({
    source: 'Admin',
    events: {
        //Initialize or trigger actions
        //Open event form model
        openModel: emptyProps(),
        //Close event form model
        closeModel: emptyProps(),
        //open update event form
        openUpdateEvent: props<{ id:string }>(),
        //close update event form
        closeUpdateEvent: emptyProps(),
        //Submit event data
        submitData: props<{  data:EventData }>(),
        //Update event data
        updateData: props<{ id: string, eventData: EventData }>(),
        //Get event form data if any error ocures or page refreshesh 
        initiateEventFormData: emptyProps(),
        //To get events data
        getEventData: emptyProps(),
        //To delete event
        removeEvent: props<{ id: string }>(),
        
        //To return empty actions
        //To delay open model
        opneModuleCall: emptyProps(),
        //To delay close model
        closeModuleCall: emptyProps(),
        //To delay open update model
        opneUpdateModuleCall: emptyProps(),
        //To delay close update model
        closeUpdateModuleCall: emptyProps(),
        //Get event form data
        getEventFormData: props<{ data: EventData }>(),
        //To turn loading on after submiting form
        processData: emptyProps(),
        //For successfuly getting event data
        sucessEventData: props<{ data:EventData[], ids: string[] }>(),
        //For event remove
        eventRemoveSuccess: emptyProps(),
        eventRemoveError: emptyProps(),
        //For error event data
        errorEventData: emptyProps(),
        //For error
        error: emptyProps()
    }
 })