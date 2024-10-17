import { marked } from 'marked';

/**
 * 通用操作按钮
 */
declare class ActionBtn {
    private opts;
    $el: HTMLElement;
    isLoading: boolean;
    msgRecTimer?: number;
    msgRecTimerFunc?: Function;
    get isMessaging(): boolean;
    isConfirming: boolean;
    confirmRecTimer?: number;
    /** 构造函数 */
    constructor(opts: ActionBtnOptions | string | (() => string));
    /** 将按钮装载到指定元素 */
    appendTo(dom: HTMLElement): this;
    /** 获取按钮文字（动态/静态） */
    private getText;
    /** 设置点击事件 */
    setClick(func: Function): void;
    /** 文字刷新（动态/静态） */
    updateText(text?: (() => string) | string): void;
    /** 设置加载状态 */
    setLoading(value: boolean, loadingText?: string): void;
    /** 错误消息 */
    setError(text: string): void;
    /** 警告消息 */
    setWarn(text: string): void;
    /** 成功消息 */
    setSuccess(text: string): void;
    /** 设置消息 */
    setMsg(text: string, className?: string, duringTime?: number, after?: Function): void;
    /** 设置消息复原操作定时器 */
    private setMsgRecTimer;
    /** 立刻触发器复原定时器 */
    private fireMsgRecTimer;
    /** 仅清除 timer */
    private clearMsgRecTimer;
}

declare interface ActionBtnOptions {
    /** 按钮文字 (动态/静态) */
    text: (() => string) | string;
    /** 仅管理员可用 */
    adminOnly?: boolean;
    /** 确认操作 */
    confirm?: boolean;
    /** 确认时提示文字 */
    confirmText?: string;
}

declare class Api extends Api_2<void> {
    private _opts;
    constructor(opts: ApiOptions);
    /**
     * Get user info as params for request
     *
     * @returns Request params with user info
     */
    getUserFields(): {
        name: string;
        email: string;
    } | undefined;
}

/**
 * @title Artalk API
 * @version 2.0
 * @license MIT (https://github.com/ArtalkJS/Artalk/blob/master/LICENSE)
 * @baseUrl /api/v2
 * @contact API Support <artalkjs@gmail.com> (https://artalk.js.org)
 *
 * Artalk is a modern comment system based on Golang.
 */
