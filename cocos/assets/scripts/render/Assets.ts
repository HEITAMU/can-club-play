import { assetManager, ImageAsset, Rect, resources, Size, SpriteFrame, Texture2D, Vec2 } from 'cc';

export type AssetRecord = { path: string; resource: string; width: number; height: number; bytes?: number; sha256?: string; package?: string };
export type RuntimeManifest = { assets: Record<string, AssetRecord>; packages?: {name:string;root:string}[]; baseUrl?: string; requiresRemoteBaseUrl?: boolean };
const clean = (path: string) => String(path).replace(/^\.\//, '').split('?')[0];
const root = globalThis as any;

/** Original authored resolutions. No mobile character atlases or HTML raster capture. */
export class Assets {
  private textures = new Map<string, Promise<Texture2D>>();
  private frames = new Map<string, Promise<SpriteFrame>>();
  private packages = new Map<string, Promise<void>>();
  private creatorResources: Promise<void> | null = null;
  private runtime: RuntimeManifest | null = null;
  configure(manifest: RuntimeManifest) { this.runtime = manifest; }
  private manifest(): RuntimeManifest | null { return this.runtime || root.CAN_CLUB_ASSET_MANIFEST || null; }
  /** Loads bundle metadata only; its full-resolution textures remain on demand. */
  ensureCreatorResources(): Promise<void> {
    if (this.manifest() || assetManager.getBundle('resources')) return Promise.resolve();
    if (!this.creatorResources) {
      this.creatorResources = new Promise<void>((resolve, reject) => {
        assetManager.loadBundle('resources', error => error ? reject(error) : resolve());
      });
      this.creatorResources.catch(() => { this.creatorResources = null; });
    }
    return this.creatorResources;
  }
  private async ensurePackage(name?: string) {
    if (!name || !root.wx?.loadSubpackage) return;
    if (!this.packages.has(name)) {
      const promise = new Promise<void>((resolve, reject) => root.wx.loadSubpackage({name,success:()=>resolve(),fail:reject}));
      this.packages.set(name, promise);
      promise.catch(() => this.packages.delete(name));
    }
    return this.packages.get(name);
  }
  load(path: string): Promise<Texture2D> {
    const key = clean(path);
    if (!this.textures.has(key)) {
      const task = this.loadTexture(key);
      this.textures.set(key, task);
      task.catch(() => this.textures.delete(key));
    }
    return this.textures.get(key)!;
  }
  private async loadTexture(key: string): Promise<Texture2D> {
    const manifest = this.manifest();
    if (manifest) {
      if (manifest.requiresRemoteBaseUrl && !manifest.baseUrl) throw new Error('微信原尺寸资源服务器尚未配置。');
      const record = manifest.assets[key];
      if (!record) throw new Error(`资源未迁移: ${key}`);
      await this.ensurePackage(record.package);
      const prefix = manifest.baseUrl || '';
      const url = /^(https?:|data:)/.test(record.path) ? record.path : prefix + record.path;
      const image = await new Promise<ImageAsset>((resolve, reject) => {
        assetManager.loadRemote<ImageAsset>(url, { ext: /\.webp(?:\?|$)/i.test(record.path) ? '.webp' : /\.jpe?g(?:\?|$)/i.test(record.path) ? '.jpg' : '.png' }, (error, asset) => error ? reject(error) : resolve(asset));
      });
      const texture = new Texture2D();
      texture.image = image;
      texture.addRef();
      return texture;
    }
    await this.ensureCreatorResources();
    // Creator's importer creates the image's Texture2D sub-asset under /texture.
    const resource = 'art/' + key.replace(/^assets\//, '').replace(/\.(webp|png|jpe?g)$/i, '');
    return new Promise<Texture2D>((resolve, reject) => {
      resources.load(resource + '/texture', Texture2D, (error, texture) => {
        if (!error && texture) { texture.addRef(); resolve(texture); return; }
        resources.load(resource, Texture2D, (fallbackError, fallback) => {
          if (fallbackError || !fallback) reject(fallbackError || error);
          else { fallback.addRef(); resolve(fallback); }
        });
      });
    });
  }
  frame(path: string, rect?: [number, number, number, number]): Promise<SpriteFrame> {
    const key = clean(path) + ':' + (rect ? rect.join(',') : 'whole');
    if (!this.frames.has(key)) {
      const task = this.load(path).then(texture => {
        const [x,y,width,height] = rect || [0,0,texture.width,texture.height];
        if (x<0 || y<0 || width<=0 || height<=0 || x+width>texture.width+.5 || y+height>texture.height+.5) {
          throw new Error(`图集裁切越界 ${path}: ${[x,y,width,height]} / ${texture.width}x${texture.height}`);
        }
        const frame = new SpriteFrame();
        frame.texture = texture;
        frame.rect = new Rect(x,y,width,height);
        frame.originalSize = new Size(width,height);
        frame.offset = new Vec2(0,0);
        frame.rotated = false;
        frame.addRef();
        return frame;
      });
      this.frames.set(key,task);
      task.catch(()=>this.frames.delete(key));
    }
    return this.frames.get(key)!;
  }
  async preload(paths: string[], onProgress?: (completed:number,total:number,path:string)=>void) {
    const unique = [...new Set(paths.map(clean))];
    let next=0, completed=0;
    // Bound decoding work; loading a large roster must not allocate every image at once.
    await Promise.all(Array.from({length:Math.min(3,unique.length)}, async()=>{
      while(next<unique.length) {
        const path=unique[next++]; await this.load(path); onProgress?.(++completed,unique.length,path);
      }
    }));
  }
  clear() {
    this.frames.forEach(p=>p.then(f=>f.decRef()).catch(()=>{}));
    this.textures.forEach(p=>p.then(t=>t.decRef()).catch(()=>{}));
    this.frames.clear();this.textures.clear();
  }
}
export const assets = new Assets();
