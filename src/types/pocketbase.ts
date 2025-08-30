/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
	ItemList = 'itemList',
	Mysound = 'Mysound',
	SoundStore = 'SoundStore',
	SoundStore2 = 'SoundStore2',
	SoundStoreInput = 'SoundStoreInput',
	Transaction = 'Transaction',
	UserCountBeta = 'userCountBeta',
	UserPass = 'userPass',
	Users = 'users',
	UsersTest = 'users_test'
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString;
	created: IsoDateString;
	updated: IsoDateString;
	collectionId: string;
	collectionName: Collections;
	expand?: T;
};

export type AuthSystemFields<T = never> = {
	email: string;
	emailVisibility: boolean;
	username: string;
	verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type ItemListRecord = {
	Name?: string;
	Desc?: string;
	Image?: string;
	Province?: string;
	Size?: string;
	Status?: string;
	isPriTest?: boolean;
	price?: number;
	price_pri?: number;
	price_test?: number;
	public?: boolean;
	tags?: string[];
	user?: RecordIdString;
	userStore?: RecordIdString;
};

export type MysoundRecord<Tmysound = unknown> = {
	mysound?: null | Tmysound;
	user?: RecordIdString;
};

export type SoundStoreRecord = {
	SelectedSound?: string;
	Sound?: string;
	Transpose?: number;
	text?: string;
	user?: RecordIdString;
};

export type SoundStore2Record = {
	Sound?: string;
	user: RecordIdString;
};

export type SoundStoreInputRecord = {
	Sound?: string;
	text?: string;
	user?: RecordIdString;
};

export type TransactionRecord<TJson = unknown> = {
	Amount?: number;
	Json?: null | TJson;
	transRef?: string;
	user?: RecordIdString;
};

export type UserCountBetaRecord = {
	userNum?: number;
};

export type UserPassRecord = {
	Password?: string;
	email?: string;
	user: RecordIdString;
};

export type UsersRecord = {
	FirstLoad?: number;
	GenSoundMax?: number;
	TierLevel?: number;
	Token?: number;
	Tokens?: number;
	TotalSpent?: number;
	UserNumber?: number;
	avatar?: string;
	name?: string;
};

export type UsersTestRecord = {
	Token?: number;
	avatar?: string;
	name?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type ItemListResponse<Texpand = unknown> = Required<ItemListRecord> &
	BaseSystemFields<Texpand>;
export type MysoundResponse<Tmysound = unknown, Texpand = unknown> = Required<
	MysoundRecord<Tmysound>
> &
	BaseSystemFields<Texpand>;
export type SoundStoreResponse<Texpand = unknown> = Required<SoundStoreRecord> &
	BaseSystemFields<Texpand>;
export type SoundStore2Response<Texpand = unknown> = Required<SoundStore2Record> &
	BaseSystemFields<Texpand>;
export type SoundStoreInputResponse<Texpand = unknown> = Required<SoundStoreInputRecord> &
	BaseSystemFields<Texpand>;
export type TransactionResponse<TJson = unknown, Texpand = unknown> = Required<
	TransactionRecord<TJson>
> &
	BaseSystemFields<Texpand>;
export type UserCountBetaResponse<Texpand = unknown> = Required<UserCountBetaRecord> &
	BaseSystemFields<Texpand>;
export type UserPassResponse<Texpand = unknown> = Required<UserPassRecord> &
	BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>;
export type UsersTestResponse<Texpand = unknown> = Required<UsersTestRecord> &
	AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	itemList: ItemListRecord;
	Mysound: MysoundRecord;
	SoundStore: SoundStoreRecord;
	SoundStore2: SoundStore2Record;
	SoundStoreInput: SoundStoreInputRecord;
	Transaction: TransactionRecord;
	userCountBeta: UserCountBetaRecord;
	userPass: UserPassRecord;
	users: UsersRecord;
	users_test: UsersTestRecord;
};

export type CollectionResponses = {
	itemList: ItemListResponse;
	Mysound: MysoundResponse;
	SoundStore: SoundStoreResponse;
	SoundStore2: SoundStore2Response;
	SoundStoreInput: SoundStoreInputResponse;
	Transaction: TransactionResponse;
	userCountBeta: UserCountBetaResponse;
	userPass: UserPassResponse;
	users: UsersResponse;
	users_test: UsersTestResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'itemList'): RecordService<ItemListResponse>;
	collection(idOrName: 'Mysound'): RecordService<MysoundResponse>;
	collection(idOrName: 'SoundStore'): RecordService<SoundStoreResponse>;
	collection(idOrName: 'SoundStore2'): RecordService<SoundStore2Response>;
	collection(idOrName: 'SoundStoreInput'): RecordService<SoundStoreInputResponse>;
	collection(idOrName: 'Transaction'): RecordService<TransactionResponse>;
	collection(idOrName: 'userCountBeta'): RecordService<UserCountBetaResponse>;
	collection(idOrName: 'userPass'): RecordService<UserPassResponse>;
	collection(idOrName: 'users'): RecordService<UsersResponse>;
	collection(idOrName: 'users_test'): RecordService<UsersTestResponse>;
};
