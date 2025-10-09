export interface ApiResponseWrapper<T> {
    status: boolean;
    result: T;
    message?: string;
}

export interface ApiListPayload<U> {
    list: U[];
}