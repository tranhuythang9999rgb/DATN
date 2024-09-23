package utils

import (
	"bytes"
	"crypto/aes"
	"crypto/hmac"
	"crypto/sha256"
	"encoding/base64"
	"fmt"
	"shoe_shop_server/core/configs"
	"strings"
	"time"
)

// Hàm pkcs7Unpad xóa padding từ dữ liệu theo chuẩn PKCS7
func Pkcs7Unpad(data []byte) ([]byte, error) {
	padding := int(data[len(data)-1])
	if padding < 1 || padding > aes.BlockSize {
		return nil, fmt.Errorf("Invalid padding")
	}

	return data[:len(data)-padding], nil
}

func Pkcs7Pad(data []byte, blockSize int) []byte {
	padding := blockSize - (len(data) % blockSize)
	padText := bytes.Repeat([]byte{byte(padding)}, padding)
	return append(data, padText...)
}
func GeneratekToken(data string) string {
	h := hmac.New(sha256.New, []byte(configs.Get().ChecksumKey))
	data = fmt.Sprintf("%d:%s", time.Now().UnixNano(), data)
	h.Write([]byte(data))
	signature := base64.RawURLEncoding.EncodeToString(h.Sum(nil))
	token := fmt.Sprintf("%s.%s", base64.RawURLEncoding.EncodeToString([]byte(data)), signature)
	return token
}

func VerifyWebhookToken(channelId, token string) (string, bool) {
	parts := strings.Split(token, ".")
	if len(parts) != 2 {
		return "", false
	}

	data, signature := parts[0], parts[1]
	decodedData, err := base64.RawURLEncoding.DecodeString(data)
	if err != nil {
		return "", false
	}
	h := hmac.New(sha256.New, []byte(configs.Get().ChecksumKey))
	h.Write(decodedData)
	expectedSignature := base64.RawURLEncoding.EncodeToString(h.Sum(nil))

	if expectedSignature == signature {
		dataParsed := strings.Split(string(decodedData), ":")
		if len(dataParsed) == 2 {
			return dataParsed[1], true
		} else if len(dataParsed) == 3 {
			return dataParsed[1], dataParsed[2] == channelId
		}
	}
	return "", false
}