declare class Api_2<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
    cache: {
        /**
         * @description Flush all cache on the server
         *
         * @tags Cache
         * @name FlushCache
         * @summary Flush Cache
         * @request POST:/cache/flush
         * @secure
         * @response `200` `(HandlerMap & {
         msg?: string,

         })` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         */
        flushCache: (params?: RequestParams) => Promise<HttpResponse<HandlerMap & {
            msg?: string | undefined;
        }, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Cache warming helps you to pre-load the cache to improve the performance of the first request
         *
         * @tags Cache
         * @name WarmUpCache
         * @summary Warm-Up Cache
         * @request POST:/cache/warm_up
         * @secure
         * @response `200` `(HandlerMap & {
         msg?: string,

         })` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         */
        warmUpCache: (params?: RequestParams) => Promise<HttpResponse<HandlerMap & {
            msg?: string | undefined;
        }, HandlerMap & {
            msg?: string | undefined;
        }>>;
    };
    captcha: {
        /**
         * @description Get a base64 encoded captcha image or a HTML page to verify for user
         *
         * @tags Captcha
         * @name GetCaptcha
         * @summary Get Captcha
         * @request GET:/captcha
         * @response `200` `HandlerResponseCaptchaGet` OK
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        getCaptcha: (params?: RequestParams) => Promise<HttpResponse<HandlerResponseCaptchaGet, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Get the status of the user's captcha verification
         *
         * @tags Captcha
         * @name GetCaptchaStatus
         * @summary Get Captcha Status
         * @request GET:/captcha/status
         * @response `200` `HandlerResponseCaptchaStatus` OK
         */
        getCaptchaStatus: (params?: RequestParams) => Promise<HttpResponse<HandlerResponseCaptchaStatus, any>>;
        /**
         * @description Verify user enters correct captcha code
         *
         * @tags Captcha
         * @name VerifyCaptcha
         * @summary Verify Captcha
         * @request POST:/captcha/verify
         * @response `200` `HandlerMap` OK
         * @response `403` `(HandlerMap & {
         img_data?: string,

         })` Forbidden
         */
        verifyCaptcha: (data: HandlerParamsCaptchaVerify, params?: RequestParams) => Promise<HttpResponse<HandlerMap, HandlerMap & {
            img_data?: string | undefined;
        }>>;
    };
    comments: {
        /**
         * @description Get a list of comments by some conditions
         *
         * @tags Comment
         * @name GetComments
         * @summary Get Comment List
         * @request GET:/comments
         * @secure
         * @response `200` `HandlerResponseCommentList` OK
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        getComments: (query: {
            /** The user email */
            email?: string;
            /** Enable flat_mode */
            flat_mode?: boolean;
            /** The limit for pagination */
            limit?: number;
            /** The username */
            name?: string;
            /** The offset for pagination */
            offset?: number;
            /** The comment page_key */
            page_key: string;
            /** The scope of comments */
            scope?: 'page' | 'user' | 'site';
            /** Search keywords */
            search?: string;
            /** The site name of your content scope */
            site_name?: string;
            /** Sort by condition */
            sort_by?: 'date_asc' | 'date_desc' | 'vote';
            /** Message center show type */
            type?: 'all' | 'mentions' | 'mine' | 'pending';
            /** Only show comments by admin */
            view_only_admin?: boolean;
        }, params?: RequestParams) => Promise<HttpResponse<HandlerResponseCommentList, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Create a new comment
         *
         * @tags Comment
         * @name CreateComment
         * @summary Create Comment
         * @request POST:/comments
         * @secure
         * @response `200` `HandlerResponseCommentCreate` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        createComment: (comment: HandlerParamsCommentCreate, params?: RequestParams) => Promise<HttpResponse<HandlerResponseCommentCreate, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Get the detail of a comment by comment id
         *
         * @tags Comment
         * @name GetComment
         * @summary Get a comment
         * @request GET:/comments/{id}
         * @response `200` `HandlerResponseCommentGet` OK
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        getComment: (id: number, params?: RequestParams) => Promise<HttpResponse<HandlerResponseCommentGet, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Update a specific comment
         *
         * @tags Comment
         * @name UpdateComment
         * @summary Update Comment
         * @request PUT:/comments/{id}
         * @secure
         * @response `200` `HandlerResponseCommentUpdate` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        updateComment: (id: number, comment: HandlerParamsCommentUpdate, params?: RequestParams) => Promise<HttpResponse<HandlerResponseCommentUpdate, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Delete a specific comment
         *
         * @tags Comment
         * @name DeleteComment
         * @summary Delete Comment
         * @request DELETE:/comments/{id}
         * @secure
         * @response `200` `HandlerMap` OK
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        deleteComment: (id: number, params?: RequestParams) => Promise<HttpResponse<HandlerMap, HandlerMap & {
            msg?: string | undefined;
        }>>;
    };
    conf: {
        /**
         * @description Get System Configs for UI
         *
         * @tags System
         * @name Conf
         * @summary Get System Configs
         * @request GET:/conf
         * @response `200` `CommonConfData` OK
         */
        conf: (params?: RequestParams) => Promise<HttpResponse<CommonConfData, any>>;
    };
    notifies: {
        /**
         * @description Get a list of notifies for user
         *
         * @tags Notify
         * @name GetNotifies
         * @summary Get Notifies
         * @request GET:/notifies
         * @response `200` `HandlerResponseNotifyList` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        getNotifies: (query: {
            /** The user email */
            email: string;
            /** The user name */
            name: string;
        }, params?: RequestParams) => Promise<HttpResponse<HandlerResponseNotifyList, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Mark all notifies as read for user
         *
         * @tags Notify
         * @name MarkAllNotifyRead
         * @summary Mark All Notifies as Read
         * @request POST:/notifies/read
         * @response `200` `HandlerMap` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        markAllNotifyRead: (options: HandlerParamsNotifyReadAll, params?: RequestParams) => Promise<HttpResponse<HandlerMap, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Mark specific notification as read for user
         *
         * @tags Notify
         * @name MarkNotifyRead
         * @summary Mark Notify as Read
         * @request POST:/notifies/{comment_id}/{notify_key}
         * @response `200` `HandlerMap` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        markNotifyRead: (commentId: number, notifyKey: string, params?: RequestParams) => Promise<HttpResponse<HandlerMap, HandlerMap & {
            msg?: string | undefined;
        }>>;
    };
    pages: {
        /**
         * @description Get a list of pages by some conditions
         *
         * @tags Page
         * @name GetPages
         * @summary Get Page List
         * @request GET:/pages
         * @secure
         * @response `200` `HandlerResponsePageList` OK
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         */
        getPages: (query?: {
            /** The limit for pagination */
            limit?: number;
            /** The offset for pagination */
            offset?: number;
            /** The site name of your content scope */
            site_name?: string;
        }, params?: RequestParams) => Promise<HttpResponse<HandlerResponsePageList, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Fetch the data of all pages
         *
         * @tags Page
         * @name FetchAllPages
         * @summary Fetch All Pages Data
         * @request POST:/pages/fetch
         * @secure
         * @response `200` `HandlerMap` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        fetchAllPages: (options: HandlerParamsPageFetchAll, params?: RequestParams) => Promise<HttpResponse<HandlerMap, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Get the status of the task of fetching all pages
         *
         * @tags Page
         * @name GetPageFetchStatus
         * @summary Get Pages Fetch Status
         * @request GET:/pages/fetch/status
         * @secure
         * @response `200` `HandlerResponsePageFetchStatus` OK
         */
        getPageFetchStatus: (params?: RequestParams) => Promise<HttpResponse<HandlerResponsePageFetchStatus, any>>;
        /**
         * @description Increase and get the number of page views
         *
         * @tags Page
         * @name LogPv
         * @summary Increase Page Views (PV)
         * @request POST:/pages/pv
         * @response `200` `HandlerResponsePagePV` OK
         */
        logPv: (page: HandlerParamsPagePV, params?: RequestParams) => Promise<HttpResponse<HandlerResponsePagePV, any>>;
        /**
         * @description Update a specific page
         *
         * @tags Page
         * @name UpdatePage
         * @summary Update Page
         * @request PUT:/pages/{id}
         * @secure
         * @response `200` `HandlerResponsePageUpdate` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        updatePage: (id: number, page: HandlerParamsPageUpdate, params?: RequestParams) => Promise<HttpResponse<HandlerResponsePageUpdate, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Delete a specific page
         *
         * @tags Page
         * @name DeletePage
         * @summary Delete Page
         * @request DELETE:/pages/{id}
         * @secure
         * @response `200` `HandlerMap` OK
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        deletePage: (id: number, params?: RequestParams) => Promise<HttpResponse<HandlerMap, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Fetch the data of a specific page
         *
         * @tags Page
         * @name FetchPage
         * @summary Fetch Page Data
         * @request POST:/pages/{id}/fetch
         * @secure
         * @response `200` `HandlerResponsePageFetch` OK
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        fetchPage: (id: number, params?: RequestParams) => Promise<HttpResponse<HandlerResponsePageFetch, HandlerMap & {
            msg?: string | undefined;
        }>>;
    };
    sendEmail: {
        /**
         * @description Send an email to test the email sender
         *
         * @tags System
         * @name SendEmail
         * @summary Send Email
         * @request POST:/send_email
         * @secure
         * @response `200` `HandlerMap` OK
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `500` `HandlerMap` Internal Server Error
         */
        sendEmail: (email: HandlerParamsEmailSend, params?: RequestParams) => Promise<HttpResponse<HandlerMap, HandlerMap | (HandlerMap & {
            msg?: string | undefined;
        })>>;
    };
    settings: {
        /**
         * @description Get settings from app config file
         *
         * @tags System
         * @name GetSettings
         * @summary Get Settings
         * @request GET:/settings
         * @secure
         * @response `200` `HandlerResponseSettingGet` OK
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        getSettings: (params?: RequestParams) => Promise<HttpResponse<HandlerResponseSettingGet, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Apply settings and restart the server
         *
         * @tags System
         * @name ApplySettings
         * @summary Save and apply Settings
         * @request PUT:/settings
         * @secure
         * @response `200` `HandlerMap` OK
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        applySettings: (settings: HandlerParamsSettingApply, params?: RequestParams) => Promise<HttpResponse<HandlerMap, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Get config templates in different languages for rendering the settings page in the frontend
         *
         * @tags System
         * @name GetSettingsTemplate
         * @summary Get Settings Template
         * @request GET:/settings/template/{locale}
         * @secure
         * @response `200` `HandlerResponseSettingTemplate` OK
         */
        getSettingsTemplate: (locale: string, params?: RequestParams) => Promise<HttpResponse<HandlerResponseSettingTemplate, any>>;
    };
    sites: {
        /**
         * @description Get a list of sites by some conditions
         *
         * @tags Site
         * @name GetSites
         * @summary Get Site List
         * @request GET:/sites
         * @secure
         * @response `200` `HandlerResponseSiteList` OK
         */
        getSites: (params?: RequestParams) => Promise<HttpResponse<HandlerResponseSiteList, any>>;
        /**
         * @description Create a new site
         *
         * @tags Site
         * @name CreateSite
         * @summary Create Site
         * @request POST:/sites
         * @secure
         * @response `200` `HandlerResponseSiteCreate` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        createSite: (site: HandlerParamsSiteCreate, params?: RequestParams) => Promise<HttpResponse<HandlerResponseSiteCreate, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Update a specific site
         *
         * @tags Site
         * @name UpdateSite
         * @summary Update Site
         * @request PUT:/sites/{id}
         * @secure
         * @response `200` `HandlerResponseSiteUpdate` OK
         */
        updateSite: (id: number, site: HandlerParamsSiteUpdate, params?: RequestParams) => Promise<HttpResponse<HandlerResponseSiteUpdate, any>>;
        /**
         * @description Delete a specific site
         *
         * @tags Site
         * @name DeleteSite
         * @summary Site Delete
         * @request DELETE:/sites/{id}
         * @secure
         * @response `200` `HandlerMap` OK
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        deleteSite: (id: number, params?: RequestParams) => Promise<HttpResponse<HandlerMap, HandlerMap & {
            msg?: string | undefined;
        }>>;
    };
    stats: {
        /**
         * @description Get the statistics of various data analysis
         *
         * @tags Statistic
         * @name GetStats
         * @summary Statistic
         * @request GET:/stats/{type}
         * @response `200` `CommonJSONResult` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        getStats: (type: 'latest_comments' | 'latest_pages' | 'pv_most_pages' | 'comment_most_pages' | 'page_pv' | 'site_pv' | 'page_comment' | 'site_comment' | 'rand_comments' | 'rand_pages', query?: {
            /** The limit for pagination */
            limit?: number;
            /** multiple page keys separated by commas */
            page_keys?: string;
            /** The site name of your content scope */
            site_name?: string;
        }, params?: RequestParams) => Promise<HttpResponse<CommonJSONResult, HandlerMap & {
            msg?: string | undefined;
        }>>;
    };
    transfer: {
        /**
         * @description Export data from Artalk
         *
         * @tags Transfer
         * @name ExportArtrans
         * @summary Export Artrans
         * @request GET:/transfer/export
         * @secure
         * @response `200` `HandlerResponseTransferExport` OK
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        exportArtrans: (params?: RequestParams) => Promise<HttpResponse<HandlerResponseTransferExport, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Import data to Artalk
         *
         * @tags Transfer
         * @name ImportArtrans
         * @summary Import Artrans
         * @request POST:/transfer/import
         * @secure
         * @response `200` `string` OK
         */
        importArtrans: (data: HandlerParamsTransferImport, params?: RequestParams) => Promise<HttpResponse<string, any>>;
        /**
         * @description Upload a file to prepare to import
         *
         * @tags Transfer
         * @name UploadArtrans
         * @summary Upload Artrans
         * @request POST:/transfer/upload
         * @secure
         * @response `200` `(HandlerResponseTransferUpload & {
         filename?: string,

         })` OK
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        uploadArtrans: (data: {
            /**
             * Upload file in preparation for import task
             * @format binary
             */
            file: File;
        }, params?: RequestParams) => Promise<HttpResponse<HandlerResponseTransferUpload & {
            filename?: string | undefined;
        }, HandlerMap & {
            msg?: string | undefined;
        }>>;
    };
    upload: {
        /**
         * @description Upload file from this endpoint
         *
         * @tags Upload
         * @name Upload
         * @summary Upload
         * @request POST:/upload
         * @secure
         * @response `200` `HandlerResponseUpload` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        upload: (data: {
            /**
             * Upload file
             * @format binary
             */
            file: File;
        }, params?: RequestParams) => Promise<HttpResponse<HandlerResponseUpload, HandlerMap & {
            msg?: string | undefined;
        }>>;
    };
    user: {
        /**
         * @description Get user info to prepare for login or check current user status
         *
         * @tags Account
         * @name GetUser
         * @summary Get User Info
         * @request GET:/user
         * @secure
         * @response `200` `HandlerResponseUserInfo` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         */
        getUser: (query?: {
            /** The user email */
            email?: string;
            /** The username */
            name?: string;
        }, params?: RequestParams) => Promise<HttpResponse<HandlerResponseUserInfo, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Login user by name or email
         *
         * @tags Account
         * @name Login
         * @summary Get Access Token
         * @request POST:/user/access_token
         * @response `200` `HandlerResponseUserLogin` OK
         * @response `400` `(HandlerMap & {
         " data"?: {
         need_name_select?: (string)[],

         },
         msg?: string,

         })` Multiple users with the same email address are matched
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        login: (user: HandlerParamsUserLogin, params?: RequestParams) => Promise<HttpResponse<HandlerResponseUserLogin, (HandlerMap & {
            ' data'?: {
                need_name_select?: string[] | undefined;
            } | undefined;
            msg?: string | undefined;
        }) | (HandlerMap & {
            msg?: string | undefined;
        })>>;
        /**
         * @description Get user login status by header Authorization
         *
         * @tags Account
         * @name GetUserStatus
         * @summary Get Login Status
         * @request GET:/user/status
         * @secure
         * @response `200` `HandlerResponseUserStatus` OK
         */
        getUserStatus: (query?: {
            /** The user email */
            email?: string;
            /** The username */
            name?: string;
        }, params?: RequestParams) => Promise<HttpResponse<HandlerResponseUserStatus, any>>;
    };
    users: {
        /**
         * @description Create a new user
         *
         * @tags User
         * @name CreateUser
         * @summary Create User
         * @request POST:/users
         * @secure
         * @response `200` `HandlerResponseUserCreate` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        createUser: (user: HandlerParamsUserCreate, params?: RequestParams) => Promise<HttpResponse<HandlerResponseUserCreate, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Update a specific user
         *
         * @tags User
         * @name UpdateUser
         * @summary Update User
         * @request PUT:/users/{id}
         * @secure
         * @response `200` `HandlerResponseUserUpdate` OK
         * @response `400` `(HandlerMap & {
         msg?: string,

         })` Bad Request
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        updateUser: (id: number, user: HandlerParamsUserUpdate, params?: RequestParams) => Promise<HttpResponse<HandlerResponseUserUpdate, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Delete a specific user
         *
         * @tags User
         * @name DeleteUser
         * @summary Delete User
         * @request DELETE:/users/{id}
         * @secure
         * @response `200` `HandlerMap` OK
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        deleteUser: (id: number, params?: RequestParams) => Promise<HttpResponse<HandlerMap, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Get a list of users by some conditions
         *
         * @tags User
         * @name GetUsers
         * @summary Get User List
         * @request GET:/users/{type}
         * @secure
         * @response `200` `HandlerResponseAdminUserList` OK
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         */
        getUsers: (type?: 'all' | 'admin' | 'in_conf', query?: {
            /** The limit for pagination */
            limit?: number;
            /** The offset for pagination */
            offset?: number;
        }, params?: RequestParams) => Promise<HttpResponse<HandlerResponseAdminUserList, HandlerMap & {
            msg?: string | undefined;
        }>>;
    };
    version: {
        /**
         * @description Get the version of Artalk
         *
         * @tags System
         * @name GetVersion
         * @summary Get Version Info
         * @request GET:/version
         * @response `200` `CommonApiVersionData` OK
         */
        getVersion: (params?: RequestParams) => Promise<HttpResponse<CommonApiVersionData, any>>;
    };
    votes: {
        /**
         * @description Sync the number of votes in the `comments` or `pages` data tables to keep them the same as the `votes` table
         *
         * @tags Vote
         * @name SyncVotes
         * @summary Sync Vote Data
         * @request POST:/votes/sync
         * @secure
         * @response `200` `HandlerMap` OK
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         */
        syncVotes: (params?: RequestParams) => Promise<HttpResponse<HandlerMap, HandlerMap & {
            msg?: string | undefined;
        }>>;
        /**
         * @description Vote for a specific comment or page
         *
         * @tags Vote
         * @name Vote
         * @summary Vote
         * @request POST:/votes/{type}/{target_id}
         * @response `200` `HandlerResponseVote` OK
         * @response `403` `(HandlerMap & {
         msg?: string,

         })` Forbidden
         * @response `404` `(HandlerMap & {
         msg?: string,

         })` Not Found
         * @response `500` `(HandlerMap & {
         msg?: string,

         })` Internal Server Error
         */
        vote: (type: 'comment_up' | 'comment_down' | 'page_up' | 'page_down', targetId: number, vote: HandlerParamsVote, params?: RequestParams) => Promise<HttpResponse<HandlerResponseVote, HandlerMap & {
            msg?: string | undefined;
        }>>;
    };
}

