export namespace domain {
	
	export class CryptoDecryptResult {
	    plainText: string;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new CryptoDecryptResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.plainText = source["plainText"];
	        this.error = source["error"];
	    }
	}
	export class CryptoEncryptResult {
	    cipher: string;
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new CryptoEncryptResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cipher = source["cipher"];
	        this.error = source["error"];
	    }
	}
	export class DecodedResult {
	    decoded?: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new DecodedResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.decoded = source["decoded"];
	        this.error = source["error"];
	    }
	}
	export class EmptyResult {
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new EmptyResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.error = source["error"];
	    }
	}
	export class EncodedResult {
	    encoded?: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new EncodedResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.encoded = source["encoded"];
	        this.error = source["error"];
	    }
	}
	export class GpgKeyPub {
	    type: string;
	    length: number;
	    algo: number;
	    keyid: string;
	    date: number;
	    expires: number;
	
	    static createFrom(source: any = {}) {
	        return new GpgKeyPub(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.type = source["type"];
	        this.length = source["length"];
	        this.algo = source["algo"];
	        this.keyid = source["keyid"];
	        this.date = source["date"];
	        this.expires = source["expires"];
	    }
	}
	export class GpgKeyUid {
	    uid: string;
	
	    static createFrom(source: any = {}) {
	        return new GpgKeyUid(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uid = source["uid"];
	    }
	}
	export class GpgKey {
	    uid: GpgKeyUid;
	    pub: GpgKeyPub;
	
	    static createFrom(source: any = {}) {
	        return new GpgKey(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.uid = this.convertValues(source["uid"], GpgKeyUid);
	        this.pub = this.convertValues(source["pub"], GpgKeyPub);
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	
	
	export class GpgListKeysResult {
	    data: GpgKey[];
	    error: string;
	
	    static createFrom(source: any = {}) {
	        return new GpgListKeysResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.data = this.convertValues(source["data"], GpgKey);
	        this.error = source["error"];
	    }
	
		convertValues(a: any, classs: any, asMap: boolean = false): any {
		    if (!a) {
		        return a;
		    }
		    if (a.slice) {
		        return (a as any[]).map(elem => this.convertValues(elem, classs));
		    } else if ("object" === typeof a) {
		        if (asMap) {
		            for (const key of Object.keys(a)) {
		                a[key] = new classs(a[key]);
		            }
		            return a;
		        }
		        return new classs(a);
		    }
		    return a;
		}
	}
	export class HashResult {
	    hashed?: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new HashResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.hashed = source["hashed"];
	        this.error = source["error"];
	    }
	}
	export class JwtDecodedResult {
	    decoded?: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new JwtDecodedResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.decoded = source["decoded"];
	        this.error = source["error"];
	    }
	}
	export class JwtEncodedResult {
	    encoded?: string;
	    error?: string;
	
	    static createFrom(source: any = {}) {
	        return new JwtEncodedResult(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.encoded = source["encoded"];
	        this.error = source["error"];
	    }
	}

}

