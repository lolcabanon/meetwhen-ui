import dayjs from 'dayjs';
import {
	limit as limitAs,
	orderBy,
	startAfter,
	where,
} from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Id } from '$lib/core/types/Id';
import type { Meeting } from '$lib/models/Meeting';
import type { FindAllMeetingsOwnedByUserProps } from './findAllMeetingsOwnedByUser';
import { findAllMeetingsOwnedByUser } from '.';

export const findAllPreviousMeetingsOwnedByUser = async (
	repo: Firestore,
	userId: string,
	{ now = dayjs(), limit = 5, afterEnd }: FindAllMeetingsOwnedByUserProps = {},
): Promise<Id<Meeting>[]> => {
	const timeConstraits = [
		where('total.end', '<', now.unix()),
		orderBy('total.end', 'asc'),
		limitAs(limit),
	];
	if (afterEnd !== undefined) {
		timeConstraits.push(startAfter(afterEnd.unix()));
	}
	return await findAllMeetingsOwnedByUser(repo, userId, timeConstraits);
};