import Pocketbase from "pocketbase";
import type { AuthModel } from "pocketbase";
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: Pocketbase;
			user: AuthModel | undefined;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
