export interface RegisterUser {
  email: string;
  password: string;
}

export interface fireStoreUser {
  email: string;
  role: string;
  uid: string;
  events?: string[],
  'events-beta'?: string[],
  FCMToken?: string
}
