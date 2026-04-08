/**
 * (c) Copyright Ascensio System SIA 2026
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __typeError = (msg) => {
    throw TypeError(msg);
  };
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
  var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
  var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
  var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
  var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
  var __privateWrapper = (obj, member, setter, getter) => ({
    set _(value) {
      __privateSet(obj, member, value, setter);
    },
    get _() {
      return __privateGet(obj, member, getter);
    }
  });

  // src/constants/index.ts
  var CSPApiUrl = "/api/2.0/security/csp";
  var FRAME_NAME = "frameDocSpace";
  var defaultConfig = {
    /** DocSpace server URL. Must be set — no default. Used as the iframe `src` origin. */
    src: "",
    /** Base navigation path for {@link SDKMode.Manager}. Default: `"/rooms/shared/"`. */
    rootPath: "/rooms/shared/",
    /** Auth token for public rooms ({@link SDKMode.PublicRoom}). `null` = no token. */
    requestToken: null,
    /** Iframe width. CSS value: `"100%"`, `"800px"`, etc. */
    width: "100%",
    /** Iframe height. CSS value: `"100%"`, `"600px"`, etc. */
    height: "100%",
    /** Iframe `name` attribute prefix. Default: {@link FRAME_NAME}. */
    name: FRAME_NAME,
    /** Platform layout type. Affects iframe CSS (e.g. `"mobile"` sets `position: fixed`). See {@link EditorType}. */
    type: "desktop" /* Desktop */,
    /** Unique frame identifier. Used as the DOM element `id` and the postMessage routing key. */
    frameId: "ds-frame",
    /** SDK mode. Determines UI and available methods. See {@link SDKMode}. */
    mode: "manager" /* Manager */,
    /** Entity ID (file, folder, or room) for modes that require it ({@link SDKMode.Editor}, {@link SDKMode.Viewer}, {@link SDKMode.Uploader}). `null` = none. */
    id: null,
    /** UI locale as a BCP 47 code (e.g. `"en-US"`, `"ru-RU"`). `null` = DocSpace default. */
    locale: null,
    /** Color theme. See {@link Theme}. Default: follows the OS preference. */
    theme: "System" /* System */,
    /** Editor UI layout sent to the backend. See {@link EditorType}. */
    editorType: "desktop" /* Desktop */,
    /** Show "Open file location" button in editor/viewer modes. `true` = show, `"event"` = trigger `onEditorCloseCallback` instead. */
    editorGoBack: true,
    /** Content filter for selector modes. See {@link SelectorFilterType}. */
    selectorType: "all" /* All */,
    /** Show "Cancel" button in selector modes. */
    showSelectorCancel: false,
    /** Show header bar in selector modes. */
    showSelectorHeader: false,
    /** Show header bar in mobile manager view. */
    showHeader: false,
    /** Header banner visibility. See {@link HeaderBannerDisplaying}. */
    showHeaderBanner: "none" /* None */,
    /** Show the current section/room/folder title in manager mode. */
    showTitle: true,
    /** Show the left navigation menu in manager mode. */
    showMenu: false,
    /** Show the filter toolbar in manager mode. */
    showFilter: false,
    /** Show "Sign out" button. */
    showSignOut: true,
    /** HTML string inserted into the placeholder `div` after {@link SDKInstance.destroyFrame} is called. */
    destroyText: "",
    /** Item layout in manager mode. See {@link ManagerViewMode}. */
    viewAs: "row" /* Row */,
    /** Visible table columns when `viewAs` is `"table"`. Comma-separated names: `"Index,Name,Size,Type,Tags"`. */
    viewTableColumns: "Index,Name,Size,Type,Tags",
    /** Validate CSP headers before loading the iframe. Set to `false` to skip the fetch to {@link CSPApiUrl}. */
    checkCSP: true,
    /** Hide the "Actions" button in manager mode. */
    disableActionButton: false,
    /** Show "Manage displayed columns" button in table view. */
    showSettings: false,
    /** Delay iframe rendering. When `true`, the iframe is not appended until `setConfig` is called. Exception: {@link SDKMode.System} always appends. */
    waiting: false,
    /** Skip the loading spinner. `true` = show the iframe immediately with `opacity: 1`. Note: {@link SDKMode.Manager} and {@link SDKMode.System} force this to `false`. */
    noLoader: true,
    /** Show the search bar in selector modes. */
    withSearch: true,
    /** Show breadcrumb navigation in selector modes. */
    withBreadCrumbs: true,
    /** Show subtitle with folder description in selector modes. */
    withSubtitle: true,
    /** File type filter for the file selector. `"ALL"` = no restriction. */
    filterParam: "ALL",
    /** HEX color for the selector accept button. */
    buttonColor: "#5299E0",
    /** Show the info panel toggle button in manager mode. */
    infoPanelVisible: true,
    /** Redirect download links to {@link TFrameEvents.onDownload} instead of downloading directly. */
    downloadToEvent: false,
    /** Default filter/sort/pagination for the file list in manager mode. See {@link TFrameFilter}. */
    filter: {
      /** Items per page. */
      count: "100",
      /** Page number (1-based). */
      page: "1",
      /** Sort direction. See {@link FilterSortOrder}. */
      sortOrder: "descending" /* Descending */,
      /** Sort criterion. See {@link FilterSortBy}. */
      sortBy: "DateAndTime" /* ModifiedDate */,
      /** Search query string. Empty = no search. */
      search: "",
      /** Include items from sub-folders in search results. */
      withSubfolders: false
    },
    /** Editor customization options (toolbar, plugins, macros, etc.). See {@link TEditorCustomization}. */
    editorCustomization: {},
    /** Event handlers. All callbacks are `null` by default (disabled). See {@link TFrameEvents}. */
    events: {
      /** Fired in selector modes when a room or file is selected. Receives the selected item data. */
      onSelectCallback: null,
      /** Fired in selector modes when the dialog is closed or selection is canceled. */
      onCloseCallback: null,
      /** Fired once when the DocSpace app inside the iframe is fully initialized. */
      onAppReady: null,
      /** Fired when the DocSpace app encounters an initialization error. Receives the error message. */
      onAppError: null,
      /** Fired when the document editor is closed (via UI or programmatically). */
      onEditorCloseCallback: null,
      /** Fired after successful user authorization. */
      onAuthSuccess: null,
      /** Fired when the user signs out. */
      onSignOut: null,
      /** Fired on file download when `downloadToEvent` is `true`. Receives the download URL. */
      onDownload: null,
      /** Fired when navigating to an inaccessible or deleted room/folder. */
      onNoAccess: null,
      /** Fired when navigating to a non-existent room/folder. */
      onNotFound: null,
      /** Fired when the iframe content is fully loaded and visible. Triggered by {@link SDKInstance.setIsLoaded}. */
      onContentReady: null,
      /** Fired when the editor is opened from the manager (via context menu, hotkeys, etc.). */
      onEditorOpen: null,
      /** Fired when a file row is clicked in the manager file list. */
      onFileManagerClick: null,
      /** Fired when a file upload completes successfully. */
      onUploadSuccess: null,
      /** Fired when a file upload fails. */
      onUploadError: null,
      /** Fired on file upload progress update. */
      onUploadProgress: null,
      /** Fired when a custom context menu action is clicked in {@link SDKMode.Forms}. */
      onCustomAction: null,
      /** Fired when the user navigates to a different section in {@link SDKMode.Forms}. */
      onNavigate: null
    }
  };
  var cspErrorText = "The current domain is not set in the Content Security Policy (CSP) settings.";
  var connectErrorText = "Message bus is not connected with frame";

  // src/utils/index.ts
  var customUrlSearchParams = (data) => {
    if (!data) return "";
    Object.keys(data).forEach(
      (key) => (data[key] === void 0 || data[key] === null) && delete data[key]
    );
    return new URLSearchParams(data).toString();
  };
  var validateCSP = async (targetSrc) => {
    const { origin, host } = window.location;
    if (origin.includes(targetSrc)) return;
    const response = await fetch(`${targetSrc}${CSPApiUrl}`);
    let json;
    try {
      json = await response.json();
    } catch (error) {
      throw new Error(`CSP validation failed: ${error}`);
    }
    const {
      response: { domains }
    } = json;
    const currentSrcHost = host || new URL(origin).host;
    const normalizedDomains = domains.map((domain) => {
      try {
        const url = new URL(domain.toLowerCase());
        return url.host + (url.pathname !== "/" ? url.pathname : "");
      } catch {
        return domain;
      }
    });
    if (!normalizedDomains.includes(currentSrcHost.toLowerCase())) {
      throw new Error(cspErrorText);
    }
  };
  var getCSPErrorBody = (src) => {
    const safeSrc = src.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<body style="background:#f3f4f4"><link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,300" rel="stylesheet"><div style="display:flex;flex-direction:column;gap:80px;align-items:center;justify-content:flex-start;margin-top:60px;padding:0 30px"><div style="flex-shrink:0;position:relative"><img src="${safeSrc}/static/images/logo/lightsmall.svg"></div><div style="display:flex;flex-direction:column;gap:16px;align-items:center;justify-content:flex-start;flex-shrink:0;position:relative"><div style="flex-shrink:0;width:120px;height:100px;position:relative"><img src="${safeSrc}/static/images/frame-error.svg"></div><span style="color:#a3a9ae;text-align:center;font-family:Open Sans;font-size:14px;font-style:normal;font-weight:700;line-height:16px">${cspErrorText} Please add it via <a href="${safeSrc}/developer-tools/javascript-sdk" style="color:#4781d1;text-align:center;font-family:Open Sans;font-size:14px;font-style:normal;font-weight:700;line-height:16px;text-decoration-line:underline" target="_blank">the Developer Tools section</a>.</span></div></div></body>`;
  };
  var getLoaderStyle = (className) => {
    return `@keyframes rotate { 0%{ transform: rotate(-45deg); will-change: transform; } 15%{ transform: rotate(45deg); } 30%{ transform: rotate(135deg); } 45%{ transform: rotate(225deg); } 60%, 100%{ transform: rotate(315deg); } } .${className} { width: 74px; height: 74px; border: 4px solid rgba(51,51,51, 0.1); border-top-color: #333333; border-radius: 50%; transform: rotate(-45deg); position: relative; box-sizing: border-box; animation: 1s linear infinite rotate; will-change: transform; } @media (prefers-color-scheme: dark) { .${className} { border-color: rgba(204, 204, 204, 0.1); border-top-color: #CCCCCC; } } @media (prefers-reduced-motion: reduce) { .${className} { animation-duration: 1.5s; } }`;
  };
  var getConfigFromParams = () => {
    const scriptElement = document.currentScript;
    const searchParams = new URL(decodeURIComponent(scriptElement.src)).searchParams;
    const configTemplate = { ...defaultConfig };
    searchParams.forEach((value, key) => {
      const parsedValue = value === "true" ? true : value === "false" ? false : value;
      if (defaultConfig.filter && key in defaultConfig.filter) {
        configTemplate.filter[key] = parsedValue;
      } else {
        configTemplate[key] = parsedValue;
      }
    });
    configTemplate.mode = searchParams.get("mode") || "manager";
    configTemplate.src = searchParams.get("src") || "";
    return configTemplate;
  };
  var getFramePath = (config2) => {
    var _a;
    const baseFrameOptions = {
      theme: config2.theme,
      locale: config2.locale
    };
    const baseSelectorOptions = {
      acceptLabel: config2.acceptButtonLabel,
      cancel: config2.showSelectorCancel,
      cancelLabel: config2.cancelButtonLabel,
      header: config2.showSelectorHeader,
      roomType: config2.roomType,
      search: config2.withSearch
    };
    const baseEditorOptions = {
      isSDK: true,
      fileId: !config2.id || config2.id === "undefined" || config2.id === "null" ? -1 : config2.id,
      editorType: config2.editorType,
      share: config2.requestToken ? config2.requestToken : void 0,
      is_file: config2.requestToken ? true : void 0,
      editorGoBack: ((_a = config2.events) == null ? void 0 : _a.onEditorCloseCallback) && typeof config2.events.onEditorCloseCallback === "function" ? "event" : config2.editorGoBack ? config2.editorGoBack : void 0
    };
    switch (config2.mode) {
      case "manager" /* Manager */: {
        if (config2.id) config2.filter.folder = config2.id;
        const params = config2.requestToken ? { key: config2.requestToken, ...config2.filter } : config2.filter;
        if (!(params == null ? void 0 : params.withSubfolders)) {
          params == null ? true : delete params.withSubfolders;
        }
        const urlParams = customUrlSearchParams(params);
        return `${config2.rootPath}${config2.requestToken ? `?${urlParams}` : `${config2.id ? config2.id + "/" : ""}filter?${urlParams}`}`;
      }
      case "room-selector" /* RoomSelector */: {
        const roomSelectorConfig = {
          ...baseFrameOptions,
          ...baseSelectorOptions
        };
        const urlParams = customUrlSearchParams(roomSelectorConfig);
        return `/sdk/room-selector${urlParams ? `?${urlParams}` : ""}`;
      }
      case "file-selector" /* FileSelector */: {
        const fileSelectorConfig = {
          ...baseFrameOptions,
          ...baseSelectorOptions,
          breadCrumbs: config2.withBreadCrumbs,
          filter: config2.filterParam,
          id: config2.id,
          selectorType: config2.selectorType,
          subtitle: config2.withSubtitle
        };
        const urlParams = customUrlSearchParams(fileSelectorConfig);
        return `/sdk/file-selector${urlParams ? `?${urlParams}` : ""}`;
      }
      case "public-room" /* PublicRoom */: {
        const publicRoomConfig = {
          ...baseFrameOptions,
          folder: config2.id,
          key: config2.requestToken,
          showFilter: config2.showFilter,
          showHeader: config2.showHeader,
          showTitle: config2.showTitle
        };
        const urlParams = customUrlSearchParams(publicRoomConfig);
        return `/sdk/public-room${urlParams ? `?${urlParams}` : ""}`;
      }
      case "system" /* System */: {
        const urlParams = customUrlSearchParams(baseFrameOptions);
        return `/old-sdk/system${urlParams ? `?${urlParams}` : ""}`;
      }
      case "editor" /* Editor */: {
        const editorConfig = {
          ...baseFrameOptions,
          ...baseEditorOptions
        };
        const urlParams = customUrlSearchParams(editorConfig);
        const path = `/doceditor${urlParams ? `?${urlParams}` : ""}`;
        return path;
      }
      case "viewer" /* Viewer */: {
        const viewerConfig = {
          ...baseFrameOptions,
          ...baseEditorOptions,
          action: "view"
        };
        const urlParams = customUrlSearchParams(viewerConfig);
        const path = `/doceditor${urlParams ? `?${urlParams}` : ""}`;
        return path;
      }
      case "uploader" /* Uploader */: {
        const uploaderConfig = {
          ...baseFrameOptions,
          targetId: config2.id,
          acceptExtensions: config2.acceptExtensions,
          linkMainText: config2.linkMainText,
          secondaryText: config2.secondaryText,
          extensionsText: config2.extensionsText,
          isFolderUpload: config2.isFolderUpload,
          isMultipleUpload: config2.isMultipleUpload,
          maxPerUploadSize: config2.maxPerUploadSize,
          maxTotalUploadSize: config2.maxTotalUploadSize
        };
        const urlParams = customUrlSearchParams(uploaderConfig);
        return `/sdk/uploader${urlParams ? `?${urlParams}` : ""}`;
      }
      case "forms" /* Forms */: {
        const formsConfig = {
          ...baseFrameOptions,
          roomId: config2.id,
          libraryId: config2.libraryId,
          showMenu: config2.showMenu,
          providerName: config2.providerName,
          inviteKey: config2.inviteKey,
          emplType: config2.emplType
        };
        const urlParams = customUrlSearchParams(formsConfig);
        return `/sdk/forms/my-forms${urlParams ? `?${urlParams}` : ""}`;
      }
      default:
        return config2.rootPath || "/";
    }
  };

  // src/instance/index.ts
  var _isConnected, _callbacks, _tasks, _classNames, _expectedOrigin, _iframe, _uploadIdCounter, _pendingUploads, _createLoader, _createIframe, _SDKInstance_instances, setupCSPValidation_fn, _sendMessage, _onMessage, parseMessageData_fn, handleMethodResponse_fn, drainNextTask_fn, createMethodTimer_fn, rejectAllPending_fn, processEvent_fn, _allowedCommands, executeCommand_fn, handleError_fn, executeMethod_fn, prepareFrameConfig_fn, createContainer_fn, setupContainer_fn, setupIframe_fn, setupFrameEventHandlers_fn, assembleFrame_fn, registerFrame_fn, _getMethodPromise;
  var _SDKInstance = class _SDKInstance {
    constructor(config2) {
      __privateAdd(this, _SDKInstance_instances);
      __privateAdd(this, _isConnected, false);
      __privateAdd(this, _callbacks, []);
      __privateAdd(this, _tasks, []);
      __privateAdd(this, _classNames, "");
      __privateAdd(this, _expectedOrigin, "");
      __privateAdd(this, _iframe, null);
      __privateAdd(this, _uploadIdCounter, 0);
      __privateAdd(this, _pendingUploads, /* @__PURE__ */ new Map());
      /** The iframe configuration options. */
      __publicField(this, "config");
      /**
       * Creates a loading indicator for the DocSpace frame.
       *
       * @param config - The frame configuration containing `frameId`, `width`, and `height`.
       * @returns A container `div` element with a loader, ready for DOM insertion.
       */
      __privateAdd(this, _createLoader, (config2) => {
        const { frameId, width, height } = config2;
        const loaderClassName = `${frameId}-loader__element`;
        const templateKey = `${width}_${height}`;
        const styleCache = _SDKInstance._loaderCache.style;
        const templateCache = _SDKInstance._loaderCache.templates;
        if (!styleCache.has(loaderClassName)) {
          const style = document.createElement("style");
          style.textContent = getLoaderStyle(loaderClassName);
          const fragment = document.createDocumentFragment();
          fragment.appendChild(style);
          document.head.appendChild(fragment);
          styleCache.set(loaderClassName, style);
        }
        let container;
        if (templateCache.has(templateKey)) {
          container = templateCache.get(templateKey).cloneNode(true);
          container.id = `${frameId}-loader`;
        } else {
          container = _SDKInstance._loaderCache.container.cloneNode();
          Object.assign(container.style, {
            width,
            height,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: "1",
            backgroundColor: "transparent",
            transition: "opacity 0.15s ease-out"
          });
          const loader = document.createElement("div");
          loader.className = loaderClassName;
          container.appendChild(loader);
          templateCache.set(templateKey, container.cloneNode(true));
          container.id = `${frameId}-loader`;
        }
        return container;
      });
      /**
       * Creates and configures an iframe element for the DocSpace interface.
       *
       * @param config - The frame configuration containing `frameId`, `id`, `type`, `src`, `width`, `height`, `events`, `checkCSP`, and `mode`.
       * @returns A configured `HTMLIFrameElement`, ready for DOM insertion.
       */
      __privateAdd(this, _createIframe, (config2) => {
        if (!_SDKInstance._iframeCache) {
          const template = document.createElement("iframe");
          template.allowFullscreen = true;
          template.setAttribute("allow", "storage-access *");
          _SDKInstance._iframeCache = {
            template,
            pathCache: /* @__PURE__ */ new Map(),
            styleCache: /* @__PURE__ */ new Map()
          };
        }
        const { mode, id, frameId, type, width, height, src, events, checkCSP } = config2;
        const isMobile = type === "mobile";
        const iframe = _SDKInstance._iframeCache.template.cloneNode();
        const cacheKey = `${mode}_${id || ""}_${frameId}`;
        const styleCacheKey = `${width}_${height}_${isMobile ? "mobile" : "desktop"}`;
        let path = _SDKInstance._iframeCache.pathCache.get(cacheKey);
        if (!path) {
          path = getFramePath(config2);
          _SDKInstance._iframeCache.pathCache.set(cacheKey, path);
        }
        iframe.id = frameId;
        iframe.name = `${FRAME_NAME}__#${frameId}`;
        iframe.src = src + path;
        let styleObj = _SDKInstance._iframeCache.styleCache.get(styleCacheKey);
        if (!styleObj) {
          styleObj = {
            width,
            height,
            border: "0px",
            opacity: "0",
            ...isMobile && {
              position: "fixed",
              overflow: "hidden",
              webkitOverflowScrolling: "touch"
            }
          };
          _SDKInstance._iframeCache.styleCache.set(styleCacheKey, styleObj);
        }
        Object.assign(iframe.style, styleObj);
        if (isMobile) {
          if (document.body.style.overscrollBehaviorY !== "contain") {
            document.body.style.overscrollBehaviorY = "contain";
          }
          if ("loading" in HTMLIFrameElement.prototype) {
            iframe.loading = "eager";
          }
        }
        if (checkCSP) {
          __privateMethod(this, _SDKInstance_instances, setupCSPValidation_fn).call(this, iframe, src, events);
        }
        return iframe;
      });
      /**
       * Sends a message to the DocSpace iframe.
       *
       * @param message - The message object to send to the iframe.
       */
      __privateAdd(this, _sendMessage, (message) => {
        var _a;
        try {
          const { frameId, src } = this.config;
          if (!((_a = __privateGet(this, _iframe)) == null ? void 0 : _a.contentWindow)) return false;
          const messageEnvelope = {
            frameId,
            type: "",
            data: message
          };
          const isEditorExec = message.methodName === "executeInEditor" /* ExecuteInEditor */;
          __privateGet(this, _iframe).contentWindow.postMessage(
            JSON.stringify(messageEnvelope, (_, value) => {
              if (typeof value !== "function") return value;
              return isEditorExec ? value.toString() : true;
            }),
            src
          );
          return true;
        } catch (error) {
          __privateMethod(this, _SDKInstance_instances, handleError_fn).call(this, error);
          return false;
        }
      });
      /**
       * Handles incoming messages from the DocSpace iframe.
       *
       * @param e - The MessageEvent containing the message data.
       */
      __privateAdd(this, _onMessage, (e) => {
        try {
          if (typeof e.data !== "string") return;
          if (!__privateGet(this, _expectedOrigin) || e.origin !== __privateGet(this, _expectedOrigin)) return;
          const data = __privateMethod(this, _SDKInstance_instances, parseMessageData_fn).call(this, e.data);
          if (data.frameId === "error" && data.error) {
            __privateMethod(this, _SDKInstance_instances, handleError_fn).call(this, data.error);
            return;
          }
          if (data.frameId !== this.config.frameId) return;
          if (!__privateGet(this, _isConnected)) {
            __privateSet(this, _isConnected, true);
          }
          switch (data.type) {
            case "onMethodReturn" /* OnMethodReturn */:
              __privateMethod(this, _SDKInstance_instances, handleMethodResponse_fn).call(this, data);
              break;
            case "onEventReturn" /* OnEventReturn */:
              if (data.eventReturnData) {
                __privateMethod(this, _SDKInstance_instances, processEvent_fn).call(this, data.eventReturnData);
              }
              break;
            case "onCallCommand" /* OnCallCommand */:
              __privateMethod(this, _SDKInstance_instances, executeCommand_fn).call(this, data);
              break;
            case "error" /* Error */:
              if (data.error) {
                __privateMethod(this, _SDKInstance_instances, handleError_fn).call(this, data.error);
              }
              break;
            default:
              console.warn("Unrecognized message type:", data.type);
          }
        } catch (error) {
          __privateMethod(this, _SDKInstance_instances, handleError_fn).call(this, error);
        }
      });
      /**
       * Returns a promise that resolves with the result of executing the specified method.
       *
       * @param methodName - The name of the method to execute.
       * @param params - The parameters to pass to the method. Defaults to null.
       * @returns A promise that resolves to an object containing the result of the method execution, or the current configuration if reloaded.
       */
      __privateAdd(this, _getMethodPromise, (methodName, params = null, withReload = false) => {
        const promise = new Promise((resolve, reject) => {
          if (withReload) {
            this.initFrame(this.config);
            resolve(this.config);
          } else {
            __privateMethod(this, _SDKInstance_instances, executeMethod_fn).call(this, methodName, params, resolve, reject);
          }
        });
        promise.catch(() => {
        });
        return promise;
      });
      this.config = config2;
    }
    /**
     * Called by the DocSpace iframe (via `onCallCommand`) when the app has finished loading.
     * Fades out the loader spinner, fades in the iframe, and fires {@link TFrameEvents.onContentReady}.
     *
     * @see {@link TFrameEvents.onContentReady}
     */
    setIsLoaded() {
      const { frameId, width, height, events } = this.config;
      const targetFrame = document.getElementById(frameId);
      const parent = targetFrame == null ? void 0 : targetFrame.parentElement;
      if (!targetFrame || !parent) return;
      requestAnimationFrame(() => {
        var _a, _b;
        try {
          parent.style.width = width;
          parent.style.height = height;
          const loader = document.getElementById(`${frameId}-loader`);
          if (loader) {
            loader.style.opacity = "0";
            requestAnimationFrame(() => {
              var _a2, _b2;
              try {
                if (loader.parentNode) {
                  loader.parentNode.removeChild(loader);
                }
                (_a2 = events == null ? void 0 : events.onContentReady) == null ? void 0 : _a2.call(events);
              } catch (error) {
                console.error("Error removing loader:", error);
                (_b2 = events == null ? void 0 : events.onContentReady) == null ? void 0 : _b2.call(events);
              }
            });
          } else {
            (_a = events == null ? void 0 : events.onContentReady) == null ? void 0 : _a.call(events);
          }
          requestAnimationFrame(() => {
            Object.assign(targetFrame.style, {
              opacity: "1",
              position: "relative",
              width,
              height
            });
          });
        } catch (error) {
          console.error("Error in setIsLoaded:", error);
          (_b = events == null ? void 0 : events.onContentReady) == null ? void 0 : _b.call(events);
        }
      });
    }
    /**
     * Inserts the DocSpace iframe into the DOM element identified by {@link TFrameConfig.frameId}.
     *
     * Merges `config` with {@link defaultConfig} and the instance's stored config,
     * replaces the target `<div>` with a container holding the iframe (and an optional loader),
     * attaches the `message` listener, and registers the instance in the global
     * `DocSpace.SDK.frames` registry.
     *
     * Called automatically by {@link SDK.init}. Call again to reinitialize in-place.
     *
     * @param config - Frame configuration. See {@link TFrameConfig}.
     * @returns The created `<iframe>` element, or `null` if the target element was not found.
     *
     * @example
     * ```typescript
     * const iframe = instance.initFrame({
     *   frameId: 'ds-frame',
     *   src: 'https://docspace.example.com',
     *   mode: SDKMode.Viewer,
     *   id: 42,
     * });
     * ```
     *
     * @example
     * With event handlers — see {@link TFrameEvents} for the full list of available events.
     * ```typescript
     * const iframe = instance.initFrame({
     *   frameId: 'ds-editor',
     *   src: 'https://docspace.example.com',
     *   mode: SDKMode.Editor,
     *   id: 42,
     *   events: {
     *     onAppReady: () => console.log('ready'),
     *     onEditorOpen: () => console.log('document opened'),
     *     onEditorCloseCallback: () => history.back(),
     *   },
     * });
     * ```
     */
    initFrame(config2) {
      this.config = __privateMethod(this, _SDKInstance_instances, prepareFrameConfig_fn).call(this, config2);
      try {
        __privateSet(this, _expectedOrigin, new URL(this.config.src).origin);
      } catch {
        __privateSet(this, _expectedOrigin, "");
      }
      __privateSet(this, _isConnected, false);
      for (const entry of __privateGet(this, _callbacks)) {
        if (entry.timer) clearTimeout(entry.timer);
        entry.reject(new Error("Frame reloaded"));
      }
      __privateSet(this, _callbacks, []);
      __privateSet(this, _tasks, []);
      for (const [, pending] of __privateGet(this, _pendingUploads)) {
        clearTimeout(pending.timer);
        pending.reject(new Error("Frame reloaded"));
      }
      __privateGet(this, _pendingUploads).clear();
      const setupResult = __privateMethod(this, _SDKInstance_instances, createContainer_fn).call(this, this.config.frameId);
      if (!setupResult) return null;
      const { container, target } = setupResult;
      const iframe = __privateMethod(this, _SDKInstance_instances, setupIframe_fn).call(this);
      __privateSet(this, _iframe, iframe);
      __privateMethod(this, _SDKInstance_instances, setupFrameEventHandlers_fn).call(this, iframe);
      __privateMethod(this, _SDKInstance_instances, assembleFrame_fn).call(this, container, target, iframe);
      __privateMethod(this, _SDKInstance_instances, registerFrame_fn).call(this);
      return iframe;
    }
    /**
     * Tears down the iframe and releases all resources associated with this instance.
     *
     * Replaces the container with a plain `<div>` (preserving the original `frameId` and CSS classes),
     * removes the `message` listener, clears pending callbacks and tasks,
     * and removes the instance from the global `DocSpace.SDK.frames` registry.
     *
     * @example
     * ```typescript
     * instance.destroyFrame();
     * ```
     *
     * @example
     * Destroy and reinitialize the same frame in a different mode using {@link SDK.initEditor}.
     * ```typescript
     * instance.destroyFrame();
     * sdk.initEditor({ frameId: 'ds-frame', src: 'https://docspace.example.com', id: 99 });
     * ```
     */
    destroyFrame() {
      var _a, _b;
      const frameId = this.config.frameId;
      const containerElement = document.getElementById(`${frameId}-container`);
      const replacementDiv = document.createElement("div");
      replacementDiv.id = frameId;
      replacementDiv.className = __privateGet(this, _classNames);
      replacementDiv.innerHTML = this.config.destroyText || "";
      if (containerElement) {
        if (containerElement.parentNode) {
          containerElement.parentNode.replaceChild(
            replacementDiv,
            containerElement
          );
        } else {
          document.body.appendChild(replacementDiv);
        }
        if (_SDKInstance._iframeCache) {
          const cacheKey = `${this.config.mode}_${this.config.id || ""}_${this.config.frameId}`;
          _SDKInstance._iframeCache.pathCache.delete(cacheKey);
        }
      }
      window.removeEventListener("message", __privateGet(this, _onMessage));
      __privateSet(this, _iframe, null);
      const loaderClassName = `${frameId}-loader__element`;
      const styleEl = _SDKInstance._loaderCache.style.get(loaderClassName);
      if (styleEl == null ? void 0 : styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
      _SDKInstance._loaderCache.style.delete(loaderClassName);
      __privateSet(this, _isConnected, false);
      for (const entry of __privateGet(this, _callbacks)) {
        if (entry.timer) clearTimeout(entry.timer);
        entry.reject(new Error("Frame destroyed"));
      }
      __privateSet(this, _callbacks, []);
      __privateSet(this, _tasks, []);
      for (const [, pending] of __privateGet(this, _pendingUploads)) {
        clearTimeout(pending.timer);
        pending.reject(new Error("Frame destroyed"));
      }
      __privateGet(this, _pendingUploads).clear();
      const sdkFrames = (_b = (_a = window.DocSpace) == null ? void 0 : _a.SDK) == null ? void 0 : _b.frames;
      if (sdkFrames && frameId in sdkFrames) {
        delete sdkFrames[frameId];
      }
    }
    /**
     * Merges `config` into the stored config and sends it to the iframe.
     *
     * When `reload` is `true`, reinitializes the iframe entirely via {@link SDKInstance.initFrame}
     * instead of sending a postMessage update.
     *
     * @param config - Partial frame configuration to merge. Defaults to {@link defaultConfig}.
     * @param reload - When `true`, reinitializes the frame. Defaults to `false`.
     * @returns A promise that resolves with the iframe's response, or with the merged config if `reload` is `true`.
     *
     * @example
     * ```typescript
     * await instance.setConfig({ theme: Theme.Dark, locale: 'fr-FR' });
     * ```
     *
     * @example
     * Switch to a different document while keeping existing settings —
     * read them first via {@link SDKInstance.getConfig}.
     * ```typescript
     * const current = instance.getConfig();
     * await instance.setConfig({ ...current, id: 99, mode: SDKMode.Editor }, true);
     * ```
     */
    setConfig(config2 = defaultConfig, reload = false) {
      this.config = { ...this.config, ...config2 };
      if (config2.src) {
        try {
          __privateSet(this, _expectedOrigin, new URL(this.config.src).origin);
        } catch {
          __privateSet(this, _expectedOrigin, "");
        }
      }
      return __privateGet(this, _getMethodPromise).call(this, "setConfig" /* SetConfig */, this.config, reload);
    }
    /**
     * Returns the current merged configuration object.
     *
     * @returns The active {@link TFrameConfig} for this instance.
     *
     * @example
     * ```typescript
     * const config = instance.getConfig();
     * console.log(config.mode, config.src);
     * ```
     *
     * @example
     * Preserve existing settings when making a partial update via {@link SDKInstance.setConfig}.
     * ```typescript
     * const config = instance.getConfig();
     * await instance.setConfig({ ...config, theme: Theme.Dark });
     * ```
     */
    getConfig() {
      return { ...this.config };
    }
    /**
     * Returns metadata about the folder currently open in the frame.
     *
     * @returns A promise that resolves with folder metadata.
     *
     * @example
     * ```typescript
     * const info = await instance.getFolderInfo();
     * console.log(info);
     * ```
     *
     * @example
     * Check write access before calling {@link SDKInstance.createFolder}.
     * ```typescript
     * const info = await instance.getFolderInfo();
     * if (info.security?.create) {
     *   await instance.createFolder(info.id, 'Archive');
     * }
     * ```
     */
    getFolderInfo() {
      return __privateGet(this, _getMethodPromise).call(this, "getFolderInfo" /* GetFolderInfo */);
    }
    /**
     * Returns the items currently selected in the frame.
     *
     * @returns A promise that resolves with the selection data.
     *
     * @example
     * ```typescript
     * const selection = await instance.getSelection();
     * console.log(selection);
     * ```
     *
     * @example
     * Pass the selection as context to {@link SDKInstance.openModal}.
     * ```typescript
     * const selection = await instance.getSelection();
     * if (selection.length > 0) {
     *   await instance.openModal('share', { items: selection });
     * }
     * ```
     */
    getSelection() {
      return __privateGet(this, _getMethodPromise).call(this, "getSelection" /* GetSelection */);
    }
    /**
     * Returns the files in the folder currently open in the frame.
     *
     * @returns A promise that resolves with file list data.
     *
     * @example
     * ```typescript
     * const files = await instance.getFiles();
     * console.log(files);
     * ```
     *
     * @example
     * Open the first file in viewer mode via {@link SDKInstance.setConfig}.
     * ```typescript
     * const files = await instance.getFiles();
     * if (files[0]) {
     *   await instance.setConfig({ id: files[0].id, mode: SDKMode.Viewer }, true);
     * }
     * ```
     */
    getFiles() {
      return __privateGet(this, _getMethodPromise).call(this, "getFiles" /* GetFiles */);
    }
    /**
     * Returns the subfolders of the folder currently open in the frame.
     *
     * @returns A promise that resolves with folder list data.
     *
     * @example
     * ```typescript
     * const folders = await instance.getFolders();
     * console.log(folders);
     * ```
     *
     * @example
     * Navigate into the first subfolder via {@link SDKInstance.setConfig}.
     * ```typescript
     * const folders = await instance.getFolders();
     * if (folders[0]) {
     *   await instance.setConfig({ id: folders[0].id }, true);
     * }
     * ```
     */
    getFolders() {
      return __privateGet(this, _getMethodPromise).call(this, "getFolders" /* GetFolders */);
    }
    /**
     * Returns all files and folders in the folder currently open in the frame.
     *
     * Use {@link SDKInstance.getFiles} or {@link SDKInstance.getFolders}
     * when you need only one content type.
     *
     * @returns A promise that resolves with combined file and folder list data.
     *
     * @example
     * ```typescript
     * const list = await instance.getList();
     * console.log(list);
     * ```
     *
     * @example
     * ```typescript
     * // Separate files from folders by type
     * const list = await instance.getList();
     * const files = list.filter((item) => item.type === 'file');
     * const folders = list.filter((item) => item.type === 'folder');
     * console.log(`${files.length} files, ${folders.length} folders`);
     * ```
     */
    getList() {
      return __privateGet(this, _getMethodPromise).call(this, "getList" /* GetList */);
    }
    /**
     * Returns a list of rooms, filtered by `filter`.
     *
     * @param filter - Filter and sort criteria. See {@link TFrameFilter}.
     * @returns A promise that resolves with room list data.
     *
     * @example
     * ```typescript
     * const rooms = await instance.getRooms({
     *   search: 'alpha',
     *   sortBy: FilterSortBy.Name,
     *   sortOrder: FilterSortOrder.Ascending,
     * });
     * console.log(rooms);
     * ```
     *
     * @example
     * Find rooms and remove an outdated tag from each using {@link SDKInstance.removeTagsFromRoom}.
     * ```typescript
     * const rooms = await instance.getRooms({ search: 'sprint-22' });
     * for (const room of rooms) {
     *   await instance.removeTagsFromRoom(room.id, ['in-progress']);
     * }
     * ```
     */
    getRooms(filter) {
      return __privateGet(this, _getMethodPromise).call(this, "getRooms" /* GetRooms */, filter);
    }
    /**
     * Returns information about the currently authenticated user.
     *
     * @returns A promise that resolves with user profile data.
     *
     * @example
     * ```typescript
     * const user = await instance.getUserInfo();
     * console.log(user);
     * ```
     *
     * @example
     * Apply the user's preferred locale via {@link SDKInstance.setConfig}.
     * ```typescript
     * const user = await instance.getUserInfo();
     * if (user.cultureName) {
     *   await instance.setConfig({ locale: user.cultureName });
     * }
     * ```
     */
    getUserInfo() {
      return __privateGet(this, _getMethodPromise).call(this, "getUserInfo" /* GetUserInfo */);
    }
    /**
     * Returns the server's password hash settings needed by {@link SDKInstance.createHash}.
     *
     * @returns A promise that resolves with hash algorithm settings.
     *
     * @example
     * ```typescript
     * const settings = await instance.getHashSettings();
     * console.log(settings);
     * ```
     *
     * @example
     * Full authentication flow using {@link SDKInstance.createHash} and {@link SDKInstance.login}.
     * ```typescript
     * const settings = await instance.getHashSettings();
     * const hash = await instance.createHash('p@ssw0rd', settings);
     * await instance.login('user@example.com', hash);
     * ```
     */
    getHashSettings() {
      return __privateGet(this, _getMethodPromise).call(this, "getHashSettings" /* GetHashSettings */);
    }
    /**
     * Opens a modal dialog of the specified type inside the frame.
     *
     * @param type - The modal type identifier.
     * @param options - Modal-specific configuration options.
     * @returns A promise that resolves with the modal result.
     *
     * @example
     * ```typescript
     * const result = await instance.openModal('invite', { roomId: 42 });
     * console.log(result);
     * ```
     *
     * @example
     * Open a share dialog for the items currently selected in the frame using {@link SDKInstance.getSelection}.
     * ```typescript
     * const selection = await instance.getSelection();
     * if (selection.length > 0) {
     *   await instance.openModal('share', { items: selection });
     * }
     * ```
     */
    openModal(type, options) {
      return __privateGet(this, _getMethodPromise).call(this, "openModal" /* OpenModal */, { type, options });
    }
    /**
     * Creates a new file in the specified folder.
     *
     * @param folderId - The ID of the target folder.
     * @param title - The file title (without extension).
     * @param templateId - The ID of the template to use for the new file.
     * @param formId - The ID of the associated form, or an empty string if none.
     * @returns A promise that resolves with the created file data.
     *
     * @example
     * ```typescript
     * const file = await instance.createFile('folder-123', 'Project Proposal', 'template-456', '');
     * console.log(file);
     * ```
     *
     * @example
     * Create a file and immediately open it in the editor using {@link SDKInstance.setConfig}.
     * ```typescript
     * const file = await instance.createFile('folder-123', 'Report', 'template-456', '');
     * await instance.setConfig({ id: file.id, mode: SDKMode.Editor }, true);
     * ```
     */
    createFile(folderId, title, templateId, formId) {
      return __privateGet(this, _getMethodPromise).call(this, "createFile" /* CreateFile */, {
        folderId,
        title,
        templateId,
        formId
      });
    }
    /**
     * Creates a new folder inside the specified parent folder.
     *
     * @param parentFolderId - The ID of the parent folder.
     * @param title - The folder title.
     * @returns A promise that resolves with the created folder data.
     *
     * @example
     * ```typescript
     * const folder = await instance.createFolder('parent-123', 'Archive');
     * console.log(folder);
     * ```
     *
     * @example
     * Create a folder and immediately add a file inside it using {@link SDKInstance.createFile}.
     * ```typescript
     * const folder = await instance.createFolder('parent-123', 'Q1 Reports');
     * await instance.createFile(folder.id, 'Summary', 'template-456', '');
     * ```
     */
    createFolder(parentFolderId, title) {
      return __privateGet(this, _getMethodPromise).call(this, "createFolder" /* CreateFolder */, {
        parentFolderId,
        title
      });
    }
    /**
     * Creates a new room with the given type and optional settings.
     *
     * @param title - The room display name.
     * @param roomType - The room type (e.g. `'collaboration'`, `'public'`).
     * @param quota - Optional storage quota in bytes.
     * @param tags - Optional tag names to assign.
     * @param color - Optional accent color (hex).
     * @param cover - Optional cover image URL.
     * @param indexing - Optional VDR indexing flag.
     * @param denyDownload - Optional VDR download restriction flag.
     * @returns A promise that resolves with the created room data.
     *
     * @example
     * ```typescript
     * const room = await instance.createRoom('Design Team', 'collaboration', undefined, ['design']);
     * console.log(room);
     * ```
     *
     * @example
     * Create a room, then create a new tag and apply it using {@link SDKInstance.createTag}
     * and {@link SDKInstance.addTagsToRoom}.
     * ```typescript
     * const room = await instance.createRoom('Marketing', 'collaboration');
     * await instance.createTag('campaigns');
     * await instance.addTagsToRoom(room.id, ['campaigns']);
     * ```
     */
    createRoom(title, roomType, quota, tags, color, cover, indexing, denyDownload) {
      return __privateGet(this, _getMethodPromise).call(this, "createRoom" /* CreateRoom */, {
        title,
        roomType,
        ...quota !== void 0 && { quota },
        ...denyDownload !== void 0 && { denyDownload },
        ...tags !== void 0 && { tags },
        ...color !== void 0 && { color },
        ...cover !== void 0 && { cover },
        ...indexing !== void 0 && { indexing }
      });
    }
    /**
     * Switches the file list display mode.
     *
     * @param viewType - The view mode: `"row"`, `"table"`, or `"tile"`.
     * @returns A promise that resolves with the result of the operation.
     *
     * @example
     * ```typescript
     * await instance.setListView('table');
     * ```
     *
     * @example
     * Switch to tile view only when in manager mode — read the current mode via {@link SDKInstance.getConfig}.
     * ```typescript
     * const { mode } = instance.getConfig();
     * if (mode === SDKMode.Manager) {
     *   await instance.setListView('tile');
     * }
     * ```
     */
    setListView(viewType) {
      return __privateGet(this, _getMethodPromise).call(this, "setListView" /* SetListView */, { viewType });
    }
    /**
     * Creates a password hash using the provided hash settings.
     *
     * Obtain `hashSettings` from {@link SDKInstance.getHashSettings} before calling this method.
     *
     * @param password - The plaintext password to hash.
     * @param hashSettings - Hash algorithm settings from {@link SDKInstance.getHashSettings}.
     * @returns A promise that resolves with the generated hash.
     *
     * @example
     * ```typescript
     * const settings = await instance.getHashSettings();
     * const hash = await instance.createHash('p@ssw0rd', settings);
     * console.log(hash);
     * ```
     *
     * @example
     * Full login flow using {@link SDKInstance.getHashSettings} and {@link SDKInstance.login}.
     * ```typescript
     * const settings = await instance.getHashSettings();
     * const hash = await instance.createHash('p@ssw0rd', settings);
     * await instance.login('user@example.com', hash, undefined, true);
     * ```
     */
    createHash(password, hashSettings) {
      return __privateGet(this, _getMethodPromise).call(this, "createHash" /* CreateHash */, {
        password,
        hashSettings
      });
    }
    /**
     * Authenticates a user using email and a hashed password.
     *
     * Obtain `passwordHash` from {@link SDKInstance.createHash}. The plaintext `password`
     * parameter is an alternative for development only — prefer hashing in production.
     *
     * @param email - The user's email address.
     * @param passwordHash - The hashed password (from {@link SDKInstance.createHash}).
     * @param password - Optional plaintext password (development use only).
     * @param session - Whether to create a persistent session. Defaults to `false`.
     * @returns A promise that resolves with the authentication result.
     *
     * @example
     * Login with a pre-hashed password from {@link SDKInstance.createHash}.
     * ```typescript
     * await instance.login('user@example.com', passwordHash);
     * ```
     *
     * @example
     * Full authentication flow using {@link SDKInstance.getHashSettings} and {@link SDKInstance.createHash}.
     * ```typescript
     * const settings = await instance.getHashSettings();
     * const hash = await instance.createHash('p@ssw0rd', settings);
     * const result = await instance.login('user@example.com', hash, undefined, true);
     * console.log(result);
     * ```
     */
    login(email, passwordHash, password, session) {
      return __privateGet(this, _getMethodPromise).call(this, "login" /* Login */, {
        email,
        passwordHash,
        ...password !== void 0 && { password },
        ...session !== void 0 && { session }
      });
    }
    /**
     * Ends the current user session.
     *
     * @returns A promise that resolves with the logout result.
     *
     * @example
     * ```typescript
     * await instance.logout();
     * ```
     *
     * @example
     * Log out and immediately authenticate as a different user using {@link SDKInstance.getHashSettings},
     * {@link SDKInstance.createHash}, and {@link SDKInstance.login}.
     * ```typescript
     * await instance.logout();
     * const settings = await instance.getHashSettings();
     * const hash = await instance.createHash('newpassword', settings);
     * await instance.login('other@example.com', hash);
     * ```
     */
    logout() {
      return __privateGet(this, _getMethodPromise).call(this, "logout" /* Logout */);
    }
    /**
     * Creates a new tag with the given name.
     *
     * @param name - The tag name.
     * @returns A promise that resolves with the created tag data.
     *
     * @example
     * ```typescript
     * const tag = await instance.createTag('Project Alpha');
     * console.log(tag);
     * ```
     *
     * @example
     * Create a tag and immediately apply it to a room using {@link SDKInstance.addTagsToRoom}.
     * ```typescript
     * await instance.createTag('archived');
     * await instance.addTagsToRoom('room-123', ['archived']);
     * ```
     */
    createTag(name) {
      return __privateGet(this, _getMethodPromise).call(this, "createTag" /* CreateTag */, { name });
    }
    /**
     * Adds the specified tags to a room.
     *
     * @param roomId - The room ID.
     * @param tags - Tag names to add.
     * @returns A promise that resolves with the result of the operation.
     *
     * @example
     * ```typescript
     * await instance.addTagsToRoom('room-123', ['design', 'q1']);
     * ```
     *
     * @example
     * Create a new tag with {@link SDKInstance.createTag} and apply it
     * to a newly created room via {@link SDKInstance.createRoom}.
     * ```typescript
     * await instance.createTag('design');
     * const room = await instance.createRoom('Creative Hub', 'collaboration');
     * await instance.addTagsToRoom(room.id, ['design']);
     * ```
     */
    addTagsToRoom(roomId, tags) {
      return __privateGet(this, _getMethodPromise).call(this, "addTagsToRoom" /* AddTagsToRoom */, {
        roomId,
        tags
      });
    }
    /**
     * Removes the specified tags from a room.
     *
     * @param roomId - The room ID.
     * @param tags - Tag names to remove.
     * @returns A promise that resolves with the result of the operation.
     *
     * @example
     * ```typescript
     * await instance.removeTagsFromRoom('room-123', ['draft', 'in-progress']);
     * ```
     *
     * @example
     * Find rooms by name and clean up a tag from each using {@link SDKInstance.getRooms}.
     * ```typescript
     * const rooms = await instance.getRooms({ search: 'sprint-22' });
     * for (const room of rooms) {
     *   await instance.removeTagsFromRoom(room.id, ['in-progress']);
     * }
     * ```
     */
    removeTagsFromRoom(roomId, tags) {
      return __privateGet(this, _getMethodPromise).call(this, "removeTagsFromRoom" /* RemoveTagsFromRoom */, {
        roomId,
        tags
      });
    }
    /**
     * Runs a callback function inside the active document editor.
     *
     * Only meaningful when the frame is in {@link SDKMode.Editor} or {@link SDKMode.Viewer} mode.
     *
     * @param callback - The function to run inside the editor context.
     * @param data - Optional data passed as the second argument to `callback`.
     *
     * @example
     * ```typescript
     * instance.executeInEditor((editor, data) => {
     *   editor.insertText(data.text);
     * }, { text: 'Hello, World!' });
     * ```
     *
     * @example
     * Initialize editor mode with {@link SDK.initEditor} and inject content when the document is ready.
     * ```typescript
     * const instance = sdk.initEditor({
     *   frameId: 'ds-editor',
     *   src: 'https://docspace.example.com',
     *   id: 42,
     *   events: {
     *     onEditorOpen: () => {
     *       instance.executeInEditor((editor, data) => {
     *         editor.insertText(data.header);
     *       }, { header: 'Generated by SDK' });
     *     },
     *   },
     * });
     * ```
     */
    executeInEditor(callback, data) {
      void __privateGet(this, _getMethodPromise).call(this, "executeInEditor" /* ExecuteInEditor */, {
        callback,
        data
      });
    }
    /**
     * Navigates the Forms frame to a specific section.
     * Only works in {@link SDKMode.Forms} mode.
     *
     * @param section - Target section: `"my-forms"`, `"in-progress"`, `"completed-forms"`, `"library"`, or `"settings"`.
     * @returns A promise that resolves when the navigation is complete.
     *
     * @example
     * ```typescript
     * await instance.navigateSection("completed-forms");
     * ```
     *
     * @example
     * Initialize Forms and navigate to the library section.
     * ```typescript
     * const forms = sdk.initForms({
     *   frameId: 'ds-forms',
     *   src: 'https://docspace.example.com',
     *   id: 'room-42',
     * });
     * await forms.navigateSection("library");
     * ```
     */
    navigateSection(section) {
      if (this.config.mode !== "forms" /* Forms */) {
        throw new Error("navigateSection is only available in Forms mode");
      }
      return __privateGet(this, _getMethodPromise).call(this, "navigateSection" /* NavigateSection */, { section });
    }
    /**
     * Registers custom context menu actions for files and/or folders.
     * Only works in {@link SDKMode.Forms} mode.
     * When a custom action is clicked, {@link TFrameEvents.onCustomAction} fires with the action key and item data.
     *
     * @param config - Custom actions configuration. See {@link TCustomActionsConfig}.
     * @returns A promise that resolves when actions are registered.
     *
     * @example
     * ```typescript
     * await instance.setCustomActions({
     *   contextMenu: {
     *     file: [
     *       { key: "send-to-crm", label: "Send to CRM", icon: "https://example.com/icon.svg" },
     *       { key: "export", label: "Export", section: ["completed-forms"] },
     *     ],
     *   },
     * });
     * ```
     *
     * @example
     * Handle the custom action event on the host page.
     * ```typescript
     * const forms = sdk.initForms({
     *   frameId: 'ds-forms',
     *   src: 'https://docspace.example.com',
     *   id: 'room-42',
     *   events: {
     *     onCustomAction: (data) => console.log('action:', data),
     *   },
     * });
     * await forms.setCustomActions({
     *   contextMenu: { file: [{ key: "approve", label: "Approve" }] },
     * });
     * ```
     */
    setCustomActions(config2) {
      if (this.config.mode !== "forms" /* Forms */) {
        throw new Error("setCustomActions is only available in Forms mode");
      }
      return __privateGet(this, _getMethodPromise).call(this, "setCustomActions" /* SetCustomActions */, config2);
    }
    /**
     * Uploads a file into the current room.
     * Only works in {@link SDKMode.Forms} mode.
     * The file is transferred to the iframe via zero-copy ArrayBuffer and uploaded
     * using the chunked upload API. The form list refreshes automatically when complete.
     *
     * @param file - The file to upload. Callers should validate type and size before calling.
     * @returns A promise that resolves with upload result from the iframe,
     *   or rejects if the iframe reports an error via `onUploadError`.
     *
     * @remarks
     * The entire file is read into memory via `arrayBuffer()` before transfer.
     * Callers should validate file size before invoking this method to avoid
     * excessive memory usage on the host page. The server-side upload limit
     * is configured in DocSpace and will reject files that exceed it.
     *
     * The ArrayBuffer is transferred to the iframe (zero-copy). After `upload()`
     * returns, the buffer is neutered and cannot be reused.
     *
     * @example
     * ```typescript
     * const input = document.querySelector("input[type=file]");
     * const file = input.files[0];
     * const result = await instance.upload(file);
     * ```
     *
     * @example
     * Upload with error handling.
     * ```typescript
     * try {
     *   await forms.upload(file);
     *   console.log("Upload complete");
     * } catch (err) {
     *   console.error("Upload failed:", err.message);
     * }
     * ```
     */
    async upload(file) {
      var _a;
      if (this.config.mode !== "forms" /* Forms */) {
        throw new Error("upload is only available in Forms mode");
      }
      if (!__privateGet(this, _isConnected)) {
        __privateMethod(this, _SDKInstance_instances, handleError_fn).call(this, { message: connectErrorText });
        throw new Error(connectErrorText);
      }
      const { frameId, src } = this.config;
      if (!((_a = __privateGet(this, _iframe)) == null ? void 0 : _a.contentWindow)) {
        throw new Error("Frame not connected");
      }
      const buffer = await file.arrayBuffer();
      const uploadId = ++__privateWrapper(this, _uploadIdCounter)._;
      const uploadPromise = new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          __privateGet(this, _pendingUploads).delete(uploadId);
          reject(new Error(`Upload timed out: ${file.name}`));
        }, 12e4);
        __privateGet(this, _pendingUploads).set(uploadId, { fileName: file.name, resolve, reject, timer });
      });
      __privateGet(this, _iframe).contentWindow.postMessage(
        {
          frameId,
          type: "uploadFileData" /* UploadFileData */,
          fileName: file.name,
          fileSize: file.size,
          lastModified: file.lastModified,
          buffer
        },
        src,
        [buffer]
      );
      return uploadPromise;
    }
  };
  _isConnected = new WeakMap();
  _callbacks = new WeakMap();
  _tasks = new WeakMap();
  _classNames = new WeakMap();
  _expectedOrigin = new WeakMap();
  _iframe = new WeakMap();
  _uploadIdCounter = new WeakMap();
  _pendingUploads = new WeakMap();
  _createLoader = new WeakMap();
  _createIframe = new WeakMap();
  _SDKInstance_instances = new WeakSet();
  /**
   * Sets up Content Security Policy (CSP) validation for the iframe.
   *
   * @param iframe - The iframe element to validate.
   * @param src - The source URL to validate.
   * @param events - Optional event handlers triggered on validation errors.
   */
  setupCSPValidation_fn = function(iframe, src, events) {
    requestAnimationFrame(() => {
      validateCSP(src).catch((e) => {
        var _a;
        (_a = events == null ? void 0 : events.onAppError) == null ? void 0 : _a.call(events, e.message);
        iframe.srcdoc = getCSPErrorBody(src);
        this.setIsLoaded();
      });
    });
  };
  _sendMessage = new WeakMap();
  _onMessage = new WeakMap();
  /**
   * Parses JSON message data from the DocSpace iframe.
   *
   * @param data - The JSON string to be parsed.
   * @returns The parsed message data, or an error object if parsing fails.
   */
  parseMessageData_fn = function(data) {
    try {
      const parsed = JSON.parse(data);
      if (!parsed || typeof parsed !== "object") {
        throw new Error("Invalid message structure");
      }
      if (!parsed.frameId) {
        parsed.frameId = "";
      }
      return parsed;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown parsing error";
      console.warn("Failed to parse message:", errorMessage);
      return {
        frameId: "error",
        type: "error" /* Error */,
        commandName: "parseMessageData",
        error: {
          message: "Invalid message format: " + errorMessage
        }
      };
    }
  };
  /**
   * Processes method response messages and executes the corresponding callbacks.
   *
   * @param data - The message data containing the method response.
   */
  handleMethodResponse_fn = function(data) {
    const entry = __privateGet(this, _callbacks).shift();
    if (entry) {
      if (entry.timer) clearTimeout(entry.timer);
      try {
        entry.resolve(data.methodReturnData || {});
      } catch (error) {
        console.error("Error in callback execution:", error);
      }
    }
    __privateMethod(this, _SDKInstance_instances, drainNextTask_fn).call(this);
  };
  /**
   * Sends the next queued task and starts its timeout timer.
   * @internal
   */
  drainNextTask_fn = function() {
    if (__privateGet(this, _tasks).length === 0 || __privateGet(this, _callbacks).length === 0) return;
    const nextTask = __privateGet(this, _tasks).shift();
    const nextEntry = __privateGet(this, _callbacks)[0];
    if (nextEntry) {
      nextEntry.timer = __privateMethod(this, _SDKInstance_instances, createMethodTimer_fn).call(this, nextEntry);
    }
    if (!__privateGet(this, _sendMessage).call(this, nextTask)) {
      __privateMethod(this, _SDKInstance_instances, rejectAllPending_fn).call(this, "Frame disconnected");
    }
  };
  /**
   * Creates a timeout timer for an in-flight method call.
   * @internal
   */
  createMethodTimer_fn = function(entry) {
    return setTimeout(() => {
      const idx = __privateGet(this, _callbacks).indexOf(entry);
      if (idx !== -1) __privateGet(this, _callbacks).splice(idx, 1);
      entry.reject(new Error("Method call timed out"));
      __privateMethod(this, _SDKInstance_instances, handleError_fn).call(this, { message: "Method call timed out" });
      __privateMethod(this, _SDKInstance_instances, drainNextTask_fn).call(this);
    }, this.config.methodTimeout || 3e4);
  };
  /**
   * Rejects all pending method callbacks and clears the queue.
   * @internal
   */
  rejectAllPending_fn = function(reason) {
    const entries = [...__privateGet(this, _callbacks)];
    __privateSet(this, _callbacks, []);
    __privateSet(this, _tasks, []);
    for (const entry of entries) {
      if (entry.timer) clearTimeout(entry.timer);
      entry.reject(new Error(reason));
    }
    __privateSet(this, _isConnected, false);
    __privateMethod(this, _SDKInstance_instances, handleError_fn).call(this, { message: reason });
  };
  /**
   * Processes event data received from the DocSpace iframe and dispatches it to the registered event handlers.
   *
   * @param eventData - The optional event data containing the event name and payload.
   */
  processEvent_fn = function(eventData) {
    var _a;
    if (!(eventData == null ? void 0 : eventData.event)) return;
    const eventName = eventData.event;
    if (__privateGet(this, _pendingUploads).size > 0 && (eventName === "onUploadSuccess" || eventName === "onUploadError")) {
      const payload = eventData.data;
      const fileName = payload == null ? void 0 : payload.fileName;
      let matchedId;
      if (fileName) {
        for (const [id, entry] of __privateGet(this, _pendingUploads)) {
          if (entry.fileName === fileName) {
            matchedId = id;
            break;
          }
        }
      } else if (__privateGet(this, _pendingUploads).size > 0) {
        matchedId = __privateGet(this, _pendingUploads).keys().next().value;
      }
      if (matchedId !== void 0) {
        const pending = __privateGet(this, _pendingUploads).get(matchedId);
        clearTimeout(pending.timer);
        __privateGet(this, _pendingUploads).delete(matchedId);
        if (eventName === "onUploadSuccess") {
          pending.resolve(eventData.data || {});
        } else {
          pending.reject(new Error((payload == null ? void 0 : payload.message) || "Upload failed"));
        }
      }
    }
    const handler = (_a = this.config.events) == null ? void 0 : _a[eventName];
    if (typeof handler === "function") {
      try {
        handler(eventData.data || {});
      } catch (error) {
        console.error("Event handler failed:", eventName, error);
      }
    }
  };
  _allowedCommands = new WeakMap();
  /**
   * Executes commands received from the DocSpace iframe by invoking the corresponding SDK method.
   * Only methods listed in {@link SDKInstance.#allowedCommands} are callable.
   *
   * @param data - The message data containing the command name and parameters.
   */
  executeCommand_fn = function(data) {
    if (!data.commandName) return;
    if (!__privateGet(_SDKInstance, _allowedCommands).has(data.commandName)) {
      console.warn("Blocked iframe command not in allowlist:", data.commandName);
      return;
    }
    const command = this[data.commandName];
    if (typeof command === "function") {
      command.call(this, data.commandData);
    }
  };
  /**
   * Handles errors by logging them to the console and notifying the registered error handlers.
   *
   * @param error - The error object containing error information.
   */
  handleError_fn = function(error) {
    var _a, _b;
    console.error("SDK Error:", error);
    (_b = (_a = this.config.events) == null ? void 0 : _a.onAppError) == null ? void 0 : _b.call(
      _a,
      error.message || "Unknown error occurred"
    );
  };
  /**
   * Executes methods on the DocSpace iframe using message-based communication.
   *
   * @param methodName - The name of the DocSpace method to execute.
   * @param params - The parameters for the method, or null if none are required.
   * @param callback - The function called with the response data when execution completes.
   */
  executeMethod_fn = function(methodName, params, resolve, reject) {
    if (!__privateGet(this, _isConnected) && methodName !== "setConfig" /* SetConfig */) {
      __privateMethod(this, _SDKInstance_instances, handleError_fn).call(this, { message: connectErrorText });
      reject(new Error(connectErrorText));
      return;
    }
    const entry = { resolve, reject, timer: null };
    __privateGet(this, _callbacks).push(entry);
    const message = { type: "method", methodName, data: params };
    if (__privateGet(this, _callbacks).length > 1) {
      __privateGet(this, _tasks).push(message);
    } else {
      entry.timer = __privateMethod(this, _SDKInstance_instances, createMethodTimer_fn).call(this, entry);
      if (!__privateGet(this, _sendMessage).call(this, message)) {
        __privateGet(this, _callbacks).pop();
        if (entry.timer) clearTimeout(entry.timer);
        __privateMethod(this, _SDKInstance_instances, handleError_fn).call(this, { message: connectErrorText });
        reject(new Error(connectErrorText));
      }
    }
  };
  /**
   * Merges user configuration with instance and system defaults.
   *
   * @param config - The user-provided configuration object.
   * @returns The merged configuration, ready for frame initialization.
   */
  prepareFrameConfig_fn = function(config2) {
    const mergedConfig = { ...defaultConfig, ...this.config, ...config2 };
    if (mergedConfig.mode === "manager" || mergedConfig.mode === "system") {
      mergedConfig.noLoader = false;
    }
    if (mergedConfig.mode === "forms" /* Forms */) {
      if (mergedConfig.showMenu === void 0) {
        mergedConfig.showMenu = true;
      }
      mergedConfig.noLoader = true;
    }
    return mergedConfig;
  };
  /**
   * Creates a container element for frame initialization and handles cleanup of any existing container.
   *
   * @param targetId - The ID of the DOM element to be replaced by the container.
   * @returns An object containing the container and target elements, or null if the target element was not found.
   */
  createContainer_fn = function(targetId) {
    const target = document.getElementById(targetId);
    if (!target) return null;
    const existingContainer = document.getElementById(`${targetId}-container`);
    if (existingContainer) {
      const parentNode = existingContainer.parentNode;
      if (parentNode) {
        const restoredTarget = document.createElement("div");
        restoredTarget.id = targetId;
        parentNode.replaceChild(restoredTarget, existingContainer);
        const cacheKey = `${this.config.mode}_${this.config.id || ""}_${this.config.frameId}`;
        _SDKInstance._iframeCache.pathCache.delete(cacheKey);
        return __privateMethod(this, _SDKInstance_instances, setupContainer_fn).call(this, restoredTarget);
      }
    }
    __privateSet(this, _classNames, target.className);
    return __privateMethod(this, _SDKInstance_instances, setupContainer_fn).call(this, target);
  };
  /**
   * Configures and styles the container element for frame presentation.
   *
   * @param target - The DOM element to be replaced by the container.
   * @returns An object containing the configured container and the target element.
   */
  setupContainer_fn = function(target) {
    const renderContainer = document.createElement("div");
    renderContainer.id = target.id + "-container";
    renderContainer.className = "frame-container";
    Object.assign(renderContainer.style, {
      position: "relative",
      width: this.config.width,
      height: this.config.height
    });
    return { container: renderContainer, target };
  };
  /**
   * Creates and applies styling to the iframe element for DocSpace integration.
   *
   * @returns The configured `HTMLIFrameElement`, ready for DOM insertion.
   */
  setupIframe_fn = function() {
    const iframe = __privateGet(this, _createIframe).call(this, this.config);
    Object.assign(iframe.style, {
      opacity: this.config.noLoader ? "1" : "0",
      zIndex: "2",
      position: this.config.noLoader ? "relative" : "absolute",
      width: this.config.noLoader ? this.config.width : "100%",
      height: this.config.noLoader ? this.config.height : "100%",
      top: "0",
      left: "0"
    });
    return iframe;
  };
  /**
   * Sets up event handlers for iframe loading and message communication.
   *
   * @param iframe - The `HTMLIFrameElement` to attach event handlers.
   */
  setupFrameEventHandlers_fn = function(iframe) {
    window.removeEventListener("message", __privateGet(this, _onMessage));
    window.addEventListener("message", __privateGet(this, _onMessage), false);
    const handleFrameLoad = () => {
      var _a, _b;
      __privateSet(this, _isConnected, true);
      if (this.config.noLoader) {
        (_b = (_a = this.config.events) == null ? void 0 : _a.onContentReady) == null ? void 0 : _b.call(_a);
      }
      iframe.removeEventListener("load", handleFrameLoad);
    };
    iframe.addEventListener("load", handleFrameLoad);
  };
  /**
   * Assembles and integrates frame components into the DOM.
   *
   * @param container - The container element for the frame components.
   * @param target - The target element to be replaced, or null if not required.
   * @param iframe - The configured `HTMLIFrameElement` for DocSpace integration.
   * @returns The integrated iframe element, ready for communication.
   */
  assembleFrame_fn = function(container, target, iframe) {
    const fragment = document.createDocumentFragment();
    if (!this.config.waiting || this.config.mode === "system") {
      fragment.appendChild(iframe);
    }
    if (!this.config.noLoader) {
      const frameLoader = __privateGet(this, _createLoader).call(this, this.config);
      fragment.appendChild(frameLoader);
    } else {
      container.style.height = this.config.height;
      container.style.width = this.config.width;
    }
    container.appendChild(fragment);
    if (target == null ? void 0 : target.parentNode) {
      target.parentNode.insertBefore(container, target);
      target.remove();
    } else {
      target == null ? void 0 : target.replaceWith(container);
    }
    return iframe;
  };
  /**
   * Registers the current frame instance in the global DocSpace SDK registry.
   */
  registerFrame_fn = function() {
    window.DocSpace.SDK.frames = window.DocSpace.SDK.frames || {};
    window.DocSpace.SDK.frames[this.config.frameId] = this;
  };
  _getMethodPromise = new WeakMap();
  __publicField(_SDKInstance, "_loaderCache", {
    style: /* @__PURE__ */ new Map(),
    container: document.createElement("div"),
    templates: /* @__PURE__ */ new Map()
  });
  __publicField(_SDKInstance, "_iframeCache");
  /** Methods the iframe is allowed to invoke via `onCallCommand`. */
  __privateAdd(_SDKInstance, _allowedCommands, /* @__PURE__ */ new Set([
    "setIsLoaded",
    "setConfig"
  ]));
  var SDKInstance = _SDKInstance;

  // src/sdk/index.ts
  var SDK = class {
    constructor() {
      /**
       * Registry of all active instances, keyed by {@link TFrameConfig.frameId}.
       * Updated automatically by every `init*` call.
       */
      __publicField(this, "frames", {});
      /**
       * Core factory method. Creates a new {@link SDKInstance} for the given config,
       * or reinitializes the existing one if `frameId` is already in {@link SDK.frames}.
       * Stores the result in {@link SDK.frames}.
       *
       * Prefer the mode-specific wrappers ({@link SDK.initManager}, {@link SDK.initEditor}, etc.)
       * which set `mode` automatically.
       *
       * @param config - Frame configuration. See {@link TFrameConfig}.
       * @returns The created or reinitialized {@link SDKInstance}.
       *
       * @example
       * ```typescript
       * import { SDK, SDKMode } from '@onlyoffice/docspace-sdk-js';
       *
       * const sdk = new SDK();
       *
       * // Create a manager instance
       * const instance = sdk.init({
       *   frameId: 'ds-frame',
       *   src: 'https://docspace.example.com',
       *   mode: SDKMode.Manager,
       * });
       *
       * // Reinitialize the same frame in a different mode — sdk.frames['ds-frame'] is reused
       * sdk.init({ frameId: 'ds-frame', src: 'https://docspace.example.com', mode: SDKMode.Editor, id: 42 });
       * ```
       */
      __publicField(this, "init", (config2) => {
        const { frameId } = config2;
        const existingInstance = this.frames[frameId];
        if (existingInstance) {
          existingInstance.initFrame(config2);
          return existingInstance;
        }
        const instance = new SDKInstance(config2);
        instance.initFrame(config2);
        this.frames[frameId] = instance;
        return instance;
      });
      /**
       * Alias for {@link SDK.init}. Prefer the mode-specific wrappers instead.
       *
       * @param config - Frame configuration. See {@link TFrameConfig}.
       * @returns The created or reinitialized {@link SDKInstance}.
       */
      __publicField(this, "initFrame", (config2) => this.init(config2));
      /**
       * Initializes a frame in {@link SDKMode.Manager} mode — a file/folder browser
       * with full CRUD operations on rooms, folders, and files.
       * Forces `mode` to {@link SDKMode.Manager}.
       *
       * @param config - Frame configuration. See {@link TFrameConfig}.
       * @returns The initialized {@link SDKInstance}.
       *
       * @example
       * ```typescript
       * import { SDK, ManagerViewMode, FilterSortBy, FilterSortOrder } from '@onlyoffice/docspace-sdk-js';
       *
       * const sdk = new SDK();
       * const instance = sdk.initManager({
       *   frameId: 'ds-frame',
       *   src: 'https://docspace.example.com',
       *   viewAs: ManagerViewMode.Table,
       *   showFilter: true,
       *   showMenu: true,
       *   filter: { sortBy: FilterSortBy.Name, sortOrder: FilterSortOrder.Ascending },
       *   events: {
       *     onAppReady: () => console.log('ready'),
       *     onFileManagerClick: (item) => console.log('clicked:', item),
       *   },
       * });
       * ```
       */
      __publicField(this, "initManager", (config2) => this.init({ ...config2, mode: "manager" /* Manager */ }));
      /**
       * Initializes a frame in {@link SDKMode.Viewer} mode — read-only document viewer.
       * Forces `mode` to {@link SDKMode.Viewer}. Requires {@link TFrameConfig.id}.
       *
       * @param config - Frame configuration. See {@link TFrameConfig}.
       * @returns The initialized {@link SDKInstance}.
       *
       * @example
       * ```typescript
       * import { SDK } from '@onlyoffice/docspace-sdk-js';
       *
       * const sdk = new SDK();
       * const instance = sdk.initViewer({
       *   frameId: 'ds-frame',
       *   src: 'https://docspace.example.com',
       *   id: 42,
       *   events: {
       *     onAppReady: () => console.log('ready'),
       *     onNoAccess: () => console.warn('access denied'),
       *     onNotFound: () => console.warn('document not found'),
       *   },
       * });
       * ```
       */
      __publicField(this, "initViewer", (config2) => this.init({ ...config2, mode: "viewer" /* Viewer */ }));
      /**
       * Initializes a frame in {@link SDKMode.Editor} mode — full document editor.
       * Forces `mode` to {@link SDKMode.Editor}. Requires {@link TFrameConfig.id}.
       *
       * @param config - Frame configuration. See {@link TFrameConfig}.
       * @returns The initialized {@link SDKInstance}.
       *
       * @example
       * ```typescript
       * import { SDK, EditorType } from '@onlyoffice/docspace-sdk-js';
       *
       * const sdk = new SDK();
       * const instance = sdk.initEditor({
       *   frameId: 'ds-frame',
       *   src: 'https://docspace.example.com',
       *   id: 42,
       *   editorType: EditorType.Desktop,
       *   editorCustomization: { autosave: true, forcesave: true },
       *   events: {
       *     onAppReady: () => console.log('ready'),
       *     onEditorCloseCallback: () => history.back(),
       *   },
       * });
       * ```
       */
      __publicField(this, "initEditor", (config2) => this.init({ ...config2, mode: "editor" /* Editor */ }));
      /**
       * Initializes a frame in {@link SDKMode.RoomSelector} mode — a dialog for selecting a room.
       * Forces `mode` to {@link SDKMode.RoomSelector}.
       * The selected room is returned via {@link TFrameEvents.onSelectCallback}.
       *
       * @param config - Frame configuration. See {@link TFrameConfig}.
       * @returns The initialized {@link SDKInstance}.
       *
       * @example
       * ```typescript
       * import { SDK } from '@onlyoffice/docspace-sdk-js';
       *
       * const sdk = new SDK();
       * const instance = sdk.initRoomSelector({
       *   frameId: 'ds-frame',
       *   src: 'https://docspace.example.com',
       *   showSelectorHeader: true,
       *   showSelectorCancel: true,
       *   events: {
       *     onSelectCallback: (room) => console.log('selected:', room),
       *     onCloseCallback: () => console.log('cancelled'),
       *   },
       * });
       * ```
       */
      __publicField(this, "initRoomSelector", (config2) => this.init({ ...config2, mode: "room-selector" /* RoomSelector */ }));
      /**
       * Initializes a frame in {@link SDKMode.FileSelector} mode — a dialog for selecting a file.
       * Forces `mode` to {@link SDKMode.FileSelector}.
       * The selected file is returned via {@link TFrameEvents.onSelectCallback}.
       *
       * @param config - Frame configuration. See {@link TFrameConfig}.
       * @returns The initialized {@link SDKInstance}.
       *
       * @example
       * ```typescript
       * import { SDK, SelectorFilterType } from '@onlyoffice/docspace-sdk-js';
       *
       * const sdk = new SDK();
       * const instance = sdk.initFileSelector({
       *   frameId: 'ds-frame',
       *   src: 'https://docspace.example.com',
       *   selectorType: SelectorFilterType.UserOnly,
       *   withBreadCrumbs: true,
       *   withSearch: true,
       *   events: {
       *     onSelectCallback: (file) => console.log('selected:', file),
       *     onCloseCallback: () => console.log('cancelled'),
       *   },
       * });
       * ```
       */
      __publicField(this, "initFileSelector", (config2) => this.init({ ...config2, mode: "file-selector" /* FileSelector */ }));
      /**
       * Initializes a frame in {@link SDKMode.System} mode — a blank page with a loader,
       * used to call system methods ({@link SDKInstance.login}, {@link SDKInstance.logout},
       * {@link SDKInstance.getUserInfo}) without rendering any DocSpace UI.
       * Forces `mode` to {@link SDKMode.System}.
       *
       * @param config - Frame configuration. See {@link TFrameConfig}.
       * @returns The initialized {@link SDKInstance}.
       *
       * @example
       * ```typescript
       * import { SDK } from '@onlyoffice/docspace-sdk-js';
       *
       * const sdk = new SDK();
       * const system = sdk.initSystem({
       *   frameId: 'ds-system',
       *   src: 'https://docspace.example.com',
       *   events: { onAppReady: () => console.log('system ready') },
       * });
       *
       * system.getUserInfo().then((user) => console.log('current user:', user));
       * ```
       */
      __publicField(this, "initSystem", (config2) => this.init({ ...config2, mode: "system" /* System */ }));
      /**
       * Initializes a frame in {@link SDKMode.Uploader} mode — a file upload interface.
       * Forces `mode` to {@link SDKMode.Uploader}. Requires {@link TFrameConfig.id}
       * (the target folder ID).
       *
       * @param config - Frame configuration. See {@link TFrameConfig}.
       * @returns The initialized {@link SDKInstance}.
       *
       * @example
       * ```typescript
       * import { SDK } from '@onlyoffice/docspace-sdk-js';
       *
       * const sdk = new SDK();
       * const uploader = sdk.initUploader({
       *   frameId: 'ds-uploader',
       *   src: 'https://docspace.example.com',
       *   id: 'folder-id',
       *   acceptExtensions: '.docx,.xlsx,.pdf',
       *   isMultipleUpload: true,
       *   events: {
       *     onUploadSuccess: (file) => console.log('uploaded:', file),
       *     onUploadError: (err) => console.error('error:', err),
       *   },
       * });
       * ```
       */
      __publicField(this, "initUploader", (config2) => this.init({ ...config2, mode: "uploader" /* Uploader */ }));
      /**
       * Initializes a frame in {@link SDKMode.Forms} mode — a forms gallery for the room specified by `id`.
       * Forces `mode` to {@link SDKMode.Forms}. Sets `showMenu` to `true` by default.
       *
       * @param config - Frame configuration. See {@link TFrameConfig}.
       * @returns The initialized {@link SDKInstance}.
       *
       * @example
       * ```typescript
       * import { SDK } from '@onlyoffice/docspace-sdk-js';
       *
       * const sdk = new SDK();
       * const forms = sdk.initForms({
       *   frameId: 'ds-forms',
       *   src: 'https://docspace.example.com',
       *   id: 'room-id',
       *   showMenu: true,
       *   events: {
       *     onCustomAction: (data) => console.log('action:', data),
       *   },
       * });
       * ```
       */
      __publicField(this, "initForms", (config2) => this.init({ ...config2, mode: "forms" /* Forms */, showMenu: config2.showMenu ?? true }));
    }
  };

  // src/main.browser.ts
  window.DocSpace = window.DocSpace || {};
  var config = getConfigFromParams();
  window.DocSpace.SDK = window.DocSpace.SDK || new SDK();
  if (config == null ? void 0 : config.init) window.DocSpace.SDK.init(config);
})();
