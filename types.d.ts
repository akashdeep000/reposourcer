
export interface StargazersData {
    repository?: Repository;
    rateLimit:  RateLimit;
}

export interface RateLimit {
    cost:      number;
    remaining: number;
    limit:     number;
    resetAt:   Date;
}

export interface Repository {
    stargazers: Stargazers;
}

export interface Stargazers {
    totalCount: number;
    nodes:      Stargazer[];
    pageInfo:   PageInfo;
}

export interface Stargazer {
    avatarUrl:       string;
    name:            string;
    url:             string;
    followers:       Followers;
    company:         null | string;
    email:           string;
    location:        null | string;
    websiteUrl:      null | string;
    twitterUsername: null | string;
    repositories:    Followers;
}

export interface Followers {
    totalCount: number;
}

export interface PageInfo {
    endCursor:   string;
    hasNextPage: boolean;
}

// export interface Error {
//     type:      string;
//     path?:      string[];
//     locations?: {
//         line:   number;
//         column: number;
//     };
//     message:   string;
// }