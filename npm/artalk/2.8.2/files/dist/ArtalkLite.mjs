var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};
import { marked as marked$1 } from "marked";
class HttpClient {
  constructor(apiConfig = {}) {
    __publicField(this, "baseUrl", "/api/v2");
    __publicField(this, "securityData", null);
    __publicField(this, "securityWorker");
    __publicField(this, "abortControllers", /* @__PURE__ */ new Map());
    __publicField(this, "customFetch", (...fetchParams) => fetch(...fetchParams));
    __publicField(this, "baseApiParams", {
      credentials: "same-origin",
      headers: {},
      redirect: "follow",
      referrerPolicy: "no-referrer"
    });
    __publicField(this, "setSecurityData", (data) => {
      this.securityData = data;
    });
    __publicField(this, "contentFormatters", {
      [
        "application/json"
        /* Json */
      ]: (input) => input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
      [
        "text/plain"
        /* Text */
      ]: (input) => input !== null && typeof input !== "string" ? JSON.stringify(input) : input,
      [
        "multipart/form-data"
        /* FormData */
      ]: (input) => Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob ? property : typeof property === "object" && property !== null ? JSON.stringify(property) : `${property}`
        );
        return formData;
      }, new FormData()),
      [
        "application/x-www-form-urlencoded"
        /* UrlEncoded */
      ]: (input) => this.toQueryString(input)
    });
    __publicField(this, "createAbortSignal", (cancelToken) => {
      if (this.abortControllers.has(cancelToken)) {
        const abortController2 = this.abortControllers.get(cancelToken);
        if (abortController2) {
          return abortController2.signal;
        }
        return void 0;
      }
      const abortController = new AbortController();
      this.abortControllers.set(cancelToken, abortController);
      return abortController.signal;
    });
    __publicField(this, "abortRequest", (cancelToken) => {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        abortController.abort();
        this.abortControllers.delete(cancelToken);
      }
    });
    __publicField(this, "request", (_a) => __async(this, null, function* () {
      var _b = _a, {
        body,
        secure,
        path,
        type,
        query,
        format,
        baseUrl,
        cancelToken
      } = _b, params = __objRest(_b, [
        "body",
        "secure",
        "path",
        "type",
        "query",
        "format",
        "baseUrl",
        "cancelToken"
      ]);
      const secureParams = (typeof secure === "boolean" ? secure : this.baseApiParams.secure) && this.securityWorker && (yield this.securityWorker(this.securityData)) || {};
      const requestParams = this.mergeRequestParams(params, secureParams);
      const queryString = query && this.toQueryString(query);
      const payloadFormatter = this.contentFormatters[
        type || "application/json"
        /* Json */
      ];
      const responseFormat = format || requestParams.format;
      return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, __spreadProps(__spreadValues({}, requestParams), {
        headers: __spreadValues(__spreadValues({}, requestParams.headers || {}), type && type !== "multipart/form-data" ? { "Content-Type": type } : {}),
        signal: (cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal) || null,
        body: typeof body === "undefined" || body === null ? null : payloadFormatter(body)
      })).then((response) => __async(this, null, function* () {
        const r = response;
        r.data = null;
        r.error = null;
        const data = !responseFormat ? r : yield response[responseFormat]().then((data2) => {
          if (r.ok) {
            r.data = data2;
          } else {
            r.error = data2;
          }
          return r;
        }).catch((e) => {
          r.error = e;
          return r;
        });
        if (cancelToken) {
          this.abortControllers.delete(cancelToken);
        }
        if (!response.ok)
          throw data;
        return data;
      }));
    }));
    Object.assign(this, apiConfig);
  }
  encodeQueryParam(key, value) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }
  addQueryParam(query, key) {
    return this.encodeQueryParam(key, query[key]);
  }
  addArrayQueryParam(query, key) {
    const value = query[key];
    return value.map((v) => this.encodeQueryParam(key, v)).join("&");
  }
  toQueryString(rawQuery) {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys.map((key) => Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)).join("&");
  }
  addQueryParams(rawQuery) {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }
  mergeRequestParams(params1, params2) {
    return __spreadProps(__spreadValues(__spreadValues(__spreadValues({}, this.baseApiParams), params1), params2 || {}), {
      headers: __spreadValues(__spreadValues(__spreadValues({}, this.baseApiParams.headers || {}), params1.headers || {}), params2 && params2.headers || {})
    });
  }
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
let Api$1 = class Api extends HttpClient {
  constructor() {
    super(...arguments);
    __publicField(this, "cache", {
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
      flushCache: (params = {}) => this.request(__spreadValues({
        path: `/cache/flush`,
        method: "POST",
        secure: true,
        format: "json"
      }, params)),
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
      warmUpCache: (params = {}) => this.request(__spreadValues({
        path: `/cache/warm_up`,
        method: "POST",
        secure: true,
        format: "json"
      }, params))
    });
    __publicField(this, "captcha", {
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
      getCaptcha: (params = {}) => this.request(__spreadValues({
        path: `/captcha`,
        method: "GET",
        format: "json"
      }, params)),
      /**
       * @description Get the status of the user's captcha verification
       *
       * @tags Captcha
       * @name GetCaptchaStatus
       * @summary Get Captcha Status
       * @request GET:/captcha/status
       * @response `200` `HandlerResponseCaptchaStatus` OK
       */
      getCaptchaStatus: (params = {}) => this.request(__spreadValues({
        path: `/captcha/status`,
        method: "GET",
        format: "json"
      }, params)),
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
      verifyCaptcha: (data, params = {}) => this.request(__spreadValues({
        path: `/captcha/verify`,
        method: "POST",
        body: data,
        type: "application/json",
        format: "json"
      }, params))
    });
    __publicField(this, "comments", {
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
      getComments: (query, params = {}) => this.request(__spreadValues({
        path: `/comments`,
        method: "GET",
        query,
        secure: true,
        type: "application/json",
        format: "json"
      }, params)),
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
      createComment: (comment, params = {}) => this.request(__spreadValues({
        path: `/comments`,
        method: "POST",
        body: comment,
        secure: true,
        type: "application/json",
        format: "json"
      }, params)),
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
      getComment: (id, params = {}) => this.request(__spreadValues({
        path: `/comments/${id}`,
        method: "GET",
        type: "application/json",
        format: "json"
      }, params)),
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
      updateComment: (id, comment, params = {}) => this.request(__spreadValues({
        path: `/comments/${id}`,
        method: "PUT",
        body: comment,
        secure: true,
        type: "application/json",
        format: "json"
      }, params)),
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
      deleteComment: (id, params = {}) => this.request(__spreadValues({
        path: `/comments/${id}`,
        method: "DELETE",
        secure: true,
        format: "json"
      }, params))
    });
    __publicField(this, "conf", {
      /**
       * @description Get System Configs for UI
       *
       * @tags System
       * @name Conf
       * @summary Get System Configs
       * @request GET:/conf
       * @response `200` `CommonConfData` OK
       */
      conf: (params = {}) => this.request(__spreadValues({
        path: `/conf`,
        method: "GET",
        format: "json"
      }, params))
    });
    __publicField(this, "notifies", {
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
      getNotifies: (query, params = {}) => this.request(__spreadValues({
        path: `/notifies`,
        method: "GET",
        query,
        type: "application/json",
        format: "json"
      }, params)),
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
      markAllNotifyRead: (options, params = {}) => this.request(__spreadValues({
        path: `/notifies/read`,
        method: "POST",
        body: options,
        type: "application/json",
        format: "json"
      }, params)),
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
      markNotifyRead: (commentId, notifyKey, params = {}) => this.request(__spreadValues({
        path: `/notifies/${commentId}/${notifyKey}`,
        method: "POST",
        format: "json"
      }, params))
    });
    __publicField(this, "pages", {
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
      getPages: (query, params = {}) => this.request(__spreadValues({
        path: `/pages`,
        method: "GET",
        query,
        secure: true,
        type: "application/json",
        format: "json"
      }, params)),
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
      fetchAllPages: (options, params = {}) => this.request(__spreadValues({
        path: `/pages/fetch`,
        method: "POST",
        body: options,
        secure: true,
        type: "application/json",
        format: "json"
      }, params)),
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
      getPageFetchStatus: (params = {}) => this.request(__spreadValues({
        path: `/pages/fetch/status`,
        method: "GET",
        secure: true,
        format: "json"
      }, params)),
      /**
       * @description Increase and get the number of page views
       *
       * @tags Page
       * @name LogPv
       * @summary Increase Page Views (PV)
       * @request POST:/pages/pv
       * @response `200` `HandlerResponsePagePV` OK
       */
      logPv: (page, params = {}) => this.request(__spreadValues({
        path: `/pages/pv`,
        method: "POST",
        body: page,
        type: "application/json",
        format: "json"
      }, params)),
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
      updatePage: (id, page, params = {}) => this.request(__spreadValues({
        path: `/pages/${id}`,
        method: "PUT",
        body: page,
        secure: true,
        type: "application/json",
        format: "json"
      }, params)),
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
      deletePage: (id, params = {}) => this.request(__spreadValues({
        path: `/pages/${id}`,
        method: "DELETE",
        secure: true,
        format: "json"
      }, params)),
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
      fetchPage: (id, params = {}) => this.request(__spreadValues({
        path: `/pages/${id}/fetch`,
        method: "POST",
        secure: true,
        type: "application/json",
        format: "json"
      }, params))
    });
    __publicField(this, "sendEmail", {
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
      sendEmail: (email, params = {}) => this.request(__spreadValues({
        path: `/send_email`,
        method: "POST",
        body: email,
        secure: true,
        type: "application/json",
        format: "json"
      }, params))
    });
    __publicField(this, "settings", {
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
      getSettings: (params = {}) => this.request(__spreadValues({
        path: `/settings`,
        method: "GET",
        secure: true,
        format: "json"
      }, params)),
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
      applySettings: (settings, params = {}) => this.request(__spreadValues({
        path: `/settings`,
        method: "PUT",
        body: settings,
        secure: true,
        type: "application/json",
        format: "json"
      }, params)),
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
      getSettingsTemplate: (locale, params = {}) => this.request(__spreadValues({
        path: `/settings/template/${locale}`,
        method: "GET",
        secure: true,
        format: "json"
      }, params))
    });
    __publicField(this, "sites", {
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
      getSites: (params = {}) => this.request(__spreadValues({
        path: `/sites`,
        method: "GET",
        secure: true,
        format: "json"
      }, params)),
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
      createSite: (site, params = {}) => this.request(__spreadValues({
        path: `/sites`,
        method: "POST",
        body: site,
        secure: true,
        type: "application/json",
        format: "json"
      }, params)),
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
      updateSite: (id, site, params = {}) => this.request(__spreadValues({
        path: `/sites/${id}`,
        method: "PUT",
        body: site,
        secure: true,
        type: "application/json",
        format: "json"
      }, params)),
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
      deleteSite: (id, params = {}) => this.request(__spreadValues({
        path: `/sites/${id}`,
        method: "DELETE",
        secure: true,
        format: "json"
      }, params))
    });
    __publicField(this, "stats", {
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
      getStats: (type, query, params = {}) => this.request(__spreadValues({
        path: `/stats/${type}`,
        method: "GET",
        query,
        type: "application/json",
        format: "json"
      }, params))
    });
    __publicField(this, "transfer", {
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
      exportArtrans: (params = {}) => this.request(__spreadValues({
        path: `/transfer/export`,
        method: "GET",
        secure: true,
        format: "json"
      }, params)),
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
      importArtrans: (data, params = {}) => this.request(__spreadValues({
        path: `/transfer/import`,
        method: "POST",
        body: data,
        secure: true,
        type: "application/json"
      }, params)),
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
      uploadArtrans: (data, params = {}) => this.request(__spreadValues({
        path: `/transfer/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: "multipart/form-data",
        format: "json"
      }, params))
    });
    __publicField(this, "upload", {
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
      upload: (data, params = {}) => this.request(__spreadValues({
        path: `/upload`,
        method: "POST",
        body: data,
        secure: true,
        type: "multipart/form-data",
        format: "json"
      }, params))
    });
    __publicField(this, "user", {
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
      getUser: (query, params = {}) => this.request(__spreadValues({
        path: `/user`,
        method: "GET",
        query,
        secure: true,
        format: "json"
      }, params)),
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
      login: (user, params = {}) => this.request(__spreadValues({
        path: `/user/access_token`,
        method: "POST",
        body: user,
        type: "application/json",
        format: "json"
      }, params)),
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
      getUserStatus: (query, params = {}) => this.request(__spreadValues({
        path: `/user/status`,
        method: "GET",
        query,
        secure: true,
        format: "json"
      }, params))
    });
    __publicField(this, "users", {
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
      createUser: (user, params = {}) => this.request(__spreadValues({
        path: `/users`,
        method: "POST",
        body: user,
        secure: true,
        type: "application/json",
        format: "json"
      }, params)),
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
      updateUser: (id, user, params = {}) => this.request(__spreadValues({
        path: `/users/${id}`,
        method: "PUT",
        body: user,
        secure: true,
        type: "application/json",
        format: "json"
      }, params)),
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
      deleteUser: (id, params = {}) => this.request(__spreadValues({
        path: `/users/${id}`,
        method: "DELETE",
        secure: true,
        format: "json"
      }, params)),
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
      getUsers: (type, query, params = {}) => this.request(__spreadValues({
        path: `/users/${type}`,
        method: "GET",
        query,
        secure: true,
        type: "application/json",
        format: "json"
      }, params))
    });
    __publicField(this, "version", {
      /**
       * @description Get the version of Artalk
       *
       * @tags System
       * @name GetVersion
       * @summary Get Version Info
       * @request GET:/version
       * @response `200` `CommonApiVersionData` OK
       */
      getVersion: (params = {}) => this.request(__spreadValues({
        path: `/version`,
        method: "GET",
        format: "json"
      }, params))
    });
    __publicField(this, "votes", {
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
      syncVotes: (params = {}) => this.request(__spreadValues({
        path: `/votes/sync`,
        method: "POST",
        secure: true,
        format: "json"
      }, params)),
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
      vote: (type, targetId, vote, params = {}) => this.request(__spreadValues({
        path: `/votes/${type}/${targetId}`,
        method: "POST",
        body: vote,
        type: "application/json",
        format: "json"
      }, params))
    });
  }
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
(function(factory) {
  factory();
})(function() {
  function _classCallCheck(instance2, Constructor) {
    if (!(instance2 instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor)
        descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps)
      _defineProperties(Constructor.prototype, protoProps);
    if (staticProps)
      _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _inherits(subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function");
    }
    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        writable: true,
        configurable: true
      }
    });
    Object.defineProperty(subClass, "prototype", {
      writable: false
    });
    if (superClass)
      _setPrototypeOf(subClass, superClass);
  }
  function _getPrototypeOf(o) {
    _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf2(o2) {
      return o2.__proto__ || Object.getPrototypeOf(o2);
    };
    return _getPrototypeOf(o);
  }
  function _setPrototypeOf(o, p) {
    _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf2(o2, p2) {
      o2.__proto__ = p2;
      return o2;
    };
    return _setPrototypeOf(o, p);
  }
  function _isNativeReflectConstruct() {
    if (typeof Reflect === "undefined" || !Reflect.construct)
      return false;
    if (Reflect.construct.sham)
      return false;
    if (typeof Proxy === "function")
      return true;
    try {
      Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function() {
      }));
      return true;
    } catch (e) {
      return false;
    }
  }
  function _assertThisInitialized(self2) {
    if (self2 === void 0) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }
    return self2;
  }
  function _possibleConstructorReturn(self2, call) {
    if (call && (typeof call === "object" || typeof call === "function")) {
      return call;
    } else if (call !== void 0) {
      throw new TypeError("Derived constructors may only return object or undefined");
    }
    return _assertThisInitialized(self2);
  }
  function _createSuper(Derived) {
    var hasNativeReflectConstruct = _isNativeReflectConstruct();
    return function _createSuperInternal() {
      var Super = _getPrototypeOf(Derived), result;
      if (hasNativeReflectConstruct) {
        var NewTarget = _getPrototypeOf(this).constructor;
        result = Reflect.construct(Super, arguments, NewTarget);
      } else {
        result = Super.apply(this, arguments);
      }
      return _possibleConstructorReturn(this, result);
    };
  }
  function _superPropBase(object, property) {
    while (!Object.prototype.hasOwnProperty.call(object, property)) {
      object = _getPrototypeOf(object);
      if (object === null)
        break;
    }
    return object;
  }
  function _get() {
    if (typeof Reflect !== "undefined" && Reflect.get) {
      _get = Reflect.get.bind();
    } else {
      _get = function _get2(target, property, receiver) {
        var base = _superPropBase(target, property);
        if (!base)
          return;
        var desc = Object.getOwnPropertyDescriptor(base, property);
        if (desc.get) {
          return desc.get.call(arguments.length < 3 ? target : receiver);
        }
        return desc.value;
      };
    }
    return _get.apply(this, arguments);
  }
  var Emitter = /* @__PURE__ */ function() {
    function Emitter2() {
      _classCallCheck(this, Emitter2);
      Object.defineProperty(this, "listeners", {
        value: {},
        writable: true,
        configurable: true
      });
    }
    _createClass(Emitter2, [{
      key: "addEventListener",
      value: function addEventListener(type, callback, options) {
        if (!(type in this.listeners)) {
          this.listeners[type] = [];
        }
        this.listeners[type].push({
          callback,
          options
        });
      }
    }, {
      key: "removeEventListener",
      value: function removeEventListener(type, callback) {
        if (!(type in this.listeners)) {
          return;
        }
        var stack = this.listeners[type];
        for (var i = 0, l = stack.length; i < l; i++) {
          if (stack[i].callback === callback) {
            stack.splice(i, 1);
            return;
          }
        }
      }
    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        if (!(event.type in this.listeners)) {
          return;
        }
        var stack = this.listeners[event.type];
        var stackToCall = stack.slice();
        for (var i = 0, l = stackToCall.length; i < l; i++) {
          var listener = stackToCall[i];
          try {
            listener.callback.call(this, event);
          } catch (e) {
            Promise.resolve().then(function() {
              throw e;
            });
          }
          if (listener.options && listener.options.once) {
            this.removeEventListener(event.type, listener.callback);
          }
        }
        return !event.defaultPrevented;
      }
    }]);
    return Emitter2;
  }();
  var AbortSignal = /* @__PURE__ */ function(_Emitter) {
    _inherits(AbortSignal2, _Emitter);
    var _super = _createSuper(AbortSignal2);
    function AbortSignal2() {
      var _this;
      _classCallCheck(this, AbortSignal2);
      _this = _super.call(this);
      if (!_this.listeners) {
        Emitter.call(_assertThisInitialized(_this));
      }
      Object.defineProperty(_assertThisInitialized(_this), "aborted", {
        value: false,
        writable: true,
        configurable: true
      });
      Object.defineProperty(_assertThisInitialized(_this), "onabort", {
        value: null,
        writable: true,
        configurable: true
      });
      Object.defineProperty(_assertThisInitialized(_this), "reason", {
        value: void 0,
        writable: true,
        configurable: true
      });
      return _this;
    }
    _createClass(AbortSignal2, [{
      key: "toString",
      value: function toString() {
        return "[object AbortSignal]";
      }
    }, {
      key: "dispatchEvent",
      value: function dispatchEvent(event) {
        if (event.type === "abort") {
          this.aborted = true;
          if (typeof this.onabort === "function") {
            this.onabort.call(this, event);
          }
        }
        _get(_getPrototypeOf(AbortSignal2.prototype), "dispatchEvent", this).call(this, event);
      }
    }]);
    return AbortSignal2;
  }(Emitter);
  var AbortController2 = /* @__PURE__ */ function() {
    function AbortController3() {
      _classCallCheck(this, AbortController3);
      Object.defineProperty(this, "signal", {
        value: new AbortSignal(),
        writable: true,
        configurable: true
      });
    }
    _createClass(AbortController3, [{
      key: "abort",
      value: function abort(reason) {
        var event;
        try {
          event = new Event("abort");
        } catch (e) {
          if (typeof document !== "undefined") {
            if (!document.createEvent) {
              event = document.createEventObject();
              event.type = "abort";
            } else {
              event = document.createEvent("Event");
              event.initEvent("abort", false, false);
            }
          } else {
            event = {
              type: "abort",
              bubbles: false,
              cancelable: false
            };
          }
        }
        var signalReason = reason;
        if (signalReason === void 0) {
          if (typeof document === "undefined") {
            signalReason = new Error("This operation was aborted");
            signalReason.name = "AbortError";
          } else {
            try {
              signalReason = new DOMException("signal is aborted without reason");
            } catch (err) {
              signalReason = new Error("This operation was aborted");
              signalReason.name = "AbortError";
            }
          }
        }
        this.signal.reason = signalReason;
        this.signal.dispatchEvent(event);
      }
    }, {
      key: "toString",
      value: function toString() {
        return "[object AbortController]";
      }
    }]);
    return AbortController3;
  }();
  if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
    AbortController2.prototype[Symbol.toStringTag] = "AbortController";
    AbortSignal.prototype[Symbol.toStringTag] = "AbortSignal";
  }
  function polyfillNeeded(self2) {
    if (self2.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL) {
      console.log("__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL=true is set, will force install polyfill");
      return true;
    }
    return typeof self2.Request === "function" && !self2.Request.prototype.hasOwnProperty("signal") || !self2.AbortController;
  }
  function abortableFetchDecorator(patchTargets) {
    if ("function" === typeof patchTargets) {
      patchTargets = {
        fetch: patchTargets
      };
    }
    var _patchTargets = patchTargets, fetch2 = _patchTargets.fetch, _patchTargets$Request = _patchTargets.Request, NativeRequest = _patchTargets$Request === void 0 ? fetch2.Request : _patchTargets$Request, NativeAbortController = _patchTargets.AbortController, _patchTargets$__FORCE = _patchTargets.__FORCE_INSTALL_ABORTCONTROLLER_POLYFILL, __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL = _patchTargets$__FORCE === void 0 ? false : _patchTargets$__FORCE;
    if (!polyfillNeeded({
      fetch: fetch2,
      Request: NativeRequest,
      AbortController: NativeAbortController,
      __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL
    })) {
      return {
        fetch: fetch2,
        Request
      };
    }
    var Request = NativeRequest;
    if (Request && !Request.prototype.hasOwnProperty("signal") || __FORCE_INSTALL_ABORTCONTROLLER_POLYFILL) {
      Request = function Request2(input, init2) {
        var signal;
        if (init2 && init2.signal) {
          signal = init2.signal;
          delete init2.signal;
        }
        var request = new NativeRequest(input, init2);
        if (signal) {
          Object.defineProperty(request, "signal", {
            writable: false,
            enumerable: false,
            configurable: true,
            value: signal
          });
        }
        return request;
      };
      Request.prototype = NativeRequest.prototype;
    }
    var realFetch = fetch2;
    var abortableFetch = function abortableFetch2(input, init2) {
      var signal = Request && Request.prototype.isPrototypeOf(input) ? input.signal : init2 ? init2.signal : void 0;
      if (signal) {
        var abortError;
        try {
          abortError = new DOMException("Aborted", "AbortError");
        } catch (err) {
          abortError = new Error("Aborted");
          abortError.name = "AbortError";
        }
        if (signal.aborted) {
          return Promise.reject(abortError);
        }
        var cancellation = new Promise(function(_, reject) {
          signal.addEventListener("abort", function() {
            return reject(abortError);
          }, {
            once: true
          });
        });
        if (init2 && init2.signal) {
          delete init2.signal;
        }
        return Promise.race([cancellation, realFetch(input, init2)]);
      }
      return realFetch(input, init2);
    };
    return {
      fetch: abortableFetch,
      Request
    };
  }
  (function(self2) {
    if (!polyfillNeeded(self2)) {
      return;
    }
    if (!self2.fetch) {
      console.warn("fetch() is not available, cannot install abortcontroller-polyfill");
      return;
    }
    var _abortableFetch = abortableFetchDecorator(self2), fetch2 = _abortableFetch.fetch, Request = _abortableFetch.Request;
    self2.fetch = fetch2;
    self2.Request = Request;
    Object.defineProperty(self2, "AbortController", {
      writable: true,
      enumerable: false,
      configurable: true,
      value: AbortController2
    });
    Object.defineProperty(self2, "AbortSignal", {
      writable: true,
      enumerable: false,
      configurable: true,
      value: AbortSignal
    });
  })(typeof self !== "undefined" ? self : commonjsGlobal);
});
const Fetch$1 = (opts, input, init2) => __async(void 0, null, function* () {
  const apiToken = opts.getApiToken && opts.getApiToken();
  const headers = new Headers(__spreadValues({
    "Authorization": apiToken ? `Bearer ${apiToken}` : ""
  }, init2 == null ? void 0 : init2.headers));
  if (!headers.get("Authorization"))
    headers.delete("Authorization");
  const resp = yield fetch(input, __spreadProps(__spreadValues({}, init2), {
    headers
  }));
  if (!resp.ok) {
    const json = (yield resp.json().catch(() => {
    })) || {};
    if (json.need_captcha) {
      opts.onNeedCheckCaptcha && (yield opts.onNeedCheckCaptcha({
        data: { imgData: json.img_data, iframe: json.iframe }
      }));
      return Fetch$1(opts, input, init2);
    }
    if (json.need_login) {
      opts.onNeedCheckAdmin && (yield opts.onNeedCheckAdmin({}));
      return Fetch$1(opts, input, init2);
    }
    throw createError(resp.status, json);
  }
  return resp;
});
class FetchException extends Error {
  constructor() {
    super(...arguments);
    __publicField(this, "code", 0);
    __publicField(this, "message", "fetch error");
    __publicField(this, "data");
  }
}
function createError(code, data) {
  const err = new FetchException();
  err.message = data.msg || data.message || "fetch error";
  err.code = code;
  err.data = data;
  console.error(err);
  return err;
}
class Api2 extends Api$1 {
  constructor(opts) {
    super({
      baseUrl: opts.baseURL,
      customFetch: (input, init2) => Fetch$1(opts, input, init2)
    });
    __publicField(this, "_opts");
    this._opts = opts;
  }
  /**
   * Get user info as params for request
   *
   * @returns Request params with user info
   */
  getUserFields() {
    const user = this._opts.userInfo;
    if (!(user == null ? void 0 : user.name) || !(user == null ? void 0 : user.email))
      return void 0;
    return { name: user.name, email: user.email };
  }
}
var escapes = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
var unescapes = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'"
};
var rescaped = /(&amp;|&lt;|&gt;|&quot;|&#39;)/g;
var runescaped = /[&<>"']/g;
function escapeHtmlChar(match) {
  return escapes[match];
}
function unescapeHtmlChar(match) {
  return unescapes[match];
}
function escapeHtml(text) {
  return text == null ? "" : String(text).replace(runescaped, escapeHtmlChar);
}
function unescapeHtml(html) {
  return html == null ? "" : String(html).replace(rescaped, unescapeHtmlChar);
}
escapeHtml.options = unescapeHtml.options = {};
var she = {
  encode: escapeHtml,
  escape: escapeHtml,
  decode: unescapeHtml,
  unescape: unescapeHtml,
  version: "1.0.0-browser"
};
function assignment(result) {
  var stack = Array.prototype.slice.call(arguments, 1);
  var item;
  var key;
  while (stack.length) {
    item = stack.shift();
    for (key in item) {
      if (item.hasOwnProperty(key)) {
        if (Object.prototype.toString.call(result[key]) === "[object Object]") {
          result[key] = assignment(result[key], item[key]);
        } else {
          result[key] = item[key];
        }
      }
    }
  }
  return result;
}
var assignment_1 = assignment;
var lowercase$2 = function lowercase(string) {
  return typeof string === "string" ? string.toLowerCase() : string;
};
function toMap$2(list) {
  return list.reduce(asKey, {});
}
function asKey(accumulator, item) {
  accumulator[item] = true;
  return accumulator;
}
var toMap_1 = toMap$2;
var toMap$1 = toMap_1;
var uris = ["background", "base", "cite", "href", "longdesc", "src", "usemap"];
var attributes$1 = {
  uris: toMap$1(uris)
  // attributes that have an href and hence need to be sanitized
};
var toMap = toMap_1;
var voids = ["area", "br", "col", "hr", "img", "wbr", "input", "base", "basefont", "link", "meta"];
var elements$2 = {
  voids: toMap(voids)
};
var he$1 = she;
var lowercase$1 = lowercase$2;
var elements$1 = elements$2;
var rstart = /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/;
var rend = /^<\s*\/\s*([\w:-]+)[^>]*>/;
var rattrs = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g;
var rtag = /^</;
var rtagend = /^<\s*\//;
function createStack() {
  var stack = [];
  stack.lastItem = function lastItem() {
    return stack[stack.length - 1];
  };
  return stack;
}
function parser$1(html, handler) {
  var stack = createStack();
  var last = html;
  var chars;
  while (html) {
    parsePart();
  }
  parseEndTag();
  function parsePart() {
    chars = true;
    parseTag();
    var same = html === last;
    last = html;
    if (same) {
      html = "";
    }
  }
  function parseTag() {
    if (html.substr(0, 4) === "<!--") {
      parseComment();
    } else if (rtagend.test(html)) {
      parseEdge(rend, parseEndTag);
    } else if (rtag.test(html)) {
      parseEdge(rstart, parseStartTag);
    }
    parseTagDecode();
  }
  function parseEdge(regex, parser2) {
    var match = html.match(regex);
    if (match) {
      html = html.substring(match[0].length);
      match[0].replace(regex, parser2);
      chars = false;
    }
  }
  function parseComment() {
    var index = html.indexOf("-->");
    if (index >= 0) {
      if (handler.comment) {
        handler.comment(html.substring(4, index));
      }
      html = html.substring(index + 3);
      chars = false;
    }
  }
  function parseTagDecode() {
    if (!chars) {
      return;
    }
    var text;
    var index = html.indexOf("<");
    if (index >= 0) {
      text = html.substring(0, index);
      html = html.substring(index);
    } else {
      text = html;
      html = "";
    }
    if (handler.chars) {
      handler.chars(text);
    }
  }
  function parseStartTag(tag, tagName, rest, unary) {
    var attrs = {};
    var low = lowercase$1(tagName);
    var u = elements$1.voids[low] || !!unary;
    rest.replace(rattrs, attrReplacer);
    if (!u) {
      stack.push(low);
    }
    if (handler.start) {
      handler.start(low, attrs, u);
    }
    function attrReplacer(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
      if (doubleQuotedValue === void 0 && singleQuotedValue === void 0 && unquotedValue === void 0) {
        attrs[name] = void 0;
      } else {
        attrs[name] = he$1.decode(doubleQuotedValue || singleQuotedValue || unquotedValue || "");
      }
    }
  }
  function parseEndTag(tag, tagName) {
    var i;
    var pos = 0;
    var low = lowercase$1(tagName);
    if (low) {
      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos] === low) {
          break;
        }
      }
    }
    if (pos >= 0) {
      for (i = stack.length - 1; i >= pos; i--) {
        if (handler.end) {
          handler.end(stack[i]);
        }
      }
      stack.length = pos;
    }
  }
}
var parser_1 = parser$1;
var he = she;
var lowercase2 = lowercase$2;
var attributes = attributes$1;
var elements = elements$2;
function sanitizer$1(buffer, options) {
  var context;
  var o = options || {};
  reset();
  return {
    start,
    end,
    chars
  };
  function out(value) {
    buffer.push(value);
  }
  function start(tag, attrs, unary) {
    var low = lowercase2(tag);
    if (context.ignoring) {
      ignore(low);
      return;
    }
    if ((o.allowedTags || []).indexOf(low) === -1) {
      ignore(low);
      return;
    }
    if (o.filter && !o.filter({ tag: low, attrs })) {
      ignore(low);
      return;
    }
    out("<");
    out(low);
    Object.keys(attrs).forEach(parse);
    out(unary ? "/>" : ">");
    function parse(key) {
      var value = attrs[key];
      var classesOk = (o.allowedClasses || {})[low] || [];
      var attrsOk = (o.allowedAttributes || {})[low] || [];
      var valid;
      var lkey = lowercase2(key);
      if (lkey === "class" && attrsOk.indexOf(lkey) === -1) {
        value = value.split(" ").filter(isValidClass).join(" ").trim();
        valid = value.length;
      } else {
        valid = attrsOk.indexOf(lkey) !== -1 && (attributes.uris[lkey] !== true || testUrl(value));
      }
      if (valid) {
        out(" ");
        out(key);
        if (typeof value === "string") {
          out('="');
          out(he.encode(value));
          out('"');
        }
      }
      function isValidClass(className) {
        return classesOk && classesOk.indexOf(className) !== -1;
      }
    }
  }
  function end(tag) {
    var low = lowercase2(tag);
    var allowed = (o.allowedTags || []).indexOf(low) !== -1;
    if (allowed) {
      if (context.ignoring === false) {
        out("</");
        out(low);
        out(">");
      } else {
        unignore(low);
      }
    } else {
      unignore(low);
    }
  }
  function testUrl(text) {
    var start2 = text[0];
    if (start2 === "#" || start2 === "/") {
      return true;
    }
    var colon = text.indexOf(":");
    if (colon === -1) {
      return true;
    }
    var questionmark = text.indexOf("?");
    if (questionmark !== -1 && colon > questionmark) {
      return true;
    }
    var hash = text.indexOf("#");
    if (hash !== -1 && colon > hash) {
      return true;
    }
    return o.allowedSchemes.some(matches);
    function matches(scheme) {
      return text.indexOf(scheme + ":") === 0;
    }
  }
  function chars(text) {
    if (context.ignoring === false) {
      out(o.transformText ? o.transformText(text) : text);
    }
  }
  function ignore(tag) {
    if (elements.voids[tag]) {
      return;
    }
    if (context.ignoring === false) {
      context = { ignoring: tag, depth: 1 };
    } else if (context.ignoring === tag) {
      context.depth++;
    }
  }
  function unignore(tag) {
    if (context.ignoring === tag) {
      if (--context.depth <= 0) {
        reset();
      }
    }
  }
  function reset() {
    context = { ignoring: false, depth: 0 };
  }
}
var sanitizer_1 = sanitizer$1;
var defaults$2 = {
  allowedAttributes: {
    a: ["href", "name", "target", "title", "aria-label"],
    iframe: ["allowfullscreen", "frameborder", "src"],
    img: ["src", "alt", "title", "aria-label"]
  },
  allowedClasses: {},
  allowedSchemes: ["http", "https", "mailto"],
  allowedTags: [
    "a",
    "abbr",
    "article",
    "b",
    "blockquote",
    "br",
    "caption",
    "code",
    "del",
    "details",
    "div",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "i",
    "img",
    "ins",
    "kbd",
    "li",
    "main",
    "mark",
    "ol",
    "p",
    "pre",
    "section",
    "span",
    "strike",
    "strong",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "u",
    "ul"
  ],
  filter: null
};
var defaults_1 = defaults$2;
var assign = assignment_1;
var parser = parser_1;
var sanitizer = sanitizer_1;
var defaults$1 = defaults_1;
function insane(html, options, strict) {
  var buffer = [];
  var configuration = strict === true ? options : assign({}, defaults$1, options);
  var handler = sanitizer(buffer, configuration);
  parser(html, handler);
  return buffer.join("");
}
insane.defaults = defaults$1;
var insane_1 = insane;
const insane$1 = /* @__PURE__ */ getDefaultExportFromCjs(insane_1);
const insaneOptions = {
  allowedClasses: {},
  // @refer CVE-2018-8495
  // @link https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2018-8495
  // @link https://leucosite.com/Microsoft-Edge-RCE/
  // @link https://medium.com/@knownsec404team/analysis-of-the-security-issues-of-url-scheme-in-pc-from-cve-2018-8495-934478a36756
  allowedSchemes: [
    "http",
    "https",
    "mailto",
    "data"
    // for support base64 encoded image (安全性有待考虑)
  ],
  allowedTags: [
    "a",
    "abbr",
    "article",
    "b",
    "blockquote",
    "br",
    "caption",
    "code",
    "del",
    "details",
    "div",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "hr",
    "i",
    "img",
    "ins",
    "kbd",
    "li",
    "main",
    "mark",
    "ol",
    "p",
    "pre",
    "section",
    "span",
    "strike",
    "strong",
    "sub",
    "summary",
    "sup",
    "table",
    "tbody",
    "td",
    "th",
    "thead",
    "tr",
    "u",
    "ul"
  ],
  allowedAttributes: {
    "*": ["title", "accesskey"],
    a: ["href", "name", "target", "aria-label", "rel"],
    img: ["src", "alt", "title", "atk-emoticon", "aria-label"],
    // for code highlight
    code: ["class"],
    span: ["class", "style"]
  },
  filter: (node) => {
    const allowed = [
      ["code", /^hljs\W+language-(.*)$/],
      ["span", /^(hljs-.*)$/]
    ];
    allowed.forEach(([tag, reg]) => {
      if (node.tag === tag && !!node.attrs.class && !reg.test(node.attrs.class)) {
        delete node.attrs.class;
      }
    });
    if (node.tag === "span" && !!node.attrs.style && !/^color:(\W+)?#[0-9a-f]{3,6};?$/i.test(node.attrs.style)) {
      delete node.attrs.style;
    }
    return true;
  }
};
function sanitize(content) {
  return insane$1(content, insaneOptions);
}
var hanabi$1 = { exports: {} };
(function(module, exports) {
  (function(global2, factory) {
    module.exports = factory();
  })(commonjsGlobal, function() {
    function createCommonjsModule(fn, module2) {
      return module2 = { exports: {} }, fn(module2, module2.exports), module2.exports;
    }
    var index$1 = createCommonjsModule(function(module2) {
      var comment = module2.exports = function() {
        return new RegExp("(?:" + comment.line().source + ")|(?:" + comment.block().source + ")", "gm");
      };
      comment.line = function() {
        return /(?:^|\s)\/\/(.+?)$/gm;
      };
      comment.block = function() {
        return /\/\*([\S\s]*?)\*\//gm;
      };
    });
    var defaultColors = ["23AC69", "91C132", "F19726", "E8552D", "1AAB8E", "E1147F", "2980C1", "1BA1E6", "9FA0A0", "F19726", "E30B20", "E30B20", "A3338B"];
    var index = function(input, ref) {
      if (ref === void 0)
        ref = {};
      var colors = ref.colors;
      if (colors === void 0)
        colors = defaultColors;
      var index2 = 0;
      var cache = {};
      var wordRe = /[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af\u0400-\u04FF]+|\w+/;
      var leftAngleRe = /</;
      var re = new RegExp("(" + wordRe.source + "|" + leftAngleRe.source + ")|(" + index$1().source + ")", "gmi");
      return input.replace(re, function(m, word, cm) {
        if (cm) {
          return toComment(cm);
        }
        if (word === "<") {
          return "&lt;";
        }
        var color;
        if (cache[word]) {
          color = cache[word];
        } else {
          color = colors[index2];
          cache[word] = color;
        }
        var out = '<span style="color: #' + color + '">' + word + "</span>";
        index2 = ++index2 % colors.length;
        return out;
      });
    };
    function toComment(cm) {
      return '<span style="color: slategray">' + cm + "</span>";
    }
    return index;
  });
})(hanabi$1);
var hanabiExports = hanabi$1.exports;
const hanabi = /* @__PURE__ */ getDefaultExportFromCjs(hanabiExports);
function renderCode(code) {
  return hanabi(code);
}
function getRenderer() {
  const renderer = new marked$1.Renderer();
  renderer.link = markedLinkRenderer(renderer, renderer.link);
  renderer.code = markedCodeRenderer();
  return renderer;
}
const markedLinkRenderer = (renderer, orgLinkRenderer) => (href, title, text) => {
  const localLink = href == null ? void 0 : href.startsWith(`${window.location.protocol}//${window.location.hostname}`);
  const html = orgLinkRenderer.call(renderer, href, title, text);
  return html.replace(/^<a /, `<a target="_blank" ${!localLink ? `rel="noreferrer noopener nofollow"` : ""} `);
};
const markedCodeRenderer = () => (block, lang) => {
  const realLang = !lang ? "plaintext" : lang;
  let colorized = block;
  if (window.hljs) {
    if (realLang && window.hljs.getLanguage(realLang)) {
      colorized = window.hljs.highlight(realLang, block).value;
    }
  } else {
    colorized = renderCode(block);
  }
  return `<pre rel="${realLang}">
<code class="hljs language-${realLang}">${colorized.replace(/&amp;/g, "&")}</code>
</pre>`;
};
let instance;
let replacers = [];
const markedOptions = {
  gfm: true,
  breaks: true,
  async: false
};
function getInstance() {
  return instance;
}
function setReplacers(arr) {
  replacers = arr;
}
function initMarked() {
  try {
    if (!marked$1.name)
      return;
  } catch (e) {
    return;
  }
  marked$1.setOptions(__spreadValues({
    renderer: getRenderer()
  }, markedOptions));
  instance = marked$1;
}
function marked(src) {
  var _a;
  let markedContent = (_a = getInstance()) == null ? void 0 : _a.parse(src);
  if (!markedContent) {
    markedContent = simpleMarked(src);
  }
  let dest = sanitize(markedContent);
  replacers.forEach((replacer) => {
    if (typeof replacer === "function")
      dest = replacer(dest);
  });
  return dest;
}
function simpleMarked(src) {
  return src.replace(/```\s*([^]+?.*?[^]+?[^]+?)```/g, (_, code) => `<pre><code>${renderCode(code)}</code></pre>`).replace(/!\[(.*?)\]\((.*?)\)/g, (_, alt, imgSrc) => `<img src="${imgSrc}" alt="${alt}" />`).replace(/\[(.*?)\]\((.*?)\)/g, (_, text, link) => `<a href="${link}" target="_blank">${text}</a>`).replace(/\n/g, "<br>");
}
function mergeDeep(...objects) {
  const isObject = (obj) => obj && typeof obj === "object" && obj.constructor === Object;
  return objects.reduce((prev, obj) => {
    Object.keys(obj != null ? obj : {}).forEach((key) => {
      if (key === "__proto__" || key === "constructor" || key === "prototype") {
        return;
      }
      const pVal = prev[key];
      const oVal = obj[key];
      if (Array.isArray(pVal) && Array.isArray(oVal)) {
        prev[key] = pVal.concat(...oVal);
      } else if (isObject(pVal) && isObject(oVal)) {
        prev[key] = mergeDeep(pVal, oVal);
      } else {
        prev[key] = oVal;
      }
    });
    return prev;
  }, {});
}
class DataManager {
  constructor(events) {
    __publicField(this, "loading", false);
    __publicField(this, "listLastFetch");
    __publicField(this, "comments", []);
    // Note: 无层级结构 + 无须排列
    __publicField(this, "notifies", []);
    __publicField(this, "page");
    this.events = events;
  }
  getLoading() {
    return this.loading;
  }
  setLoading(val) {
    this.loading = val;
  }
  getListLastFetch() {
    return this.listLastFetch;
  }
  setListLastFetch(val) {
    this.listLastFetch = val;
  }
  // -------------------------------------------------------------------
  //  Comments
  // -------------------------------------------------------------------
  getComments() {
    return this.comments;
  }
  fetchComments(params) {
    this.events.trigger("list-fetch", params);
  }
  findComment(id) {
    return this.comments.find((c) => c.id === id);
  }
  clearComments() {
    this.comments = [];
    this.events.trigger("list-loaded", this.comments);
  }
  loadComments(partialComments) {
    this.events.trigger("list-load", partialComments);
    this.comments.push(...partialComments);
    this.events.trigger("list-loaded", this.comments);
  }
  insertComment(comment) {
    this.comments.push(comment);
    this.events.trigger("comment-inserted", comment);
    this.events.trigger("list-loaded", this.comments);
  }
  updateComment(comment) {
    this.comments = this.comments.map((c) => {
      if (c.id === comment.id)
        return comment;
      return c;
    });
    this.events.trigger("comment-updated", comment);
    this.events.trigger("list-loaded", this.comments);
  }
  deleteComment(id) {
    const comment = this.comments.find((c) => c.id === id);
    if (!comment)
      throw new Error(`Comment ${id} not found`);
    this.comments = this.comments.filter((c) => c.id !== id);
    this.events.trigger("comment-deleted", comment);
    this.events.trigger("list-loaded", this.comments);
  }
  // -------------------------------------------------------------------
  //  Notifies
  // -------------------------------------------------------------------
  getNotifies() {
    return this.notifies;
  }
  updateNotifies(notifies) {
    this.notifies = notifies;
    this.events.trigger("notifies-updated", this.notifies);
  }
  // -------------------------------------------------------------------
  // Page
  // -------------------------------------------------------------------
  getPage() {
    return this.page;
  }
  updatePage(pageData) {
    this.page = pageData;
    this.events.trigger("page-loaded", pageData);
  }
}
const en = {
  /* Editor */
  placeholder: "Leave a comment",
  noComment: "No Comment",
  send: "Send",
  save: "Save",
  nick: "Nickname",
  email: "Email",
  link: "Website",
  emoticon: "Emoji",
  preview: "Preview",
  uploadImage: "Upload Image",
  uploadFail: "Upload Failed",
  commentFail: "Failed to comment",
  restoredMsg: "Content has been restored",
  onlyAdminCanReply: "Only admin can reply",
  uploadLoginMsg: "Please fill in your name and email to upload",
  /* List */
  counter: "{count} Comments",
  sortLatest: "Latest",
  sortOldest: "Oldest",
  sortBest: "Best",
  sortAuthor: "Author",
  openComment: "Open Comment",
  closeComment: "Close Comment",
  listLoadFailMsg: "Failed to load comments",
  listRetry: "Retry",
  loadMore: "Load More",
  /* Comment */
  admin: "Admin",
  reply: "Reply",
  voteUp: "Up",
  voteDown: "Down",
  voteFail: "Vote Failed",
  readMore: "Read More",
  actionConfirm: "Confirm",
  collapse: "Collapse",
  collapsed: "Collapsed",
  collapsedMsg: "This comment has been collapsed",
  expand: "Expand",
  approved: "Approved",
  pending: "Pending",
  pendingMsg: "Pending, visible only to commenter.",
  edit: "Edit",
  editCancel: "Cancel Edit",
  delete: "Delete",
  deleteConfirm: "Confirm",
  pin: "Pin",
  unpin: "Unpin",
  /* Time */
  seconds: "seconds ago",
  minutes: "minutes ago",
  hours: "hours ago",
  days: "days ago",
  now: "just now",
  /* Checker */
  adminCheck: "Enter admin password:",
  captchaCheck: "Enter the CAPTCHA to continue:",
  confirm: "Confirm",
  cancel: "Cancel",
  /* Sidebar */
  msgCenter: "Messages",
  ctrlCenter: "Admin",
  /* General */
  frontend: "Frontend",
  backend: "Backend",
  loading: "Loading",
  loadFail: "Load Failed",
  editing: "Editing",
  editFail: "Edit Failed",
  deleting: "Deleting",
  deleteFail: "Delete Failed",
  reqGot: "Request got",
  reqAborted: "Request timed out or terminated unexpectedly",
  updateMsg: "Please update Artalk {name} to get the full experience",
  currentVersion: "Current Version",
  ignore: "Ignore",
  open: "Open",
  openName: "Open {name}"
};
const zhCN = {
  /* Editor */
  placeholder: "键入内容...",
  noComment: "「此时无声胜有声」",
  send: "发送",
  save: "保存",
  nick: "昵称",
  email: "邮箱",
  link: "网址",
  emoticon: "表情",
  preview: "预览",
  uploadImage: "上传图片",
  uploadFail: "上传失败",
  commentFail: "评论失败",
  restoredMsg: "内容已自动恢复",
  onlyAdminCanReply: "仅管理员可评论",
  uploadLoginMsg: "填入你的名字邮箱才能上传哦",
  /* List */
  counter: "{count} 条评论",
  sortLatest: "最新",
  sortOldest: "最早",
  sortBest: "最热",
  sortAuthor: "作者",
  openComment: "打开评论",
  closeComment: "关闭评论",
  listLoadFailMsg: "无法获取评论列表数据",
  listRetry: "点击重新获取",
  loadMore: "加载更多",
  /* Comment */
  admin: "管理员",
  reply: "回复",
  voteUp: "赞同",
  voteDown: "反对",
  voteFail: "投票失败",
  readMore: "阅读更多",
  actionConfirm: "确认操作",
  collapse: "折叠",
  collapsed: "已折叠",
  collapsedMsg: "该评论已被系统或管理员折叠",
  expand: "展开",
  approved: "已审",
  pending: "待审",
  pendingMsg: "审核中，仅本人可见。",
  edit: "编辑",
  editCancel: "取消编辑",
  delete: "删除",
  deleteConfirm: "确认删除",
  pin: "置顶",
  unpin: "取消置顶",
  /* Time */
  seconds: "秒前",
  minutes: "分钟前",
  hours: "小时前",
  days: "天前",
  now: "刚刚",
  /* Checker */
  adminCheck: "键入密码来验证管理员身份：",
  captchaCheck: "键入验证码继续：",
  confirm: "确认",
  cancel: "取消",
  /* Sidebar */
  msgCenter: "通知中心",
  ctrlCenter: "控制中心",
  /* General */
  frontend: "前端",
  backend: "后端",
  loading: "加载中",
  loadFail: "加载失败",
  editing: "修改中",
  editFail: "修改失败",
  deleting: "删除中",
  deleteFail: "删除失败",
  reqGot: "请求响应",
  reqAborted: "请求超时或意外终止",
  updateMsg: "请更新 Artalk {name} 以获得完整体验",
  currentVersion: "当前版本",
  ignore: "忽略",
  open: "打开",
  openName: "打开{name}"
};
const GLOBAL_LOCALES_KEY = "ArtalkI18n";
function createElement(htmlStr = "") {
  const div = document.createElement("div");
  div.innerHTML = htmlStr.trim();
  return div.firstElementChild || div;
}
function getHeight(el) {
  return parseFloat(getComputedStyle(el, null).height.replace("px", ""));
}
function htmlEncode(str) {
  const temp = document.createElement("div");
  temp.innerText = str;
  const output = temp.innerHTML;
  return output;
}
function getQueryParam(name) {
  const match = RegExp(`[?&]${name}=([^&]*)`).exec(window.location.search);
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
}
function getOffset(el, relativeTo) {
  const getOffsetRecursive = (element) => {
    const rect = element.getBoundingClientRect();
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft
    };
  };
  const elOffset = getOffsetRecursive(el);
  if (!relativeTo)
    return elOffset;
  const relativeToOffset = getOffsetRecursive(relativeTo);
  return {
    top: elOffset.top - relativeToOffset.top,
    left: elOffset.left - relativeToOffset.left
  };
}
function padWithZeros(vNumber, width) {
  let numAsString = vNumber.toString();
  while (numAsString.length < width) {
    numAsString = `0${numAsString}`;
  }
  return numAsString;
}
function dateFormat(date) {
  const vDay = padWithZeros(date.getDate(), 2);
  const vMonth = padWithZeros(date.getMonth() + 1, 2);
  const vYear = padWithZeros(date.getFullYear(), 2);
  return `${vYear}-${vMonth}-${vDay}`;
}
function timeAgo(date, $t = (n) => n) {
  try {
    const oldTime = date.getTime();
    const currTime = (/* @__PURE__ */ new Date()).getTime();
    const diffValue = currTime - oldTime;
    const days = Math.floor(diffValue / (24 * 3600 * 1e3));
    if (days === 0) {
      const leave1 = diffValue % (24 * 3600 * 1e3);
      const hours = Math.floor(leave1 / (3600 * 1e3));
      if (hours === 0) {
        const leave2 = leave1 % (3600 * 1e3);
        const minutes = Math.floor(leave2 / (60 * 1e3));
        if (minutes === 0) {
          const leave3 = leave2 % (60 * 1e3);
          const seconds = Math.round(leave3 / 1e3);
          if (seconds < 10)
            return $t("now");
          return `${seconds} ${$t("seconds")}`;
        }
        return `${minutes} ${$t("minutes")}`;
      }
      return `${hours} ${$t("hours")}`;
    }
    if (days < 0)
      return $t("now");
    if (days < 8) {
      return `${days} ${$t("days")}`;
    }
    return dateFormat(date);
  } catch (error) {
    console.error(error);
    return " - ";
  }
}
function onImagesLoaded($container, event) {
  if (!$container)
    return;
  const images = $container.getElementsByTagName("img");
  if (!images.length)
    return;
  let loaded = images.length;
  for (let i = 0; i < images.length; i++) {
    if (images[i].complete) {
      loaded--;
    } else {
      images[i].addEventListener("load", () => {
        loaded--;
        if (loaded === 0)
          event();
      });
    }
    if (loaded === 0)
      event();
  }
}
function getGravatarURL(opts) {
  return `${opts.mirror.replace(/\/$/, "")}/${opts.emailMD5}?${opts.params.replace(/^\?/, "")}`;
}
function versionCompare(a, b) {
  const pa = a.split(".");
  const pb = b.split(".");
  for (let i = 0; i < 3; i++) {
    const na = Number(pa[i]);
    const nb = Number(pb[i]);
    if (na > nb)
      return 1;
    if (nb > na)
      return -1;
    if (!Number.isNaN(na) && Number.isNaN(nb))
      return 1;
    if (Number.isNaN(na) && !Number.isNaN(nb))
      return -1;
  }
  return 0;
}
function getCorrectUserAgent() {
  return __async(this, null, function* () {
    const uaRaw = navigator.userAgent;
    if (!navigator.userAgentData || !navigator.userAgentData.getHighEntropyValues) {
      return uaRaw;
    }
    const uaData = navigator.userAgentData;
    let uaGot = null;
    try {
      uaGot = yield uaData.getHighEntropyValues(["platformVersion"]);
    } catch (err) {
      console.error(err);
      return uaRaw;
    }
    const majorPlatformVersion = Number(uaGot.platformVersion.split(".")[0]);
    if (uaData.platform === "Windows") {
      if (majorPlatformVersion >= 13) {
        return uaRaw.replace(/Windows NT 10.0/, "Windows NT 11.0");
      }
    }
    if (uaData.platform === "macOS") {
      if (majorPlatformVersion >= 11) {
        return uaRaw.replace(/(Mac OS X \d+_\d+_\d+|Mac OS X)/, `Mac OS X ${uaGot.platformVersion.replace(/\./g, "_")}`);
      }
    }
    return uaRaw;
  });
}
function isValidURL(urlRaw) {
  let url;
  try {
    url = new URL(urlRaw);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
}
function getURLBasedOnApi(opts) {
  return getURLBasedOn(opts.base, opts.path);
}
function getURLBasedOn(baseURL, path) {
  return `${baseURL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}
const internal = {
  "en": en,
  "en-US": en,
  "zh-CN": zhCN
};
function findLocaleSet(lang) {
  lang = lang.replace(
    /^([a-zA-Z]+)(-[a-zA-Z]+)?$/,
    (_, p1, p2) => p1.toLowerCase() + (p2 || "").toUpperCase()
  );
  if (internal[lang]) {
    return internal[lang];
  }
  if (window[GLOBAL_LOCALES_KEY] && window[GLOBAL_LOCALES_KEY][lang]) {
    return window[GLOBAL_LOCALES_KEY][lang];
  }
  return internal.en;
}
let LocaleConf = "en";
let LocaleDict = findLocaleSet(LocaleConf);
function setLocale(locale) {
  if (locale === LocaleConf)
    return;
  LocaleConf = locale;
  LocaleDict = typeof locale === "string" ? findLocaleSet(locale) : locale;
}
function t(key, args = {}) {
  let str = (LocaleDict == null ? void 0 : LocaleDict[key]) || key;
  str = str.replace(/\{\s*(\w+?)\s*\}/g, (_, token) => args[token] || "");
  return htmlEncode(str);
}
class EventManager {
  constructor() {
    __publicField(this, "events", []);
  }
  /**
   * Add an event listener for a specific event name
   */
  on(name, handler, opts = {}) {
    this.events.push(__spreadValues({ name, handler }, opts));
  }
  /**
   * Remove an event listener for a specific event name and handler
   */
  off(name, handler) {
    if (!handler)
      return;
    this.events = this.events.filter((evt) => !(evt.name === name && evt.handler === handler));
  }
  /**
   * Trigger an event with an optional payload
   */
  trigger(name, payload) {
    this.events.slice(0).filter((evt) => evt.name === name && typeof evt.handler === "function").forEach((evt) => {
      if (evt.once)
        this.off(name, evt.handler);
      evt.handler(payload);
    });
  }
}
const defaults = {
  el: "",
  pageKey: "",
  pageTitle: "",
  server: "",
  site: "",
  placeholder: "",
  noComment: "",
  sendBtn: "",
  darkMode: false,
  editorTravel: true,
  flatMode: "auto",
  nestMax: 2,
  nestSort: "DATE_ASC",
  emoticons: "https://cdn.jsdelivr.net/gh/ArtalkJS/Emoticons/grps/default.json",
  vote: true,
  voteDown: false,
  uaBadge: true,
  listSort: true,
  preview: true,
  countEl: "#ArtalkCount",
  pvEl: "#ArtalkPV",
  gravatar: {
    mirror: "https://cravatar.cn/avatar/",
    params: "d=mp&s=240"
  },
  pagination: {
    pageSize: 20,
    readMore: true,
    autoLoad: true
  },
  heightLimit: {
    content: 300,
    children: 400,
    scrollable: false
  },
  imgUpload: true,
  reqTimeout: 15e3,
  versionCheck: true,
  useBackendConf: true,
  locale: "en"
};
function handelCustomConf(customConf, full = false) {
  const conf = full ? mergeDeep(defaults, customConf) : customConf;
  if (conf.el && typeof conf.el === "string") {
    try {
      const findEl = document.querySelector(conf.el);
      if (!findEl)
        throw Error(`Target element "${conf.el}" was not found.`);
      conf.el = findEl;
    } catch (e) {
      console.error(e);
      throw new Error("Please check your Artalk `el` config.");
    }
  }
  if (conf.pageKey === "")
    conf.pageKey = `${window.location.pathname}`;
  if (conf.pageTitle === "")
    conf.pageTitle = `${document.title}`;
  if (conf.server)
    conf.server = conf.server.replace(/\/$/, "").replace(/\/api\/?$/, "");
  if (conf.locale === "auto")
    conf.locale = navigator.language;
  if (conf.flatMode === "auto")
    conf.flatMode = window.matchMedia("(max-width: 768px)").matches;
  if (typeof conf.nestMax === "number" && Number(conf.nestMax) <= 1)
    conf.flatMode = true;
  return conf;
}
function handleConfFormServer(conf) {
  const DisabledKeys = [
    "el",
    "pageKey",
    "pageTitle",
    "server",
    "site",
    "darkMode"
  ];
  Object.keys(conf).forEach((k) => {
    if (DisabledKeys.includes(k))
      delete conf[k];
  });
  if (conf.emoticons && typeof conf.emoticons === "string") {
    conf.emoticons = conf.emoticons.trim();
    if (conf.emoticons.startsWith("[") || conf.emoticons.startsWith("{")) {
      conf.emoticons = JSON.parse(conf.emoticons);
    } else if (conf.emoticons === "false") {
      conf.emoticons = false;
    }
  }
  return conf;
}
function convertApiOptions(conf, ctx) {
  return {
    baseURL: `${conf.server}/api/v2`,
    siteName: conf.site || "",
    pageKey: conf.pageKey || "",
    pageTitle: conf.pageTitle || "",
    timeout: conf.reqTimeout,
    getApiToken: () => ctx == null ? void 0 : ctx.get("user").getData().token,
    userInfo: (ctx == null ? void 0 : ctx.get("user").checkHasBasicUserInfo()) ? {
      name: ctx == null ? void 0 : ctx.get("user").getData().nick,
      email: ctx == null ? void 0 : ctx.get("user").getData().email
    } : void 0,
    onNeedCheckAdmin: (payload) => {
      if (!ctx)
        throw new Error("`ctx` is required when `onNeedCheckAdmin` is called.");
      return ctx.checkAdmin({});
    },
    onNeedCheckCaptcha: (payload) => {
      if (!ctx)
        throw new Error("`ctx` is required when `onNeedCheckCaptcha` is called.");
      return ctx.checkCaptcha({
        imgData: payload.data.imgData,
        iframe: payload.data.iframe
      });
    }
  };
}
function watchConf(ctx, keys, effect) {
  const deepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const val = () => {
    const conf = ctx.getConf();
    const res = {};
    keys.forEach((key) => {
      res[key] = conf[key];
    });
    return res;
  };
  let lastVal = null;
  const handler = () => {
    const newVal = val();
    const isDiff = lastVal == null || !deepEqual(lastVal, newVal);
    if (isDiff) {
      lastVal = newVal;
      effect(newVal);
    }
  };
  ctx.on("mounted", handler);
  ctx.on("updated", handler);
}
class Context {
  constructor(conf) {
    /* 运行参数 */
    __publicField(this, "conf");
    __publicField(this, "data");
    __publicField(this, "$root");
    /* Event Manager */
    __publicField(this, "events", new EventManager());
    __publicField(this, "mounted", false);
    __publicField(this, "getCommentList", this.getCommentNodes);
    __publicField(this, "getCommentDataList", this.getComments);
    this.conf = conf;
    this.$root = conf.el;
    this.$root.classList.add("artalk");
    this.$root.innerHTML = "";
    this.data = new DataManager(this.events);
    this.on("mounted", () => {
      this.mounted = true;
    });
  }
  inject(depName, obj) {
    this[depName] = obj;
  }
  get(depName) {
    return this[depName];
  }
  getApi() {
    return new Api2(convertApiOptions(this.conf, this));
  }
  getData() {
    return this.data;
  }
  replyComment(commentData, $comment) {
    this.editor.setReply(commentData, $comment);
  }
  editComment(commentData, $comment) {
    this.editor.setEditComment(commentData, $comment);
  }
  fetch(params) {
    this.data.fetchComments(params);
  }
  reload() {
    this.data.fetchComments({ offset: 0 });
  }
  /* List */
  listGotoFirst() {
    this.events.trigger("list-goto-first");
  }
  getCommentNodes() {
    return this.list.getCommentNodes();
  }
  getComments() {
    return this.data.getComments();
  }
  /* Editor */
  editorShowLoading() {
    this.editor.showLoading();
  }
  editorHideLoading() {
    this.editor.hideLoading();
  }
  editorShowNotify(msg, type) {
    this.editor.showNotify(msg, type);
  }
  editorResetState() {
    this.editor.resetState();
  }
  /* Sidebar */
  showSidebar(payload) {
    this.sidebarLayer.show(payload);
  }
  hideSidebar() {
    this.sidebarLayer.hide();
  }
  /* Checker */
  checkAdmin(payload) {
    return this.checkerLauncher.checkAdmin(payload);
  }
  checkCaptcha(payload) {
    return this.checkerLauncher.checkCaptcha(payload);
  }
  /* Events */
  on(name, handler) {
    this.events.on(name, handler);
  }
  off(name, handler) {
    this.events.off(name, handler);
  }
  trigger(name, payload) {
    this.events.trigger(name, payload);
  }
  /* i18n */
  $t(key, args = {}) {
    return t(key, args);
  }
  setDarkMode(darkMode) {
    this.updateConf({ darkMode });
  }
  updateConf(nConf) {
    this.conf = mergeDeep(this.conf, handelCustomConf(nConf, false));
    this.mounted && this.events.trigger("updated", this.conf);
  }
  getConf() {
    return this.conf;
  }
  getEl() {
    return this.$root;
  }
  getMarked() {
    return getInstance();
  }
  watchConf(keys, effect) {
    watchConf(this, keys, effect);
  }
}
class Dialog {
  constructor(contentEl) {
    __publicField(this, "$el");
    __publicField(this, "$content");
    __publicField(this, "$actions");
    this.$el = createElement(
      `<div class="atk-layer-dialog-wrap">
        <div class="atk-layer-dialog">
          <div class="atk-layer-dialog-content"></div>
          <div class="atk-layer-dialog-actions"></div>
        </div>
      </div>`
    );
    this.$actions = this.$el.querySelector(".atk-layer-dialog-actions");
    this.$content = this.$el.querySelector(".atk-layer-dialog-content");
    this.$content.appendChild(contentEl);
  }
  /** 按钮 · 确定 */
  setYes(handler) {
    const btn = createElement(
      `<button data-action="confirm">${t("confirm")}</button>`
    );
    btn.onclick = this.onBtnClick(handler);
    this.$actions.appendChild(btn);
    return this;
  }
  /** 按钮 · 取消 */
  setNo(handler) {
    const btn = createElement(
      `<button data-action="cancel">${t("cancel")}</button>`
    );
    btn.onclick = this.onBtnClick(handler);
    this.$actions.appendChild(btn);
    return this;
  }
  onBtnClick(handler) {
    return (evt) => {
      const re = handler(evt.currentTarget, this);
      if (re === void 0 || re === true) {
        this.$el.remove();
      }
    };
  }
}
function showLoading(parentElem, conf) {
  let $loading = parentElem.querySelector(":scope > .atk-loading");
  if (!$loading) {
    $loading = createElement(
      `<div class="atk-loading" style="display: none;">
      <div class="atk-loading-spinner">
        <svg viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"></circle></svg>
      </div>
    </div>`
    );
    if (conf == null ? void 0 : conf.transparentBg)
      $loading.style.background = "transparent";
    parentElem.appendChild($loading);
  }
  $loading.style.display = "";
  const $spinner = $loading.querySelector(".atk-loading-spinner");
  if ($spinner) {
    $spinner.style.display = "none";
    window.setTimeout(() => {
      if ($spinner.isConnected)
        $spinner.style.display = "";
    }, 500);
  }
}
function hideLoading(parentElem) {
  const $loading = parentElem.querySelector(":scope > .atk-loading");
  if ($loading)
    $loading.style.display = "none";
}
function setLoading(val, parentElem) {
  if (val)
    showLoading(parentElem);
  else
    hideLoading(parentElem);
}
function scrollIntoView(elem, enableAnim = true, relativeTo) {
  let top;
  if (relativeTo) {
    const containerRect = relativeTo.getBoundingClientRect();
    const elementRect = elem.getBoundingClientRect();
    top = elementRect.top - containerRect.top + relativeTo.scrollTop - relativeTo.clientHeight / 2 + elem.clientHeight / 2;
  } else {
    const rect = elem.getBoundingClientRect();
    const elemTop = rect.top + window.scrollY;
    top = elemTop - (window.innerHeight / 2 - rect.height / 2);
  }
  const scrollOptions = {
    top,
    left: 0,
    // behavior: enableAnim ? 'smooth' : 'instant',
    behavior: "instant"
  };
  if (relativeTo)
    relativeTo.scroll(scrollOptions);
  else
    window.scroll(scrollOptions);
}
function showNotify(wrapElem, msg, type) {
  const colors = { s: "#57d59f", e: "#ff6f6c", w: "#ffc721", i: "#2ebcfc" };
  const timeout = 3e3;
  const notifyElem = createElement(
    `<div class="atk-notify atk-fade-in" style="background-color: ${colors[type]}"><span class="atk-notify-content"></span></div>`
  );
  const notifyContentEl = notifyElem.querySelector(".atk-notify-content");
  notifyContentEl.innerHTML = htmlEncode(msg).replace("\n", "<br/>");
  wrapElem.appendChild(notifyElem);
  const notifyRemove = () => {
    notifyElem.classList.add("atk-fade-out");
    setTimeout(() => {
      notifyElem.remove();
    }, 200);
  };
  let timeoutFn;
  {
    timeoutFn = window.setTimeout(() => {
      notifyRemove();
    }, timeout);
  }
  notifyElem.addEventListener("click", () => {
    notifyRemove();
    window.clearTimeout(timeoutFn);
  });
}
function playFadeAnim(elem, after, type = "in") {
  elem.classList.add(`atk-fade-${type}`);
  const onAnimEnded = () => {
    elem.classList.remove(`atk-fade-${type}`);
    elem.removeEventListener("animationend", onAnimEnded);
    if (after)
      after();
  };
  elem.addEventListener("animationend", onAnimEnded);
}
function playFadeInAnim(elem, after) {
  playFadeAnim(elem, after, "in");
}
function setError(parentElem, html, title = '<span class="atk-error-title">Artalk Error</span>') {
  let elem = parentElem.querySelector(".atk-error-layer");
  if (html === null) {
    if (elem !== null)
      elem.remove();
    return;
  }
  if (!elem) {
    elem = createElement(
      `<div class="atk-error-layer">${title}<span class="atk-error-text"></span></div>`
    );
    parentElem.appendChild(elem);
  }
  const errorTextEl = elem.querySelector(".atk-error-text");
  errorTextEl.innerHTML = "";
  if (html === null)
    return;
  if (html instanceof HTMLElement) {
    errorTextEl.appendChild(html);
  } else {
    errorTextEl.innerText = html;
  }
}
function getScrollBarWidth() {
  const inner = document.createElement("p");
  inner.style.width = "100%";
  inner.style.height = "200px";
  const outer = document.createElement("div");
  outer.style.position = "absolute";
  outer.style.top = "0px";
  outer.style.left = "0px";
  outer.style.visibility = "hidden";
  outer.style.width = "200px";
  outer.style.height = "150px";
  outer.style.overflow = "hidden";
  outer.appendChild(inner);
  document.body.appendChild(outer);
  const w1 = inner.offsetWidth;
  outer.style.overflow = "scroll";
  let w2 = inner.offsetWidth;
  if (w1 === w2)
    w2 = outer.clientWidth;
  document.body.removeChild(outer);
  return w1 - w2;
}
function imgBody(checker) {
  const elem = createElement(
    `<span><img class="atk-captcha-img" src="${checker.get("img_data") || ""}">${t("captchaCheck")}</span>`
  );
  elem.querySelector(".atk-captcha-img").onclick = () => {
    const imgEl = elem.querySelector(".atk-captcha-img");
    checker.getApi().captcha.getCaptcha().then((res) => {
      imgEl.setAttribute("src", res.data.img_data);
    }).catch((err) => {
      console.error("Failed to get captcha image ", err);
    });
  };
  return elem;
}
function iframeBody(checker) {
  const $iframeWrap = createElement(`<div class="atk-checker-iframe-wrap"></div>`);
  const $iframe = createElement(`<iframe class="atk-fade-in" referrerpolicy="strict-origin-when-cross-origin"></iframe>`);
  $iframe.style.display = "none";
  showLoading($iframeWrap, { transparentBg: true });
  $iframe.src = checker.getOpts().getCaptchaIframeURL();
  $iframe.onload = () => {
    $iframe.style.display = "";
    hideLoading($iframeWrap);
  };
  $iframeWrap.append($iframe);
  const $closeBtn = createElement(`<div class="atk-close-btn"><i class="atk-icon atk-icon-close"></i></div>`);
  $iframeWrap.append($closeBtn);
  checker.hideInteractInput();
  let stop = false;
  const sleep = (ms) => new Promise((resolve) => {
    window.setTimeout(() => {
      resolve(null);
    }, ms);
  });
  (function queryStatus() {
    return __async(this, null, function* () {
      yield sleep(1e3);
      if (stop)
        return;
      let isPass = false;
      try {
        const resp = yield checker.getApi().captcha.getCaptchaStatus();
        isPass = resp.data.is_pass;
      } catch (e) {
        isPass = false;
      }
      if (isPass) {
        checker.triggerSuccess();
      } else {
        queryStatus();
      }
    });
  })();
  $closeBtn.onclick = () => {
    stop = true;
    checker.cancel();
  };
  return $iframeWrap;
}
const CaptchaChecker = {
  request(checker, inputVal) {
    return checker.getApi().captcha.verifyCaptcha({
      value: inputVal
    });
  },
  body(checker) {
    if (checker.get("iframe"))
      return iframeBody(checker);
    return imgBody(checker);
  },
  onSuccess(checker, data, inputVal, formEl) {
    checker.set("val", inputVal);
  },
  onError(checker, err, inputVal, formEl) {
    formEl.querySelector(".atk-captcha-img").click();
    formEl.querySelector('input[type="text"]').value = "";
  }
};
const AdminChecker = {
  inputType: "password",
  request(checker, inputVal) {
    return __async(this, null, function* () {
      return (yield checker.getApi().user.login({
        name: checker.getUser().getData().nick,
        email: checker.getUser().getData().email,
        password: inputVal
      })).data;
    });
  },
  body(checker) {
    return createElement(`<span>${t("adminCheck")}</span>`);
  },
  onSuccess(checker, res, inputVal, formEl) {
    checker.getUser().update({
      isAdmin: true,
      token: res.token
    });
    checker.getOpts().onReload();
  },
  onError(checker, err, inputVal, formEl) {
  }
};
function wrapPromise(fn) {
  return (payload) => new Promise((resolve, reject) => {
    const cancelFn = payload.onCancel;
    payload.onCancel = () => {
      cancelFn && cancelFn();
      reject(new Error("user canceled the checker"));
    };
    const successFn = payload.onSuccess;
    payload.onSuccess = () => {
      successFn && successFn();
      resolve();
    };
    fn(payload);
  });
}
class CheckerLauncher {
  constructor(opts) {
    __publicField(this, "checkCaptcha", wrapPromise((p) => {
      this.fire(CaptchaChecker, p, (ctx) => {
        ctx.set("img_data", p.imgData);
        ctx.set("iframe", p.iframe);
      });
    }));
    __publicField(this, "checkAdmin", wrapPromise((p) => {
      this.fire(AdminChecker, p);
    }));
    this.opts = opts;
  }
  fire(checker, payload, postFire) {
    const layer = this.opts.getCtx().get("layerManager").create(`checker-${(/* @__PURE__ */ new Date()).getTime()}`);
    layer.show();
    const close = () => {
      layer.destroy();
    };
    const checkerStore = {};
    let hideInteractInput = false;
    const checkerCtx = {
      set: (key, val) => {
        checkerStore[key] = val;
      },
      get: (key) => checkerStore[key],
      getOpts: () => this.opts,
      getUser: () => this.opts.getCtx().get("user"),
      getApi: () => this.opts.getApi(),
      hideInteractInput: () => {
        hideInteractInput = true;
      },
      triggerSuccess: () => {
        close();
        if (checker.onSuccess)
          checker.onSuccess(checkerCtx, "", "", formEl);
        if (payload.onSuccess)
          payload.onSuccess();
      },
      cancel: () => {
        close();
        if (payload.onCancel)
          payload.onCancel();
      }
    };
    if (postFire)
      postFire(checkerCtx);
    const formEl = createElement();
    formEl.appendChild(checker.body(checkerCtx));
    const $input = createElement(
      `<input id="check" type="${checker.inputType || "text"}" autocomplete="off" required placeholder="">`
    );
    formEl.appendChild($input);
    setTimeout(() => $input.focus(), 80);
    $input.onkeyup = (evt) => {
      if (evt.key === "Enter" || evt.keyCode === 13) {
        evt.preventDefault();
        layer.getEl().querySelector('button[data-action="confirm"]').click();
      }
    };
    let btnTextOrg;
    const dialog = new Dialog(formEl);
    dialog.setYes((btnEl) => {
      const inputVal = $input.value.trim();
      if (!btnTextOrg)
        btnTextOrg = btnEl.innerText;
      const btnTextSet = (btnText) => {
        btnEl.innerText = btnText;
        btnEl.classList.add("error");
      };
      const btnTextRestore = () => {
        btnEl.innerText = btnTextOrg || "";
        btnEl.classList.remove("error");
      };
      btnEl.innerText = `${t("loading")}...`;
      checker.request(checkerCtx, inputVal).then((data) => {
        close();
        if (checker.onSuccess)
          checker.onSuccess(checkerCtx, data, inputVal, formEl);
        if (payload.onSuccess)
          payload.onSuccess();
      }).catch((err) => {
        btnTextSet(String(err.msg || String(err)));
        if (checker.onError)
          checker.onError(checkerCtx, err, inputVal, formEl);
        const tf = setTimeout(() => btnTextRestore(), 3e3);
        $input.onfocus = () => {
          btnTextRestore();
          clearTimeout(tf);
        };
      });
      return false;
    });
    dialog.setNo(() => {
      close();
      if (payload.onCancel)
        payload.onCancel();
      return false;
    });
    if (hideInteractInput) {
      $input.style.display = "none";
      dialog.$el.querySelector(".atk-layer-dialog-actions").style.display = "none";
    }
    layer.getEl().append(dialog.$el);
    if (payload.onMount)
      payload.onMount(dialog.$el);
  }
}
class Component {
  constructor(ctx) {
    __publicField(this, "$el");
    this.ctx = ctx;
  }
  get conf() {
    return this.ctx.conf;
  }
  getEl() {
    return this.$el;
  }
}
const EditorHTML = '<div class="atk-main-editor">\n  <div class="atk-header">\n    <input name="nick" class="atk-nick" type="text" required="required">\n    <input name="email" class="atk-email" type="email" required="required">\n    <input name="link" class="atk-link" type="url">\n  </div>\n  <div class="atk-textarea-wrap">\n    <textarea class="atk-textarea"></textarea>\n  </div>\n  <div class="atk-plug-panel-wrap" style="display: none;"></div>\n  <div class="atk-bottom">\n    <div class="atk-item atk-bottom-left">\n      <span class="atk-state-wrap"></span>\n      <span class="atk-plug-btn-wrap"></span>\n    </div>\n    <div class="atk-item">\n      <button type="button" class="atk-send-btn"></button>\n    </div>\n  </div>\n  <div class="atk-notify-wrap"></div>\n</div>\n';
const Sel = {
  $header: ".atk-header",
  $nick: '.atk-header [name="nick"]',
  $email: '.atk-header [name="email"]',
  $link: '.atk-header [name="link"]',
  $textareaWrap: ".atk-textarea-wrap",
  $textarea: ".atk-textarea",
  $bottom: ".atk-bottom",
  $submitBtn: ".atk-send-btn",
  $notifyWrap: ".atk-notify-wrap",
  $bottomLeft: ".atk-bottom-left",
  $stateWrap: ".atk-state-wrap",
  $plugBtnWrap: ".atk-plug-btn-wrap",
  $plugPanelWrap: ".atk-plug-panel-wrap"
};
function render() {
  const $el = createElement(EditorHTML);
  const ui = { $el };
  Object.entries(Sel).forEach(([k, sel]) => {
    ui[k] = $el.querySelector(sel);
  });
  return ui;
}
class EditorPlug {
  constructor(kit) {
    this.kit = kit;
  }
  /** Use plug btn will add a btn on the bottom of editor */
  useBtn(html = "<div></div>") {
    this.$btn = createElement(`<span class="atk-plug-btn">${html}</span>`);
    return this.$btn;
  }
  /** Use plug panel will show the panel when btn is clicked */
  usePanel(html = "<div></div>") {
    this.$panel = createElement(html);
    return this.$panel;
  }
  /** Use the content transformer to handle the content of the last submit by the editor */
  useContentTransformer(func) {
    this.contentTransformer = func;
  }
  /** Listen the event of panel show */
  usePanelShow(func) {
    this.kit.useEvents().on("panel-show", (aPlug) => {
      if (aPlug === this)
        func();
    });
  }
  /** Listen the event of panel hide */
  usePanelHide(func) {
    this.kit.useEvents().on("panel-hide", (aPlug) => {
      if (aPlug === this)
        func();
    });
  }
  /** Use editor state modifier */
  useEditorStateEffect(stateName, effectFn) {
    this.editorStateEffectWhen = stateName;
    this.editorStateEffect = effectFn;
  }
}
class Mover extends EditorPlug {
  constructor() {
    super(...arguments);
    __publicField(this, "isMoved", false);
  }
  move(afterEl) {
    if (this.isMoved)
      return;
    this.isMoved = true;
    const editorEl = this.kit.useUI().$el;
    editorEl.after(createElement('<div class="atk-editor-travel-placeholder"></div>'));
    const $travelPlace = createElement("<div></div>");
    afterEl.after($travelPlace);
    $travelPlace.replaceWith(editorEl);
    editorEl.classList.add("atk-fade-in");
    editorEl.classList.add("editor-traveling");
  }
  back() {
    var _a;
    if (!this.isMoved)
      return;
    this.isMoved = false;
    (_a = this.kit.useGlobalCtx().$root.querySelector(".atk-editor-travel-placeholder")) == null ? void 0 : _a.replaceWith(this.kit.useUI().$el);
    this.kit.useUI().$el.classList.remove("editor-traveling");
  }
}
class EditorStateManager {
  constructor(editor) {
    __publicField(this, "stateCurt", "normal");
    __publicField(this, "stateUnmountFn", null);
    this.editor = editor;
  }
  /** Get current state */
  get() {
    return this.stateCurt;
  }
  /**
   * Switch editor state
   *
   * @param state The state to switch
   * @param payload The cause of state switch
   */
  switch(state, payload) {
    var _a, _b, _c, _d, _e;
    if (this.stateUnmountFn) {
      this.stateUnmountFn();
      this.stateUnmountFn = null;
      (_b = (_a = this.editor.getPlugs()) == null ? void 0 : _a.get(Mover)) == null ? void 0 : _b.back();
    }
    if (state !== "normal" && payload) {
      let moveAfterEl = payload.$comment;
      if (!this.editor.conf.flatMode)
        moveAfterEl = moveAfterEl.querySelector(".atk-footer");
      (_d = (_c = this.editor.getPlugs()) == null ? void 0 : _c.get(Mover)) == null ? void 0 : _d.move(moveAfterEl);
      const $relative = this.editor.ctx.conf.scrollRelativeTo && this.editor.ctx.conf.scrollRelativeTo();
      scrollIntoView(this.editor.getUI().$el, true, $relative);
      const plugin = (_e = this.editor.getPlugs()) == null ? void 0 : _e.getPlugs().find((p) => p.editorStateEffectWhen === state);
      if (plugin && plugin.editorStateEffect) {
        this.stateUnmountFn = plugin.editorStateEffect(payload.comment);
      }
    }
    this.stateCurt = state;
  }
}
class Editor extends Component {
  constructor(ctx) {
    super(ctx);
    __publicField(this, "ui");
    __publicField(this, "state");
    this.ui = render();
    this.$el = this.ui.$el;
    this.state = new EditorStateManager(this);
  }
  getUI() {
    return this.ui;
  }
  getPlugs() {
    return this.ctx.get("editorPlugs");
  }
  getState() {
    return this.state.get();
  }
  getHeaderInputEls() {
    return { nick: this.ui.$nick, email: this.ui.$email, link: this.ui.$link };
  }
  getContentFinal() {
    let content = this.getContentRaw();
    const plugs = this.getPlugs();
    if (plugs)
      content = plugs.getTransformedContent(content);
    return content;
  }
  getContentRaw() {
    return this.ui.$textarea.value || "";
  }
  getContentMarked() {
    return marked(this.getContentFinal());
  }
  setContent(val) {
    var _a;
    this.ui.$textarea.value = val;
    (_a = this.getPlugs()) == null ? void 0 : _a.getEvents().trigger("content-updated", val);
  }
  insertContent(val) {
    if (document.selection) {
      this.ui.$textarea.focus();
      document.selection.createRange().text = val;
      this.ui.$textarea.focus();
    } else if (this.ui.$textarea.selectionStart || this.ui.$textarea.selectionStart === 0) {
      const sStart = this.ui.$textarea.selectionStart;
      const sEnd = this.ui.$textarea.selectionEnd;
      const sT = this.ui.$textarea.scrollTop;
      this.setContent(this.ui.$textarea.value.substring(0, sStart) + val + this.ui.$textarea.value.substring(sEnd, this.ui.$textarea.value.length));
      this.ui.$textarea.focus();
      this.ui.$textarea.selectionStart = sStart + val.length;
      this.ui.$textarea.selectionEnd = sStart + val.length;
      this.ui.$textarea.scrollTop = sT;
    } else {
      this.ui.$textarea.focus();
      this.ui.$textarea.value += val;
    }
  }
  focus() {
    this.ui.$textarea.focus();
  }
  reset() {
    this.setContent("");
    this.resetState();
  }
  resetState() {
    this.state.switch("normal");
  }
  setReply(comment, $comment) {
    this.state.switch("reply", { comment, $comment });
  }
  setEditComment(comment, $comment) {
    this.state.switch("edit", { comment, $comment });
  }
  showNotify(msg, type) {
    showNotify(this.ui.$notifyWrap, msg, type);
  }
  showLoading() {
    showLoading(this.ui.$el);
  }
  hideLoading() {
    hideLoading(this.ui.$el);
  }
  submit() {
    this.ctx.trigger("editor-submit");
  }
}
const SidebarHTML = '<div class="atk-sidebar-layer">\n  <div class="atk-sidebar-inner">\n    <div class="atk-sidebar-header">\n      <div class="atk-sidebar-close"><i class="atk-icon atk-icon-close"></i></div>\n    </div>\n    <div class="atk-sidebar-iframe-wrap"></div>\n  </div>\n</div>\n';
class SidebarLayer extends Component {
  constructor(ctx) {
    super(ctx);
    __publicField(this, "layer");
    __publicField(this, "$header");
    __publicField(this, "$closeBtn");
    __publicField(this, "$iframeWrap");
    __publicField(this, "$iframe");
    /** Refresh iFrame on show */
    __publicField(this, "refreshOnShow", true);
    /** Animation timer */
    __publicField(this, "animTimer");
    this.$el = createElement(SidebarHTML);
    this.$header = this.$el.querySelector(".atk-sidebar-header");
    this.$closeBtn = this.$header.querySelector(".atk-sidebar-close");
    this.$iframeWrap = this.$el.querySelector(".atk-sidebar-iframe-wrap");
    this.$closeBtn.onclick = () => {
      this.hide();
    };
    this.ctx.on("user-changed", () => {
      this.refreshOnShow = true;
    });
  }
  /** 显示 */
  show() {
    return __async(this, arguments, function* (conf = {}) {
      this.$el.style.transform = "";
      this.initLayer();
      this.layer.show();
      if (this.refreshOnShow) {
        this.refreshOnShow = false;
        this.$iframeWrap.innerHTML = "";
        this.$iframe = this.createIframe(conf.view);
        this.$iframeWrap.append(this.$iframe);
      } else {
        const $iframe = this.$iframe;
        const iFrameSrc = $iframe.src;
        if (this.conf.darkMode !== iFrameSrc.includes("darkMode=1")) {
          this.iframeLoad($iframe, this.conf.darkMode ? iFrameSrc.concat("&darkMode=1") : iFrameSrc.replace("&darkMode=1", ""));
        }
      }
      this.authCheck({
        onSuccess: () => this.show(conf)
        // retry show after auth check
      });
      this.animTimer = setTimeout(() => {
        this.animTimer = void 0;
        this.$el.style.transform = "translate(0, 0)";
        setTimeout(() => {
          this.ctx.getData().updateNotifies([]);
        }, 0);
        this.ctx.trigger("sidebar-show");
      }, 100);
    });
  }
  /** 隐藏 */
  hide() {
    var _a;
    (_a = this.layer) == null ? void 0 : _a.hide();
  }
  // --------------------------------------------------
  authCheck(opts) {
    return __async(this, null, function* () {
      const data = (yield this.ctx.getApi().user.getUserStatus(__spreadValues({}, this.ctx.getApi().getUserFields()))).data;
      if (data.is_admin && !data.is_login) {
        this.refreshOnShow = true;
        this.ctx.checkAdmin({
          onSuccess: () => {
            setTimeout(() => {
              opts.onSuccess();
            }, 500);
          },
          onCancel: () => {
            this.hide();
          }
        });
        this.hide();
      }
    });
  }
  initLayer() {
    if (this.layer)
      return;
    this.layer = this.ctx.get("layerManager").create("sidebar", this.$el);
    this.layer.setOnAfterHide(() => {
      this.ctx.editorResetState();
      this.animTimer && clearTimeout(this.animTimer);
      this.$el.style.transform = "";
      this.ctx.trigger("sidebar-hide");
    });
  }
  createIframe(view) {
    const $iframe = createElement('<iframe referrerpolicy="strict-origin-when-cross-origin"></iframe>');
    const baseURL = getURLBasedOnApi({
      base: this.ctx.conf.server,
      path: "/sidebar/"
    });
    const query = {
      pageKey: this.conf.pageKey,
      site: this.conf.site || "",
      user: JSON.stringify(this.ctx.get("user").getData()),
      time: +/* @__PURE__ */ new Date()
    };
    if (view)
      query.view = view;
    if (this.conf.darkMode)
      query.darkMode = "1";
    const urlParams = new URLSearchParams(query);
    this.iframeLoad($iframe, `${baseURL}?${urlParams.toString()}`);
    return $iframe;
  }
  iframeLoad($iframe, src) {
    $iframe.src = src;
    showLoading(this.$iframeWrap);
    $iframe.onload = () => {
      hideLoading(this.$iframeWrap);
    };
  }
}
const ListHTML = '<div class="atk-list">\n  <div class="atk-list-header">\n    <div class="atk-comment-count">\n      <div class="atk-text"></div>\n    </div>\n    <div class="atk-right-action">\n      <span data-action="admin-close-comment" class="atk-hide" atk-only-admin-show></span>\n      <span data-action="open-sidebar" class="atk-hide atk-on">\n        <span class="atk-unread-badge" style="display: none;"></span>\n        <div class="atk-text"></div>\n      </span>\n    </div>\n  </div>\n  <div class="atk-list-body">\n    <div class="atk-list-comments-wrap"></div>\n  </div>\n  <div class="atk-list-footer">\n    <div class="atk-copyright"></div>\n  </div>\n</div>\n';
function makeNestCommentNodeList(srcData, sortBy = "DATE_DESC", nestMax = 2) {
  const nodeList = [];
  const roots = srcData.filter((o) => o.rid === 0);
  roots.forEach((root) => {
    const rootNode = {
      id: root.id,
      comment: root,
      children: [],
      level: 1
    };
    rootNode.parent = rootNode;
    nodeList.push(rootNode);
    (function loadChildren(parentNode) {
      const children = srcData.filter((o) => o.rid === parentNode.id);
      if (children.length === 0)
        return;
      if (parentNode.level >= nestMax)
        parentNode = parentNode.parent;
      children.forEach((child) => {
        const childNode = {
          id: child.id,
          comment: child,
          children: [],
          parent: parentNode,
          level: parentNode.level + 1
        };
        parentNode.children.push(childNode);
        loadChildren(childNode);
      });
    })(rootNode);
  });
  const sortFunc = (a, b) => {
    let v = a.id - b.id;
    if (sortBy === "DATE_ASC")
      v = +new Date(a.comment.date) - +new Date(b.comment.date);
    else if (sortBy === "DATE_DESC")
      v = +new Date(b.comment.date) - +new Date(a.comment.date);
    else if (sortBy === "SRC_INDEX")
      v = srcData.indexOf(a.comment) - srcData.indexOf(b.comment);
    else if (sortBy === "VOTE_UP_DESC")
      v = b.comment.vote_up - a.comment.vote_up;
    return v;
  };
  (function sortLevels(nodes) {
    nodes.forEach((node) => {
      node.children = node.children.sort(sortFunc);
      sortLevels(node.children);
    });
  })(nodeList);
  return nodeList;
}
const createNestStrategy = (opts) => ({
  import: (comments) => {
    const rootNodes = makeNestCommentNodeList(comments, opts.nestSortBy, opts.nestMax);
    rootNodes.forEach((rootNode) => {
      var _a;
      const rootC = opts.createCommentNode(rootNode.comment);
      (_a = opts.$commentsWrap) == null ? void 0 : _a.appendChild(rootC.getEl());
      rootC.getRender().playFadeAnim();
      const loadChildren = (parentC, parentNode) => {
        parentNode.children.forEach((node) => {
          const childD = node.comment;
          const childC = opts.createCommentNode(childD, parentC.getData());
          parentC.putChild(childC);
          loadChildren(childC, node);
        });
      };
      loadChildren(rootC, rootNode);
      rootC.getRender().checkHeightLimit();
    });
  },
  insert: (comment, replyComment) => {
    var _a;
    const node = opts.createCommentNode(comment, replyComment);
    if (comment.rid === 0) {
      (_a = opts.$commentsWrap) == null ? void 0 : _a.prepend(node.getEl());
    } else {
      const parent = opts.findCommentNode(comment.rid);
      if (parent) {
        parent.putChild(node, opts.nestSortBy === "DATE_ASC" ? "append" : "prepend");
        node.getParents().forEach((p) => {
          p.getRender().heightLimitRemoveForChildren();
        });
      }
    }
    node.getRender().checkHeightLimit();
    node.scrollIntoView();
    node.getRender().playFadeAnim();
  }
});
const createFlatStrategy = (opts) => ({
  import: (comments) => {
    comments.forEach((comment) => {
      const replyComment = comment.rid === 0 ? void 0 : comments.find((c) => c.id === comment.rid);
      insertComment(opts, "append", comment, replyComment);
    });
  },
  insert: (comment, replyComment) => {
    const node = insertComment(opts, "prepend", comment, replyComment);
    node.scrollIntoView();
  }
});
function insertComment(opts, insertMode, comment, replyComment) {
  if (comment.is_collapsed)
    comment.is_allow_reply = false;
  const node = opts.createCommentNode(comment, replyComment);
  if (comment.visible) {
    const $comment = node.getEl();
    const $listCommentsWrap = opts.$commentsWrap;
    if (insertMode === "append")
      $listCommentsWrap == null ? void 0 : $listCommentsWrap.append($comment);
    if (insertMode === "prepend")
      $listCommentsWrap == null ? void 0 : $listCommentsWrap.prepend($comment);
    node.getRender().playFadeAnim();
  }
  node.getRender().checkHeightLimit();
  return node;
}
class ListLayout {
  constructor(options) {
    this.options = options;
  }
  getStrategy() {
    return this.options.flatMode ? createFlatStrategy(this.options) : createNestStrategy(this.options);
  }
  import(comments) {
    this.getStrategy().import(comments);
  }
  insert(comment, replyComment) {
    this.getStrategy().insert(comment, replyComment);
  }
}
function Detect(userAgent) {
  const win = window || {};
  const nav = navigator || {};
  const u = String(userAgent || nav.userAgent);
  const dest = {
    os: "",
    osVersion: "",
    engine: "",
    browser: "",
    device: "",
    language: "",
    version: ""
  };
  const engineMatch = {
    Trident: u.includes("Trident") || u.includes("NET CLR"),
    Presto: u.includes("Presto"),
    WebKit: u.includes("AppleWebKit"),
    Gecko: u.includes("Gecko/")
  };
  const browserMatch = {
    Safari: u.includes("Safari"),
    Chrome: u.includes("Chrome") || u.includes("CriOS"),
    IE: u.includes("MSIE") || u.includes("Trident"),
    Edge: u.includes("Edge") || u.includes("Edg"),
    Firefox: u.includes("Firefox") || u.includes("FxiOS"),
    "Firefox Focus": u.includes("Focus"),
    Chromium: u.includes("Chromium"),
    Opera: u.includes("Opera") || u.includes("OPR"),
    Vivaldi: u.includes("Vivaldi"),
    Yandex: u.includes("YaBrowser"),
    Kindle: u.includes("Kindle") || u.includes("Silk/"),
    360: u.includes("360EE") || u.includes("360SE"),
    UC: u.includes("UC") || u.includes(" UBrowser"),
    QQBrowser: u.includes("QQBrowser"),
    QQ: u.includes("QQ/"),
    Baidu: u.includes("Baidu") || u.includes("BIDUBrowser"),
    Maxthon: u.includes("Maxthon"),
    Sogou: u.includes("MetaSr") || u.includes("Sogou"),
    LBBROWSER: u.includes("LBBROWSER"),
    "2345Explorer": u.includes("2345Explorer"),
    TheWorld: u.includes("TheWorld"),
    MIUI: u.includes("MiuiBrowser"),
    Quark: u.includes("Quark"),
    Qiyu: u.includes("Qiyu"),
    Wechat: u.includes("MicroMessenger"),
    Taobao: u.includes("AliApp(TB"),
    Alipay: u.includes("AliApp(AP"),
    Weibo: u.includes("Weibo"),
    Douban: u.includes("com.douban.frodo"),
    Suning: u.includes("SNEBUY-APP"),
    iQiYi: u.includes("IqiyiApp")
  };
  const osMatch = {
    Windows: u.includes("Windows"),
    Linux: u.includes("Linux") || u.includes("X11"),
    "macOS": u.includes("Macintosh"),
    Android: u.includes("Android") || u.includes("Adr"),
    Ubuntu: u.includes("Ubuntu"),
    FreeBSD: u.includes("FreeBSD"),
    Debian: u.includes("Debian"),
    "Windows Phone": u.includes("IEMobile") || u.includes("Windows Phone"),
    BlackBerry: u.includes("BlackBerry") || u.includes("RIM"),
    MeeGo: u.includes("MeeGo"),
    Symbian: u.includes("Symbian"),
    iOS: u.includes("like Mac OS X"),
    "Chrome OS": u.includes("CrOS"),
    WebOS: u.includes("hpwOS")
  };
  const deviceMatch = {
    Mobile: u.includes("Mobi") || u.includes("iPh") || u.includes("480"),
    Tablet: u.includes("Tablet") || u.includes("Pad") || u.includes("Nexus 7")
  };
  if (deviceMatch.Mobile) {
    deviceMatch.Mobile = !u.includes("iPad");
  } else if (browserMatch.Chrome && u.includes("Edg")) {
    browserMatch.Chrome = false;
    browserMatch.Edge = true;
  } else if (win.showModalDialog && win.chrome) {
    browserMatch.Chrome = false;
    browserMatch["360"] = true;
  }
  dest.device = "PC";
  dest.language = (() => {
    const g = nav.browserLanguage || nav.language;
    const arr = g.split("-");
    if (arr[1])
      arr[1] = arr[1].toUpperCase();
    return arr.join("_");
  })();
  const hash = {
    engine: engineMatch,
    browser: browserMatch,
    os: osMatch,
    device: deviceMatch
  };
  Object.entries(hash).forEach(([type, match]) => {
    Object.entries(match).forEach(([name, result]) => {
      if (result === true)
        dest[type] = name;
    });
  });
  const osVersion = {
    Windows: () => {
      const v = u.replace(/^.*Windows NT ([\d.]+);.*$/, "$1");
      const wvHash = {
        "6.4": "10",
        "6.3": "8.1",
        "6.2": "8",
        "6.1": "7",
        "6.0": "Vista",
        "5.2": "XP",
        "5.1": "XP",
        "5.0": "2000",
        "10.0": "10",
        "11.0": "11"
        // 自定的，不是微软官方的判断方法
      };
      return wvHash[v] || v;
    },
    Android: () => u.replace(/^.*Android ([\d.]+);.*$/, "$1"),
    iOS: () => u.replace(/^.*OS ([\d_]+) like.*$/, "$1").replace(/_/g, "."),
    Debian: () => u.replace(/^.*Debian\/([\d.]+).*$/, "$1"),
    "Windows Phone": () => u.replace(/^.*Windows Phone( OS)? ([\d.]+);.*$/, "$2"),
    "macOS": () => u.replace(/^.*Mac OS X ([\d_]+).*$/, "$1").replace(/_/g, "."),
    WebOS: () => u.replace(/^.*hpwOS\/([\d.]+);.*$/, "$1")
  };
  dest.osVersion = "";
  if (osVersion[dest.os]) {
    dest.osVersion = osVersion[dest.os]();
    if (dest.osVersion === u) {
      dest.osVersion = "";
    }
  }
  const version2 = {
    Safari: () => u.replace(/^.*Version\/([\d.]+).*$/, "$1"),
    Chrome: () => u.replace(/^.*Chrome\/([\d.]+).*$/, "$1").replace(/^.*CriOS\/([\d.]+).*$/, "$1"),
    IE: () => u.replace(/^.*MSIE ([\d.]+).*$/, "$1").replace(/^.*rv:([\d.]+).*$/, "$1"),
    Edge: () => u.replace(/^.*(Edge|Edg|Edg[A-Z]{1})\/([\d.]+).*$/, "$2"),
    Firefox: () => u.replace(/^.*Firefox\/([\d.]+).*$/, "$1").replace(/^.*FxiOS\/([\d.]+).*$/, "$1"),
    "Firefox Focus": () => u.replace(/^.*Focus\/([\d.]+).*$/, "$1"),
    Chromium: () => u.replace(/^.*Chromium\/([\d.]+).*$/, "$1"),
    Opera: () => u.replace(/^.*Opera\/([\d.]+).*$/, "$1").replace(/^.*OPR\/([\d.]+).*$/, "$1"),
    Vivaldi: () => u.replace(/^.*Vivaldi\/([\d.]+).*$/, "$1"),
    Yandex: () => u.replace(/^.*YaBrowser\/([\d.]+).*$/, "$1"),
    Kindle: () => u.replace(/^.*Version\/([\d.]+).*$/, "$1"),
    Maxthon: () => u.replace(/^.*Maxthon\/([\d.]+).*$/, "$1"),
    QQBrowser: () => u.replace(/^.*QQBrowser\/([\d.]+).*$/, "$1"),
    QQ: () => u.replace(/^.*QQ\/([\d.]+).*$/, "$1"),
    Baidu: () => u.replace(/^.*BIDUBrowser[\s/]([\d.]+).*$/, "$1"),
    UC: () => u.replace(/^.*UC?Browser\/([\d.]+).*$/, "$1"),
    Sogou: () => u.replace(/^.*SE ([\d.X]+).*$/, "$1").replace(/^.*SogouMobileBrowser\/([\d.]+).*$/, "$1"),
    "2345Explorer": () => u.replace(/^.*2345Explorer\/([\d.]+).*$/, "$1"),
    TheWorld: () => u.replace(/^.*TheWorld ([\d.]+).*$/, "$1"),
    MIUI: () => u.replace(/^.*MiuiBrowser\/([\d.]+).*$/, "$1"),
    Quark: () => u.replace(/^.*Quark\/([\d.]+).*$/, "$1"),
    Qiyu: () => u.replace(/^.*Qiyu\/([\d.]+).*$/, "$1"),
    Wechat: () => u.replace(/^.*MicroMessenger\/([\d.]+).*$/, "$1"),
    Taobao: () => u.replace(/^.*AliApp\(TB\/([\d.]+).*$/, "$1"),
    Alipay: () => u.replace(/^.*AliApp\(AP\/([\d.]+).*$/, "$1"),
    Weibo: () => u.replace(/^.*weibo__([\d.]+).*$/, "$1"),
    Douban: () => u.replace(/^.*com.douban.frodo\/([\d.]+).*$/, "$1"),
    Suning: () => u.replace(/^.*SNEBUY-APP([\d.]+).*$/, "$1"),
    iQiYi: () => u.replace(/^.*IqiyiVersion\/([\d.]+).*$/, "$1")
  };
  dest.version = "";
  if (version2[dest.browser]) {
    dest.version = version2[dest.browser]();
    if (dest.version === u) {
      dest.version = "";
    }
  }
  if (dest.version.indexOf(".")) {
    dest.version = dest.version.substring(0, dest.version.indexOf("."));
  }
  if (dest.os === "iOS" && u.includes("iPad")) {
    dest.os = "iPadOS";
  } else if (dest.browser === "Edge" && !u.includes("Edg")) {
    dest.engine = "EdgeHTML";
  } else if (dest.browser === "MIUI") {
    dest.os = "Android";
  } else if (dest.browser === "Chrome" && Number(dest.version) > 27) {
    dest.engine = "Blink";
  } else if (dest.browser === "Opera" && Number(dest.version) > 12) {
    dest.engine = "Blink";
  } else if (dest.browser === "Yandex") {
    dest.engine = "Blink";
  } else if (dest.browser === void 0) {
    dest.browser = "Unknow App";
  }
  return dest;
}
function check(conf, rules) {
  rules.forEach(({
    el,
    max: maxHeight,
    imgContains
  }) => {
    const _apply = () => {
      if (!el)
        return;
      if (!conf.scrollable)
        applyHeightLimit({ el, maxHeight, postBtnClick: conf.postExpandBtnClick });
      else
        applyScrollableHeightLimit({ el, maxHeight });
    };
    const _check = () => {
      if (el && getHeight(el) > maxHeight)
        _apply();
    };
    _check();
    if (imgContains && el)
      onImagesLoaded(el, () => _check());
  });
}
const HEIGHT_LIMIT_CSS = "atk-height-limit";
function applyHeightLimit(obj) {
  if (!obj.el)
    return;
  if (!obj.maxHeight)
    return;
  if (obj.el.classList.contains(HEIGHT_LIMIT_CSS))
    return;
  obj.el.classList.add(HEIGHT_LIMIT_CSS);
  obj.el.style.height = `${obj.maxHeight}px`;
  obj.el.style.overflow = "hidden";
  const $expandBtn = createElement(`<div class="atk-height-limit-btn">${t("readMore")}</span>`);
  $expandBtn.onclick = (e) => {
    e.stopPropagation();
    disposeHeightLimit(obj.el);
    if (obj.postBtnClick)
      obj.postBtnClick(e);
  };
  obj.el.append($expandBtn);
}
function disposeHeightLimit($el) {
  if (!$el)
    return;
  if (!$el.classList.contains(HEIGHT_LIMIT_CSS))
    return;
  $el.classList.remove(HEIGHT_LIMIT_CSS);
  Array.from($el.children).forEach((e) => {
    if (e.classList.contains("atk-height-limit-btn"))
      e.remove();
  });
  $el.style.height = "";
  $el.style.overflow = "";
}
const HEIGHT_LIMIT_SCROLL_CSS = "atk-height-limit-scroll";
function applyScrollableHeightLimit(obj) {
  if (!obj.el)
    return;
  if (obj.el.classList.contains(HEIGHT_LIMIT_SCROLL_CSS))
    return;
  obj.el.classList.add(HEIGHT_LIMIT_SCROLL_CSS);
  obj.el.style.height = `${obj.maxHeight}px`;
}
const CommentHTML = '<div class="atk-comment-wrap">\n  <div class="atk-comment">\n    <div class="atk-avatar"></div>\n    <div class="atk-main">\n      <div class="atk-header">\n        <span class="atk-item atk-nick"></span>\n        <span class="atk-badge-wrap"></span>\n        <span class="atk-item atk-date"></span>\n      </div>\n      <div class="atk-body">\n        <div class="atk-content"></div>\n      </div>\n      <div class="atk-footer">\n        <div class="atk-actions"></div>\n      </div>\n    </div>\n  </div>\n</div>\n';
function renderAvatar(r) {
  const $avatar = r.$el.querySelector(".atk-avatar");
  const $avatarImg = createElement("<img />");
  const avatarURLBuilder = r.opts.avatarURLBuilder;
  $avatarImg.src = avatarURLBuilder ? avatarURLBuilder(r.data) : r.comment.getGravatarURL();
  if (r.data.link) {
    const $avatarA = createElement('<a target="_blank" rel="noreferrer noopener nofollow"></a>');
    $avatarA.href = isValidURL(r.data.link) ? r.data.link : `https://${r.data.link}`;
    $avatarA.append($avatarImg);
    $avatar.append($avatarA);
  } else {
    $avatar.append($avatarImg);
  }
}
function renderHeader(r) {
  Object.entries({
    renderNick,
    renderVerifyBadge,
    renderDate,
    renderUABadge
  }).forEach(([name, render2]) => {
    render2(r);
  });
}
function renderNick(r) {
  r.$headerNick = r.$el.querySelector(".atk-nick");
  if (r.data.link) {
    const $nickA = createElement('<a target="_blank" rel="noreferrer noopener nofollow"></a>');
    $nickA.innerText = r.data.nick;
    $nickA.href = isValidURL(r.data.link) ? r.data.link : `https://${r.data.link}`;
    r.$headerNick.append($nickA);
  } else {
    r.$headerNick.innerText = r.data.nick;
  }
}
function renderVerifyBadge(ctx) {
  ctx.$headerBadgeWrap = ctx.$el.querySelector(".atk-badge-wrap");
  ctx.$headerBadgeWrap.innerHTML = "";
  const badgeText = ctx.data.badge_name;
  const badgeColor = ctx.data.badge_color;
  if (badgeText) {
    const $badge = createElement(`<span class="atk-badge"></span>`);
    $badge.innerText = badgeText.replace("管理员", t("admin"));
    $badge.style.backgroundColor = badgeColor || "";
    ctx.$headerBadgeWrap.append($badge);
  }
  if (ctx.data.is_pinned) {
    const $pinnedBadge = createElement(`<span class="atk-pinned-badge">${t("pin")}</span>`);
    ctx.$headerBadgeWrap.append($pinnedBadge);
  }
}
function renderDate(ctx) {
  const $date = ctx.$el.querySelector(".atk-date");
  $date.innerText = ctx.comment.getDateFormatted();
  $date.setAttribute("data-atk-comment-date", String(+new Date(ctx.data.date)));
}
function renderUABadge(ctx) {
  if (!ctx.opts.uaBadge && !ctx.data.ip_region)
    return;
  let $uaWrap = ctx.$header.querySelector("atk-ua-wrap");
  if (!$uaWrap) {
    $uaWrap = createElement(`<span class="atk-ua-wrap"></span>`);
    ctx.$header.append($uaWrap);
  }
  $uaWrap.innerHTML = "";
  if (ctx.data.ip_region) {
    const $regionBadge = createElement(`<span class="atk-region-badge"></span>`);
    $regionBadge.innerText = ctx.data.ip_region;
    $uaWrap.append($regionBadge);
  }
  if (ctx.opts.uaBadge) {
    const { browser, os } = ctx.comment.getUserUA();
    if (String(browser).trim()) {
      const $uaBrowser = createElement(`<span class="atk-ua ua-browser"></span>`);
      $uaBrowser.innerText = browser;
      $uaWrap.append($uaBrowser);
    }
    if (String(os).trim()) {
      const $usOS = createElement(`<span class="atk-ua ua-os"></span>`);
      $usOS.innerText = os;
      $uaWrap.append($usOS);
    }
  }
}
function renderContent(r) {
  if (!r.data.is_collapsed) {
    r.$content.innerHTML = r.comment.getContentMarked();
    r.$content.classList.remove("atk-hide", "atk-collapsed");
    return;
  }
  r.$content.classList.add("atk-hide", "atk-type-collapsed");
  const collapsedInfoEl = createElement(`
    <div class="atk-collapsed">
      <span class="atk-text">${t("collapsedMsg")}</span>
      <span class="atk-show-btn">${t("expand")}</span>
    </div>`);
  r.$body.insertAdjacentElement("beforeend", collapsedInfoEl);
  const contentShowBtn = collapsedInfoEl.querySelector(".atk-show-btn");
  contentShowBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (r.$content.classList.contains("atk-hide")) {
      r.$content.innerHTML = r.comment.getContentMarked();
      r.$content.classList.remove("atk-hide");
      playFadeInAnim(r.$content);
      contentShowBtn.innerText = t("collapse");
    } else {
      r.$content.innerHTML = "";
      r.$content.classList.add("atk-hide");
      contentShowBtn.innerText = t("expand");
    }
  });
}
function renderReplyAt(r) {
  if (r.opts.flatMode || r.data.rid === 0)
    return;
  if (!r.opts.replyTo)
    return;
  r.$replyAt = createElement(`<span class="atk-item atk-reply-at"><span class="atk-arrow"></span><span class="atk-nick"></span></span>`);
  r.$replyAt.querySelector(".atk-nick").innerText = `${r.opts.replyTo.nick}`;
  r.$replyAt.onclick = () => {
    r.comment.getActions().goToReplyComment();
  };
  r.$headerBadgeWrap.insertAdjacentElement("afterend", r.$replyAt);
}
function renderReplyTo(r) {
  if (!r.opts.flatMode)
    return;
  if (!r.opts.replyTo)
    return;
  r.$replyTo = createElement(`
    <div class="atk-reply-to">
      <div class="atk-meta">${t("reply")} <span class="atk-nick"></span>:</div>
      <div class="atk-content"></div>
    </div>`);
  const $nick = r.$replyTo.querySelector(".atk-nick");
  $nick.innerText = `@${r.opts.replyTo.nick}`;
  $nick.onclick = () => {
    r.comment.getActions().goToReplyComment();
  };
  let replyContent = marked(r.opts.replyTo.content);
  if (r.opts.replyTo.is_collapsed)
    replyContent = `[${t("collapsed")}]`;
  r.$replyTo.querySelector(".atk-content").innerHTML = replyContent;
  r.$body.prepend(r.$replyTo);
}
function renderPending(r) {
  if (!r.data.is_pending)
    return;
  const pendingEl = createElement(`<div class="atk-pending">${t("pendingMsg")}</div>`);
  r.$body.prepend(pendingEl);
}
class ActionBtn {
  // 确认消息复原定时器
  /** 构造函数 */
  constructor(opts) {
    __publicField(this, "opts");
    __publicField(this, "$el");
    __publicField(this, "isLoading", false);
    // 正在加载
    __publicField(this, "msgRecTimer");
    // 消息显示复原定时器
    __publicField(this, "msgRecTimerFunc");
    // 消息正在显示
    __publicField(this, "isConfirming", false);
    // 正在确认
    __publicField(this, "confirmRecTimer");
    this.$el = createElement(`<span class="atk-common-action-btn"></span>`);
    this.opts = typeof opts !== "object" ? { text: opts } : opts;
    this.$el.innerText = this.getText();
    if (this.opts.adminOnly)
      this.$el.setAttribute("atk-only-admin-show", "");
  }
  // 消息显示复原操作
  get isMessaging() {
    return !!this.msgRecTimer;
  }
  /** 将按钮装载到指定元素 */
  appendTo(dom) {
    dom.append(this.$el);
    return this;
  }
  /** 获取按钮文字（动态/静态） */
  getText() {
    return typeof this.opts.text === "string" ? this.opts.text : this.opts.text();
  }
  /** 设置点击事件 */
  setClick(func) {
    this.$el.onclick = (e) => {
      e.stopPropagation();
      if (this.isLoading) {
        return;
      }
      if (this.opts.confirm && !this.isMessaging) {
        const confirmRestore = () => {
          this.isConfirming = false;
          this.$el.classList.remove("atk-btn-confirm");
          this.$el.innerText = this.getText();
        };
        if (!this.isConfirming) {
          this.isConfirming = true;
          this.$el.classList.add("atk-btn-confirm");
          this.$el.innerText = this.opts.confirmText || t("actionConfirm");
          this.confirmRecTimer = window.setTimeout(() => confirmRestore(), 5e3);
          return;
        }
        if (this.confirmRecTimer)
          window.clearTimeout(this.confirmRecTimer);
        confirmRestore();
      }
      if (this.msgRecTimer) {
        this.fireMsgRecTimer();
        this.clearMsgRecTimer();
        return;
      }
      func();
    };
  }
  /** 文字刷新（动态/静态） */
  updateText(text) {
    if (text)
      this.opts.text = text;
    this.setLoading(false);
    this.$el.innerText = this.getText();
  }
  /** 设置加载状态 */
  setLoading(value, loadingText) {
    if (this.isLoading === value)
      return;
    this.isLoading = value;
    if (value) {
      this.$el.classList.add("atk-btn-loading");
      this.$el.innerText = loadingText || `${t("loading")}...`;
    } else {
      this.$el.classList.remove("atk-btn-loading");
      this.$el.innerText = this.getText();
    }
  }
  /** 错误消息 */
  setError(text) {
    this.setMsg(text, "atk-btn-error");
  }
  /** 警告消息 */
  setWarn(text) {
    this.setMsg(text, "atk-btn-warn");
  }
  /** 成功消息 */
  setSuccess(text) {
    this.setMsg(text, "atk-btn-success");
  }
  /** 设置消息 */
  setMsg(text, className, duringTime, after) {
    this.setLoading(false);
    if (className)
      this.$el.classList.add(className);
    this.$el.innerText = text;
    this.setMsgRecTimer(() => {
      this.$el.innerText = this.getText();
      if (className)
        this.$el.classList.remove(className);
      if (after)
        after();
    }, duringTime || 2500);
  }
  /** 设置消息复原操作定时器 */
  setMsgRecTimer(func, duringTime) {
    this.fireMsgRecTimer();
    this.clearMsgRecTimer();
    this.msgRecTimerFunc = func;
    this.msgRecTimer = window.setTimeout(() => {
      func();
      this.clearMsgRecTimer();
    }, duringTime);
  }
  /** 立刻触发器复原定时器 */
  fireMsgRecTimer() {
    if (this.msgRecTimerFunc)
      this.msgRecTimerFunc();
  }
  /** 仅清除 timer */
  clearMsgRecTimer() {
    if (this.msgRecTimer)
      window.clearTimeout(this.msgRecTimer);
    this.msgRecTimer = void 0;
    this.msgRecTimerFunc = void 0;
  }
}
function renderActions(r) {
  Object.entries({
    renderVote,
    renderReply,
    // 管理员操作
    renderCollapse,
    renderModerator,
    renderPin,
    renderEdit,
    renderDel
  }).forEach(([name, render2]) => {
    render2(r);
  });
}
function renderVote(r) {
  if (!r.opts.vote)
    return;
  r.voteBtnUp = new ActionBtn(() => `${t("voteUp")} (${r.data.vote_up || 0})`).appendTo(r.$actions);
  r.voteBtnUp.setClick(() => {
    r.comment.getActions().vote("up");
  });
  if (r.opts.voteDown) {
    r.voteBtnDown = new ActionBtn(() => `${t("voteDown")} (${r.data.vote_down || 0})`).appendTo(r.$actions);
    r.voteBtnDown.setClick(() => {
      r.comment.getActions().vote("down");
    });
  }
}
function renderReply(r) {
  if (!r.data.is_allow_reply)
    return;
  const replyBtn = createElement(`<span>${t("reply")}</span>`);
  r.$actions.append(replyBtn);
  replyBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    r.opts.replyComment(r.data, r.$el);
  });
}
function renderCollapse(r) {
  const collapseBtn = new ActionBtn({
    text: () => r.data.is_collapsed ? t("expand") : t("collapse"),
    adminOnly: true
  });
  collapseBtn.appendTo(r.$actions);
  collapseBtn.setClick(() => {
    r.comment.getActions().adminEdit("collapsed", collapseBtn);
  });
}
function renderModerator(r) {
  const pendingBtn = new ActionBtn({
    text: () => r.data.is_pending ? t("pending") : t("approved"),
    adminOnly: true
  });
  pendingBtn.appendTo(r.$actions);
  pendingBtn.setClick(() => {
    r.comment.getActions().adminEdit("pending", pendingBtn);
  });
}
function renderPin(r) {
  const pinnedBtn = new ActionBtn({
    text: () => r.data.is_pinned ? t("unpin") : t("pin"),
    adminOnly: true
  });
  pinnedBtn.appendTo(r.$actions);
  pinnedBtn.setClick(() => {
    r.comment.getActions().adminEdit("pinned", pinnedBtn);
  });
}
function renderEdit(r) {
  const editBtn = new ActionBtn({
    text: t("edit"),
    adminOnly: true
  });
  editBtn.appendTo(r.$actions);
  editBtn.setClick(() => {
    r.opts.editComment(r.data, r.$el);
  });
}
function renderDel(r) {
  const delBtn = new ActionBtn({
    text: t("delete"),
    confirm: true,
    confirmText: t("deleteConfirm"),
    adminOnly: true
  });
  delBtn.appendTo(r.$actions);
  delBtn.setClick(() => {
    r.comment.getActions().adminDelete(delBtn);
  });
}
const Renders = {
  Avatar: renderAvatar,
  Header: renderHeader,
  Content: renderContent,
  ReplyAt: renderReplyAt,
  ReplyTo: renderReplyTo,
  Pending: renderPending,
  Actions: renderActions
};
function loadRenders(r) {
  Object.entries(Renders).forEach(([name, render2]) => {
    render2(r);
  });
}
class Render {
  // 回复 AT（层级嵌套下显示）
  constructor(comment) {
    __publicField(this, "comment");
    __publicField(this, "$el");
    __publicField(this, "$main");
    __publicField(this, "$header");
    __publicField(this, "$headerNick");
    __publicField(this, "$headerBadgeWrap");
    __publicField(this, "$body");
    __publicField(this, "$content");
    __publicField(this, "$childrenWrap");
    __publicField(this, "$actions");
    __publicField(this, "voteBtnUp");
    __publicField(this, "voteBtnDown");
    __publicField(this, "$replyTo");
    // 回复评论内容 (平铺下显示)
    __publicField(this, "$replyAt");
    this.comment = comment;
  }
  get data() {
    return this.comment.getData();
  }
  get opts() {
    return this.comment.getOpts();
  }
  /**
   * Render the comment ui
   *
   * If comment data is updated, call this method to re-render the comment ui.
   * The method will be called multiple times, so it should be idempotent.
   *
   * Renders may add event listeners to the comment ui, so it should be called only once or override the original.
   * Please be aware of the memory leak caused by the event listener.
   */
  render() {
    this.$el = createElement(CommentHTML);
    this.$main = this.$el.querySelector(".atk-main");
    this.$header = this.$el.querySelector(".atk-header");
    this.$body = this.$el.querySelector(".atk-body");
    this.$content = this.$body.querySelector(".atk-content");
    this.$actions = this.$el.querySelector(".atk-actions");
    this.$el.setAttribute("id", `atk-comment-${this.data.id}`);
    loadRenders(this);
    if (this.$childrenWrap) {
      this.$main.append(this.$childrenWrap);
    }
    return this.$el;
  }
  /** 内容限高检测 */
  checkHeightLimit() {
    const conf = this.opts.heightLimit;
    if (!conf || !conf.content || !conf.children)
      return;
    const contentMaxH = conf.content;
    const childrenMaxH = conf.children;
    check({
      postExpandBtnClick: () => {
        const children = this.comment.getChildren();
        if (children.length === 1)
          disposeHeightLimit(children[0].getRender().$content);
      },
      scrollable: conf.scrollable
    }, [
      // 评论内容限高
      { el: this.$content, max: contentMaxH, imgContains: true },
      { el: this.$replyTo, max: contentMaxH, imgContains: true },
      // 子评论区域限高（仅嵌套模式）
      { el: this.$childrenWrap, max: childrenMaxH, imgContains: false }
    ]);
  }
  /** 子评论区域移除限高 */
  heightLimitRemoveForChildren() {
    if (!this.$childrenWrap)
      return;
    disposeHeightLimit(this.$childrenWrap);
  }
  /** 渐出动画 */
  playFadeAnim() {
    playFadeInAnim(this.comment.getRender().$el);
  }
  /** 渐出动画 · 评论内容区域 */
  playFadeAnimForBody() {
    playFadeInAnim(this.comment.getRender().$body);
  }
  /** Perform the flash animation */
  playFlashAnim() {
    this.$el.classList.remove("atk-flash-once");
    window.setTimeout(() => {
      this.$el.classList.add("atk-flash-once");
    }, 150);
  }
  /** 获取子评论 Wrap */
  getChildrenWrap() {
    if (!this.$childrenWrap) {
      this.$childrenWrap = createElement('<div class="atk-comment-children"></div>');
      this.$main.append(this.$childrenWrap);
    }
    return this.$childrenWrap;
  }
  /** 设置已读 */
  setUnread(val) {
    if (val)
      this.$el.classList.add("atk-unread");
    else
      this.$el.classList.remove("atk-unread");
  }
  /** 设置为可点击的评论 */
  setOpenable(val) {
    if (val)
      this.$el.classList.add("atk-openable");
    else
      this.$el.classList.remove("atk-openable");
  }
  /** 设置点击评论打开置顶 URL */
  setOpenURL(url) {
    this.setOpenable(true);
    this.$el.onclick = (evt) => {
      evt.stopPropagation();
      window.open(url);
    };
  }
  /** 设置点击评论时的操作 */
  setOpenAction(action) {
    this.setOpenable(true);
    this.$el.onclick = (evt) => {
      evt.stopPropagation();
      action();
    };
  }
}
class CommentActions {
  constructor(comment) {
    __publicField(this, "comment");
    this.comment = comment;
  }
  get data() {
    return this.comment.getData();
  }
  get opts() {
    return this.comment.getOpts();
  }
  getApi() {
    return this.comment.getOpts().getApi();
  }
  /** 投票操作 */
  vote(type) {
    const actionBtn = type === "up" ? this.comment.getRender().voteBtnUp : this.comment.getRender().voteBtnDown;
    this.getApi().votes.vote(`comment_${type}`, this.data.id, __spreadValues({}, this.getApi().getUserFields())).then((res) => {
      var _a, _b;
      this.data.vote_up = res.data.up;
      this.data.vote_down = res.data.down;
      (_a = this.comment.getRender().voteBtnUp) == null ? void 0 : _a.updateText();
      (_b = this.comment.getRender().voteBtnDown) == null ? void 0 : _b.updateText();
    }).catch((err) => {
      actionBtn == null ? void 0 : actionBtn.setError(t("voteFail"));
      console.log(err);
    });
  }
  /** 管理员 - 评论状态修改 */
  adminEdit(type, btnElem) {
    if (btnElem.isLoading)
      return;
    btnElem.setLoading(true, `${t("editing")}...`);
    const modify = __spreadValues({}, this.data);
    if (type === "collapsed") {
      modify.is_collapsed = !modify.is_collapsed;
    } else if (type === "pending") {
      modify.is_pending = !modify.is_pending;
    } else if (type === "pinned") {
      modify.is_pinned = !modify.is_pinned;
    }
    this.getApi().comments.updateComment(this.data.id, __spreadValues({}, modify)).then((res) => {
      btnElem.setLoading(false);
      this.comment.setData(res.data);
    }).catch((err) => {
      console.error(err);
      btnElem.setError(t("editFail"));
    });
  }
  /** 管理员 - 评论删除 */
  adminDelete(btnElem) {
    if (btnElem.isLoading)
      return;
    btnElem.setLoading(true, `${t("deleting")}...`);
    this.getApi().comments.deleteComment(this.data.id).then(() => {
      btnElem.setLoading(false);
      if (this.opts.onDelete)
        this.opts.onDelete(this.comment);
    }).catch((e) => {
      console.error(e);
      btnElem.setError(t("deleteFail"));
    });
  }
  /** 快速跳转到该评论 */
  goToReplyComment() {
    const origHash = window.location.hash;
    const modifyHash = `#atk-comment-${this.data.rid}`;
    window.location.hash = modifyHash;
    if (modifyHash === origHash)
      window.dispatchEvent(new Event("hashchange"));
  }
}
class CommentNode {
  // 当前嵌套层数
  constructor(data, opts) {
    __publicField(this, "$el");
    __publicField(this, "renderInstance");
    __publicField(this, "actionInstance");
    __publicField(this, "data");
    __publicField(this, "opts");
    __publicField(this, "parent");
    __publicField(this, "children", []);
    __publicField(this, "nestCurt");
    this.opts = opts;
    this.data = __spreadValues({}, data);
    this.data.date = this.data.date.replace(/-/g, "/");
    this.parent = null;
    this.nestCurt = 1;
    this.actionInstance = new CommentActions(this);
    this.renderInstance = new Render(this);
  }
  /** 渲染 UI */
  render() {
    const newEl = this.renderInstance.render();
    if (this.$el)
      this.$el.replaceWith(newEl);
    this.$el = newEl;
    if (this.opts.onAfterRender)
      this.opts.onAfterRender();
  }
  /** 获取评论操作实例对象 */
  getActions() {
    return this.actionInstance;
  }
  /** 获取评论渲染器实例对象 */
  getRender() {
    return this.renderInstance;
  }
  /** 获取评论数据 */
  getData() {
    return this.data;
  }
  /** 设置数据 */
  setData(data) {
    this.data = data;
    this.render();
    this.getRender().playFadeAnimForBody();
  }
  /** 获取父评论 */
  getParent() {
    return this.parent;
  }
  /** 获取所有子评论 */
  getChildren() {
    return this.children;
  }
  /** 获取当前嵌套层数 */
  getNestCurt() {
    return this.nestCurt;
  }
  /** 判断是否为根评论 */
  getIsRoot() {
    return this.data.rid === 0;
  }
  /** 获取评论 ID */
  getID() {
    return this.data.id;
  }
  /** 置入子评论 */
  putChild(childNode, insertMode = "append") {
    childNode.parent = this;
    childNode.nestCurt = this.nestCurt + 1;
    this.children.push(childNode);
    const $childrenWrap = this.getChildrenWrapEl();
    const $childComment = childNode.getEl();
    if (insertMode === "append")
      $childrenWrap.append($childComment);
    else if (insertMode === "prepend")
      $childrenWrap.prepend($childComment);
    childNode.getRender().playFadeAnim();
    childNode.getRender().checkHeightLimit();
  }
  /** 获取存放子评论的元素对象 */
  getChildrenWrapEl() {
    if (this.nestCurt >= this.opts.nestMax) {
      return this.parent.getChildrenWrapEl();
    }
    return this.getRender().getChildrenWrap();
  }
  /** 获取所有父评论 */
  getParents() {
    const flattenParents = [];
    let parent = this.parent;
    while (parent) {
      flattenParents.push(parent);
      parent = parent.getParent();
    }
    return flattenParents;
  }
  /**
   * Get the element of the comment
   *
   * The `getEl()` will always return the latest $el after calling `render()`.
   * Please be aware of the memory leak if you use the $el reference directly.
   */
  getEl() {
    if (!this.$el)
      throw new Error("comment element not initialized before `getEl()`");
    return this.$el;
  }
  /**
   * Focus on the comment
   *
   * Scroll to the comment and perform flash animation
   */
  focus() {
    if (!this.$el)
      throw new Error("comment element not initialized before `focus()`");
    this.getParents().forEach((p) => {
      p.getRender().heightLimitRemoveForChildren();
    });
    this.scrollIntoView();
    this.getRender().playFlashAnim();
  }
  scrollIntoView() {
    this.$el && scrollIntoView(this.$el, false, this.opts.scrollRelativeTo && this.opts.scrollRelativeTo());
  }
  /**
   * Remove the comment node
   */
  remove() {
    var _a;
    (_a = this.$el) == null ? void 0 : _a.remove();
  }
  /** 获取 Gravatar 头像 URL */
  getGravatarURL() {
    return getGravatarURL({
      mirror: this.opts.gravatar.mirror,
      params: this.opts.gravatar.params,
      emailMD5: this.data.email_encrypted
    });
  }
  /** 获取评论 markdown 解析后的内容 */
  getContentMarked() {
    return marked(this.data.content);
  }
  /** 获取格式化后的日期 */
  getDateFormatted() {
    return timeAgo(new Date(this.data.date), t);
  }
  /** 获取用户 UserAgent 信息 */
  getUserUA() {
    const info = Detect(this.data.ua);
    return {
      browser: `${info.browser} ${info.version}`,
      os: `${info.os} ${info.osVersion}`
    };
  }
  /** 获取配置 */
  getOpts() {
    return this.opts;
  }
}
function createCommentNode(ctx, comment, replyComment, opts) {
  const instance2 = new CommentNode(comment, {
    onAfterRender: () => {
      ctx.trigger("comment-rendered", instance2);
    },
    onDelete: (c) => {
      ctx.getData().deleteComment(c.getID());
    },
    replyTo: replyComment,
    // TODO simplify reference
    flatMode: typeof (opts == null ? void 0 : opts.forceFlatMode) === "boolean" ? opts == null ? void 0 : opts.forceFlatMode : ctx.conf.flatMode,
    gravatar: ctx.conf.gravatar,
    nestMax: ctx.conf.nestMax,
    heightLimit: ctx.conf.heightLimit,
    avatarURLBuilder: ctx.conf.avatarURLBuilder,
    scrollRelativeTo: ctx.conf.scrollRelativeTo,
    vote: ctx.conf.vote,
    voteDown: ctx.conf.voteDown,
    uaBadge: ctx.conf.uaBadge,
    // TODO: move to plugin folder and remove from core
    getApi: () => ctx.getApi(),
    replyComment: (c, $el) => ctx.replyComment(c, $el),
    editComment: (c, $el) => ctx.editComment(c, $el)
  });
  instance2.render();
  return instance2;
}
class ReadMoreBtn {
  constructor(opts) {
    __publicField(this, "opts");
    __publicField(this, "$el");
    __publicField(this, "$loading");
    __publicField(this, "$text");
    __publicField(this, "offset", 0);
    __publicField(this, "total", 0);
    __publicField(this, "origText", "Load More");
    this.opts = opts;
    this.origText = this.opts.text || this.origText;
    this.$el = createElement(
      `<div class="atk-list-read-more" style="display: none;">
      <div class="atk-list-read-more-inner">
        <div class="atk-loading-icon" style="display: none;"></div>
        <span class="atk-text">${this.origText}</span>
      </div>
    </div>`
    );
    this.$loading = this.$el.querySelector(".atk-loading-icon");
    this.$text = this.$el.querySelector(".atk-text");
    this.$el.onclick = () => {
      this.click();
    };
  }
  /** 是否有更多内容 */
  get hasMore() {
    return this.total > this.offset + this.opts.pageSize;
  }
  click() {
    if (this.hasMore)
      this.opts.onClick(this.offset + this.opts.pageSize);
    this.checkDisabled();
  }
  /** 显示 */
  show() {
    this.$el.style.display = "";
  }
  /** 隐藏 */
  hide() {
    this.$el.style.display = "none";
  }
  /** 加载 */
  setLoading(isLoading) {
    this.$loading.style.display = isLoading ? "" : "none";
    this.$text.style.display = isLoading ? "none" : "";
  }
  /** 错误提示 */
  showErr(errMsg) {
    this.setLoading(false);
    this.$text.innerText = errMsg;
    this.$el.classList.add("atk-err");
    window.setTimeout(() => {
      this.$text.innerText = this.origText;
      this.$el.classList.remove("atk-err");
    }, 2e3);
  }
  /** 更新数据 */
  update(offset, total) {
    this.offset = offset;
    this.total = total;
    this.checkDisabled();
  }
  checkDisabled() {
    if (this.hasMore)
      this.show();
    else
      this.hide();
  }
}
class ReadMorePaginator {
  constructor() {
    __publicField(this, "instance");
    __publicField(this, "onReachedBottom", null);
    __publicField(this, "opt");
  }
  create(opt) {
    this.opt = opt;
    this.instance = new ReadMoreBtn({
      pageSize: opt.pageSize,
      onClick: (o) => __async(this, null, function* () {
        opt.ctx.fetch({
          offset: o
        });
      }),
      text: t("loadMore")
    });
    if (opt.readMoreAutoLoad) {
      this.onReachedBottom = () => {
        if (!this.instance.hasMore || this.opt.ctx.getData().getLoading())
          return;
        this.instance.click();
      };
      this.opt.ctx.on("list-reach-bottom", this.onReachedBottom);
    }
    return this.instance.$el;
  }
  setLoading(val) {
    this.instance.setLoading(val);
  }
  update(offset, total) {
    this.instance.update(offset, total);
  }
  showErr(msg) {
    this.instance.showErr(msg);
  }
  next() {
    this.instance.click();
  }
  getHasMore() {
    return this.instance.hasMore;
  }
  getIsClearComments(params) {
    return params.offset === 0;
  }
  dispose() {
    this.onReachedBottom && this.opt.ctx.off("list-reach-bottom", this.onReachedBottom);
    this.instance.$el.remove();
  }
}
class Pagination {
  constructor(total, opts) {
    __publicField(this, "opts");
    __publicField(this, "total");
    __publicField(this, "$el");
    __publicField(this, "$input");
    __publicField(this, "inputTimer");
    __publicField(this, "$prevBtn");
    __publicField(this, "$nextBtn");
    __publicField(this, "page", 1);
    this.total = total;
    this.opts = opts;
    this.$el = createElement(
      `<div class="atk-pagination-wrap">
        <div class="atk-pagination">
          <div class="atk-btn atk-btn-prev" aria-label="Previous page">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="M217.9 256L345 129c9.4-9.4 9.4-24.6 0-33.9-9.4-9.4-24.6-9.3-34 0L167 239c-9.1 9.1-9.3 23.7-.7 33.1L310.9 417c4.7 4.7 10.9 7 17 7s12.3-2.3 17-7c9.4-9.4 9.4-24.6 0-33.9L217.9 256z"></path></svg>
          </div>
          <input type="text" class="atk-input" aria-label="Enter the number of page" />
          <div class="atk-btn atk-btn-next" aria-label="Next page">
            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="14px" width="14px" xmlns="http://www.w3.org/2000/svg"><path d="M294.1 256L167 129c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.3 34 0L345 239c9.1 9.1 9.3 23.7.7 33.1L201.1 417c-4.7 4.7-10.9 7-17 7s-12.3-2.3-17-7c-9.4-9.4-9.4-24.6 0-33.9l127-127.1z"></path></svg>
          </div>
        </div>
      </div>`
    );
    this.$input = this.$el.querySelector(".atk-input");
    this.$input.value = `${this.page}`;
    this.$input.oninput = () => this.input();
    this.$input.onkeydown = (e) => this.keydown(e);
    this.$prevBtn = this.$el.querySelector(".atk-btn-prev");
    this.$nextBtn = this.$el.querySelector(".atk-btn-next");
    this.$prevBtn.onclick = () => this.prev();
    this.$nextBtn.onclick = () => this.next();
    this.checkDisabled();
  }
  get pageSize() {
    return this.opts.pageSize;
  }
  get offset() {
    return this.pageSize * (this.page - 1);
  }
  get maxPage() {
    return Math.ceil(this.total / this.pageSize);
  }
  update(offset, total) {
    this.page = Math.ceil(offset / this.pageSize) + 1;
    this.total = total;
    this.setInput(this.page);
    this.checkDisabled();
  }
  setInput(page) {
    this.$input.value = `${page}`;
  }
  input(now = false) {
    window.clearTimeout(this.inputTimer);
    const value = this.$input.value.trim();
    const modify = () => {
      if (value === "") {
        this.setInput(this.page);
        return;
      }
      let page = Number(value);
      if (Number.isNaN(page)) {
        this.setInput(this.page);
        return;
      }
      if (page < 1) {
        this.setInput(this.page);
        return;
      }
      if (page > this.maxPage) {
        this.setInput(this.maxPage);
        page = this.maxPage;
      }
      this.change(page);
    };
    if (!now)
      this.inputTimer = window.setTimeout(() => modify(), 800);
    else
      modify();
  }
  prev() {
    const page = this.page - 1;
    if (page < 1) {
      return;
    }
    this.change(page);
  }
  next() {
    const page = this.page + 1;
    if (page > this.maxPage) {
      return;
    }
    this.change(page);
  }
  getHasMore() {
    return this.page + 1 <= this.maxPage;
  }
  change(page) {
    this.page = page;
    this.opts.onChange(this.offset);
    this.setInput(page);
    this.checkDisabled();
  }
  checkDisabled() {
    if (this.page + 1 > this.maxPage) {
      this.$nextBtn.classList.add("atk-disabled");
    } else {
      this.$nextBtn.classList.remove("atk-disabled");
    }
    if (this.page - 1 < 1) {
      this.$prevBtn.classList.add("atk-disabled");
    } else {
      this.$prevBtn.classList.remove("atk-disabled");
    }
  }
  keydown(e) {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 38) {
      const page = Number(this.$input.value) + 1;
      if (page > this.maxPage) {
        return;
      }
      this.setInput(page);
      this.input();
    } else if (keyCode === 40) {
      const page = Number(this.$input.value) - 1;
      if (page < 1) {
        return;
      }
      this.setInput(page);
      this.input();
    } else if (keyCode === 13) {
      this.input(true);
    }
  }
  /** 加载 */
  setLoading(isLoading) {
    if (isLoading)
      showLoading(this.$el);
    else
      hideLoading(this.$el);
  }
}
class UpDownPaginator {
  constructor() {
    __publicField(this, "instance");
  }
  create(opt) {
    this.instance = new Pagination(opt.total, {
      pageSize: opt.pageSize,
      onChange: (o) => __async(this, null, function* () {
        opt.ctx.editorResetState();
        opt.ctx.fetch({
          offset: o,
          onSuccess: () => {
            opt.ctx.listGotoFirst();
          }
        });
      })
    });
    return this.instance.$el;
  }
  setLoading(val) {
    this.instance.setLoading(val);
  }
  update(offset, total) {
    this.instance.update(offset, total);
  }
  next() {
    this.instance.next();
  }
  getHasMore() {
    return this.instance.getHasMore();
  }
  getIsClearComments() {
    return true;
  }
  dispose() {
    this.instance.$el.remove();
  }
}
function createPaginatorByConf(conf) {
  if (conf.pagination.readMore)
    return new ReadMorePaginator();
  return new UpDownPaginator();
}
function getPageDataByLastData(ctx) {
  const last = ctx.getData().getListLastFetch();
  const r = { offset: 0, total: 0 };
  if (!last)
    return r;
  r.offset = last.params.offset;
  if (last.data)
    r.total = last.params.flatMode ? last.data.count : last.data.roots_count;
  return r;
}
const initListPaginatorFunc = (ctx) => {
  let paginator = null;
  ctx.watchConf(["pagination", "locale"], (conf) => {
    const list = ctx.get("list");
    if (paginator)
      paginator.dispose();
    paginator = createPaginatorByConf(conf);
    const { offset, total } = getPageDataByLastData(ctx);
    const $paginator = paginator.create({
      ctx,
      pageSize: conf.pagination.pageSize,
      total,
      readMoreAutoLoad: conf.pagination.autoLoad
    });
    list.$commentsWrap.after($paginator);
    paginator == null ? void 0 : paginator.update(offset, total);
  });
  ctx.on("list-loaded", (comments) => {
    const { offset, total } = getPageDataByLastData(ctx);
    paginator == null ? void 0 : paginator.update(offset, total);
  });
  ctx.on("list-fetch", (params) => {
    if (ctx.getData().getComments().length > 0 && (paginator == null ? void 0 : paginator.getIsClearComments(params))) {
      ctx.getData().clearComments();
    }
  });
  ctx.on("list-failed", () => {
    var _a;
    (_a = paginator == null ? void 0 : paginator.showErr) == null ? void 0 : _a.call(paginator, t("loadFail"));
  });
  ctx.on("list-fetch", (params) => {
    paginator == null ? void 0 : paginator.setLoading(true);
  });
  ctx.on("list-fetched", ({ params }) => {
    paginator == null ? void 0 : paginator.setLoading(false);
  });
};
class List extends Component {
  constructor(ctx) {
    super(ctx);
    /** 列表评论集区域元素 */
    __publicField(this, "$commentsWrap");
    __publicField(this, "commentNodes", []);
    this.$el = createElement(ListHTML);
    this.$commentsWrap = this.$el.querySelector(".atk-list-comments-wrap");
    initListPaginatorFunc(ctx);
    this.initCrudEvents();
  }
  getCommentsWrapEl() {
    return this.$commentsWrap;
  }
  getCommentNodes() {
    return this.commentNodes;
  }
  getListLayout({ forceFlatMode } = {}) {
    return new ListLayout({
      $commentsWrap: this.$commentsWrap,
      nestSortBy: this.ctx.conf.nestSort,
      nestMax: this.ctx.conf.nestMax,
      flatMode: typeof forceFlatMode === "boolean" ? forceFlatMode : this.ctx.conf.flatMode,
      // flatMode must be boolean because it had been handled when Artalk.init
      createCommentNode: (d, r) => {
        const node = createCommentNode(this.ctx, d, r, { forceFlatMode });
        this.commentNodes.push(node);
        return node;
      },
      findCommentNode: (id) => this.commentNodes.find((c) => c.getID() === id)
    });
  }
  initCrudEvents() {
    this.ctx.on("list-load", (comments) => {
      this.getListLayout().import(comments);
    });
    this.ctx.on("list-loaded", (comments) => {
      if (comments.length === 0) {
        this.commentNodes = [];
        this.$commentsWrap.innerHTML = "";
      }
    });
    this.ctx.on("comment-inserted", (comment) => {
      this.getListLayout().insert(comment);
    });
    this.ctx.on("comment-deleted", (comment) => {
      const node = this.commentNodes.find((c) => c.getID() === comment.id);
      if (!node) {
        console.error(`comment node id=${comment.id} not found`);
        return;
      }
      node.remove();
      this.commentNodes = this.commentNodes.filter((c) => c.getID() !== comment.id);
    });
    this.ctx.on("comment-updated", (comment) => {
      const node = this.commentNodes.find((c) => c.getID() === comment.id);
      node && node.setData(comment);
    });
  }
}
let bodyOrgOverflow;
let bodyOrgPaddingRight;
function getScrollbarHelper() {
  return {
    init() {
      bodyOrgOverflow = document.body.style.overflow;
      bodyOrgPaddingRight = document.body.style.paddingRight;
    },
    unlock() {
      document.body.style.overflow = bodyOrgOverflow;
      document.body.style.paddingRight = bodyOrgPaddingRight;
    },
    lock() {
      document.body.style.overflow = "hidden";
      const barPaddingRight = parseInt(window.getComputedStyle(document.body, null).getPropertyValue("padding-right"), 10);
      document.body.style.paddingRight = `${getScrollBarWidth() + barPaddingRight || 0}px`;
    }
  };
}
class Layer {
  constructor($el, opts) {
    __publicField(this, "allowMaskClose", true);
    __publicField(this, "onAfterHide");
    this.$el = $el;
    this.opts = opts;
  }
  setOnAfterHide(func) {
    this.onAfterHide = func;
  }
  setAllowMaskClose(allow) {
    this.allowMaskClose = allow;
  }
  getAllowMaskClose() {
    return this.allowMaskClose;
  }
  getEl() {
    return this.$el;
  }
  show() {
    this.opts.onShow();
    this.$el.style.display = "";
  }
  hide() {
    return __async(this, null, function* () {
      this.opts.onHide();
      this.$el.style.display = "none";
      this.onAfterHide && this.onAfterHide();
    });
  }
  destroy() {
    return __async(this, null, function* () {
      this.opts.onHide();
      this.$el.remove();
      this.onAfterHide && this.onAfterHide();
    });
  }
}
class LayerWrap {
  constructor() {
    __publicField(this, "$wrap");
    __publicField(this, "$mask");
    __publicField(this, "items", []);
    this.$wrap = createElement(
      `<div class="atk-layer-wrap" style="display: none;"><div class="atk-layer-mask"></div></div>`
    );
    this.$mask = this.$wrap.querySelector(".atk-layer-mask");
  }
  createItem(name, el) {
    el = el || this.createItemElement(name);
    el.setAttribute("data-layer-name", name);
    this.$wrap.appendChild(el);
    const layer = new Layer(el, {
      onHide: () => this.hideWrap(el),
      onShow: () => this.showWrap()
    });
    this.getMask().addEventListener("click", () => {
      layer.getAllowMaskClose() && layer.hide();
    });
    this.items.push(layer);
    return layer;
  }
  createItemElement(name) {
    const el = document.createElement("div");
    el.classList.add("atk-layer-item");
    el.style.display = "none";
    this.$wrap.appendChild(el);
    return el;
  }
  getWrap() {
    return this.$wrap;
  }
  getMask() {
    return this.$mask;
  }
  showWrap() {
    this.$wrap.style.display = "block";
    this.$mask.style.display = "block";
    this.$mask.classList.add("atk-fade-in");
    getScrollbarHelper().lock();
  }
  hideWrap($el) {
    if (this.items.map((l) => l.getEl()).filter((e) => e !== $el && e.isConnected && e.style.display !== "none").length > 0) {
      return;
    }
    const onHide = () => {
      this.$wrap.style.display = "none";
      this.$wrap.classList.remove("atk-fade-out");
      getScrollbarHelper().unlock();
      this.$wrap.onanimationend = null;
    };
    this.$wrap.classList.add("atk-fade-out");
    if (window.getComputedStyle(this.$wrap)["animation-name"] !== "none") {
      this.$wrap.onanimationend = () => onHide();
    } else {
      onHide();
    }
  }
}
class LayerManager {
  constructor(ctx) {
    __publicField(this, "wrap");
    this.wrap = new LayerWrap();
    document.body.appendChild(this.wrap.getWrap());
    ctx.on("unmounted", () => {
      this.wrap.getWrap().remove();
    });
    getScrollbarHelper().init();
  }
  getEl() {
    return this.wrap.getWrap();
  }
  create(name, el) {
    return this.wrap.createItem(name, el);
  }
}
const LOCAL_USER_KEY = "ArtalkUser";
class User {
  constructor(opts) {
    __publicField(this, "data");
    this.opts = opts;
    const localUser = JSON.parse(window.localStorage.getItem(LOCAL_USER_KEY) || "{}");
    this.data = {
      nick: localUser.nick || "",
      email: localUser.email || "",
      link: localUser.link || "",
      token: localUser.token || "",
      isAdmin: localUser.isAdmin || false
    };
  }
  getData() {
    return this.data;
  }
  /** Update user data and save to localStorage */
  update(obj = {}) {
    Object.entries(obj).forEach(([key, value]) => {
      this.data[key] = value;
    });
    window.localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(this.data));
    this.opts.onUserChanged && this.opts.onUserChanged(this.data);
  }
  /**
   * Logout
   *
   * @description Logout will clear login status, but not clear user data (nick, email, link)
   */
  logout() {
    this.update({
      token: "",
      isAdmin: false
    });
  }
  /** Check if user has filled basic data */
  checkHasBasicUserInfo() {
    return !!this.data.nick && !!this.data.email;
  }
}
const services = {
  // I18n
  i18n(ctx) {
    setLocale(ctx.conf.locale);
    ctx.watchConf(["locale"], (conf) => {
      setLocale(conf.locale);
    });
  },
  // User Store
  user(ctx) {
    const user = new User({
      onUserChanged: (data) => {
        ctx.trigger("user-changed", data);
      }
    });
    return user;
  },
  // 弹出层
  layerManager(ctx) {
    return new LayerManager(ctx);
  },
  // CheckerLauncher
  checkerLauncher(ctx) {
    const checkerLauncher = new CheckerLauncher({
      getCtx: () => ctx,
      getApi: () => ctx.getApi(),
      onReload: () => ctx.reload(),
      // make sure suffix with a slash, because it will be used as a base url when call `fetch`
      getCaptchaIframeURL: () => `${ctx.conf.server}/api/v2/captcha/?t=${+/* @__PURE__ */ new Date()}`
    });
    return checkerLauncher;
  },
  // 编辑器
  editor(ctx) {
    const editor = new Editor(ctx);
    ctx.$root.appendChild(editor.$el);
    return editor;
  },
  // 评论列表
  list(ctx) {
    const list = new List(ctx);
    ctx.$root.appendChild(list.$el);
    return list;
  },
  // 侧边栏 Layer
  sidebarLayer(ctx) {
    const sidebarLayer = new SidebarLayer(ctx);
    return sidebarLayer;
  },
  // Extra Service
  // -----------------------------------------
  // Only for type check
  // Not inject to ctx immediately,
  // but can be injected by other occasions
  editorPlugs() {
    return void 0;
  }
};
function showErrorDialog(opts) {
  const errEl = createElement(`<span><span class="error-message"></span><br/><br/></span>`);
  errEl.querySelector(".error-message").innerText = `${t("listLoadFailMsg")}
${opts.errMsg}`;
  if (opts.retryFn) {
    const $retryBtn = createElement(`<span style="cursor:pointer;">${t("listRetry")}</span>`);
    $retryBtn.onclick = () => opts.retryFn && opts.retryFn();
    errEl.appendChild($retryBtn);
  }
  if (opts.onOpenSidebar) {
    const $openSidebar = createElement(`<span atk-only-admin-show> | <span style="cursor:pointer;">${t("openName", { name: t("ctrlCenter") })}</span></span>`);
    errEl.appendChild($openSidebar);
    $openSidebar.onclick = () => opts.onOpenSidebar && opts.onOpenSidebar();
  }
  setError(opts.$err, errEl);
}
const ConfRemoter = (ctx) => {
  ctx.on("created", () => {
    if (ctx.conf.immediateFetch !== false)
      ctx.trigger("conf-fetch");
  });
  ctx.on("conf-fetch", () => {
    loadConf(ctx);
  });
};
function loadConf(ctx) {
  ctx.getApi().conf.conf().then((res) => {
    var _a;
    let conf = {
      apiVersion: (_a = res.data.version) == null ? void 0 : _a.version
      // version info
    };
    if (ctx.conf.useBackendConf) {
      if (!res.data.frontend_conf)
        throw new Error("The remote backend does not respond to the frontend conf, but `useBackendConf` conf is enabled");
      conf = __spreadValues(__spreadValues({}, conf), handleConfFormServer(res.data.frontend_conf));
    }
    ctx.conf.remoteConfModifier && ctx.conf.remoteConfModifier(conf);
    ctx.updateConf(conf);
  }).catch((err) => {
    var _a;
    ctx.updateConf({});
    let sidebarOpenView = "";
    if ((_a = err.data) == null ? void 0 : _a.err_no_site) {
      const viewLoadParam = { create_name: ctx.conf.site, create_urls: `${window.location.protocol}//${window.location.host}` };
      sidebarOpenView = `sites|${JSON.stringify(viewLoadParam)}`;
    }
    showErrorDialog({
      $err: ctx.get("list").$el,
      errMsg: err.msg || String(err),
      errData: err.data,
      retryFn: () => loadConf(ctx),
      onOpenSidebar: ctx.get("user").getData().isAdmin ? () => ctx.showSidebar({
        view: sidebarOpenView
      }) : void 0
      // only show open sidebar button when user is admin
    });
    console.error(err);
    throw err;
  }).then(() => {
    ctx.trigger("mounted");
  }).then(() => {
    if (ctx.conf.remoteConfModifier)
      return;
    ctx.fetch({ offset: 0 });
  }).catch(() => {
  });
}
const Markdown = (ctx) => {
  initMarked();
  ctx.on("updated", (conf) => {
    if (conf.markedReplacers)
      setReplacers(conf.markedReplacers);
  });
};
const LocalStorageKey = "ArtalkContent";
class LocalStorage extends EditorPlug {
  constructor(kit) {
    super(kit);
    const onContentUpdated = () => {
      this.save();
    };
    this.kit.useMounted(() => {
      const localContent = window.localStorage.getItem(LocalStorageKey) || "";
      if (localContent.trim() !== "") {
        this.kit.useEditor().showNotify(t("restoredMsg"), "i");
        this.kit.useEditor().setContent(localContent);
      }
      this.kit.useEvents().on("content-updated", onContentUpdated);
    });
    this.kit.useUnmounted(() => {
      this.kit.useEvents().off("content-updated", onContentUpdated);
    });
  }
  // Save editor content to localStorage
  save() {
    window.localStorage.setItem(LocalStorageKey, this.kit.useEditor().getContentRaw().trim());
  }
}
class Textarea extends EditorPlug {
  constructor(kit) {
    super(kit);
    const onKeydown = (e) => this.onKeydown(e);
    const onInput = () => this.onInput();
    this.kit.useMounted(() => {
      this.kit.useUI().$textarea.placeholder = this.kit.useConf().placeholder || t("placeholder");
      this.kit.useUI().$textarea.addEventListener("keydown", onKeydown);
      this.kit.useUI().$textarea.addEventListener("input", onInput);
    });
    this.kit.useUnmounted(() => {
      this.kit.useUI().$textarea.removeEventListener("keydown", onKeydown);
      this.kit.useUI().$textarea.removeEventListener("input", onInput);
    });
    this.kit.useEvents().on("content-updated", () => {
      window.setTimeout(() => {
        this.adaptiveHeightByContent();
      }, 80);
    });
  }
  // 按下 Tab 输入内容，而不是失去焦距
  onKeydown(e) {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 9) {
      e.preventDefault();
      this.kit.useEditor().insertContent("	");
    }
  }
  onInput() {
    this.kit.useEvents().trigger("content-updated", this.kit.useEditor().getContentRaw());
  }
  // Resize the textarea height by content
  adaptiveHeightByContent() {
    const diff = this.kit.useUI().$textarea.offsetHeight - this.kit.useUI().$textarea.clientHeight;
    this.kit.useUI().$textarea.style.height = "0px";
    this.kit.useUI().$textarea.style.height = `${this.kit.useUI().$textarea.scrollHeight + diff}px`;
  }
}
class SubmitBtn extends EditorPlug {
  constructor(kit) {
    super(kit);
    const onClick = () => {
      this.kit.useEditor().submit();
    };
    this.kit.useMounted(() => {
      this.kit.useUI().$submitBtn.innerText = this.kit.useConf().sendBtn || t("send");
      this.kit.useUI().$submitBtn.addEventListener("click", onClick);
    });
    this.kit.useUnmounted(() => {
      this.kit.useUI().$submitBtn.removeEventListener("click", onClick);
    });
  }
}
class SubmitAddPreset {
  constructor(kit) {
    this.kit = kit;
  }
  reqAdd() {
    return __async(this, null, function* () {
      const nComment = (yield this.kit.useApi().comments.createComment(__spreadValues({}, yield this.getSubmitAddParams()))).data;
      return nComment;
    });
  }
  getSubmitAddParams() {
    return __async(this, null, function* () {
      const { nick, email, link } = this.kit.useUser().getData();
      const conf = this.kit.useConf();
      return {
        content: this.kit.useEditor().getContentFinal(),
        name: nick,
        email,
        link,
        rid: 0,
        page_key: conf.pageKey,
        page_title: conf.pageTitle,
        site_name: conf.site,
        ua: yield getCorrectUserAgent()
        // Get the corrected UA
      };
    });
  }
  postSubmitAdd(commentNew) {
    this.kit.useGlobalCtx().getData().insertComment(commentNew);
  }
}
class Submit extends EditorPlug {
  constructor(kit) {
    super(kit);
    __publicField(this, "customs", []);
    __publicField(this, "defaultPreset");
    this.defaultPreset = new SubmitAddPreset(this.kit);
    const onEditorSubmit = () => this.do();
    this.kit.useMounted(() => {
      this.kit.useGlobalCtx().on("editor-submit", onEditorSubmit);
    });
    this.kit.useUnmounted(() => {
      this.kit.useGlobalCtx().off("editor-submit", onEditorSubmit);
    });
  }
  registerCustom(c) {
    this.customs.push(c);
  }
  do() {
    return __async(this, null, function* () {
      if (this.kit.useEditor().getContentFinal().trim() === "") {
        this.kit.useEditor().focus();
        return;
      }
      const custom = this.customs.find((o) => o.activeCond());
      this.kit.useEditor().showLoading();
      try {
        if (custom == null ? void 0 : custom.pre)
          custom.pre();
        let nComment;
        if (custom == null ? void 0 : custom.req)
          nComment = yield custom.req();
        else
          nComment = yield this.defaultPreset.reqAdd();
        if (custom == null ? void 0 : custom.post)
          custom.post(nComment);
        else
          this.defaultPreset.postSubmitAdd(nComment);
      } catch (err) {
        console.error(err);
        this.kit.useEditor().showNotify(`${t("commentFail")}: ${err.msg || String(err)}`, "e");
        return;
      } finally {
        this.kit.useEditor().hideLoading();
      }
      this.kit.useEditor().reset();
      this.kit.useGlobalCtx().trigger("editor-submitted");
    });
  }
}
class StateReply extends EditorPlug {
  constructor(kit) {
    super(kit);
    __publicField(this, "comment");
    this.useEditorStateEffect("reply", (commentData) => {
      this.setReply(commentData);
      return () => {
        this.cancelReply();
      };
    });
    this.kit.useEvents().on("mounted", () => {
      const submitPlug = this.kit.useDeps(Submit);
      if (!submitPlug)
        throw Error("SubmitPlug not initialized");
      const defaultPreset = new SubmitAddPreset(this.kit);
      submitPlug.registerCustom({
        activeCond: () => !!this.comment,
        // active this custom submit when reply mode
        req: () => __async(this, null, function* () {
          if (!this.comment)
            throw new Error("reply comment cannot be empty");
          const nComment = (yield this.kit.useApi().comments.createComment(__spreadProps(__spreadValues({}, yield defaultPreset.getSubmitAddParams()), {
            rid: this.comment.id,
            page_key: this.comment.page_key,
            page_title: void 0,
            site_name: this.comment.site_name
          }))).data;
          return nComment;
        }),
        post: (nComment) => {
          const conf = this.kit.useConf();
          if (nComment.page_key !== conf.pageKey) {
            window.open(`${nComment.page_url}#atk-comment-${nComment.id}`);
          }
          defaultPreset.postSubmitAdd(nComment);
        }
      });
    });
  }
  setReply(commentData) {
    const ui = this.kit.useUI();
    if (!ui.$sendReplyBtn) {
      const $btn = createElement(
        `<span class="atk-state-btn"><span class="atk-text-wrap">${t("reply")} <span class="atk-text"></span></span><span class="atk-cancel">×</span></span>`
      );
      $btn.querySelector(".atk-text").innerText = `@${commentData.nick}`;
      $btn.addEventListener("click", () => {
        this.kit.useEditor().resetState();
      });
      ui.$stateWrap.append($btn);
      ui.$sendReplyBtn = $btn;
    }
    this.comment = commentData;
    ui.$textarea.focus();
  }
  cancelReply() {
    if (!this.comment)
      return;
    const ui = this.kit.useUI();
    if (ui.$sendReplyBtn) {
      ui.$sendReplyBtn.remove();
      ui.$sendReplyBtn = void 0;
    }
    this.comment = void 0;
  }
}
class StateEdit extends EditorPlug {
  constructor(kit) {
    super(kit);
    __publicField(this, "comment");
    // -------------------------------------------------------------------
    //  Submit Btn Text Modifier
    // -------------------------------------------------------------------
    __publicField(this, "originalSubmitBtnText", "Send");
    this.useEditorStateEffect("edit", (comment) => {
      this.edit(comment);
      return () => {
        this.cancelEdit();
      };
    });
    this.kit.useMounted(() => {
      const submitPlug = this.kit.useDeps(Submit);
      if (!submitPlug)
        throw Error("SubmitPlug not initialized");
      submitPlug.registerCustom({
        activeCond: () => !!this.comment,
        // active this custom submit when edit mode
        req: () => __async(this, null, function* () {
          const saveData = {
            content: this.kit.useEditor().getContentFinal(),
            nick: this.kit.useUI().$nick.value,
            email: this.kit.useUI().$email.value,
            link: this.kit.useUI().$link.value
          };
          const comment = this.comment;
          const nComment = yield this.kit.useApi().comments.updateComment(comment.id, __spreadValues(__spreadValues({}, comment), saveData));
          return nComment.data;
        }),
        post: (nComment) => {
          this.kit.useGlobalCtx().getData().updateComment(nComment);
        }
      });
    });
  }
  edit(comment) {
    const ui = this.kit.useUI();
    if (!ui.$editCancelBtn) {
      const $btn = createElement(
        `<span class="atk-state-btn"><span class="atk-text-wrap">${t("editCancel")}</span><span class="atk-cancel">×</span></span>`
      );
      $btn.onclick = () => {
        this.kit.useEditor().resetState();
      };
      ui.$stateWrap.append($btn);
      ui.$editCancelBtn = $btn;
    }
    this.comment = comment;
    ui.$header.style.display = "none";
    ui.$nick.value = comment.nick || "";
    ui.$email.value = comment.email || "";
    ui.$link.value = comment.link || "";
    this.kit.useEditor().setContent(comment.content);
    ui.$textarea.focus();
    this.updateSubmitBtnText(t("save"));
  }
  cancelEdit() {
    if (!this.comment)
      return;
    const ui = this.kit.useUI();
    if (ui.$editCancelBtn) {
      ui.$editCancelBtn.remove();
      ui.$editCancelBtn = void 0;
    }
    this.comment = void 0;
    const { nick, email, link } = this.kit.useUser().getData();
    ui.$nick.value = nick;
    ui.$email.value = email;
    ui.$link.value = link;
    this.kit.useEditor().setContent("");
    this.restoreSubmitBtnText();
    ui.$header.style.display = "";
  }
  updateSubmitBtnText(text) {
    this.originalSubmitBtnText = this.kit.useUI().$submitBtn.innerText;
    this.kit.useUI().$submitBtn.innerText = text;
  }
  restoreSubmitBtnText() {
    this.kit.useUI().$submitBtn.innerText = this.originalSubmitBtnText;
  }
}
class Closable extends EditorPlug {
  constructor(kit) {
    super(kit);
    const onOpen = () => this.open();
    const onClose = () => this.close();
    this.kit.useMounted(() => {
      this.kit.useEvents().on("editor-open", onOpen);
      this.kit.useEvents().on("editor-close", onClose);
    });
    this.kit.useUnmounted(() => {
      this.kit.useEvents().off("editor-open", onOpen);
      this.kit.useEvents().off("editor-close", onClose);
    });
  }
  open() {
    var _a;
    (_a = this.kit.useUI().$textareaWrap.querySelector(".atk-comment-closed")) == null ? void 0 : _a.remove();
    this.kit.useUI().$textarea.style.display = "";
    this.kit.useUI().$bottom.style.display = "";
  }
  close() {
    if (!this.kit.useUI().$textareaWrap.querySelector(".atk-comment-closed"))
      this.kit.useUI().$textareaWrap.prepend(createElement(`<div class="atk-comment-closed">${t("onlyAdminCanReply")}</div>`));
    if (!this.kit.useUser().getData().isAdmin) {
      this.kit.useUI().$textarea.style.display = "none";
      this.kit.useEvents().trigger("panel-close");
      this.kit.useUI().$bottom.style.display = "none";
    } else {
      this.kit.useUI().$textarea.style.display = "";
      this.kit.useUI().$bottom.style.display = "";
    }
  }
}
class HeaderEvent extends EditorPlug {
  get $inputs() {
    return this.kit.useEditor().getHeaderInputEls();
  }
  constructor(kit) {
    super(kit);
    const inputEventFns = {};
    const changeEventFns = {};
    const trigger = (evt, $input, field) => () => {
      this.kit.useEvents().trigger(evt, { field, $input });
    };
    this.kit.useMounted(() => {
      Object.entries(this.$inputs).forEach(([key, $input]) => {
        $input.addEventListener("input", inputEventFns[key] = trigger("header-input", $input, key));
        $input.addEventListener("change", changeEventFns[key] = trigger("header-change", $input, key));
      });
    });
    this.kit.useUnmounted(() => {
      Object.entries(this.$inputs).forEach(([key, $input]) => {
        $input.removeEventListener("input", inputEventFns[key]);
        $input.removeEventListener("change", changeEventFns[key]);
      });
    });
  }
}
class HeaderUser extends EditorPlug {
  constructor(kit) {
    super(kit);
    __publicField(this, "query", {
      timer: null,
      abortFn: null
    });
    const onInput = ({ $input, field }) => {
      if (this.kit.useEditor().getState() === "edit")
        return;
      this.kit.useUser().update({ [field]: $input.value.trim() });
      if (field === "nick" || field === "email")
        this.fetchUserInfo();
    };
    this.kit.useMounted(() => {
      Object.entries(this.kit.useEditor().getHeaderInputEls()).forEach(([key, $input]) => {
        $input.placeholder = `${t(key)}`;
        $input.value = this.kit.useUser().getData()[key] || "";
      });
      this.kit.useEvents().on("header-input", onInput);
    });
    this.kit.useUnmounted(() => {
      this.kit.useEvents().off("header-input", onInput);
    });
  }
  /**
   * Fetch user info from server
   */
  fetchUserInfo() {
    this.kit.useUser().logout();
    if (this.query.timer)
      window.clearTimeout(this.query.timer);
    if (this.query.abortFn)
      this.query.abortFn();
    this.query.timer = window.setTimeout(() => {
      this.query.timer = null;
      const api = this.kit.useApi();
      const CANCEL_TOKEN = "getUserCancelToken";
      this.query.abortFn = () => api.abortRequest(CANCEL_TOKEN);
      api.user.getUser(__spreadValues({}, api.getUserFields()), {
        cancelToken: CANCEL_TOKEN
      }).then((res) => this.onUserInfoFetched(res.data)).catch((err) => {
      }).finally(() => {
        this.query.abortFn = null;
      });
    }, 400);
  }
  /**
   * Function called when user info fetched
   *
   * @param data The response data from server
   */
  onUserInfoFetched(data) {
    var _a;
    if (!data.is_login)
      this.kit.useUser().logout();
    this.kit.useGlobalCtx().getData().updateNotifies(data.notifies);
    if (this.kit.useUser().checkHasBasicUserInfo() && !data.is_login && ((_a = data.user) == null ? void 0 : _a.is_admin)) {
      this.kit.useGlobalCtx().checkAdmin({
        onSuccess: () => {
        }
      });
    }
    if (data.user && data.user.link) {
      this.kit.useUI().$link.value = data.user.link;
      this.kit.useUser().update({ link: data.user.link });
    }
  }
}
class HeaderLink extends EditorPlug {
  constructor(kit) {
    super(kit);
    const onLinkChange = ({ field }) => {
      if (field === "link")
        this.onLinkInputChange();
    };
    this.kit.useMounted(() => {
      this.kit.useEvents().on("header-change", onLinkChange);
    });
    this.kit.useUnmounted(() => {
      this.kit.useEvents().off("header-change", onLinkChange);
    });
  }
  onLinkInputChange() {
    const link = this.kit.useUI().$link.value.trim();
    if (!!link && !/^(http|https):\/\//.test(link)) {
      this.kit.useUI().$link.value = `https://${link}`;
      this.kit.useUser().update({ link: this.kit.useUI().$link.value });
    }
  }
}
class Emoticons extends EditorPlug {
  constructor(kit) {
    super(kit);
    __publicField(this, "emoticons", []);
    __publicField(this, "loadingTask", null);
    __publicField(this, "$grpWrap");
    __publicField(this, "$grpSwitcher");
    __publicField(this, "isListLoaded", false);
    __publicField(this, "isImgLoaded", false);
    this.kit.useMounted(() => {
      this.usePanel(`<div class="atk-editor-plug-emoticons"></div>`);
      this.useBtn(`<i aria-label="${t("emoticon")}"><svg fill="currentColor" aria-hidden="true" height="14" viewBox="0 0 14 14" width="14"><path d="m4.26829 5.29294c0-.94317.45893-1.7074 1.02439-1.7074.56547 0 1.02439.76423 1.02439 1.7074s-.45892 1.7074-1.02439 1.7074c-.56546 0-1.02439-.76423-1.02439-1.7074zm4.43903 1.7074c.56546 0 1.02439-.76423 1.02439-1.7074s-.45893-1.7074-1.02439-1.7074c-.56547 0-1.02439.76423-1.02439 1.7074s.45892 1.7074 1.02439 1.7074zm-1.70732 2.73184c-1.51883 0-2.06312-1.52095-2.08361-1.58173l-1.29551.43231c.03414.10244.868 2.51604 3.3798 2.51604 2.51181 0 3.34502-2.41291 3.37982-2.51604l-1.29484-.43573c-.02254.06488-.56683 1.58583-2.08498 1.58583zm7-2.73252c0 3.86004-3.1401 7.00034-7 7.00034s-7-3.1396-7-6.99966c0-3.86009 3.1401-7.00034 7-7.00034s7 3.14025 7 7.00034zm-1.3659 0c0-3.10679-2.5275-5.63442-5.6341-5.63442-3.10663 0-5.63415 2.52832-5.63415 5.6351 0 3.10676 2.52752 5.63446 5.63415 5.63446 3.1066 0 5.6341-2.5277 5.6341-5.63446z"/></svg></i>`);
    });
    this.kit.useUnmounted(() => {
    });
    this.useContentTransformer((raw) => this.transEmoticonImageText(raw));
    this.usePanelShow(() => {
      (() => __async(this, null, function* () {
        yield this.loadEmoticonsData();
        if (!this.isImgLoaded) {
          this.initEmoticonsList();
          this.isImgLoaded = true;
        }
        setTimeout(() => {
          this.changeListHeight();
        }, 30);
      }))();
    });
    this.usePanelHide(() => {
      this.$panel.parentElement.style.height = "";
    });
    window.setTimeout(() => {
      this.loadEmoticonsData();
    }, 1e3);
  }
  loadEmoticonsData() {
    return __async(this, null, function* () {
      if (this.isListLoaded)
        return;
      if (this.loadingTask !== null) {
        yield this.loadingTask;
        return;
      }
      this.loadingTask = (() => __async(this, null, function* () {
        showLoading(this.$panel);
        this.emoticons = yield this.handleData(this.kit.useConf().emoticons);
        hideLoading(this.$panel);
        this.loadingTask = null;
        this.isListLoaded = true;
      }))();
      yield this.loadingTask;
    });
  }
  handleData(data) {
    return __async(this, null, function* () {
      if (!Array.isArray(data) && ["object", "string"].includes(typeof data)) {
        data = [data];
      }
      if (!Array.isArray(data)) {
        setError(this.$panel, `[${t("emoticon")}] Data must be of Array/Object/String type`);
        hideLoading(this.$panel);
        return [];
      }
      const pushGrp = (grp) => {
        if (typeof grp !== "object")
          return;
        if (grp.name && data.find((o) => o.name === grp.name))
          return;
        data.push(grp);
      };
      const remoteLoad = (d) => __async(this, null, function* () {
        yield Promise.all(d.map((grp, index) => __async(this, null, function* () {
          if (typeof grp === "object" && !Array.isArray(grp)) {
            pushGrp(grp);
          } else if (Array.isArray(grp)) {
            yield remoteLoad(grp);
          } else if (typeof grp === "string") {
            const grpData = yield this.remoteLoad(grp);
            if (Array.isArray(grpData))
              yield remoteLoad(grpData);
            else if (typeof grpData === "object")
              pushGrp(grpData);
          }
        })));
      });
      yield remoteLoad(data);
      data.forEach((item) => {
        if (this.isOwOFormat(item)) {
          const c = this.convertOwO(item);
          c.forEach((grp) => {
            pushGrp(grp);
          });
        } else if (Array.isArray(item)) {
          item.forEach((grp) => {
            pushGrp(grp);
          });
        }
      });
      data = data.filter((item) => typeof item === "object" && !Array.isArray(item) && !!item && !!item.name);
      this.solveNullKey(data);
      this.solveSameKey(data);
      return data;
    });
  }
  /** 远程加载 */
  remoteLoad(url) {
    return __async(this, null, function* () {
      if (!url)
        return [];
      try {
        const resp = yield fetch(url);
        const json = yield resp.json();
        return json;
      } catch (err) {
        hideLoading(this.$panel);
        console.error("[Emoticons] Load Failed:", err);
        setError(this.$panel, `[${t("emoticon")}] ${t("loadFail")}: ${String(err)}`);
        return [];
      }
    });
  }
  /** 避免表情 item.key 为 null 的情况 */
  solveNullKey(data) {
    data.forEach((grp) => {
      grp.items.forEach((item, index) => {
        if (!item.key)
          item.key = `${grp.name} ${index + 1}`;
      });
    });
  }
  /** 避免相同 item.key */
  solveSameKey(data) {
    const tmp = {};
    data.forEach((grp) => {
      grp.items.forEach((item) => {
        if (!item.key || String(item.key).trim() === "")
          return;
        if (!tmp[item.key])
          tmp[item.key] = 1;
        else
          tmp[item.key]++;
        if (tmp[item.key] > 1)
          item.key = `${item.key} ${tmp[item.key]}`;
      });
    });
  }
  /** 判断是否为 OwO 格式 */
  isOwOFormat(data) {
    try {
      return typeof data === "object" && !!Object.values(data).length && Array.isArray(Object.keys(Object.values(data)[0].container)) && Object.keys(Object.values(data)[0].container[0]).includes("icon");
    } catch (e) {
      return false;
    }
  }
  /** 转换 OwO 格式数据 */
  convertOwO(owoData) {
    const dest = [];
    Object.entries(owoData).forEach(([grpName, grp]) => {
      const nGrp = { name: grpName, type: grp.type, items: [] };
      grp.container.forEach((item, index) => {
        const iconStr = item.icon;
        if (/<(img|IMG)/.test(iconStr)) {
          const find = /src=["'](.*?)["']/.exec(iconStr);
          if (find && find.length > 1)
            item.icon = find[1];
        }
        nGrp.items.push({ key: item.text || `${grpName} ${index + 1}`, val: item.icon });
      });
      dest.push(nGrp);
    });
    return dest;
  }
  /** 初始化表情列表界面 */
  initEmoticonsList() {
    this.$grpWrap = createElement(`<div class="atk-grp-wrap"></div>`);
    this.$panel.append(this.$grpWrap);
    this.emoticons.forEach((grp, index) => {
      const $grp = createElement(`<div class="atk-grp" style="display: none;"></div>`);
      this.$grpWrap.append($grp);
      $grp.setAttribute("data-index", String(index));
      $grp.setAttribute("data-grp-name", grp.name);
      $grp.setAttribute("data-type", grp.type);
      grp.items.forEach((item) => {
        const $item = createElement(`<span class="atk-item"></span>`);
        $grp.append($item);
        if (!!item.key && !new RegExp(`^(${grp.name})?\\s?[0-9]+$`).test(item.key))
          $item.setAttribute("title", item.key);
        if (grp.type === "image") {
          const imgEl = document.createElement("img");
          imgEl.src = item.val;
          imgEl.alt = item.key;
          $item.append(imgEl);
        } else {
          $item.innerText = item.val;
        }
        $item.onclick = () => {
          if (grp.type === "image") {
            this.kit.useEditor().insertContent(`:[${item.key}]`);
          } else {
            this.kit.useEditor().insertContent(item.val || "");
          }
        };
      });
    });
    if (this.emoticons.length > 1) {
      this.$grpSwitcher = createElement(`<div class="atk-grp-switcher"></div>`);
      this.$panel.append(this.$grpSwitcher);
      this.emoticons.forEach((grp, index) => {
        const $item = createElement("<span />");
        $item.innerText = grp.name;
        $item.setAttribute("data-index", String(index));
        $item.onclick = () => this.openGrp(index);
        this.$grpSwitcher.append($item);
      });
    }
    if (this.emoticons.length > 0)
      this.openGrp(0);
  }
  /** 打开一个表情组 */
  openGrp(index) {
    var _a, _b, _c;
    Array.from(this.$grpWrap.children).forEach((item) => {
      const el = item;
      if (el.getAttribute("data-index") !== String(index)) {
        el.style.display = "none";
      } else {
        el.style.display = "";
      }
    });
    (_a = this.$grpSwitcher) == null ? void 0 : _a.querySelectorAll("span.active").forEach((item) => item.classList.remove("active"));
    (_c = (_b = this.$grpSwitcher) == null ? void 0 : _b.querySelector(`span[data-index="${index}"]`)) == null ? void 0 : _c.classList.add("active");
    this.changeListHeight();
  }
  changeListHeight() {
  }
  /** 处理评论 content 中的表情内容 */
  transEmoticonImageText(text) {
    if (!this.emoticons || !Array.isArray(this.emoticons))
      return text;
    this.emoticons.forEach((grp) => {
      if (grp.type !== "image")
        return;
      Object.entries(grp.items).forEach(([index, item]) => {
        text = text.split(`:[${item.key}]`).join(`<img src="${item.val}" atk-emoticon="${item.key}">`);
      });
    });
    return text;
  }
}
const AllowImgExts = ["png", "jpg", "jpeg", "gif", "bmp", "svg", "webp"];
class Upload extends EditorPlug {
  constructor(kit) {
    super(kit);
    __publicField(this, "$imgUploadInput");
    this.kit.useMounted(() => this.init());
    this.initDragImg();
  }
  init() {
    this.$imgUploadInput = document.createElement("input");
    this.$imgUploadInput.type = "file";
    this.$imgUploadInput.style.display = "none";
    this.$imgUploadInput.accept = AllowImgExts.map((o) => `.${o}`).join(",");
    const $btn = this.useBtn(`<i aria-label="${t("uploadImage")}"><svg fill="currentColor" aria-hidden="true" height="14" viewBox="0 0 14 14" width="14"><path d="m0 1.94444c0-1.074107.870333-1.94444 1.94444-1.94444h10.11116c1.0741 0 1.9444.870333 1.9444 1.94444v10.11116c0 1.0741-.8703 1.9444-1.9444 1.9444h-10.11116c-1.074107 0-1.94444-.8703-1.94444-1.9444zm1.94444-.38888c-.21466 0-.38888.17422-.38888.38888v7.06689l2.33333-2.33333 2.33333 2.33333 3.88888-3.88889 2.3333 2.33334v-5.51134c0-.21466-.1742-.38888-.3888-.38888zm10.49996 8.09977-2.3333-2.33333-3.88888 3.8889-2.33333-2.33334-2.33333 2.33334v.8447c0 .2146.17422.3888.38888.3888h10.11116c.2146 0 .3888-.1742.3888-.3888zm-7.1944-6.54422c-.75133 0-1.36111.60978-1.36111 1.36111 0 .75134.60978 1.36111 1.36111 1.36111s1.36111-.60977 1.36111-1.36111c0-.75133-.60978-1.36111-1.36111-1.36111z"/></svg></i>`);
    $btn.after(this.$imgUploadInput);
    $btn.onclick = () => {
      const $input = this.$imgUploadInput;
      $input.onchange = () => {
        (() => __async(this, null, function* () {
          if (!$input.files || $input.files.length === 0)
            return;
          const file = $input.files[0];
          this.uploadImg(file);
        }))();
      };
      $input.click();
    };
    if (!this.kit.useConf().imgUpload) {
      this.$btn.setAttribute("atk-only-admin-show", "");
    }
  }
  initDragImg() {
    const uploadFromFileList = (files) => {
      if (!files)
        return;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        this.uploadImg(file);
      }
    };
    const onDragover = (evt) => {
      evt.stopPropagation();
      evt.preventDefault();
    };
    const onDrop = (evt) => {
      var _a;
      const files = (_a = evt.dataTransfer) == null ? void 0 : _a.files;
      if (files == null ? void 0 : files.length) {
        evt.preventDefault();
        uploadFromFileList(files);
      }
    };
    const onPaste = (evt) => {
      var _a;
      const files = (_a = evt.clipboardData) == null ? void 0 : _a.files;
      if (files == null ? void 0 : files.length) {
        evt.preventDefault();
        uploadFromFileList(files);
      }
    };
    this.kit.useMounted(() => {
      this.kit.useUI().$textarea.addEventListener("dragover", onDragover);
      this.kit.useUI().$textarea.addEventListener("drop", onDrop);
      this.kit.useUI().$textarea.addEventListener("paste", onPaste);
    });
    this.kit.useUnmounted(() => {
      this.kit.useUI().$textarea.removeEventListener("dragover", onDragover);
      this.kit.useUI().$textarea.removeEventListener("drop", onDrop);
      this.kit.useUI().$textarea.removeEventListener("paste", onPaste);
    });
  }
  uploadImg(file) {
    return __async(this, null, function* () {
      const fileExt = /[^.]+$/.exec(file.name);
      if (!fileExt || !AllowImgExts.includes(fileExt[0]))
        return;
      if (!this.kit.useUser().checkHasBasicUserInfo()) {
        this.kit.useEditor().showNotify(t("uploadLoginMsg"), "w");
        return;
      }
      let insertPrefix = "\n";
      if (this.kit.useUI().$textarea.value.trim() === "")
        insertPrefix = "";
      const uploadPlaceholderTxt = `${insertPrefix}![](Uploading ${file.name}...)`;
      this.kit.useEditor().insertContent(uploadPlaceholderTxt);
      let resp;
      try {
        const customUploaderFn = this.kit.useConf().imgUploader;
        if (!customUploaderFn) {
          resp = (yield this.kit.useApi().upload.upload({ file })).data;
        } else {
          resp = { public_url: yield customUploaderFn(file) };
        }
      } catch (err) {
        console.error(err);
        this.kit.useEditor().showNotify(`${t("uploadFail")}: ${err.msg}`, "e");
      }
      if (!!resp && resp.public_url) {
        let imgURL = resp.public_url;
        if (!isValidURL(imgURL))
          imgURL = getURLBasedOnApi({
            base: this.kit.useConf().server,
            path: imgURL
          });
        this.kit.useEditor().setContent(this.kit.useUI().$textarea.value.replace(uploadPlaceholderTxt, `${insertPrefix}![](${imgURL})`));
      } else {
        this.kit.useEditor().setContent(this.kit.useUI().$textarea.value.replace(uploadPlaceholderTxt, ""));
      }
    });
  }
}
class Preview extends EditorPlug {
  constructor(kit) {
    super(kit);
    __publicField(this, "isPlugPanelShow", false);
    this.kit.useMounted(() => {
      this.usePanel(`<div class="atk-editor-plug-preview"></div>`);
      this.useBtn(`<i aria-label="${t("preview")}"><svg fill="currentColor" aria-hidden="true" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M14.85 3H1.15C.52 3 0 3.52 0 4.15v7.69C0 12.48.52 13 1.15 13h13.69c.64 0 1.15-.52 1.15-1.15v-7.7C16 3.52 15.48 3 14.85 3zM9 11H7V8L5.5 9.92 4 8v3H2V5h2l1.5 2L7 5h2v6zm2.99.5L9.5 8H11V5h2v3h1.5l-2.51 3.5z"></path></svg></i>`);
    });
    this.kit.useUnmounted(() => {
    });
    this.kit.useEvents().on("content-updated", (content) => {
      this.isPlugPanelShow && this.updateContent();
    });
    this.usePanelShow(() => {
      this.isPlugPanelShow = true;
      this.updateContent();
    });
    this.usePanelHide(() => {
      this.isPlugPanelShow = false;
    });
  }
  updateContent() {
    this.$panel.innerHTML = this.kit.useEditor().getContentMarked();
  }
}
const EDITOR_PLUGS = [
  // Core
  LocalStorage,
  HeaderEvent,
  HeaderUser,
  HeaderLink,
  Textarea,
  Submit,
  SubmitBtn,
  Mover,
  StateReply,
  StateEdit,
  Closable,
  // Extensions
  Emoticons,
  Upload,
  Preview
];
function getEnabledPlugs(conf) {
  const confRefs = /* @__PURE__ */ new Map();
  confRefs.set(Upload, conf.imgUpload);
  confRefs.set(Emoticons, conf.emoticons);
  confRefs.set(Preview, conf.preview);
  confRefs.set(Mover, conf.editorTravel);
  return EDITOR_PLUGS.filter((p) => !confRefs.has(p) || !!confRefs.get(p));
}
class PlugKit {
  constructor(plugs) {
    this.plugs = plugs;
  }
  /** Use the editor */
  useEditor() {
    return this.plugs.editor;
  }
  /**
   * Use the context of global
   *
   * @deprecated The calls to this function should be reduced as much as possible
   */
  useGlobalCtx() {
    return this.plugs.editor.ctx;
  }
  /** Use the config of Artalk */
  useConf() {
    return this.plugs.editor.ctx.conf;
  }
  /** Use the http api client */
  useApi() {
    return this.plugs.editor.ctx.getApi();
  }
  /** Use the user manager */
  useUser() {
    return this.plugs.editor.ctx.get("user");
  }
  /** Use the ui of editor */
  useUI() {
    return this.plugs.editor.getUI();
  }
  /** Use the events in editor scope */
  useEvents() {
    return this.plugs.getEvents();
  }
  /** Listen the event when plug is mounted */
  useMounted(func) {
    this.useEvents().on("mounted", func);
  }
  /** Listen the event when plug is unmounted */
  useUnmounted(func) {
    this.useEvents().on("unmounted", func);
  }
  /** Use the deps of other plug */
  useDeps(plug) {
    return this.plugs.get(plug);
  }
}
const EditorKit = (ctx) => {
  const editor = ctx.get("editor");
  const editorPlugs = new PlugManager(editor);
  ctx.inject("editorPlugs", editorPlugs);
};
class PlugManager {
  constructor(editor) {
    __publicField(this, "plugs", []);
    __publicField(this, "openedPlug", null);
    __publicField(this, "events", new EventManager());
    this.editor = editor;
    let confLoaded = false;
    this.editor.ctx.watchConf([
      "imgUpload",
      "emoticons",
      "preview",
      "editorTravel",
      "locale"
    ], (conf) => {
      confLoaded && this.getEvents().trigger("unmounted");
      this.clear();
      getEnabledPlugs(conf).forEach((Plug) => {
        const kit = new PlugKit(this);
        this.plugs.push(new Plug(kit));
      });
      this.getEvents().trigger("mounted");
      confLoaded = true;
      this.loadPluginUI();
    });
    this.events.on("panel-close", () => this.closePlugPanel());
  }
  getPlugs() {
    return this.plugs;
  }
  getEvents() {
    return this.events;
  }
  clear() {
    this.plugs = [];
    this.events = new EventManager();
    if (this.openedPlug)
      this.closePlugPanel();
  }
  loadPluginUI() {
    this.editor.getUI().$plugPanelWrap.innerHTML = "";
    this.editor.getUI().$plugPanelWrap.style.display = "none";
    this.editor.getUI().$plugBtnWrap.innerHTML = "";
    this.editor.getUI().$el.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    this.plugs.forEach((plug) => this.loadPluginItem(plug));
  }
  /** Load the plug btn and plug panel on editor ui */
  loadPluginItem(plug) {
    const $btn = plug.$btn;
    if (!$btn)
      return;
    this.editor.getUI().$plugBtnWrap.appendChild($btn);
    !$btn.onclick && ($btn.onclick = () => {
      this.editor.getUI().$plugBtnWrap.querySelectorAll(".active").forEach((item) => item.classList.remove("active"));
      if (plug !== this.openedPlug) {
        this.openPlugPanel(plug);
        $btn.classList.add("active");
      } else {
        this.closePlugPanel();
      }
    });
    const $panel = plug.$panel;
    if ($panel) {
      $panel.style.display = "none";
      this.editor.getUI().$plugPanelWrap.appendChild($panel);
    }
  }
  get(plug) {
    return this.plugs.find((p) => p instanceof plug);
  }
  /** Open the editor plug panel */
  openPlugPanel(plug) {
    this.plugs.forEach((aPlug) => {
      const plugPanel = aPlug.$panel;
      if (!plugPanel)
        return;
      if (aPlug === plug) {
        plugPanel.style.display = "";
        this.events.trigger("panel-show", plug);
      } else {
        plugPanel.style.display = "none";
        this.events.trigger("panel-hide", plug);
      }
    });
    this.editor.getUI().$plugPanelWrap.style.display = "";
    this.openedPlug = plug;
  }
  /** Close the editor plug panel */
  closePlugPanel() {
    if (!this.openedPlug)
      return;
    this.editor.getUI().$plugPanelWrap.style.display = "none";
    this.events.trigger("panel-hide", this.openedPlug);
    this.openedPlug = null;
  }
  /** Get the content which is transformed by plugs */
  getTransformedContent(rawContent) {
    let result = rawContent;
    this.plugs.forEach((aPlug) => {
      if (!aPlug.contentTransformer)
        return;
      result = aPlug.contentTransformer(result);
    });
    return result;
  }
}
const WithEditor = (ctx) => {
  let $closeCommentBtn;
  ctx.on("mounted", () => {
    const list = ctx.get("list");
    $closeCommentBtn = list.$el.querySelector('[data-action="admin-close-comment"]');
    $closeCommentBtn.addEventListener("click", () => {
      const page = ctx.getData().getPage();
      if (!page)
        throw new Error("Page data not found");
      page.admin_only = !page.admin_only;
      adminPageEditSave(ctx, page);
    });
  });
  ctx.on("page-loaded", (page) => {
    var _a, _b;
    const editor = ctx.get("editor");
    if ((page == null ? void 0 : page.admin_only) === true) {
      (_a = editor.getPlugs()) == null ? void 0 : _a.getEvents().trigger("editor-close");
      $closeCommentBtn && ($closeCommentBtn.innerText = t("openComment"));
    } else {
      (_b = editor.getPlugs()) == null ? void 0 : _b.getEvents().trigger("editor-open");
      $closeCommentBtn && ($closeCommentBtn.innerText = t("closeComment"));
    }
  });
  ctx.on("list-loaded", (comments) => {
    ctx.editorResetState();
  });
};
function adminPageEditSave(ctx, page) {
  ctx.editorShowLoading();
  ctx.getApi().pages.updatePage(page.id, page).then(({ data }) => {
    ctx.getData().updatePage(data);
  }).catch((err) => {
    ctx.editorShowNotify(`${t("editFail")}: ${err.msg || String(err)}`, "e");
  }).finally(() => {
    ctx.editorHideLoading();
  });
}
const Unread = (ctx) => {
  ctx.on("comment-rendered", (comment) => {
    if (ctx.conf.listUnreadHighlight === true) {
      const notifies = ctx.getData().getNotifies();
      const notify = notifies.find((o) => o.comment_id === comment.getID());
      if (notify) {
        comment.getRender().setUnread(true);
        comment.getRender().setOpenAction(() => {
          window.open(notify.read_link);
          ctx.getData().updateNotifies(notifies.filter((o) => o.comment_id !== comment.getID()));
        });
      } else {
        comment.getRender().setUnread(false);
      }
    }
  });
  ctx.on("list-goto", (commentID) => {
    const notifyKey = getQueryParam("atk_notify_key");
    if (notifyKey) {
      ctx.getApi().notifies.markNotifyRead(commentID, notifyKey).then(() => {
        ctx.getData().updateNotifies(ctx.getData().getNotifies().filter((o) => o.comment_id !== commentID));
      });
    }
  });
};
const Count = (ctx) => {
  const refreshCountNumEl = () => {
    var _a, _b;
    const list = ctx.get("list");
    const $count = list.$el.querySelector(".atk-comment-count .atk-text");
    if (!$count)
      return;
    const text = htmlEncode(t("counter", { count: `${Number((_b = (_a = ctx.getData().getListLastFetch()) == null ? void 0 : _a.data) == null ? void 0 : _b.count) || 0}` }));
    $count.innerHTML = text.replace(/(\d+)/, '<span class="atk-comment-count-num">$1</span>');
  };
  ctx.on("list-loaded", () => {
    refreshCountNumEl();
  });
  ctx.on("comment-inserted", () => {
    const last = ctx.getData().getListLastFetch();
    if (last == null ? void 0 : last.data)
      last.data.count += 1;
  });
  ctx.on("comment-deleted", () => {
    const last = ctx.getData().getListLastFetch();
    if (last == null ? void 0 : last.data)
      last.data.count -= 1;
  });
};
const SidebarBtn = (ctx) => {
  let $openSidebarBtn = null;
  const syncByUser = () => {
    if (!$openSidebarBtn)
      return;
    const user = ctx.get("user").getData();
    if (!!user.nick && !!user.email) {
      $openSidebarBtn.classList.remove("atk-hide");
      const $btnText = $openSidebarBtn.querySelector(".atk-text");
      if ($btnText)
        $btnText.innerText = !user.isAdmin ? t("msgCenter") : t("ctrlCenter");
    } else {
      $openSidebarBtn.classList.add("atk-hide");
    }
  };
  ctx.watchConf(["locale"], (conf) => {
    const list = ctx.get("list");
    $openSidebarBtn = list.$el.querySelector('[data-action="open-sidebar"]');
    if (!$openSidebarBtn)
      return;
    $openSidebarBtn.onclick = () => {
      ctx.showSidebar();
    };
    syncByUser();
  });
  ctx.on("user-changed", (user) => {
    syncByUser();
  });
};
const UnreadBadge = (ctx) => {
  let $unreadBadge = null;
  const showUnreadBadge = (count) => {
    if (!$unreadBadge)
      return;
    if (count > 0) {
      $unreadBadge.innerText = `${Number(count || 0)}`;
      $unreadBadge.style.display = "block";
    } else {
      $unreadBadge.style.display = "none";
    }
  };
  ctx.on("mounted", () => {
    const list = ctx.get("list");
    $unreadBadge = list.$el.querySelector(".atk-unread-badge");
  });
  ctx.on("notifies-updated", (notifies) => {
    showUnreadBadge(notifies.length || 0);
  });
};
const GotoDispatcher = (ctx) => {
  let lastID = 0;
  const check2 = ({ locker }) => {
    const commentID = extractCommentID();
    if (!commentID)
      return;
    if (locker && lastID === commentID)
      return;
    lastID = commentID;
    ctx.trigger("list-goto", commentID);
  };
  const hashChangeHandler = () => check2({ locker: false });
  const listLoadedHandler = () => check2({ locker: true });
  ctx.on("mounted", () => {
    window.addEventListener("hashchange", hashChangeHandler);
    ctx.on("list-loaded", listLoadedHandler);
  });
  ctx.on("unmounted", () => {
    window.removeEventListener("hashchange", hashChangeHandler);
    ctx.off("list-loaded", listLoadedHandler);
  });
};
function extractCommentID() {
  const match = window.location.hash.match(/#atk-comment-([0-9]+)/);
  let commentId = match && match[1] && !Number.isNaN(parseFloat(match[1])) ? parseFloat(match[1]) : null;
  if (!commentId) {
    commentId = Number(getQueryParam("atk_comment"));
  }
  return commentId || null;
}
const GotoFocus = (ctx) => {
  ctx.on("list-goto", (commentID) => __async(void 0, null, function* () {
    let comment = ctx.getCommentNodes().find((c) => c.getID() === commentID);
    if (!comment) {
      const data = (yield ctx.getApi().comments.getComment(commentID)).data;
      ctx.get("list").getListLayout({ forceFlatMode: true }).insert(data.comment, data.reply_comment);
      comment = ctx.getCommentNodes().find((c) => c.getID() === commentID);
    }
    if (!comment)
      return;
    comment.focus();
  }));
};
const version = "2.8.2";
const Copyright = (ctx) => {
  ctx.on("mounted", () => {
    const list = ctx.get("list");
    const $copyright = list.$el.querySelector(".atk-copyright");
    if (!$copyright)
      return;
    $copyright.innerHTML = `Powered By <a href="https://artalk.js.org" target="_blank" title="Artalk v${version}">Artalk</a>`;
  });
};
const NoComment = (ctx) => {
  ctx.on("list-loaded", (comments) => {
    const list = ctx.get("list");
    const isNoComment = comments.length <= 0;
    let $noComment = list.getCommentsWrapEl().querySelector(".atk-list-no-comment");
    if (isNoComment) {
      if (!$noComment) {
        $noComment = createElement('<div class="atk-list-no-comment"></div>');
        $noComment.innerHTML = sanitize(list.ctx.conf.noComment || list.ctx.$t("noComment"));
        list.getCommentsWrapEl().appendChild($noComment);
      }
    } else {
      $noComment == null ? void 0 : $noComment.remove();
    }
  });
};
const Dropdown = (ctx) => {
  const reloadUseParamsEditor = (func) => {
    ctx.conf.listFetchParamsModifier = func;
    ctx.reload();
  };
  const initDropdown = ($dropdownOn) => {
    renderDropdown({
      $dropdownWrap: $dropdownOn,
      dropdownList: [
        [t("sortLatest"), () => {
          reloadUseParamsEditor((p) => {
            p.sort_by = "date_desc";
          });
        }],
        [t("sortBest"), () => {
          reloadUseParamsEditor((p) => {
            p.sort_by = "vote";
          });
        }],
        [t("sortOldest"), () => {
          reloadUseParamsEditor((p) => {
            p.sort_by = "date_asc";
          });
        }],
        [t("sortAuthor"), () => {
          reloadUseParamsEditor((p) => {
            p.view_only_admin = true;
          });
        }]
      ]
    });
  };
  ctx.watchConf(["listSort", "locale"], (conf) => {
    const list = ctx.get("list");
    const $count = list.$el.querySelector(".atk-comment-count");
    if (!$count)
      return;
    if (conf.listSort) {
      initDropdown($count);
    } else {
      removeDropdown({
        $dropdownWrap: $count
      });
    }
  });
};
function renderDropdown(conf) {
  const { $dropdownWrap, dropdownList } = conf;
  if ($dropdownWrap.querySelector(".atk-dropdown"))
    return;
  $dropdownWrap.classList.add("atk-dropdown-wrap");
  $dropdownWrap.append(createElement(`<span class="atk-arrow-down-icon"></span>`));
  let curtActive = 0;
  const onItemClick = (i, $item, name, action) => {
    action();
    curtActive = i;
    $dropdown.querySelectorAll(".active").forEach((e) => {
      e.classList.remove("active");
    });
    $item.classList.add("active");
    $dropdown.style.display = "none";
    setTimeout(() => {
      $dropdown.style.display = "";
    }, 80);
  };
  const $dropdown = createElement(`<ul class="atk-dropdown atk-fade-in"></ul>`);
  dropdownList.forEach((item, i) => {
    const name = item[0];
    const action = item[1];
    const $item = createElement(`<li class="atk-dropdown-item"><span></span></li>`);
    const $link = $item.querySelector("span");
    $link.innerText = name;
    $link.onclick = () => {
      onItemClick(i, $item, name, action);
    };
    $dropdown.append($item);
    if (i === curtActive)
      $item.classList.add("active");
  });
  $dropdownWrap.append($dropdown);
}
function removeDropdown(conf) {
  var _a, _b;
  const { $dropdownWrap } = conf;
  $dropdownWrap.classList.remove("atk-dropdown-wrap");
  (_a = $dropdownWrap.querySelector(".atk-arrow-down-icon")) == null ? void 0 : _a.remove();
  (_b = $dropdownWrap.querySelector(".atk-dropdown")) == null ? void 0 : _b.remove();
}
const TimeTicking = (ctx) => {
  let timer = null;
  ctx.on("mounted", () => {
    timer = window.setInterval(() => {
      const list = ctx.get("list");
      list.$el.querySelectorAll("[data-atk-comment-date]").forEach((el) => {
        const date = el.getAttribute("data-atk-comment-date");
        el.innerText = timeAgo(new Date(Number(date)), ctx.$t);
      });
    }, 30 * 1e3);
  });
  ctx.on("unmounted", () => {
    timer && window.clearInterval(timer);
  });
};
const ErrorDialog = (ctx) => {
  ctx.on("list-fetch", () => {
    const list = ctx.get("list");
    setError(list.$el, null);
  });
  ctx.on("list-failed", (err) => {
    showErrorDialog({
      $err: ctx.get("list").$el,
      errMsg: err.msg,
      errData: err.data,
      retryFn: () => ctx.fetch({ offset: 0 })
    });
  });
};
const Loading = (ctx) => {
  ctx.on("list-fetch", (p) => {
    const list = ctx.get("list");
    if (p.offset === 0)
      setLoading(true, list.$el);
  });
  ctx.on("list-fetched", () => {
    const list = ctx.get("list");
    setLoading(false, list.$el);
  });
};
const Fetch = (ctx) => {
  ctx.on("list-fetch", (_params) => {
    if (ctx.getData().getLoading())
      return;
    ctx.getData().setLoading(true);
    const params = __spreadValues({
      // default params
      offset: 0,
      limit: ctx.conf.pagination.pageSize,
      flatMode: ctx.conf.flatMode,
      // always be boolean because had been handled in Artalk.init
      paramsModifier: ctx.conf.listFetchParamsModifier
    }, _params);
    ctx.getData().setListLastFetch({
      params
    });
    const reqParams = {
      limit: params.limit,
      offset: params.offset,
      flat_mode: params.flatMode,
      page_key: ctx.getConf().pageKey,
      site_name: ctx.getConf().site
    };
    if (params.paramsModifier)
      params.paramsModifier(reqParams);
    ctx.getApi().comments.getComments(__spreadValues(__spreadValues({}, reqParams), ctx.getApi().getUserFields())).then(({ data }) => {
      ctx.getData().setListLastFetch({ params, data });
      ctx.getData().loadComments(data.comments);
      ctx.getData().updatePage(data.page);
      params.onSuccess && params.onSuccess(data);
      ctx.trigger("list-fetched", { params, data });
    }).catch((e) => {
      const error = {
        msg: e.msg || String(e),
        data: e.data
      };
      params.onError && params.onError(error);
      ctx.trigger("list-failed", error);
      ctx.trigger("list-fetched", { params, error });
      throw e;
    }).finally(() => {
      ctx.getData().setLoading(false);
    });
  });
};
const ReachBottom = (ctx) => {
  let observer = null;
  const setupObserver = ($target) => {
    const scrollEvtAt = ctx.conf.scrollRelativeTo && ctx.conf.scrollRelativeTo() || null;
    observer = new IntersectionObserver(([entries]) => {
      if (entries.isIntersecting) {
        clearObserver();
        ctx.trigger("list-reach-bottom");
      }
    }, {
      threshold: 0.9,
      // when the target is 90% visible
      // @see https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/root
      // If the root is null, then the bounds of the actual document viewport are used.
      root: scrollEvtAt
    });
    observer.observe($target);
  };
  const clearObserver = () => {
    observer == null ? void 0 : observer.disconnect();
    observer = null;
  };
  ctx.on("list-loaded", () => {
    clearObserver();
    const list = ctx.get("list");
    const children = list.getCommentsWrapEl().childNodes;
    const $target = children.length > 2 ? children[children.length - 2] : null;
    if (!$target)
      return;
    if (!("IntersectionObserver" in window)) {
      console.warn("IntersectionObserver api not supported");
      return;
    }
    setupObserver($target);
  });
  ctx.on("unmounted", () => {
    clearObserver();
  });
};
const GotoFirst = (ctx) => {
  const handler = () => {
    const list = ctx.get("list");
    const $relative = ctx.conf.scrollRelativeTo && ctx.conf.scrollRelativeTo();
    ($relative || window).scroll({
      top: getOffset(list.$el, $relative).top,
      left: 0
    });
  };
  ctx.on("mounted", () => {
    ctx.on("list-goto-first", handler);
  });
  ctx.on("unmounted", () => {
    ctx.off("list-goto-first", handler);
  });
};
const ListPlugins = [
  Fetch,
  Loading,
  Unread,
  WithEditor,
  Count,
  SidebarBtn,
  UnreadBadge,
  Dropdown,
  GotoDispatcher,
  GotoFocus,
  NoComment,
  Copyright,
  TimeTicking,
  ErrorDialog,
  ReachBottom,
  GotoFirst
];
const Notifies = (ctx) => {
  ctx.on("list-fetch", (params) => {
    if (params.offset !== 0)
      return;
    const user = ctx.getApi().getUserFields();
    if (!user)
      return;
    ctx.getApi().notifies.getNotifies(user).then((res) => {
      ctx.getData().updateNotifies(res.data.notifies);
    });
  });
};
const PvCountWidget = (ctx) => {
  ctx.watchConf([
    "site",
    "pageKey",
    "pageTitle",
    "countEl",
    "pvEl"
  ], (conf) => {
    initCountWidget({
      getApi: () => ctx.getApi(),
      siteName: conf.site,
      pageKey: conf.pageKey,
      pageTitle: conf.pageTitle,
      countEl: conf.countEl,
      pvEl: conf.pvEl,
      pvAdd: typeof ctx.conf.pvAdd === "boolean" ? ctx.conf.pvAdd : true
    });
  });
};
function initCountWidget(opt) {
  return __async(this, null, function* () {
    if (opt.countEl && document.querySelector(opt.countEl)) {
      refreshStatCount(opt, { query: "page_comment", numEl: opt.countEl });
    }
    const initialData = opt.pvAdd && opt.pageKey ? {
      [opt.pageKey]: (yield opt.getApi().pages.logPv({
        page_key: opt.pageKey,
        page_title: opt.pageTitle,
        site_name: opt.siteName
      })).data.pv
      // pv+1 and get pv count
    } : void 0;
    if (opt.pvEl && document.querySelector(opt.pvEl)) {
      refreshStatCount(opt, {
        query: "page_pv",
        numEl: opt.pvEl,
        data: initialData
      });
    }
  });
}
function refreshStatCount(opt, args) {
  return __async(this, null, function* () {
    let data = args.data || {};
    let queryPageKeys = Array.from(document.querySelectorAll(args.numEl)).map((e) => e.getAttribute("data-page-key") || opt.pageKey).filter((k) => k && typeof data[k] !== "number");
    queryPageKeys = [...new Set(queryPageKeys)];
    if (queryPageKeys.length > 0) {
      const res = (yield opt.getApi().stats.getStats(args.query, {
        page_keys: queryPageKeys.join(","),
        site_name: opt.siteName
      })).data.data;
      data = __spreadValues(__spreadValues({}, data), res);
    }
    const defaultCount = opt.pageKey ? data[opt.pageKey] : 0;
    applyCountData(args.numEl, data, defaultCount);
  });
}
function applyCountData(selector, data, defaultCount) {
  document.querySelectorAll(selector).forEach((el) => {
    const pageKey = el.getAttribute("data-page-key");
    const count = Number(pageKey ? data[pageKey] : defaultCount);
    el.innerHTML = `${count}`;
  });
}
let IgnoreVersionCheck = false;
const VersionCheck = (ctx) => {
  ctx.watchConf(["apiVersion", "versionCheck"], (conf) => {
    const list = ctx.get("list");
    if (conf.apiVersion && conf.versionCheck && !IgnoreVersionCheck)
      versionCheck(list, version, conf.apiVersion);
  });
};
function versionCheck(list, feVer, beVer) {
  const comp = versionCompare(feVer, beVer);
  const sameVer = comp === 0;
  if (sameVer)
    return;
  const errEl = createElement(
    `<div>${t("updateMsg", { name: comp < 0 ? t("frontend") : t("backend") })}<br/><br/><span style="color: var(--at-color-meta);">${t("currentVersion")}: ${t("frontend")} ${feVer} / ${t("backend")} ${beVer}</span><br/><br/></div>`
  );
  const ignoreBtn = createElement(`<span style="cursor:pointer">${t("ignore")}</span>`);
  ignoreBtn.onclick = () => {
    setError(list.$el.parentElement, null);
    IgnoreVersionCheck = true;
    list.ctx.fetch({ offset: 0 });
  };
  errEl.append(ignoreBtn);
  setError(list.$el.parentElement, errEl, '<span class="atk-warn-title">Artalk Warn</span>');
}
const AdminOnlyElem = (ctx) => {
  const scanApply = () => {
    applyAdminOnlyEls(ctx.get("user").getData().isAdmin, getAdminOnlyEls({
      $root: ctx.$root
    }));
  };
  ctx.on("list-loaded", () => {
    scanApply();
  });
  ctx.on("user-changed", (user) => {
    scanApply();
  });
};
function getAdminOnlyEls(opts) {
  const els = [];
  opts.$root.querySelectorAll(`[atk-only-admin-show]`).forEach((item) => els.push(item));
  const $sidebarEl = document.querySelector(".atk-sidebar");
  if ($sidebarEl)
    $sidebarEl.querySelectorAll(`[atk-only-admin-show]`).forEach((item) => els.push(item));
  return els;
}
function applyAdminOnlyEls(isAdmin, els) {
  els.forEach(($item) => {
    if (isAdmin)
      $item.classList.remove("atk-hide");
    else
      $item.classList.add("atk-hide");
  });
}
let darkModeMedia;
function updateClassnames($els, darkMode) {
  const DarkModeClassName = "atk-dark-mode";
  $els.forEach(($el) => {
    if (darkMode)
      $el.classList.add(DarkModeClassName);
    else
      $el.classList.remove(DarkModeClassName);
  });
}
const DarkMode = (ctx) => {
  let darkModeAutoHandler;
  const sync = (darkMode) => {
    const $els = [ctx.$root, ctx.get("layerManager").getEl()];
    if (!darkModeMedia) {
      darkModeMedia = window.matchMedia("(prefers-color-scheme: dark)");
    }
    if (darkMode === "auto") {
      if (!darkModeAutoHandler) {
        darkModeAutoHandler = (evt) => updateClassnames($els, evt.matches);
        darkModeMedia.addEventListener("change", darkModeAutoHandler);
      }
      updateClassnames($els, darkModeMedia.matches);
    } else {
      if (darkModeAutoHandler) {
        darkModeMedia.removeEventListener("change", darkModeAutoHandler);
        darkModeAutoHandler = void 0;
      }
      updateClassnames($els, darkMode);
    }
  };
  ctx.watchConf(["darkMode"], (conf) => sync(conf.darkMode));
  ctx.on("created", () => sync(ctx.conf.darkMode));
  ctx.on("unmounted", () => {
    darkModeAutoHandler && (darkModeMedia == null ? void 0 : darkModeMedia.removeEventListener("change", darkModeAutoHandler));
    darkModeAutoHandler = void 0;
  });
};
const DefaultPlugins = [
  ConfRemoter,
  Markdown,
  EditorKit,
  AdminOnlyElem,
  ...ListPlugins,
  Notifies,
  PvCountWidget,
  VersionCheck,
  DarkMode
];
const GlobalPlugins = [...DefaultPlugins];
class Artalk {
  constructor(conf) {
    __publicField(this, "ctx");
    /** Plugins */
    __publicField(this, "plugins", [...GlobalPlugins]);
    const handledConf = handelCustomConf(conf, true);
    this.ctx = new Context(handledConf);
    Object.entries(services).forEach(([name, initService]) => {
      const obj = initService(this.ctx);
      if (obj)
        this.ctx.inject(name, obj);
    });
    this.plugins.forEach((plugin) => {
      if (typeof plugin === "function")
        plugin(this.ctx);
    });
    this.ctx.trigger("created");
  }
  /** Get the config of Artalk */
  getConf() {
    return this.ctx.getConf();
  }
  /** Get the root element of Artalk */
  getEl() {
    return this.ctx.$root;
  }
  /** Update config of Artalk */
  update(conf) {
    this.ctx.updateConf(conf);
    return this;
  }
  /** Reload comment list of Artalk */
  reload() {
    this.ctx.reload();
  }
  /** Destroy instance of Artalk */
  destroy() {
    this.ctx.trigger("unmounted");
    this.ctx.$root.remove();
  }
  /** Add an event listener */
  on(name, handler) {
    this.ctx.on(name, handler);
  }
  /** Remove an event listener */
  off(name, handler) {
    this.ctx.off(name, handler);
  }
  /** Trigger an event */
  trigger(name, payload) {
    this.ctx.trigger(name, payload);
  }
  /** Set dark mode */
  setDarkMode(darkMode) {
    this.ctx.setDarkMode(darkMode);
  }
  // ===========================
  //       Static Members
  // ===========================
  /** Init Artalk */
  static init(conf) {
    return new Artalk(conf);
  }
  /** Use plugin, the plugin will be used when Artalk.init */
  static use(plugin) {
    if (GlobalPlugins.includes(plugin))
      return;
    GlobalPlugins.push(plugin);
  }
  /** Load count widget */
  static loadCountWidget(c) {
    const conf = handelCustomConf(c, true);
    initCountWidget({
      getApi: () => new Api2(convertApiOptions(conf)),
      siteName: conf.site,
      countEl: conf.countEl,
      pvEl: conf.pvEl,
      pvAdd: false
    });
  }
  // ===========================
  //         Deprecated
  // ===========================
  /** @deprecated Please use `getEl()` instead */
  get $root() {
    return this.ctx.$root;
  }
  /** @description Please use `getConf()` instead */
  get conf() {
    return this.ctx.getConf();
  }
}
const init = Artalk.init;
const use = Artalk.use;
const loadCountWidget = Artalk.loadCountWidget;
export {
  Artalk as default,
  init,
  loadCountWidget,
  use
};
//# sourceMappingURL=ArtalkLite.mjs.map
