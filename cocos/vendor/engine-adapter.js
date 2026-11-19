(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of cache-manager software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in cache-manager License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

/* eslint-disable no-global-assign */
/* eslint-disable no-undef */
/* eslint-disable import/no-dynamic-require */
const cacheManager = require('./cache-manager');
const {
  fs,
  downloadFile,
  readText,
  readArrayBuffer,
  readJson,
  loadSubpackage,
  getUserDataPath,
  exists
} = window.fsUtils;
const REGEX = /^https?:\/\/.*/;
const downloader = cc.assetManager.downloader;
const parser = cc.assetManager.parser;
const presets = cc.assetManager.presets;
downloader.maxConcurrency = 12;
downloader.maxRequestsPerFrame = 64;
presets.scene.maxConcurrency = 12;
presets.scene.maxRequestsPerFrame = 64;
const subpackages = {};
const sys = cc.sys;
if (sys.platform === sys.Platform.TAOBAO_MINI_GAME) {
  require = globalThis.__taobaoRequire;
}
function downloadScript(url, options, onComplete) {
  if (REGEX.test(url)) {
    onComplete && onComplete(new Error('Can not load remote scripts'));
  } else {
    if (sys.platform !== sys.Platform.TAOBAO_CREATIVE_APP) {
      //Can't load scripts dynamically on Taobao platform
      require(`../../../${url}`);
    }
    onComplete && onComplete(null);
  }
}
function handleZip(url, options, onComplete) {
  const cachedUnzip = cacheManager.cachedFiles.get(url);
  if (cachedUnzip) {
    cacheManager.updateLastTime(url);
    onComplete && onComplete(null, cachedUnzip.url);
  } else if (REGEX.test(url)) {
    downloadFile(url, null, options.header, options.onFileProgress, (err, downloadedZipPath) => {
      if (err) {
        onComplete && onComplete(err);
        return;
      }
      cacheManager.unzipAndCacheBundle(url, downloadedZipPath, options.__cacheBundleRoot__, onComplete);
    });
  } else {
    cacheManager.unzipAndCacheBundle(url, url, options.__cacheBundleRoot__, onComplete);
  }
}
function loadAudioPlayer(url, options, onComplete) {
  cc.AudioPlayer.load(url).then(player => {
    const audioMeta = {
      player,
      url,
      duration: player.duration,
      type: player.type
    };
    onComplete(null, audioMeta);
  }).catch(err => {
    onComplete(err);
  });
}
function download(url, func, options, onFileProgress, onComplete) {
  const result = transformUrl(url, options);
  if (result.inLocal) {
    func(result.url, options, onComplete);
  } else if (result.inCache) {
    cacheManager.updateLastTime(url);
    func(result.url, options, (err, data) => {
      if (err) {
        cacheManager.removeCache(url);
      }
      onComplete(err, data);
    });
  } else {
    downloadFile(url, null, options.header, onFileProgress, (err, path) => {
      if (err) {
        onComplete(err, null);
        return;
      }
      func(path, options, (err, data) => {
        if (!err) {
          cacheManager.tempFiles.add(url, path);
          cacheManager.cacheFile(url, path, options.cacheEnabled, options.__cacheBundleRoot__, true);
        }
        onComplete(err, data);
      });
    });
  }
}
function parseArrayBuffer(url, options, onComplete) {
  readArrayBuffer(url, onComplete);
}
function parseText(url, options, onComplete) {
  readText(url, onComplete);
}
function parseJson(url, options, onComplete) {
  readJson(url, onComplete);
}
function downloadText(url, options, onComplete) {
  download(url, parseText, options, options.onFileProgress, onComplete);
}
function downloadJson(url, options, onComplete) {
  download(url, parseJson, options, options.onFileProgress, onComplete);
}
function downloadArrayBuffer(url, options, onComplete) {
  download(url, parseArrayBuffer, options, options.onFileProgress, onComplete);
}
function loadFont(url, options, onComplete) {
  const fontFamily = __globalAdapter.loadFont(url);
  onComplete(null, fontFamily || 'Arial');
}
function doNothing(content, options, onComplete) {
  exists(content, existence => {
    if (existence) {
      onComplete(null, content);
    } else {
      onComplete(new Error(`file ${content} does not exist!`));
    }
  });
}
function downloadAsset(url, options, onComplete) {
  download(url, doNothing, options, options.onFileProgress, onComplete);
}
function downloadBundle(nameOrUrl, options, onComplete) {
  const bundleName = cc.path.basename(nameOrUrl);
  const version = options.version || cc.assetManager.downloader.bundleVers[bundleName];
  const suffix = version ? `${version}.` : '';
  function getConfigPathForSubPackage() {
    if (sys.platform === sys.Platform.TAOBAO_MINI_GAME) {
      return `${bundleName}/config.${suffix}json`;
    }
    return `subpackages/${bundleName}/config.${suffix}json`;
  }
  function appendBaseToJsonData(data) {
    if (!data) return;
    if (sys.platform === sys.Platform.TAOBAO_MINI_GAME) {
      data.base = `${bundleName}/`;
    } else {
      data.base = `subpackages/${bundleName}/`;
    }
  }
  if (subpackages[bundleName]) {
    const config = getConfigPathForSubPackage();
    loadSubpackage(bundleName, options.onFileProgress, err => {
      if (err) {
        onComplete(err, null);
        return;
      }
      downloadJson(config, options, (err, data) => {
        appendBaseToJsonData(data);
        onComplete(err, data);
      });
    });
  } else {
    let js;
    let url;
    if (REGEX.test(nameOrUrl) || nameOrUrl.startsWith(getUserDataPath())) {
      url = nameOrUrl;
      js = `src/bundle-scripts/${bundleName}/index.${suffix}js`;
      cacheManager.makeBundleFolder(bundleName);
    } else if (downloader.remoteBundles.indexOf(bundleName) !== -1) {
      url = `${downloader.remoteServerAddress}remote/${bundleName}`;
      js = `src/bundle-scripts/${bundleName}/index.${suffix}js`;
      cacheManager.makeBundleFolder(bundleName);
    } else {
      url = `assets/${bundleName}`;
      js = `assets/${bundleName}/index.${suffix}js`;
    }
    if (sys.platform === sys.Platform.TAOBAO_MINI_GAME) {
      require(js);
    } else if (sys.platform !== sys.Platform.TAOBAO_CREATIVE_APP) {
      // Can't load scripts dynamically on Taobao platform
      require(`./${js}`);
    }
    options.__cacheBundleRoot__ = bundleName;
    const config = `${url}/config.${suffix}json`;
    downloadJson(config, options, (err, data) => {
      if (err) {
        onComplete && onComplete(err);
        return;
      }
      if (data.isZip) {
        const zipVersion = data.zipVersion;
        const zipUrl = `${url}/res.${zipVersion ? `${zipVersion}.` : ''}zip`;
        handleZip(zipUrl, options, (err, unzipPath) => {
          if (err) {
            onComplete && onComplete(err);
            return;
          }
          data.base = `${unzipPath}/res/`;
          // PATCH: for android alipay version before v10.1.95 (v10.1.95 included)
          // to remove in the future
          if (sys.platform === sys.Platform.ALIPAY_MINI_GAME && sys.os === sys.OS.ANDROID) {
            const resPath = `${unzipPath}res/`;
            if (fs.accessSync({
              path: resPath
            }).success) {
              data.base = resPath;
            }
          }
          onComplete && onComplete(null, data);
        });
      } else {
        data.base = `${url}/`;
        onComplete && onComplete(null, data);
      }
    });
  }
}
const originParsePVRTex = parser.parsePVRTex;
const parsePVRTex = function (file, options, onComplete) {
  readArrayBuffer(file, (err, data) => {
    if (err) {
      onComplete(err);
      return;
    }
    originParsePVRTex(data, options, onComplete);
  });
};
const originParsePKMTex = parser.parsePKMTex;
const parsePKMTex = function (file, options, onComplete) {
  readArrayBuffer(file, (err, data) => {
    if (err) {
      onComplete(err);
      return;
    }
    originParsePKMTex(data, options, onComplete);
  });
};
const originParseASTCTex = parser.parseASTCTex;
const parseASTCTex = function (file, options, onComplete) {
  readArrayBuffer(file, (err, data) => {
    if (err) {
      onComplete(err);
      return;
    }
    originParseASTCTex(data, options, onComplete);
  });
};
const originParsePlist = parser.parsePlist;
const parsePlist = function (url, options, onComplete) {
  readText(url, (err, file) => {
    if (err) {
      onComplete(err);
      return;
    }
    originParsePlist(file, options, onComplete);
  });
};
downloader.downloadScript = downloadScript;
downloader._downloadArrayBuffer = downloadArrayBuffer;
downloader._downloadJson = downloadJson;
parser.parsePVRTex = parsePVRTex;
parser.parsePKMTex = parsePKMTex;
parser.parseASTCTex = parseASTCTex;
parser.parsePlist = parsePlist;
downloader.register({
  '.js': downloadScript,
  // Audio
  '.mp3': downloadAsset,
  '.ogg': downloadAsset,
  '.wav': downloadAsset,
  '.m4a': downloadAsset,
  // Image
  '.png': downloadAsset,
  '.jpg': downloadAsset,
  '.bmp': downloadAsset,
  '.jpeg': downloadAsset,
  '.gif': downloadAsset,
  '.ico': downloadAsset,
  '.tiff': downloadAsset,
  '.image': downloadAsset,
  '.webp': downloadAsset,
  '.pvr': downloadAsset,
  '.pkm': downloadAsset,
  '.astc': downloadAsset,
  '.font': downloadAsset,
  '.eot': downloadAsset,
  '.ttf': downloadAsset,
  '.woff': downloadAsset,
  '.svg': downloadAsset,
  '.ttc': downloadAsset,
  // Txt
  '.txt': downloadAsset,
  '.xml': downloadAsset,
  '.vsh': downloadAsset,
  '.fsh': downloadAsset,
  '.atlas': downloadAsset,
  '.tmx': downloadAsset,
  '.tsx': downloadAsset,
  '.plist': downloadAsset,
  '.fnt': downloadAsset,
  '.json': downloadJson,
  '.ExportJson': downloadAsset,
  '.binary': downloadAsset,
  '.bin': downloadAsset,
  '.dbbin': downloadAsset,
  '.skel': downloadAsset,
  '.mp4': downloadAsset,
  '.avi': downloadAsset,
  '.mov': downloadAsset,
  '.mpg': downloadAsset,
  '.mpeg': downloadAsset,
  '.rm': downloadAsset,
  '.rmvb': downloadAsset,
  bundle: downloadBundle,
  default: downloadText
});
parser.register({
  '.png': downloader.downloadDomImage,
  '.jpg': downloader.downloadDomImage,
  '.bmp': downloader.downloadDomImage,
  '.jpeg': downloader.downloadDomImage,
  '.gif': downloader.downloadDomImage,
  '.ico': downloader.downloadDomImage,
  '.tiff': downloader.downloadDomImage,
  '.image': downloader.downloadDomImage,
  '.webp': downloader.downloadDomImage,
  '.pvr': parsePVRTex,
  '.pkm': parsePKMTex,
  '.astc': parseASTCTex,
  '.font': loadFont,
  '.eot': loadFont,
  '.ttf': loadFont,
  '.woff': loadFont,
  '.svg': loadFont,
  '.ttc': loadFont,
  // Audio
  '.mp3': loadAudioPlayer,
  '.ogg': loadAudioPlayer,
  '.wav': loadAudioPlayer,
  '.m4a': loadAudioPlayer,
  // Txt
  '.txt': parseText,
  '.xml': parseText,
  '.vsh': parseText,
  '.fsh': parseText,
  '.atlas': parseText,
  '.tmx': parseText,
  '.tsx': parseText,
  '.fnt': parseText,
  '.plist': parsePlist,
  '.binary': parseArrayBuffer,
  '.bin': parseArrayBuffer,
  '.dbbin': parseArrayBuffer,
  '.skel': parseArrayBuffer,
  '.ExportJson': parseJson
});
function transformUrl(url, options) {
  let inLocal = false;
  let inCache = false;
  const isInUserDataPath = url.startsWith(getUserDataPath());
  if (isInUserDataPath) {
    inLocal = true;
  } else if (REGEX.test(url)) {
    if (!options.reload) {
      const cache = cacheManager.cachedFiles.get(url);
      if (cache) {
        inCache = true;
        url = cache.url;
      } else {
        const tempUrl = cacheManager.tempFiles.get(url);
        if (tempUrl) {
          inLocal = true;
          url = tempUrl;
        }
      }
    }
  } else {
    inLocal = true;
  }
  return {
    url,
    inLocal,
    inCache
  };
}
cc.assetManager.transformPipeline.append(task => {
  const input = task.output = task.input;
  for (let i = 0, l = input.length; i < l; i++) {
    const item = input[i];
    const options = item.options;
    if (!item.config) {
      if (item.ext === 'bundle') continue;
      options.cacheEnabled = options.cacheEnabled !== undefined ? options.cacheEnabled : false;
    } else {
      options.__cacheBundleRoot__ = item.config.name;
    }
    if (item.ext === '.cconb') {
      item.url = item.url.replace(item.ext, '.bin');
    } else if (item.ext === '.ccon') {
      item.url = item.url.replace(item.ext, '.json');
    }
  }
});
const originInit = cc.assetManager.init;
cc.assetManager.init = function (options) {
  originInit.call(cc.assetManager, options);
  const subpacks = cc.settings.querySettings('assets', 'subpackages');
  subpacks && subpacks.forEach(x => subpackages[x] = `subpackages/${x}`);
  cacheManager.init();
};

},{"./cache-manager":3}],2:[function(require,module,exports){
"use strict";

(function () {
  if (!(cc && cc.internal && cc.internal.EditBox)) {
    return;
  }
  const EditBoxComp = cc.internal.EditBox;
  const js = cc.js;
  const KeyboardReturnType = EditBoxComp.KeyboardReturnType;
  const MAX_VALUE = 65535;
  const KEYBOARD_HIDE_TIME = 600;
  let _hideKeyboardTimeout = null;
  let _currentEditBoxImpl = null;
  function getKeyboardReturnType(type) {
    switch (type) {
      case KeyboardReturnType.DEFAULT:
      case KeyboardReturnType.DONE:
        return 'done';
      case KeyboardReturnType.SEND:
        return 'send';
      case KeyboardReturnType.SEARCH:
        return 'search';
      case KeyboardReturnType.GO:
        return 'go';
      case KeyboardReturnType.NEXT:
        return 'next';
      default:
        return 'done';
    }
  }
  function MiniGameEditBoxImpl() {
    this._delegate = null;
    this._editing = false;
    this._eventListeners = {
      onKeyboardInput: null,
      onKeyboardConfirm: null,
      onKeyboardComplete: null
    };
  }
  js.extend(MiniGameEditBoxImpl, EditBoxComp._EditBoxImpl);
  EditBoxComp._EditBoxImpl = MiniGameEditBoxImpl;
  Object.assign(MiniGameEditBoxImpl.prototype, {
    init(delegate) {
      if (!delegate) {
        cc.error('EditBox init failed');
        return;
      }
      this._delegate = delegate;
    },
    beginEditing() {
      // In case multiply register events
      if (this._editing) {
        return;
      }
      this._ensureKeyboardHide(() => {
        const delegate = this._delegate;
        this._showKeyboard();
        this._registerKeyboardEvent();
        this._editing = true;
        _currentEditBoxImpl = this;
        delegate._editBoxEditingDidBegan();
      });
    },
    endEditing() {
      this._hideKeyboard();
      const cbs = this._eventListeners;
      cbs.onKeyboardComplete && cbs.onKeyboardComplete();
    },
    _registerKeyboardEvent() {
      const self = this;
      const delegate = this._delegate;
      const cbs = this._eventListeners;
      cbs.onKeyboardInput = function (res) {
        if (delegate._string !== res.value) {
          delegate._editBoxTextChanged(res.value);
        }
      };
      cbs.onKeyboardConfirm = function (res) {
        res && res.value ? delegate._editBoxEditingReturn(res.value) : delegate._editBoxEditingReturn();
        const cbs = self._eventListeners;
        cbs.onKeyboardComplete && cbs.onKeyboardComplete(res);
      };
      cbs.onKeyboardComplete = function (res) {
        self._editing = false;
        _currentEditBoxImpl = null;
        // wechat program do not have offKeyboard related callback
        if (cc.sys.platform !== cc.sys.Platform.WECHAT_MINI_PROGRAM) {
          self._unregisterKeyboardEvent();
        }
        if (res && res.value && res.value !== delegate.string) {
          delegate._editBoxTextChanged(res.value);
        }
        res && res.value ? delegate._editBoxEditingDidEnded(res.value) : delegate._editBoxEditingDidEnded();
      };
      __globalAdapter.onKeyboardInput(cbs.onKeyboardInput);
      __globalAdapter.onKeyboardConfirm(cbs.onKeyboardConfirm);
      __globalAdapter.onKeyboardComplete(cbs.onKeyboardComplete);
    },
    _unregisterKeyboardEvent() {
      const cbs = this._eventListeners;
      if (cbs.onKeyboardInput) {
        __globalAdapter.offKeyboardInput(cbs.onKeyboardInput);
        cbs.onKeyboardInput = null;
      }
      if (cbs.onKeyboardConfirm) {
        __globalAdapter.offKeyboardConfirm(cbs.onKeyboardConfirm);
        cbs.onKeyboardConfirm = null;
      }
      if (cbs.onKeyboardComplete) {
        __globalAdapter.offKeyboardComplete(cbs.onKeyboardComplete);
        cbs.onKeyboardComplete = null;
      }
    },
    _otherEditing() {
      return !!_currentEditBoxImpl && _currentEditBoxImpl !== this && _currentEditBoxImpl._editing;
    },
    _ensureKeyboardHide(cb) {
      const otherEditing = this._otherEditing();
      if (!otherEditing && !_hideKeyboardTimeout) {
        return cb();
      }
      if (_hideKeyboardTimeout) {
        clearTimeout(_hideKeyboardTimeout);
      }
      if (otherEditing) {
        _currentEditBoxImpl.endEditing();
      }
      _hideKeyboardTimeout = setTimeout(() => {
        _hideKeyboardTimeout = null;
        cb();
      }, KEYBOARD_HIDE_TIME);
    },
    _showKeyboard() {
      const delegate = this._delegate;
      const multiline = delegate.inputMode === EditBoxComp.InputMode.ANY;
      __globalAdapter.showKeyboard({
        defaultValue: delegate.string,
        maxLength: delegate.maxLength < 0 ? MAX_VALUE : delegate.maxLength,
        multiple: multiline,
        confirmHold: false,
        confirmType: getKeyboardReturnType(delegate.returnType),
        success(res) {},
        fail(res) {
          cc.warn(res.errMsg);
        }
      });
    },
    _hideKeyboard() {
      __globalAdapter.hideKeyboard({
        success(res) {},
        fail(res) {
          cc.warn(res.errMsg);
        }
      });
    }
  });
})();

},{}],3:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2020 Xiamen Yaji Software Co., Ltd.

 https://www.cocos.com/

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of cache-manager software and associated engine source code (the "Software"), a limited,
  worldwide, royalty-free, non-assignable, revocable and non-exclusive license
 to use Cocos Creator solely to develop games on your target platforms. You shall
  not use Cocos Creator software for developing other software or tools that's
  used for developing games. You are not granted to publish, distribute,
  sublicense, and/or sell copies of Cocos Creator.

 The software or tools in cache-manager License Agreement are licensed, not sold.
 Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