declare interface ApiConfig<SecurityDataType = unknown> {
    baseUrl?: string;
    baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
    securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
    customFetch?: typeof fetch;
}

declare interface ApiOptions {
    baseURL: string;
    siteName: string;
    pageKey: string;
    pageTitle: string;
    timeout?: number;
    getApiToken?: () => string | undefined;
    userInfo?: {
        name: string;
        email: string;
    };
    onNeedCheckCaptcha?: (payload: {
        data: {
            imgData?: string;
            iframe?: string;
        };
    }) => Promise<void>;
    onNeedCheckAdmin?: (payload: {}) => Promise<void>;
}

export declare interface ApiVersionData {
    /** API 程序名 */
    app: string;
    /** API 程序版本号 */
    version: string;
    /** API 程序 CommitHash */
    commit_hash: string;
}

/**
 * Artalk
 *
 * @see https://artalk.js.org
 */
declare class Artalk {
    ctx: ContextApi;
    /** Plugins */
    protected plugins: ArtalkPlugin[];
    constructor(conf: Partial<ArtalkConfig>);
    /** Get the config of Artalk */
    getConf(): ArtalkConfig;
    /** Get the root element of Artalk */
    getEl(): HTMLElement;
    /** Update config of Artalk */
    update(conf: Partial<ArtalkConfig>): this;
    /** Reload comment list of Artalk */
    reload(): void;
    /** Destroy instance of Artalk */
    destroy(): void;
    /** Add an event listener */
    on<K extends keyof EventPayloadMap>(name: K, handler: EventHandler<EventPayloadMap[K]>): void;
    /** Remove an event listener */
    off<K extends keyof EventPayloadMap>(name: K, handler: EventHandler<EventPayloadMap[K]>): void;
    /** Trigger an event */
    trigger<K extends keyof EventPayloadMap>(name: K, payload?: EventPayloadMap[K]): void;
    /** Set dark mode */
    setDarkMode(darkMode: boolean): void;
    /** Init Artalk */
    static init(conf: Partial<ArtalkConfig>): Artalk;
    /** Use plugin, the plugin will be used when Artalk.init */
    static use(plugin: ArtalkPlugin): void;
    /** Load count widget */
    static loadCountWidget(c: Partial<ArtalkConfig>): void;
    /** @deprecated Please use `getEl()` instead */
    get $root(): HTMLElement;
    /** @description Please use `getConf()` instead */
    get conf(): ArtalkConfig;
}
export default Artalk;

export declare interface ArtalkConfig {
    /** 装载元素 */
    el: string | HTMLElement;
    /** 页面唯一标识（完整 URL） */
    pageKey: string;
    /** 页面标题 */
    pageTitle: string;
    /** 服务器地址 */
    server: string;
    /** 站点名 */
    site: string;
    /** 评论框占位字符 */
    placeholder: string;
    /** 评论为空时显示字符 */
    noComment: string;
    /** 发送按钮文字 */
    sendBtn: string;
    /** 评论框穿梭（显示在待回复评论后面） */
    editorTravel: boolean;
    /** 表情包 */
    emoticons: object | any[] | string | false;
    /** Gravatar 头像 */
    gravatar: {
        /** API 地址 */
        mirror: string;
        /** API 参数 */
        params: string;
    };
    /** 头像链接生成器 */
    avatarURLBuilder?: (comment: CommentData) => string;
    /** 分页配置 */
    pagination: {
        /** 每次请求获取数量 */
        pageSize: number;
        /** 阅读更多模式 */
        readMore: boolean;
        /** 滚动到底部自动加载 */
        autoLoad: boolean;
    };
    /** 内容限高 */
    heightLimit: {
        /** 评论内容限高 */
        content: number;
        /** 子评论区域限高 */
        children: number;
        /** 滚动限高 */
        scrollable: boolean;
    };
    /** 评论投票按钮 */
    vote: boolean;
    /** 评论投票反对按钮 */
    voteDown: boolean;
    /** 评论预览功能 */
    preview: boolean;
    /** 评论数绑定元素 Selector */
    countEl: string;
    /** PV 数绑定元素 Selector */
    pvEl: string;
    /** 夜间模式 */
    darkMode: boolean | 'auto';
    /** 请求超时（单位：秒） */
    reqTimeout: number;
    /** 平铺模式 */
    flatMode: boolean | 'auto';
    /** 嵌套模式 · 最大层数 */
    nestMax: number;
    /** 嵌套模式 · 排序方式 */
    nestSort: 'DATE_ASC' | 'DATE_DESC';
    /** 显示 UA 徽标 */
    uaBadge: boolean;
    /** 评论列表排序功能 (显示 Dropdown) */
    listSort: boolean;
    /** 图片上传功能 */
    imgUpload: boolean;
    /** 图片上传器 */
    imgUploader?: (file: File) => Promise<string>;
    /** 版本检测 */
    versionCheck: boolean;
    /** 引用后端配置 */
    useBackendConf: boolean;
    /** 语言本地化 */
    locale: I18n | string;
    /** 后端版本 (系统数据，用户不允许更改) */
    apiVersion?: string;
    /** Replacer for marked */
    markedReplacers?: ((raw: string) => string)[];
    /** 列表请求参数修改器 */
    listFetchParamsModifier?: (params: any) => void;
    remoteConfModifier?: (conf: Partial<ArtalkConfig>) => void;
    listUnreadHighlight?: boolean;
    scrollRelativeTo?: () => HTMLElement;
    immediateFetch?: boolean;
    pvAdd?: boolean;
}

