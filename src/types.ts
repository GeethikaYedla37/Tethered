export type ItemType = 'sticky' | 'photo' | 'voice' | 'video';

export interface Reaction {
  emoji: string;
  count: number;
  users: string[];
}

export interface RoomItem {
  id: string;
  type: ItemType;
  x: number;
  y: number;
  content?: string;
  color?: string;
  fontFamily?: string;
  rotation?: number;
  author?: string;
  reactions?: Reaction[];
}

export type Mood = 'neutral' | 'calm' | 'energetic' | 'melancholy' | 'warm';
export type RoomType = 'private' | 'group';