const {
  getUserDataPath,
  readJsonSync,
  makeDirSync,
  writeFileSync,
  copyFile,
  downloadFile,
  deleteFile,
  rmdirSync,
  unzip,
  isOutOfStorage
} = window.fsUtils;
let checkNextPeriod = false;
let writeCacheFileList = null;
let cleaning = false;
let suffix = 0;
const REGEX = /^https?:\/\/.*/;
const cacheManager = {
  cacheDir: 'gamecaches',
  cachedFileName: 'cacheList.json',
  // whether or not cache asset into user's storage space
  cacheEnabled: true,
  // whether or not auto clear cache when storage ran out
  autoClear: true,
  // cache one per cycle
  cacheInterval: 500,
  deleteInterval: 500,
  writeFileInterval: 2000,
  // whether or not storage space has run out
  outOfStorage: false,
  tempFiles: null,
  cachedFiles: null,
  cacheQueue: {},
  version: '1.0',
  getCache(url) {
    return this.cachedFiles.has(url) ? this.cachedFiles.get(url).url : '';
  },
  getTemp(url) {
    return this.tempFiles.has(url) ? this.tempFiles.get(url) : '';
  },
  init() {
    this.cacheDir = `${getUserDataPath()}/${this.cacheDir}`;
    const cacheFilePath = `${this.cacheDir}/${this.cachedFileName}`;
    const result = readJsonSync(cacheFilePath);
    if (result instanceof Error || !result.version) {
      if (!(result instanceof Error)) rmdirSync(this.cacheDir, true);
      this.cachedFiles = new cc.AssetManager.Cache();
      makeDirSync(this.cacheDir, true);
      writeFileSync(cacheFilePath, JSON.stringify({
        files: this.cachedFiles._map,
        version: this.version
      }), 'utf8');
    } else {
      this.cachedFiles = new cc.AssetManager.Cache(result.files);
    }
    this.tempFiles = new cc.AssetManager.Cache();
  },
  updateLastTime(url) {
    if (this.cachedFiles.has(url)) {
      const cache = this.cachedFiles.get(url);
      cache.lastTime = Date.now();
    }
  },
  _write() {
    writeCacheFileList = null;
    writeFileSync(`${this.cacheDir}/${this.cachedFileName}`, JSON.stringify({
      files: this.cachedFiles._map,
      version: this.version
    }), 'utf8');
  },
  writeCacheFile() {
    if (!writeCacheFileList) {
      writeCacheFileList = setTimeout(this._write.bind(this), this.writeFileInterval);
    }
  },
  _cache() {
    checkNextPeriod = false;
    const self = this;
    let id = '';
    // eslint-disable-next-line no-unreachable-loop
    for (const key in this.cacheQueue) {
      id = key;
      break;
    }
    if (!id) return;
    const {
      srcUrl,
      isCopy,
      cacheBundleRoot
    } = this.cacheQueue[id];
    const time = Date.now().toString();
    let localPath = '';
    if (cacheBundleRoot) {
      localPath = `${this.cacheDir}/${cacheBundleRoot}/${time}${suffix++}${cc.path.extname(id)}`;
    } else {
      localPath = `${this.cacheDir}/${time}${suffix++}${cc.path.extname(id)}`;
    }
    function callback(err) {
      if (err) {
        if (isOutOfStorage(err.message)) {
          self.outOfStorage = true;
          self.autoClear && self.clearLRU();
          return;
        }
      } else {
        self.cachedFiles.add(id, {
          bundle: cacheBundleRoot,
          url: localPath,
          lastTime: time
        });
        self.writeCacheFile();
      }
      delete self.cacheQueue[id];
      if (!cc.js.isEmptyObject(self.cacheQueue) && !checkNextPeriod) {
        checkNextPeriod = true;
        setTimeout(self._cache.bind(self), self.cacheInterval);
      }
    }
    if (!isCopy) {
      downloadFile(srcUrl, localPath, null, callback);
    } else {
      copyFile(srcUrl, localPath, callback);
    }
  },
  cacheFile(id, srcUrl, cacheEnabled, cacheBundleRoot, isCopy) {
    cacheEnabled = cacheEnabled !== undefined ? cacheEnabled : this.cacheEnabled;
    if (!cacheEnabled || this.cacheQueue[id] || this.cachedFiles.has(id)) return;
    this.cacheQueue[id] = {
      srcUrl,
      cacheBundleRoot,
      isCopy
    };
    if (!checkNextPeriod && !this.outOfStorage) {
      checkNextPeriod = true;
      setTimeout(this._cache.bind(this), this.cacheInterval);
    }
  },
  clearCache() {
    rmdirSync(this.cacheDir, true);
    this.cachedFiles = new cc.AssetManager.Cache();
    makeDirSync(this.cacheDir, true);
    this.outOfStorage = false;
    clearTimeout(writeCacheFileList);
    this._write();
    cc.assetManager.bundles.forEach(bundle => {
      if (REGEX.test(bundle.base)) this.makeBundleFolder(bundle.name);
    });
  },
  clearLRU() {
    if (cleaning) return;
    cleaning = true;
    const caches = [];
    const self = this;
    this.cachedFiles.forEach((val, key) => {
      if (self._isZipFile(key) && cc.assetManager.bundles.find(bundle => bundle.base.indexOf(val.url) !== -1)) return;
      caches.push({
        originUrl: key,
        url: val.url,
        lastTime: val.lastTime
      });
    });
    caches.sort((a, b) => a.lastTime - b.lastTime);
    // cache length above 3 then clear 1/3, or clear all caches
    if (caches.length < 3) {
      console.warn('Insufficient storage, cleaning now');
    } else {
      caches.length = Math.floor(caches.length / 3);
    }
    for (let i = 0, l = caches.length; i < l; i++) {
      const cacheKey = `${cc.assetManager.utils.getUuidFromURL(caches[i].originUrl)}@native`;
      cc.assetManager.files.remove(cacheKey);
      this.cachedFiles.remove(caches[i].originUrl);
    }
    clearTimeout(writeCacheFileList);
    this._write();
    function deferredDelete() {
      const item = caches.pop();
      self._removePathOrFile(item.originUrl, item.url);
      if (caches.length > 0) {
        setTimeout(deferredDelete, self.deleteInterval);
      } else {
        cleaning = false;
      }
    }
    setTimeout(deferredDelete, self.deleteInterval);
  },
  removeCache(url) {
    if (this.cachedFiles.has(url)) {
      const path = this.cachedFiles.remove(url).url;
      clearTimeout(writeCacheFileList);
      this._write();
      this._removePathOrFile(url, path);
    }
  },
  _removePathOrFile(url, path) {
    if (this._isZipFile(url)) {
      if (this._isZipFile(path)) {
        deleteFile(path, this._deleteFileCB.bind(this));
      } else {
        rmdirSync(path, true);
        this._deleteFileCB();
      }
    } else {
      deleteFile(path, this._deleteFileCB.bind(this));
    }
  },
  _deleteFileCB(err) {
    if (!err) this.outOfStorage = false;
  },
  makeBundleFolder(bundleName) {
    makeDirSync(`${this.cacheDir}/${bundleName}`, true);
  },
  unzipAndCacheBundle(id, zipFilePath, cacheBundleRoot, onComplete) {
    const time = Date.now().toString();
    const targetPath = `${this.cacheDir}/${cacheBundleRoot}/${time}${suffix++}`;
    const self = this;
    makeDirSync(targetPath, true);
    unzip(zipFilePath, targetPath, err => {
      if (err) {
        rmdirSync(targetPath, true);
        if (isOutOfStorage(err.message)) {
          self.outOfStorage = true;
          self.autoClear && self.clearLRU();
        }
        onComplete && onComplete(err);
        return;
      }
      self.cachedFiles.add(id, {
        bundle: cacheBundleRoot,
        url: targetPath,
        lastTime: time
      });
      self.writeCacheFile();
      onComplete && onComplete(null, targetPath);
    });
  },
  _isZipFile(url) {
    return url.slice(-4) === '.zip';
  }
};
cc.assetManager.cacheManager = module.exports = cacheManager;

},{}],4:[function(require,module,exports){
"use strict";

require('./Editbox');
require('./AssetManager');

},{"./AssetManager":1,"./Editbox":2}],5:[function(require,module,exports){
"use strict";

/****************************************************************************
 Copyright (c) 2018 Xiamen Yaji Software Co., Ltd.

https://www.cocos.com/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated engine source code (the "Software"), a limited,
worldwide, royalty-free, non-assignable, revocable and non-exclusive license
to use Cocos Creator solely to develop games on your target platforms. You shall
not use Cocos Creator software for developing other software or tools that's
used for developing games. You are not granted to publish, distribute,
sublicense, and/or sell copies of Cocos Creator.

The software or tools in this License Agreement are licensed, not sold.
Xiamen Yaji Software Co., Ltd. reserves all rights not expressly granted to you.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/

if (cc.internal.VideoPlayer) {
  const {
    EventType
  } = cc.internal.VideoPlayer;
  const _mat4_temp = cc.mat4();
  const _topLeft = new cc.Vec3();
  const _bottomRight = new cc.Vec3();

  // eslint-disable-next-line no-undef
  const dpr = wx.getSystemInfoSync().pixelRatio;
  cc.internal.VideoPlayerImplManager.getImpl = function (componenet) {
    return new VideoPlayerImplMiniGame(componenet);
  };
  class VideoPlayerImplMiniGame extends cc.internal.VideoPlayerImpl {
    constructor(componenet) {
      super(componenet);
    }
    syncClip(clip) {
      this.removeVideoPlayer();
      if (!clip) {
        return;
      }
      this.createVideoPlayer(clip._nativeAsset);
    }
    syncURL(url) {
      this.removeVideoPlayer();
      if (!url) {
        return;
      }
      this.createVideoPlayer(url);
    }
    onCanplay() {
      if (this._loaded) {
        return;
      }
      this._loaded = true;
      this.setVisible(this._visible);
      this.dispatchEvent(EventType.READY_TO_PLAY);
      this.delayedPlay();
    }
    _bindEvent() {
      const video = this._video;
      const self = this;
      if (!video) {
        return;
      }
      video.onPlay(() => {
        if (self._video !== video) return;
        self._playing = true;
        self.dispatchEvent(EventType.PLAYING);
      });
      video.onEnded(() => {
        if (self._video !== video) return;
        self._playing = false;
        self._currentTime = self._duration; // ensure currentTime is at the end of duration
        self.dispatchEvent(EventType.COMPLETED);
      });
      video.onPause(() => {
        if (self._video !== video) return;
        self._playing = false;
        self.dispatchEvent(EventType.PAUSED);
      });
      video.onTimeUpdate(res => {
        self._duration = res.duration;
        self._currentTime = res.position;
      });
      // onStop not supported, implemented in promise returned by video.stop call.
    }

    _unbindEvent() {
      const video = this._video;
      if (!video) {
        return;
      }

      // BUG: video.offPlay(cb) is invalid
      video.offPlay();
      video.offEnded();
      video.offPause();
      video.offTimeUpdate();
      // offStop not supported
    }

    createVideoPlayer(url) {
      // eslint-disable-next-line no-undef
      if (!__globalAdapter.createVideo) {
        console.warn('VideoPlayer not supported');
        return;
      }
      if (!this._video) {
        // eslint-disable-next-line no-undef
        this._video = __globalAdapter.createVideo();
        this._video.showCenterPlayBtn = false;
        this._video.controls = false;
        this._duration = 0;
        this._currentTime = 0;
        this._loaded = false;
        this.setVisible(this._visible);
        this._bindEvent();
        this._forceUpdate = true;
      }
      this.setURL(url);
      this._forceUpdate = true;
    }
    setURL(path) {
      const video = this._video;
      if (!video || video.src === path) {
        return;
      }
      video.stop();
      this._unbindEvent();
      video.autoplay = true; // HACK: to implement onCanplay callback
      video.src = path;
      video.muted = true;
      const self = this;
      this._loaded = false;
      function loadedCallback() {
        video.offPlay();
        self._bindEvent();
        video.stop();
        video.muted = false;
        self._loaded = true;
        self._playing = false;
        self._currentTime = 0;
        self.dispatchEvent(EventType.READY_TO_PLAY);
        video.autoplay = false;
      }
      video.onPlay(loadedCallback);
    }
    removeVideoPlayer() {
      const video = this.video;
      if (video) {
        video.stop();
        video.destroy();
        this._playing = false;
        this._loaded = false;
        this._loadedMeta = false;
        this._ignorePause = false;
        this._cachedCurrentTime = 0;
        this._video = null;
      }
    }
    setVisible(value) {
      const video = this._video;
      if (!video || this._visible === value) {
        return;
      }
      if (value) {
        video.width = this._actualWidth || 0;
      } else {
        video.width = 0; // hide video
      }

      this._visible = value;
    }
    getDuration() {
      return this.duration();
    }
    duration() {
      return this._duration;
    }
    syncPlaybackRate(value) {
      const video = this._video;
      if (video && value !== video.playbackRate) {
        if (value === 0.5 | value === 0.8 | value === 1.0 | value === 1.25 | value === 1.5) {
          video.playbackRate = value;
        } else {
          console.warn('The platform does not support this PlaybackRate!');
        }
      }
    }
    syncVolume() {
      console.warn('The platform does not support');
    }
    syncMute(enable) {
      const video = this._video;
      if (video && video.muted !== enable) {
        video.muted = enable;
      }
    }
    syncLoop(enable) {
      const video = this._video;
      if (video && video.loop !== enable) {
        video.loop = enable;
      }
    }
    syncStayOnBottom() {
      console.warn('The platform does not support');
    }
    getCurrentTime() {
      if (this.video) {
        return this.currentTime();
      }
      return -1;
    }
    currentTime() {
      return this._currentTime;
    }
    seekTo(time) {
      const video = this._video;
      if (!video || !this._loaded) return;
      video.seek(time);
    }
    disable(noPause) {
      if (this._video) {
        if (!noPause) {
          this._video.pause();
        }
        this.setVisible(false);
        this._visible = false;
      }
    }
    enable() {
      if (this._video) {
        this.setVisible(true);
        this._visible = true;
      }
    }
    canPlay() {
      this._video.play();
      this.syncCurrentTime();
    }
    resume() {
      const video = this._video;
      if (this._playing || !video) return;
      video.play();
    }
    pause() {
      const video = this._video;
      if (!this._playing || !video) return;
      video.pause();
    }
    stop() {
      const self = this;
      const video = this._video;
      if (!video || !this._visible) return;
      // HACK: this is to unify inconsistent behavior (on Android, video won't play from begin if called pause() before called stop().
      // but if called play() before stop(), video will play from begin.) of wechat official interface on Android & iOS.
      if (!this._playing) {
        video.play();
      }
      video.stop().then(res => {
        if (res.errMsg && !res.errMsg.includes('ok')) {
          console.error('failed to stop video player');
          return;
        }
        self._currentTime = 0;
        self._playing = false;
        self.dispatchEvent(EventType.STOPPED);
      });
    }
    canFullScreen(enabled) {
      if (this._video) {
        this.setFullScreenEnabled(enabled);
      }
    }
    setFullScreenEnabled(enable) {
      const video = this._video;
      if (!video || this._fullScreenEnabled === enable) {
        return;
      }
      if (enable) {
        video.requestFullScreen();
      } else {
        video.exitFullScreen();
      }
      this._fullScreenEnabled = enable;
    }

    // eslint-disable-next-line no-unused-vars
    syncKeepAspectRatio(enabled) {
      console.warn('On wechat game videoPlayer is always keep the aspect ratio');
    }
    syncMatrix() {
      if (!this._video || !this._component || !this._uiTrans) return;
      const camera = this.UICamera;
      if (!camera) {
        return;
      }
      this._component.node.getWorldMatrix(_mat4_temp);
      const {
        width,
        height
      } = this._uiTrans.contentSize;
      if (!this._forceUpdate && this._m00 === _mat4_temp.m00 && this._m01 === _mat4_temp.m01 && this._m04 === _mat4_temp.m04 && this._m05 === _mat4_temp.m05 && this._m12 === _mat4_temp.m12 && this._m13 === _mat4_temp.m13 && this._w === width && this._h === height) {
        return;
      }

      // update matrix cache
      this._m00 = _mat4_temp.m00;
      this._m01 = _mat4_temp.m01;
      this._m04 = _mat4_temp.m04;
      this._m05 = _mat4_temp.m05;
      this._m12 = _mat4_temp.m12;
      this._m13 = _mat4_temp.m13;
      this._w = width;
      this._h = height;

      // const canvasWidth = cc.game.canvas.width;
      const canvasHeight = cc.game.canvas.height;
      const ap = this._uiTrans.anchorPoint;
      // Vectors in node space
      cc.Vec3.set(_topLeft, -ap.x * this._w, (1.0 - ap.y) * this._h, 0);
      cc.Vec3.set(_bottomRight, (1 - ap.x) * this._w, -ap.y * this._h, 0);
      // Convert to world space
      cc.Vec3.transformMat4(_topLeft, _topLeft, _mat4_temp);
      cc.Vec3.transformMat4(_bottomRight, _bottomRight, _mat4_temp);
      // Convert to Screen space
      camera.worldToScreen(_topLeft, _topLeft);
      camera.worldToScreen(_bottomRight, _bottomRight);
      const finalWidth = _bottomRight.x - _topLeft.x;
      const finalHeight = _topLeft.y - _bottomRight.y;
      this._video.x = _topLeft.x / dpr;
      this._video.y = (canvasHeight - _topLeft.y) / dpr;
      this._actualWidth = this._video.width = finalWidth / dpr;
      this._video.height = finalHeight / dpr;
      this._forceUpdate = false;
    }
  }
}

},{}],6:[function(require,module,exports){
"use strict";

// require('../fs-utils');
require('../../../../common/engine/index');
require('./VideoPlayer');
require('./sprite-frame');

},{"../../../../common/engine/index":4,"./VideoPlayer":5,"./sprite-frame":7}],7:[function(require,module,exports){
"use strict";

if (cc.SpriteFrame) {
  cc.SpriteFrame.prototype._checkPackable = function () {
    const dynamicAtlas = cc.internal.dynamicAtlasManager;
    if (!dynamicAtlas) return;
    const texture = this._texture;
    if (!(texture instanceof cc.Texture2D) || texture.isCompressed) {
      this._packable = false;
      return;
    }
    const w = this.width;
    const h = this.height;
    if (!texture.image || w > dynamicAtlas.maxFrameSize || h > dynamicAtlas.maxFrameSize) {
      this._packable = false;
      return;
    }

    // HACK: Can't tell if it's a Canvas or an Image by instanceof on WeChat.
    if (texture.image && texture.image.getContext) {
      this._packable = true;
    }
  };
}

},{}]},{},[6]);