export declare type ArtalkPlugin = (ctx: ContextApi) => void;

declare namespace ArtalkType {
    export {
        I18n,
        I18nKeys,
        ArtalkConfig,
        LocalUser,
        CommentData,
        ListData,
        PageData,
        SiteData,
        UserData,
        UserDataForAdmin,
        NotifyData,
        EmoticonGrpData,
        EmoticonListData,
        ApiVersionData,
        ListFetchParams,
        ListLastFetchData,
        DataManagerApi,
        NotifyLevel,
        UserInfoApiResponseData,
        FetchError,
        ContextApi,
        EditorState,
        EditorApi,
        ListErrorData,
        ListFetchedArgs,
        EventPayloadMap,
        ArtalkPlugin,
        SidebarShowPayload
    }
}
export { ArtalkType }

declare type CancelToken = Symbol | string | number;

declare interface Checker<T = any> {
    el?: HTMLElement;
    inputType?: 'password' | 'text';
    body: (checker: CheckerCtx) => HTMLElement;
    request: (checker: CheckerCtx, inputVal: string) => Promise<T>;
    onSuccess?: (checker: CheckerCtx, respData: T, inputVal: string, formEl: HTMLElement) => void;
    onError?: (checker: CheckerCtx, errData: any, inputVal: string, formEl: HTMLElement) => void;
}

declare interface CheckerCaptchaPayload extends CheckerPayload {
    imgData?: string;
    iframe?: string;
}

declare interface CheckerCtx {
    get<K extends keyof CheckerStore>(key: K): CheckerStore[K];
    set<K extends keyof CheckerStore>(key: K, val: CheckerStore[K]): void;
    getOpts(): CheckerLauncherOptions;
    getApi(): Api;
    getUser(): User;
    hideInteractInput(): void;
    triggerSuccess(): void;
    cancel(): void;
}

/**
 * Checker 发射台
 */
declare class CheckerLauncher {
    private opts;
    constructor(opts: CheckerLauncherOptions);
    checkCaptcha: ((payload: CheckerCaptchaPayload) => Promise<void>);
    checkAdmin: ((payload: CheckerPayload) => Promise<void>);
    fire(checker: Checker, payload: CheckerPayload, postFire?: (c: CheckerCtx) => void): void;
}

declare interface CheckerLauncherOptions {
    getCtx: () => ContextApi;
    getApi: () => Api;
    getCaptchaIframeURL: () => string;
    onReload: () => void;
}

declare interface CheckerPayload {
    onSuccess?: () => void;
    onMount?: (dialogEl: HTMLElement) => void;
    onCancel?: () => void;
}

declare interface CheckerStore {
    val?: string;
    img_data?: string;
    iframe?: string;
}

declare class CommentActions {
    private comment;
    private get data();
    private get opts();
    private getApi;
    constructor(comment: CommentNode);
    /** 投票操作 */
    vote(type: 'up' | 'down'): void;
    /** 管理员 - 评论状态修改 */
    adminEdit(type: 'collapsed' | 'pending' | 'pinned', btnElem: ActionBtn): void;
    /** 管理员 - 评论删除 */
    adminDelete(btnElem: ActionBtn): void;
    /** 快速跳转到该评论 */
    goToReplyComment(): void;
}

export declare interface CommentData {
    /** 评论 ID */
    id: number;
    /** 评论正文 */
    content: string;
    /** 用户昵称 */
    nick: string;
    /** 用户邮箱 (该字段仅管理员可见) */
    email?: string;
    /** 用户邮箱（已加密） */
    email_encrypted: string;
    /** 用户链接 */
    link: string;
    /** 回复目标评论 ID */
    rid: number;
    /** User Agent */
    ua: string;
    /** 评论日期 */
    date: string;
    /** 是否折叠 */
    is_collapsed: boolean;
    /** 是否待审 */
    is_pending: boolean;
    /** 是否置顶 */
    is_pinned: boolean;
    /** 徽章文字 */
    badge_name?: string;
    /** 徽章颜色 */
    badge_color?: string;
    /** IP 属地 */
    ip_region?: string;
    /** 是否允许回复 */
    is_allow_reply: boolean;
    /** 评论页面 key */
    page_key: string;
    /** 评论页面 url */
    page_url?: string;
    /** 是否可见 */
    visible: boolean;
    /** 站点名（用于隔离） */
    site_name: string;
    /** 赞同数 */
    vote_up: number;
    /** 反对数 */
    vote_down: number;
}

declare class CommentNode {
    $el?: HTMLElement;
    private renderInstance;
    private actionInstance;
    private data;
    private opts;
    private parent;
    private children;
    private nestCurt;
    constructor(data: CommentData, opts: CommentOptions);
    /** 渲染 UI */
    render(): void;
    /** 获取评论操作实例对象 */
    getActions(): CommentActions;
    /** 获取评论渲染器实例对象 */
    getRender(): Render;
    /** 获取评论数据 */
    getData(): CommentData;
    /** 设置数据 */
    setData(data: CommentData): void;
    /** 获取父评论 */
    getParent(): CommentNode | null;
    /** 获取所有子评论 */
    getChildren(): CommentNode[];
    /** 获取当前嵌套层数 */
    getNestCurt(): number;
    /** 判断是否为根评论 */
    getIsRoot(): boolean;
    /** 获取评论 ID */
    getID(): number;
    /** 置入子评论 */
    putChild(childNode: CommentNode, insertMode?: 'append' | 'prepend'): void;
    /** 获取存放子评论的元素对象 */
    getChildrenWrapEl(): HTMLElement;
    /** 获取所有父评论 */
    getParents(): CommentNode[];
    /**
     * Get the element of the comment
     *
     * The `getEl()` will always return the latest $el after calling `render()`.
     * Please be aware of the memory leak if you use the $el reference directly.
     */
    getEl(): HTMLElement;
    /**
     * Focus on the comment
     *
     * Scroll to the comment and perform flash animation
     */
    focus(): void;
    scrollIntoView(): void;
    /**
     * Remove the comment node
     */
    remove(): void;
    /** 获取 Gravatar 头像 URL */
    getGravatarURL(): string;
    /** 获取评论 markdown 解析后的内容 */
    getContentMarked(): string;
    /** 获取格式化后的日期 */
    getDateFormatted(): any;
    /** 获取用户 UserAgent 信息 */
    getUserUA(): {
        browser: string;
        os: string;
    };
    /** 获取配置 */
    getOpts(): CommentOptions;
}

declare type CommentNode_2 = {
    id: number;
    comment: CommentData;
    children: CommentNode_2[];
    parent?: CommentNode_2;
    level: number;
};

declare interface CommentOptions {
    onAfterRender?: () => void;
    onDelete?: Function;
    /** The comment being replied to (linked comment) */
    replyTo?: CommentData;
    flatMode: boolean;
    vote: boolean;
    voteDown: boolean;
    uaBadge: boolean;
    nestMax: number;
    gravatar: ArtalkConfig['gravatar'];
    heightLimit: ArtalkConfig['heightLimit'];
    avatarURLBuilder: ArtalkConfig['avatarURLBuilder'];
    scrollRelativeTo: ArtalkConfig['scrollRelativeTo'];
    getApi: () => Api;
    replyComment: ContextApi['replyComment'];
    editComment: ContextApi['editComment'];
}

declare interface CommonApiVersionData {
    app: string;
    commit_hash: string;
    version: string;
}

declare interface CommonConfData {
    frontend_conf: CommonMap;
    version: CommonApiVersionData;
}

declare interface CommonJSONResult {
    /** Data */
    data: any;
    /** Message */
    msg: string;
}

declare type CommonMap = Record<string, any>;

declare abstract class Component {
    ctx: ContextApi;
    $el: HTMLElement;
    get conf(): ArtalkConfig;
    constructor(ctx: ContextApi);
    getEl(): HTMLElement;
}

declare enum ContentType {
    Json = "application/json",
    FormData = "multipart/form-data",
    UrlEncoded = "application/x-www-form-urlencoded",
    Text = "text/plain"
}

