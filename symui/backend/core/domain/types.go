package domain

type EmptyResult struct {
	Error string `json:"error,omitempty"`
}

type EncodedResult struct {
	Encoded string `json:"encoded,omitempty"`
	Error   string `json:"error,omitempty"`
}

type DecodedResult struct {
	Decoded string `json:"decoded,omitempty"`
	Error   string `json:"error,omitempty"`
}

type JwtEncodedResult struct {
	Encoded string `json:"encoded,omitempty"`
	Error   string `json:"error,omitempty"`
}

type JwtDecodedResult struct {
	Decoded string `json:"decoded,omitempty"`
	Error   string `json:"error,omitempty"`
}

type HashResult struct {
	Hashed string `json:"hashed,omitempty"`
	Error  string `json:"error,omitempty"`
}

type CryptoEncryptResult struct {
	Cipher string `json:"cipher"`
	Error  string `json:"error"`
}

type CryptoDecryptResult struct {
	PlainText string `json:"plainText"`
	Error     string `json:"error"`
}

type GpgListKeysResult struct {
	Data  []GpgKey `json:"data"`
	Error string   `json:"error"`
}

type GpgKey struct {
	Uid GpgKeyUid `json:"uid"`
	Pub GpgKeyPub `json:"pub"`
}

type GpgKeyUid struct {
	Uid string `json:"uid"`
}

type GpgKeyPub struct {
	Type    string `json:"type"`
	Length  int32  `json:"length"`
	Algo    int8   `json:"algo"`
	Keyid   string `json:"keyid"`
	Date    int32  `json:"date"`
	Expires int32  `json:"expires"`
}
