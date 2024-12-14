import { IManagedObject } from '@c8y/client';

export interface _LocalstorageDevice {
  id: string;
  lastVisit: string;
  lastRoute: string;
}
export interface _CustomDevice extends IManagedObject {
  id: string;
  lastVisit: string;
  lastRoute: string;
  extraData?: string[];
}
