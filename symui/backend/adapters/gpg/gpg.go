package gpg

import (
	"bytes"
	"errors"
	"fmt"
	"github.com/realfabecker/symui/backend/core/domain"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

func ListKeys() ([]domain.GpgKey, error) {
	lraw, err := listKeysRaw()
	if err != nil {
		return nil, err
	}
	var lkeys []domain.GpgKey
	for _, v := range lraw {
		var key domain.GpgKey
		for _, l := range v {
			if strings.HasPrefix(l, "pub:") {
				pub, err := newGpgKeyPub(l)
				if err != nil {
					return nil, err
				}
				key.Pub = *pub
			} else if strings.HasPrefix(l, "uid:") {
				uid, err := newGpgKeyUid(l)
				if err != nil {
					return nil, err
				}
				key.Uid = *uid
			}
		}
		lkeys = append(lkeys, key)
	}
	return lkeys, nil
}

func listKeysRaw() ([][]string, error) {
	cmda := exec.Command("gpg", "--list-keys", "--keyid-format=long", "--with-colons")
	var outb, errb bytes.Buffer

	cmda.Stdout = &outb
	cmda.Stderr = &errb
	if err := cmda.Run(); err != nil {
		return nil, err
	}

	lkeys := make([][]string, 0)
	lindex := 0
	for _, v := range strings.Split(strings.TrimSpace(outb.String()), "\n") {
		if strings.HasPrefix(v, "tru:") {
			continue
		}
		if strings.HasPrefix(v, "pub:") {
			if len(lkeys) > 0 {
				lindex = lindex + 1
			}
		}
		if len(lkeys) == 0 || lindex >= len(lkeys) {
			lkeys = append(lkeys, []string{v})
		} else {
			lkeys[lindex] = append(lkeys[lindex], v)
		}
	}
	return lkeys, nil
}

func newGpgKeyPub(pub string) (*domain.GpgKeyPub, error) {
	lkey := strings.Split(pub, ":")
	if len(lkey) < 6 {
		return nil, errors.New("newGpgKeyPub: unable to obtain pub meta from key")
	}
	length, err := strconv.Atoi(lkey[2])
	if err != nil {
		return nil, err
	}
	algo, err := strconv.Atoi(lkey[3])
	if err != nil {
		return nil, err
	}
	date, err := strconv.Atoi(lkey[5])
	if err != nil {
		return nil, err
	}
	expires, err := strconv.Atoi(lkey[6])
	if err != nil {
		return nil, err
	}
	return &domain.GpgKeyPub{
		Type:    lkey[1],
		Length:  int32(length),
		Algo:    int8(algo),
		Keyid:   lkey[4],
		Date:    int32(date),
		Expires: int32(expires),
	}, nil
}

func newGpgKeyUid(uid string) (*domain.GpgKeyUid, error) {
	lkey := strings.Split(uid, ":")
	if len(lkey) < 9 {
		return nil, errors.New("newGpgKeyUid: unable to obtain uid meta from key")
	}
	return &domain.GpgKeyUid{Uid: lkey[9]}, nil
}

func NewGpgKey(email string, weeks int8) error {
	cmd := exec.Command("gpg", "--batch", "--gen-key")
	cmd.Stdin = bytes.NewBufferString(fmt.Sprintf(`
Key-Type: 1
Key-Length: 2048
Subkey-Type: 1
Subkey-Length: 2048
Name-Real: %s
Name-Email: %s
Expire-Date: %s
`, email, email, time.Now().AddDate(0, 0, 7*int(weeks)).Format("20060102T150405")))
	var errb bytes.Buffer
	cmd.Stderr = &errb
	if err := cmd.Run(); err != nil {
		return err
	}
	if errb.Len() == 0 {
		return errors.New("newGpgKey: unexpected error generating key")
	}
	if !strings.Contains(errb.String(), "revocation certificate stored as") {
		return fmt.Errorf("newGpgKey: %s", errb.String())
	}
	return nil
}

func DeleteSecretKeys(email string) error {
	cmd := exec.Command("gpg", "--delete-secret-keys", email)
	return cmd.Run()
}

func DeletePublicKeys(email string) error {
	cmd := exec.Command("gpg", "--delete-keys", email)
	return cmd.Run()
}