/**
 * Artalk Context
 */
export declare interface ContextApi extends EventManagerFuncs<EventPayloadMap> {
    /** Artalk 根元素对象 */
    $root: HTMLElement;
    /** 依赖注入函数 */
    inject<K extends keyof TInjectedServices>(depName: K, obj: TInjectedServices[K]): void;
    /** 获取依赖对象 */
    get<K extends keyof TInjectedServices>(depName: K): TInjectedServices[K];
    /** 配置对象 */
    conf: ArtalkConfig;
    /** marked 依赖对象 */
    getMarked(): TMarked | undefined;
    /** 获取 API 以供 HTTP 请求 */
    getApi(): Api;
    /** 获取数据管理器对象 */
    getData(): DataManagerApi;
    /** 评论回复 */
    replyComment(commentData: CommentData, $comment: HTMLElement): void;
    /** 编辑评论 */
    editComment(commentData: CommentData, $comment: HTMLElement): void;
    /** 获取评论数据 */
    fetch(params: Partial<ListFetchParams>): void;
    /** 重载评论数据 */
    reload(): void;
    /** 列表滚动到第一个评论的位置 */
    listGotoFirst(): void;
    /** Get the comment data list */
    getComments(): CommentData[];
    /** Get the comment node list */
    getCommentNodes(): CommentNode[];
    /**
     * Get the comment data list
     * @deprecated Use `getComments()` instead
     */
    getCommentDataList(): CommentData[];
    /**
     * Get the comment node list
     * @deprecated Use `getCommentNodes()` instead
     */
    getCommentList(): CommentNode[];
    /** 显示侧边栏 */
    showSidebar(payload?: SidebarShowPayload): void;
    /** 隐藏侧边栏 */
    hideSidebar(): void;
    /** 编辑器 - 显示加载 */
    editorShowLoading(): void;
    /** 编辑器 - 隐藏加载 */
    editorHideLoading(): void;
    /** 编辑器 - 显示提示消息 */
    editorShowNotify(msg: string, type: NotifyLevel): void;
    /** 评论框 - 复原状态 */
    editorResetState(): void;
    /** 验证码检测 */
    checkCaptcha(payload: CheckerCaptchaPayload): Promise<void>;
    /** 管理员检测 */
    checkAdmin(payload: CheckerPayload): Promise<void>;
    /** i18n 翻译 */
    $t(key: keyof I18n, args?: {
        [key: string]: string;
    }): string;
    /** 设置夜间模式 */
    setDarkMode(darkMode: boolean | 'auto'): void;
    /** 获取配置 */
    getConf(): ArtalkConfig;
    /** 获取挂载元素 */
    getEl(): HTMLElement;
    /** 更新配置 */
    updateConf(conf: Partial<ArtalkConfig>): void;
    /** 监听配置更新 */
    watchConf<T extends (keyof ArtalkConfig)[]>(keys: T, effect: (val: Pick<ArtalkConfig, T[number]>) => void): void;
}

export declare interface DataManagerApi {
    getLoading(): boolean;
    setLoading(val: boolean): void;
    getListLastFetch(): ListLastFetchData | undefined;
    setListLastFetch(val: ListLastFetchData): void;
    getComments(): CommentData[];
    findComment(id: number): CommentData | undefined;
    fetchComments(params: Partial<ListFetchParams>): void;
    loadComments(comments: CommentData[]): void;
    clearComments(): void;
    insertComment(comment: CommentData): void;
    updateComment(comment: CommentData): void;
    deleteComment(id: number): void;
    getNotifies(): NotifyData[];
    updateNotifies(notifies: NotifyData[]): void;
    getPage(): PageData | undefined;
    updatePage(pageData: PageData): void;
}

declare class Editor extends Component implements EditorApi {
    private ui;
    private state;
    getUI(): EditorUI;
    getPlugs(): PlugManager | undefined;
    getState(): EditorState;
    constructor(ctx: ContextApi);
    getHeaderInputEls(): {
        nick: HTMLInputElement;
        email: HTMLInputElement;
        link: HTMLInputElement;
    };
    getContentFinal(): string;
    getContentRaw(): string;
    getContentMarked(): string;
    setContent(val: string): void;
    insertContent(val: string): void;
    focus(): void;
    reset(): void;
    resetState(): void;
    setReply(comment: CommentData, $comment: HTMLElement): void;
    setEditComment(comment: CommentData, $comment: HTMLElement): void;
    showNotify(msg: string, type: any): void;
    showLoading(): void;
    hideLoading(): void;
    submit(): void;
}

export declare interface EditorApi extends Component {
    getUI(): EditorUI;
    /**
     * Get the header input elements
     */
    getHeaderInputEls(): Record<string, HTMLInputElement>;
    /**
     * Set content
     */
    setContent(val: string): void;
    /**
     * Insert content
     */
    insertContent(val: string): void;
    /**
     * Get the final content
     *
     * This function returns the raw content or the content transformed through a plugin hook.
     */
    getContentFinal(): string;
    /**
     * Get the raw content which is inputed by user
     */
    getContentRaw(): string;
    /**
     * Get the HTML format content which is rendered by marked (a markdown parser)
     */
    getContentMarked(): string;
    /**
     * Get editor current state
     */
    getState(): EditorState;
    /**
     * Focus editor
     */
    focus(): void;
    /**
     * Reset editor
     */
    reset(): void;
    /**
     * Reset editor UI
     *
     * call it will move editor to the initial position
     */
    resetState(): void;
    /**
     * Submit comment
     */
    submit(): void;
    /**
     * Show notification message
     */
    showNotify(msg: string, type: NotifyLevel): void;
    /**
     * Show loading on editor
     */
    showLoading(): void;
    /**
     * Hide loading on editor
     */
    hideLoading(): void;
    /**
     * Start replying a comment
     */
    setReply(commentData: CommentData, $comment: HTMLElement, scroll?: boolean): void;
    /**
     * Start editing a comment
     */
    setEditComment(commentData: CommentData, $comment: HTMLElement): void;
}

declare interface EditorEventPayloadMap {
    'mounted': undefined;
    'unmounted': undefined;
    'header-input': {
        field: string;
        $input: HTMLInputElement;
    };
    'header-change': {
        field: string;
        $input: HTMLInputElement;
    };
    'content-updated': string;
    'panel-show': EditorPlug;
    'panel-hide': EditorPlug;
    'panel-close': undefined;
    'editor-close': undefined;
    'editor-open': undefined;
}

/**
 * Editor 插件
 */
declare interface EditorPlug {
    $btn?: HTMLElement;
    $panel?: HTMLElement;
    contentTransformer?(rawContent: string): string;
    editorStateEffectWhen?: EditorState;
    editorStateEffect?(comment: CommentData): () => void;
}

declare class EditorPlug {
    protected kit: PlugKit;
    constructor(kit: PlugKit);
    /** Use plug btn will add a btn on the bottom of editor */
    useBtn(html?: string): HTMLElement;
    /** Use plug panel will show the panel when btn is clicked */
    usePanel(html?: string): HTMLElement;
    /** Use the content transformer to handle the content of the last submit by the editor */
    useContentTransformer(func: (raw: string) => string): void;
    /** Listen the event of panel show */
    usePanelShow(func: () => void): void;
    /** Listen the event of panel hide */
    usePanelHide(func: () => void): void;
    /** Use editor state modifier */
    useEditorStateEffect(stateName: EditorState, effectFn: (comment: CommentData) => () => void): void;
}

export declare type EditorState = 'reply' | 'edit' | 'normal';

declare interface EditorUI extends Record<keyof typeof Sel, HTMLElement> {
    $el: HTMLElement;
    $nick: HTMLInputElement;
    $email: HTMLInputElement;
    $link: HTMLInputElement;
    $textarea: HTMLTextAreaElement;
    $submitBtn: HTMLButtonElement;
    $sendReplyBtn?: HTMLElement;
    $editCancelBtn?: HTMLElement;
}

export declare type EmoticonGrpData = {
    name: string;
    type: 'emoticon' | 'image' | 'emoji';
    items: {
        key: string;
        val: string;
    }[];
};

export declare type EmoticonListData = EmoticonGrpData[];

