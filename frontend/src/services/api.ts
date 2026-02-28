import * as backendApi from './api.backend';

export type { User, Category, EventLocation, Event, Booking, EventFilters } from './types';

export const authService = backendApi.authService;
export const eventService = backendApi.eventService;
export const bookingService = backendApi.bookingService;
