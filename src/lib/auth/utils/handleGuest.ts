import {
	updateProfile,
	createUserWithEmailAndPassword,
	deleteUser,
} from 'firebase/auth';
import type { Auth, UserCredential, User } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { addGuestUserData } from '$lib/firebase/mutations/addGuestUserData';
import { deleteGuestUserData } from '$lib/firebase/mutations/deleteGuestUserData';
import { generateSignInCode } from './generateSignInCode';
import { getGuestEmail } from './getGuestEmail';

export interface GuestJoinProps {
	username: string;
	meetingId: string;
}

export interface GuestJoinResult {
	credential: UserCredential;
	passcode: string;
}

export const guestJoin = async (
	auth: Auth,
	repo: Firestore,
	{ username, meetingId }: GuestJoinProps,
): Promise<GuestJoinResult> => {
	const email = getGuestEmail(username, meetingId);
	const passcode = generateSignInCode();
	const userCredential = await createUserWithEmailAndPassword(
		auth,
		email,
		passcode,
	);
	await updateProfile(userCredential.user, {
		displayName: username,
	});
	await addGuestUserData(repo, {
		userId: userCredential.user.uid,
		meetingId,
	});
	return {
		passcode,
		credential: userCredential,
	};
};

export interface GuestLeaveProps {
	user: User;
}

export const guestLeave = async (
	auth: Auth,
	repo: Firestore,
	{ user }: GuestLeaveProps,
): Promise<void> => {
	await deleteUser(user);
	await deleteGuestUserData(repo, {
		userId: user.uid,
	});
};