declare const en: {
    placeholder: string;
    noComment: string;
    send: string;
    save: string;
    nick: string;
    email: string;
    link: string;
    emoticon: string;
    preview: string;
    uploadImage: string;
    uploadFail: string;
    commentFail: string;
    restoredMsg: string;
    onlyAdminCanReply: string;
    uploadLoginMsg: string;
    counter: string;
    sortLatest: string;
    sortOldest: string;
    sortBest: string;
    sortAuthor: string;
    openComment: string;
    closeComment: string;
    listLoadFailMsg: string;
    listRetry: string;
    loadMore: string;
    admin: string;
    reply: string;
    voteUp: string;
    voteDown: string;
    voteFail: string;
    readMore: string;
    actionConfirm: string;
    collapse: string;
    collapsed: string;
    collapsedMsg: string;
    expand: string;
    approved: string;
    pending: string;
    pendingMsg: string;
    edit: string;
    editCancel: string;
    delete: string;
    deleteConfirm: string;
    pin: string;
    unpin: string;
    seconds: string;
    minutes: string;
    hours: string;
    days: string;
    now: string;
    adminCheck: string;
    captchaCheck: string;
    confirm: string;
    cancel: string;
    msgCenter: string;
    ctrlCenter: string;
    frontend: string;
    backend: string;
    loading: string;
    loadFail: string;
    editing: string;
    editFail: string;
    deleting: string;
    deleteFail: string;
    reqGot: string;
    reqAborted: string;
    updateMsg: string;
    currentVersion: string;
    ignore: string;
    open: string;
    openName: string;
};

declare interface EntityCookedComment {
    badge_color: string;
    badge_name: string;
    content: string;
    content_marked: string;
    date: string;
    email_encrypted: string;
    id: number;
    ip_region: string;
    is_allow_reply: boolean;
    is_collapsed: boolean;
    is_pending: boolean;
    is_pinned: boolean;
    link: string;
    nick: string;
    page_key: string;
    page_url: string;
    rid: number;
    site_name: string;
    ua: string;
    user_id: number;
    visible: boolean;
    vote_down: number;
    vote_up: number;
}

declare interface EntityCookedNotify {
    comment_id: number;
    id: number;
    is_emailed: boolean;
    is_read: boolean;
    read_link: string;
    user_id: number;
}

declare interface EntityCookedPage {
    admin_only: boolean;
    id: number;
    key: string;
    pv: number;
    site_name: string;
    title: string;
    url: string;
    vote_down: number;
    vote_up: number;
}

declare interface EntityCookedSite {
    first_url: string;
    id: number;
    name: string;
    urls: string[];
    urls_raw: string;
}

declare interface EntityCookedUser {
    badge_color: string;
    badge_name: string;
    email: string;
    id: number;
    is_admin: boolean;
    link: string;
    name: string;
    receive_email: boolean;
}

declare interface EntityCookedUserForAdmin {
    badge_color: string;
    badge_name: string;
    comment_count: number;
    email: string;
    id: number;
    is_admin: boolean;
    is_in_conf: boolean;
    last_ip: string;
    last_ua: string;
    link: string;
    name: string;
    receive_email: boolean;
}

declare type EventHandler<T> = (payload: T) => void;

declare class EventManager<PayloadMap> implements EventManagerFuncs<PayloadMap> {
    private events;
    /**
     * Add an event listener for a specific event name
     */
    on<K extends keyof PayloadMap>(name: K, handler: EventHandler<PayloadMap[K]>, opts?: EventOptions): void;
    /**
     * Remove an event listener for a specific event name and handler
     */
    off<K extends keyof PayloadMap>(name: K, handler: EventHandler<PayloadMap[K]>): void;
    /**
     * Trigger an event with an optional payload
     */
    trigger<K extends keyof PayloadMap>(name: K, payload?: PayloadMap[K]): void;
}

declare interface EventManagerFuncs<PayloadMap> {
    on<K extends keyof PayloadMap>(name: K, handler: EventHandler<PayloadMap[K]>, opts?: EventOptions): void;
    off<K extends keyof PayloadMap>(name: K, handler: EventHandler<PayloadMap[K]>): void;
    trigger<K extends keyof PayloadMap>(name: K, payload?: PayloadMap[K]): void;
}

declare interface EventOptions {
    once?: boolean;
}

/** EventName to EventPayload Type */
export declare interface EventPayloadMap {
    'created': undefined;
    'mounted': undefined;
    'updated': ArtalkConfig;
    'unmounted': undefined;
    'conf-fetch': undefined;
    'list-fetch': Partial<ListFetchParams>;
    'list-fetched': ListFetchedArgs;
    'list-load': CommentData[];
    'list-loaded': CommentData[];
    'list-failed': ListErrorData;
    'list-goto-first': undefined;
    'list-reach-bottom': undefined;
    'comment-inserted': CommentData;
    'comment-updated': CommentData;
    'comment-deleted': CommentData;
    'comment-rendered': CommentNode;
    'notifies-updated': NotifyData[];
    'list-goto': number;
    'page-loaded': PageData;
    'editor-submit': undefined;
    'editor-submitted': undefined;
    'user-changed': LocalUser;
    'sidebar-show': undefined;
    'sidebar-hide': undefined;
}

export declare interface FetchError extends Error {
    code: number;
    message: string;
    data?: any;
}

declare interface FullRequestParams extends Omit<RequestInit, 'body'> {
    /** set parameter to `true` for call `securityWorker` for this request */
    secure?: boolean;
    /** request path */
    path: string;
    /** content type of request body */
    type?: ContentType;
    /** query params */
    query?: QueryParamsType;
    /** format of response (i.e. response.json() -> format: "json") */
    format?: ResponseFormat;
    /** request body */
    body?: unknown;
    /** base url */
    baseUrl?: string;
    /** request cancellation token */
    cancelToken?: CancelToken;
}

declare type HandlerMap = Record<string, any>;

declare interface HandlerParamsCaptchaVerify {
    /** The captcha value to check */
    value: string;
}

declare interface HandlerParamsCommentCreate {
    /** The comment content */
    content: string;
    /** The comment email */
    email: string;
    /** The comment link */
    link?: string;
    /** The comment name */
    name: string;
    /** The comment page_key */
    page_key: string;
    /** The comment page_title */
    page_title?: string;
    /** The comment rid */
    rid?: number;
    /** The site name of your content scope */
    site_name: string;
    /** The comment ua */
    ua?: string;
}

declare interface HandlerParamsCommentUpdate {
    /** The comment content */
    content: string;
    /** The comment email */
    email?: string;
    /** The comment ip */
    ip?: string;
    /** The comment is_collapsed */
    is_collapsed: boolean;
    /** The comment is_pending */
    is_pending: boolean;
    /** The comment is_pinned */
    is_pinned: boolean;
    /** The comment link */
    link?: string;
    /** The comment nick */
    nick?: string;
    /** The comment page_key */
    page_key: string;
    /** The comment rid */
    rid: number;
    /** The site name of your content scope */
    site_name: string;
    /** The comment ua */
    ua: string;
}

declare interface HandlerParamsEmailSend {
    /** The body of email */
    body: string;
    /** The subject of email */
    subject: string;
    /** The email address of the receiver */
    to_addr: string;
}

declare interface HandlerParamsNotifyReadAll {
    /** The user email */
    email: string;
    /** The username */
    name: string;
}

declare interface HandlerParamsPageFetchAll {
    /** If not empty, only fetch pages of this site */
    site_name?: string;
}

declare interface HandlerParamsPagePV {
    /** The page key */
    page_key: string;
    /** The page title */
    page_title?: string;
    /** The site name of your content scope */
    site_name?: string;
}

declare interface HandlerParamsPageUpdate {
    /** Updated page admin_only option */
    admin_only: boolean;
    /** Updated page key */
    key: string;
    /** The site name of your content scope */
    site_name: string;
    /** Updated page title */
    title: string;
}

declare interface HandlerParamsSettingApply {
    /** The content of the config file in YAML format */
    yaml: string;
}

declare interface HandlerParamsSiteCreate {
    /** The site name */
    name: string;
    /** The site urls */
    urls: string[];
}

declare interface HandlerParamsSiteUpdate {
    /** Updated site name */
    name: string;
    /** Updated site urls */
    urls: string[];
}

declare interface HandlerParamsTransferImport {
    /** Automatically answer yes for all questions. */
    assumeyes?: boolean;
    /** The JSON data */
    json_data?: string;
    /** The JSON file path */
    json_file?: string;
    /** The target site name */
    target_site_name?: string;
    /** The target site url */
    target_site_url?: string;
    /** Enable URL resolver */
    url_resolver?: boolean;
}

declare interface HandlerParamsUserCreate {
    /** The user badge color (hex format) */
    badge_color?: string;
    /** The user badge name */
    badge_name?: string;
    /** The user email */
    email: string;
    /** The user is an admin */
    is_admin: boolean;
    /** The user link */
    link?: string;
    /** The user name */
    name: string;
    /** The user password */
    password?: string;
    /** The user receive email */
    receive_email: boolean;
}

declare interface HandlerParamsUserLogin {
    /** The user email */
    email: string;
    /** The username */
    name?: string;
    /** The user password */
    password: string;
}

declare interface HandlerParamsUserUpdate {
    /** The user badge color (hex format) */
    badge_color?: string;
    /** The user badge name */
    badge_name?: string;
    /** The user email */
    email: string;
    /** The user is an admin */
    is_admin: boolean;
    /** The user link */
    link?: string;
    /** The user name */
    name: string;
    /** The user password */
    password?: string;
    /** The user receive email */
    receive_email: boolean;
}

