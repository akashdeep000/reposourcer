
export interface StargazersData {
    repository?: Repository;
    rateLimit: RateLimit;
}

export interface RateLimit {
    cost: number;
    remaining: number;
    limit: number;
    resetAt: Date;
}

export interface Repository {
    stargazers: Stargazers;
}

export interface Stargazers {
    totalCount: number;
    nodes: Stargazer[];
    pageInfo: PageInfo;
}

export interface Stargazer {
    avatarUrl: string;
    name: string;
    url: string;
    followers: {
        totalCount: number;
    };
    company: null | string;
    email: string;
    location: null | string;
    websiteUrl: null | string;
    twitterUsername: null | string;
    repositories: {
        totalCount?: number;
        totalStar?: number;
        nodes?: {
            stargazerCount: number;
        }[]
    };
}

export interface PageInfo {
    endCursor: string;
    hasNextPage: boolean;
}