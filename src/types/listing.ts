export interface Listing {
  id: string;
  title: string;
  description: string;
  media: string[];
  tags: string[];
  created: string;
  updated: string;
  endsAt: string;
  _count: {
    bids: number;
  };
}

export interface Profile {
  name: string;
  email: string;
  avatar: string;
  credit: number;
  wins: string[];
  listings: Listing[];
  _count: {
    listings: number;
  };
}

export interface Bid {
  id: string;
  amount: number;
  created: string;
  bidderName: string;
}

export interface LoginResponse {
  name: string;
  email: string;
  credits: number;
  avatar: string | null;
  accessToken: string;
}

export interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  credits: number;
}

export interface fetchError {
  errors: error[];
  status: string;
  statusCode: number;
}

export interface error {
  code: string;
  message: string;
  path: string[];
}
