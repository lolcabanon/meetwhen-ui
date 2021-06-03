import type { Meeting, MeetingDTO, Schedule, ScheduleDTO } from '.';
import type { Identifiable } from './identifiable';

export interface User extends Identifiable {
  name: string;
  email: string;
  isGuest: boolean;
  meetings: Partial<Meeting>[];
  schedules: Partial<Schedule>[];
}

export interface UserDTO extends Identifiable {
  name: string;
  email: string;
  isGuest: boolean;
  meetings: Partial<MeetingDTO>[];
  schedules: Partial<ScheduleDTO>[];
}