declare interface HandlerParamsVote {
    /** The user email */
    email?: string;
    /** The username */
    name?: string;
}

declare interface HandlerResponseAdminUserList {
    count: number;
    users: EntityCookedUserForAdmin[];
}

declare interface HandlerResponseCaptchaGet {
    img_data: string;
}

declare interface HandlerResponseCaptchaStatus {
    is_pass: boolean;
}

declare interface HandlerResponseCommentCreate {
    badge_color: string;
    badge_name: string;
    content: string;
    content_marked: string;
    date: string;
    email_encrypted: string;
    id: number;
    ip_region: string;
    is_allow_reply: boolean;
    is_collapsed: boolean;
    is_pending: boolean;
    is_pinned: boolean;
    link: string;
    nick: string;
    page_key: string;
    page_url: string;
    rid: number;
    site_name: string;
    ua: string;
    user_id: number;
    visible: boolean;
    vote_down: number;
    vote_up: number;
}

declare interface HandlerResponseCommentGet {
    /** The comment detail */
    comment: EntityCookedComment;
    /** The reply comment if exists (like reply) */
    reply_comment: EntityCookedComment;
}

declare interface HandlerResponseCommentList {
    comments: EntityCookedComment[];
    count: number;
    page: EntityCookedPage;
    roots_count: number;
}

declare interface HandlerResponseCommentUpdate {
    badge_color: string;
    badge_name: string;
    content: string;
    content_marked: string;
    date: string;
    email_encrypted: string;
    id: number;
    ip_region: string;
    is_allow_reply: boolean;
    is_collapsed: boolean;
    is_pending: boolean;
    is_pinned: boolean;
    link: string;
    nick: string;
    page_key: string;
    page_url: string;
    rid: number;
    site_name: string;
    ua: string;
    user_id: number;
    visible: boolean;
    vote_down: number;
    vote_up: number;
}

declare interface HandlerResponseNotifyList {
    count: number;
    notifies: EntityCookedNotify[];
}

declare interface HandlerResponsePageFetch {
    admin_only: boolean;
    id: number;
    key: string;
    pv: number;
    site_name: string;
    title: string;
    url: string;
    vote_down: number;
    vote_up: number;
}

declare interface HandlerResponsePageFetchStatus {
    /** The number of pages that have been fetched */
    done: number;
    /** If the task is in progress */
    is_progress: boolean;
    /** The message of the task status */
    msg: string;
    /** The total number of pages */
    total: number;
}

declare interface HandlerResponsePageList {
    count: number;
    pages: EntityCookedPage[];
}

declare interface HandlerResponsePagePV {
    pv: number;
}

declare interface HandlerResponsePageUpdate {
    admin_only: boolean;
    id: number;
    key: string;
    pv: number;
    site_name: string;
    title: string;
    url: string;
    vote_down: number;
    vote_up: number;
}

declare interface HandlerResponseSettingGet {
    yaml: string;
}

declare interface HandlerResponseSettingTemplate {
    yaml: string;
}

declare interface HandlerResponseSiteCreate {
    first_url: string;
    id: number;
    name: string;
    urls: string[];
    urls_raw: string;
}

declare interface HandlerResponseSiteList {
    count: number;
    sites: EntityCookedSite[];
}

declare interface HandlerResponseSiteUpdate {
    first_url: string;
    id: number;
    name: string;
    urls: string[];
    urls_raw: string;
}

declare interface HandlerResponseTransferExport {
    /** The exported data which is a JSON string */
    artrans: string;
}

declare interface HandlerResponseTransferUpload {
    /** The uploaded file name which can be used to import */
    filename: string;
}

declare interface HandlerResponseUpload {
    file_name: string;
    file_type: string;
    public_url: string;
}

declare interface HandlerResponseUserCreate {
    badge_color: string;
    badge_name: string;
    comment_count: number;
    email: string;
    id: number;
    is_admin: boolean;
    is_in_conf: boolean;
    last_ip: string;
    last_ua: string;
    link: string;
    name: string;
    receive_email: boolean;
}

declare interface HandlerResponseUserInfo {
    is_login: boolean;
    notifies: EntityCookedNotify[];
    notifies_count: number;
    user: EntityCookedUser;
}

declare interface HandlerResponseUserLogin {
    token: string;
    user: EntityCookedUser;
}

declare interface HandlerResponseUserStatus {
    is_admin: boolean;
    is_login: boolean;
}

declare interface HandlerResponseUserUpdate {
    badge_color: string;
    badge_name: string;
    comment_count: number;
    email: string;
    id: number;
    is_admin: boolean;
    is_in_conf: boolean;
    last_ip: string;
    last_ua: string;
    link: string;
    name: string;
    receive_email: boolean;
}

declare interface HandlerResponseVote {
    down: number;
    up: number;
}

declare class HttpClient<SecurityDataType = unknown> {
    baseUrl: string;
    private securityData;
    private securityWorker?;
    private abortControllers;
    private customFetch;
    private baseApiParams;
    constructor(apiConfig?: ApiConfig<SecurityDataType>);
    setSecurityData: (data: SecurityDataType | null) => void;
    protected encodeQueryParam(key: string, value: any): string;
    protected addQueryParam(query: QueryParamsType, key: string): string;
    protected addArrayQueryParam(query: QueryParamsType, key: string): any;
    protected toQueryString(rawQuery?: QueryParamsType): string;
    protected addQueryParams(rawQuery?: QueryParamsType): string;
    private contentFormatters;
    protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams;
    protected createAbortSignal: (cancelToken: CancelToken) => AbortSignal | undefined;
    abortRequest: (cancelToken: CancelToken) => void;
    request: <T = any, E = any>({ body, secure, path, type, query, format, baseUrl, cancelToken, ...params }: FullRequestParams) => Promise<HttpResponse<T, E>>;
}

declare interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
    data: D;
    error: E;
}

export declare type I18n = typeof en;

export declare type I18nKeys = keyof I18n;

export declare const init: typeof Artalk.init;

declare class Layer {
    private $el;
    private opts;
    private allowMaskClose;
    private onAfterHide?;
    constructor($el: HTMLElement, opts: LayerOptions);
    setOnAfterHide(func: () => void): void;
    setAllowMaskClose(allow: boolean): void;
    getAllowMaskClose(): boolean;
    getEl(): HTMLElement;
    show(): void;
    hide(): Promise<void>;
    destroy(): Promise<void>;
}

declare class LayerManager {
    private wrap;
    constructor(ctx: ContextApi);
    getEl(): HTMLElement;
    create(name: string, el?: HTMLElement): Layer;
}

declare interface LayerOptions {
    onShow: () => void;
    onHide: () => void;
}

declare interface LayoutOptions {
    /** The comments wrap of list */
    $commentsWrap: HTMLElement;
    nestSortBy: ListNest.SortByType;
    nestMax: number;
    flatMode: boolean;
    createCommentNode(comment: CommentData, replyComment?: CommentData): CommentNode;
    findCommentNode(id: number): CommentNode | undefined;
}

declare class List extends Component {
    /** 列表评论集区域元素 */
    $commentsWrap: HTMLElement;
    getCommentsWrapEl(): HTMLElement;
    protected commentNodes: CommentNode[];
    getCommentNodes(): CommentNode[];
    constructor(ctx: ContextApi);
    getListLayout({ forceFlatMode }?: {
        forceFlatMode?: boolean;
    }): ListLayout;
    private initCrudEvents;
}

export declare interface ListData {
    /** 评论数据 */
    comments: CommentData[];
    /** 根评论总数 */
    roots_count: number;
    /** 评论总数（包括所有子评论） */
    count: number;
    /** 页面信息 */
    page: PageData;
}

export declare interface ListErrorData {
    msg: string;
    data?: any;
}

export declare interface ListFetchedArgs {
    params: Partial<ListFetchParams>;
    data?: ListData;
    error?: ListErrorData;
}

export declare interface ListFetchParams {
    offset: number;
    limit: number;
    flatMode: boolean;
    paramsModifier?: (p: any) => void;
    onSuccess?: (data: ListData) => void;
    onError?: (err: any) => void;
}

export declare interface ListLastFetchData {
    params: ListFetchParams;
    data?: ListData;
}

declare class ListLayout {
    private options;
    constructor(options: LayoutOptions);
    private getStrategy;
    import(comments: CommentData[]): void;
    insert(comment: CommentData, replyComment?: CommentData): void;
}

declare namespace ListNest {
    export {
        makeNestCommentNodeList,
        CommentNode_2 as CommentNode,
        SortByType
    }
}

export declare const loadCountWidget: typeof Artalk.loadCountWidget;

/**
 * 本地持久化用户数据
 * @note 始终保持一层结构，不支持多层结构
 */
export declare interface LocalUser {
    /** 昵称 */
    nick: string;
    /** 邮箱 */
    email: string;
    /** 链接 */
    link: string;
    /** TOKEN */
    token: string;
    /** 是否为管理员 */
    isAdmin: boolean;
}

