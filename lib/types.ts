export type UserRole = "admin" | "user";
export type HeadlineStatus = "DRAFT" | "PUBLISHED" | "CANCELLED";

export interface User {
  id: string;
  email: string;
  role: UserRole;
  created_at: string;
}

export interface HeadlineFile {
  name: string;
  url: string;
  size: number;
}

export interface Headline {
  id: string;
  title: string;
  description: string;
  cover_image_url?: string;
  files: HeadlineFile[];
  status: HeadlineStatus;
  auto_publish_date?: string;
  published_date?: string;
  published_by?: string;
  created_date: string;
  created_by: string;
  modified_date: string;
  modified_by: string;
}

export interface AdminInvite {
  id: string;
  token: string;
  email: string;
  created_by: string;
  created_at: string;
  expires_at: string;
  used: boolean;
  used_at?: string;
}

export interface HeadlinesResponse {
  headlines: Headline[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface PaginationParams {
  cursor?: string;
  limit?: number;
  page?: number;
}

export interface HeadlineFilters {
  status?: HeadlineStatus;
  search?: string;
}

export type ViewMode = "list" | "grid" | "card";
