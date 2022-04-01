import { createAction, props } from '@ngrx/store';

export const loadGeoCountryCode = createAction('[UserLocal] loadGeoCountryCode', props<{ countryCode: string }>());
export const loadOrganizationId = createAction('[UserLocal] loadOrganizationId', props<{ organizationId: string }>());
