package mapper

import (
	"shoe_shop_server/common/log"
	"strconv"
)

func ConvertStringToInt(id string) int {
	resp, err := strconv.Atoi(id)
	if err != nil {
		log.Error(err, "error convert string to daate")
		return 0
	}
	return resp
}
