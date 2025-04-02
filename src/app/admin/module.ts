// export interface EventData {
//     title: string,
//     image: string,
//     place: string,
//     description: string,
//     date: string,
//     participants: string[]
// }

export interface EventData {
    title: string,
    bannerImage: string
    images: string[],
    place: string,
    description: string,
    date: DateType,
    participants: string[]
}

export interface DateType{
    date: string[],
    singleDay: boolean,
    multiDay: boolean,
    odd_eventDay: boolean
    everyMonthEvent: boolean,
    everyWeekEvent: boolean,
    weekDay: string[] | null
}

export const weekDay: readonly { [key:string]: string }[] = [
    { value: '0', day: 'Sunday'},
    { value: '1', day: 'Monday'},
    { value: '2', day: 'Tuesday'},
    { value: '3', day: 'Wednesday'},
    { value: '4', day: 'Thursday'},
    { value: '5', day: 'Friday'},
    { value: '6', day: 'Saturday'},
]