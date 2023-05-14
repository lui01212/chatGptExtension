const RequestBuilder = (BaseUrl, options, interceptor) => {
    const API_URL = BaseUrl || '';
    const this_options = options || {};
    const this_interceptor = interceptor || ((response) => response.json());

    // function makes an api call, any logs for the apis logs can be attached here
    const makeRequest = async (endpoint, options) => {
        const [error, response] = await fetch(endpoint, options)
            .then(async (response) => [null, await this_interceptor(response)])
            .catch(function (error) {
                //
                console.log(error);
                //
                if (error.code) {
                    return [error, null];
                }
                //
                return ["エラー", null];
            });

        return [error, response];
    };

    return {
        get: async (url, params) => {
            const endpoint = `${API_URL}${url}${params ? `?${new URLSearchParams(params).toString()}` : ''
                }`,
                method = 'GET';
            return makeRequest(endpoint, {
                method,
                ...this_options.options(),
                headers: this_options.headers(method, url),
            });
        },

        post: async (url, data, params) => {
            const endpoint = `${API_URL}${url}${params ? `?${new URLSearchParams(params).toString()}` : ''
                }`,
                method = 'POST';
            return makeRequest(endpoint, {
                method,
                ...this_options.options(),
                ...(data instanceof FormData
                    ? {}
                    : {
                        headers: this_options.headers(),
                    }),
                ...(data && {
                    body: data instanceof FormData ? data : JSON.stringify(data),
                }),
            });
        },
    };
};

const apiIntercept = async (response) => {
    const { status } = response;
    switch (true) {
        case status === 400:
            throw apiCustomException((await response.json()).message, status);
        case status === 401:
            throw apiCustomException((await response.json()).message, status);
        case status === 403:
            throw apiCustomException((await response.json()).message, status);
        case status === 404:
            throw apiCustomException((await response.json()).message || 'Not found', status);
        case status === 419:
            throw apiCustomException((await response.json()).message, status);
        case status === 500:
            throw apiCustomException('エラー', status);
        case status === 204:
            return {
                status: 'OK',
            };
        default:
            return response.json();
    }
};

const apiCustomException = (message, status) => {
    const error = new Error(message);
    error.name = '';
    error.code = status;
    //
    return error;
};

const apiHeaders = () => {
    return {
        'Content-type': 'application/json; charset=UTF-8',
    };
};

const apiOptions = () => {
    return {
        credentials: 'same-origin',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    };
};

const apiBaseUrl = "http://localhost/chatgpt";
const apiRequest = RequestBuilder(
    apiBaseUrl,
    {
        headers: apiHeaders,
        options: apiOptions,
    },
    apiIntercept
);

const apiWaitForAll = (...ps) => {
    return Promise.all(ps);
}