import type { Readable } from 'svelte/store';
import { initializeApp } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import {
	browserSessionPersistence,
	getAuth,
	setPersistence,
	useDeviceLanguage,
} from 'firebase/auth';
import type { Auth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { pairedContext } from '$lib/core/utils/pairedContext';
import type { Maybe } from '$lib/core/types/Maybe';
import type { SafeUser } from '$lib/core/types/SafeUser';
import type { Session } from '$lib/core/types/Session';
import { firebaseConfig } from './firebaseConfig';
import { configureUser } from '$lib/auth/configureUser';

export const { get: getFirebaseApp, set: setFirebaseApp } =
	pairedContext<FirebaseApp>();

export const { get: getFirebaseAuth, set: setFirebaseAuth } =
	pairedContext<Auth>();

export const { get: getRepo, set: setRepo } = pairedContext<Firestore>();

export const { get: getUser, set: setUser } =
	pairedContext<Readable<Maybe<SafeUser>>>();

export const initFirebaseContext = (session: Session): void => {
	// Prevent re-initializing the Firebase SDK during hot reloading.
	if (getFirebaseApp()) {
		return;
	}

	const app = initializeApp(firebaseConfig);
	setFirebaseApp(app);

	const auth = getAuth(app);
	setPersistence(auth, browserSessionPersistence);
	useDeviceLanguage(auth);
	setFirebaseAuth(auth);

	const repo = getFirestore();
	setRepo(repo);

	setUser(configureUser(auth, session));
};
