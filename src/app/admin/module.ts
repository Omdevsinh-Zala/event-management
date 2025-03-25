export interface EventData {
    title: string,
    image: string,
    place: string,
    description: string,
    date: string,
    participants: string[]
}

export interface NewEventData {
    title: string,
    bannerImage: string
    images: string[],
    place: string,
    description: string,
    date: DateType,
    participants: string[]
}

export interface DateType{
    date: string[] | string,
    singleDay: boolean,
    multiDay: boolean,
    odd_eventDay: boolean
    everyMonthEvent: boolean,
    everyWeekEvent: boolean,
    weekDay: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'
}

export const weekDay: readonly string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday'
]