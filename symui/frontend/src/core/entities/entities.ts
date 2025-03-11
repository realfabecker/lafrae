export enum ActionStatus {
  IDLE = 'idle',
  PENDING = 'pending',
  REJECTED = 'rejected',
  FULFILLED = 'fulfilled',
}

export type GpgKey = {
  uid: GpgKeyUid;
  pub: GpgKeyPub;
};

export type GpgKeyPub = {
  type: string;
  length: number;
  algo: number;
  keyid: string;
  date: number;
  expires: number;
};

export type GpgKeyUid = {
  uid: string;
};