declare function makeNestCommentNodeList(srcData: CommentData[], sortBy?: SortByType, nestMax?: number): CommentNode_2[];

export declare interface NotifyData {
    /** 通知 ID */
    id: number;
    /** 用户 ID */
    user_id: number;
    /** 评论 ID */
    comment_id: number;
    /** 是否已读 */
    is_read: boolean;
    /** 是否已发送邮件通知 */
    is_emailed: boolean;
    /** 标为已读地址 */
    read_link: string;
}

export declare type NotifyLevel = "i" | "s" | "w" | "e";

export declare interface PageData {
    /** 页面 ID */
    id: number;
    /** 页面唯一标识符 */
    key: string;
    /** 页面标题 */
    title: string;
    /** 页面 url */
    url: string;
    /** 仅管理员可评 */
    admin_only: boolean;
    /** 站点名（用于隔离） */
    site_name: string;
    /** 赞同数 */
    vote_up: number;
    /** 反对数 */
    vote_down: number;
}

/**
 * PlugKit provides a set of methods to help you develop editor plug
 */
declare class PlugKit {
    private plugs;
    constructor(plugs: PlugManager);
    /** Use the editor */
    useEditor(): EditorApi;
    /**
     * Use the context of global
     *
     * @deprecated The calls to this function should be reduced as much as possible
     */
    useGlobalCtx(): ContextApi;
    /** Use the config of Artalk */
    useConf(): ArtalkConfig;
    /** Use the http api client */
    useApi(): Api;
    /** Use the user manager */
    useUser(): User;
    /** Use the ui of editor */
    useUI(): EditorUI;
    /** Use the events in editor scope */
    useEvents(): EventManager<EditorEventPayloadMap>;
    /** Listen the event when plug is mounted */
    useMounted(func: () => void): void;
    /** Listen the event when plug is unmounted */
    useUnmounted(func: () => void): void;
    /** Use the deps of other plug */
    useDeps<T extends typeof EditorPlug>(plug: T): InstanceType<T> | undefined;
}

declare class PlugManager {
    editor: EditorApi;
    private plugs;
    private openedPlug;
    private events;
    getPlugs(): EditorPlug[];
    getEvents(): EventManager<EditorEventPayloadMap>;
    private clear;
    constructor(editor: EditorApi);
    private loadPluginUI;
    /** Load the plug btn and plug panel on editor ui */
    private loadPluginItem;
    get<T extends typeof EditorPlug>(plug: T): InstanceType<T> | undefined;
    /** Open the editor plug panel */
    openPlugPanel(plug: EditorPlug): void;
    /** Close the editor plug panel */
    closePlugPanel(): void;
    /** Get the content which is transformed by plugs */
    getTransformedContent(rawContent: string): string;
}

declare type QueryParamsType = Record<string | number, any>;

declare class Render {
    comment: CommentNode;
    get data(): CommentData;
    get opts(): CommentOptions;
    $el: HTMLElement;
    $main: HTMLElement;
    $header: HTMLElement;
    $headerNick: HTMLElement;
    $headerBadgeWrap: HTMLElement;
    $body: HTMLElement;
    $content: HTMLElement;
    $childrenWrap: HTMLElement | null;
    $actions: HTMLElement;
    voteBtnUp?: ActionBtn;
    voteBtnDown?: ActionBtn;
    $replyTo?: HTMLElement;
    $replyAt?: HTMLElement;
    constructor(comment: CommentNode);
    /**
     * Render the comment ui
     *
     * If comment data is updated, call this method to re-render the comment ui.
     * The method will be called multiple times, so it should be idempotent.
     *
     * Renders may add event listeners to the comment ui, so it should be called only once or override the original.
     * Please be aware of the memory leak caused by the event listener.
     */
    render(): HTMLElement;
    /** 内容限高检测 */
    checkHeightLimit(): void;
    /** 子评论区域移除限高 */
    heightLimitRemoveForChildren(): void;
    /** 渐出动画 */
    playFadeAnim(): void;
    /** 渐出动画 · 评论内容区域 */
    playFadeAnimForBody(): void;
    /** Perform the flash animation */
    playFlashAnim(): void;
    /** 获取子评论 Wrap */
    getChildrenWrap(): HTMLElement;
    /** 设置已读 */
    setUnread(val: boolean): void;
    /** 设置为可点击的评论 */
    setOpenable(val: boolean): void;
    /** 设置点击评论打开置顶 URL */
    setOpenURL(url: string): void;
    /** 设置点击评论时的操作 */
    setOpenAction(action: () => void): void;
}

declare type RequestParams = Omit<FullRequestParams, 'body' | 'method' | 'query' | 'path'>;

declare type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

declare const Sel: {
    $header: string;
    $nick: string;
    $email: string;
    $link: string;
    $textareaWrap: string;
    $textarea: string;
    $bottom: string;
    $submitBtn: string;
    $notifyWrap: string;
    $bottomLeft: string;
    $stateWrap: string;
    $plugBtnWrap: string;
    $plugPanelWrap: string;
};

/**
 * Services
 *
 * @description Call these services by `ctx.get('serviceName')` or `ctx.serviceName`
 */
declare const services: {
    i18n(ctx: ContextApi): void;
    user(ctx: ContextApi): User;
    layerManager(ctx: ContextApi): LayerManager;
    checkerLauncher(ctx: ContextApi): CheckerLauncher;
    editor(ctx: ContextApi): Editor;
    list(ctx: ContextApi): List;
    sidebarLayer(ctx: ContextApi): SidebarLayer;
    editorPlugs(): PlugManager | undefined;
};

declare class SidebarLayer extends Component {
    layer?: Layer;
    $header: HTMLElement;
    $closeBtn: HTMLElement;
    $iframeWrap: HTMLElement;
    $iframe?: HTMLIFrameElement;
    constructor(ctx: ContextApi);
    /** Refresh iFrame on show */
    private refreshOnShow;
    /** Animation timer */
    private animTimer?;
    /** 显示 */
    show(conf?: SidebarShowPayload): Promise<void>;
    /** 隐藏 */
    hide(): void;
    private authCheck;
    private initLayer;
    private createIframe;
    private iframeLoad;
}

export declare interface SidebarShowPayload {
    view?: 'comments' | 'sites' | 'pages' | 'transfer';
}

export declare interface SiteData {
    /** 站点 ID */
    id: number;
    /** 站点名 */
    name: string;
    /** 站点 URLs */
    urls: string[];
    /** 站点 URLs（原始字符串） */
    urls_raw: string;
    /** 站点主 URL */
    first_url: string;
}

declare type SortByType = 'DATE_DESC' | 'DATE_ASC' | 'SRC_INDEX' | 'VOTE_UP_DESC';

declare type TInjectedServices = {
    [K in keyof TServiceInjectors]: ReturnType<TServiceInjectors[K]>;
};

declare type TKeysOnlyReturn<T extends TObjectWithFuncs, V> = {
    [K in keyof T]: ReturnType<T[K]> extends V ? K : never;
}[keyof T];

declare type TMarked = typeof marked;

declare type TObjectWithFuncs = {
    [k: string]: (...args: any) => any;
};

declare type TOmitConditions = TKeysOnlyReturn<TServiceImps, void>;

declare type TServiceImps = typeof services;

declare type TServiceInjectors = Omit<TServiceImps, TOmitConditions>;

export declare const use: typeof Artalk.use;

declare class User {
    private opts;
    private data;
    constructor(opts: UserOpts);
    getData(): LocalUser;
    /** Update user data and save to localStorage */
    update(obj?: Partial<LocalUser>): void;
    /**
     * Logout
     *
     * @description Logout will clear login status, but not clear user data (nick, email, link)
     */
    logout(): void;
    /** Check if user has filled basic data */
    checkHasBasicUserInfo(): boolean;
}

export declare interface UserData {
    /** 用户 ID */
    id: number;
    /** 用户名 */
    name: string;
    /** 邮箱 */
    email: string;
    /** 链接 */
    link: string;
    /** 徽章名称 */
    badge_name: string;
    /** 徽章颜色 */
    badge_color: string;
    /** 是否属于管理员 */
    is_admin: boolean;
    /** 是否允许接收邮件通知 */
    receive_email: boolean;
}

export declare interface UserDataForAdmin extends UserData {
    /** 最后一次操作 IP */
    last_ip: string;
    /** 最后一次操作 UA */
    last_ua: string;
    /** 是否存在于配置文件中 */
    is_in_conf: boolean;
    /** 评论数 */
    comment_count: number;
}

export declare interface UserInfoApiResponseData {
    user?: UserData;
    is_login: boolean;
    notifies: NotifyData[];
    notifies_count: number;
}

declare interface UserOpts {
    onUserChanged?: (user: LocalUser) => void;
}

export { }
