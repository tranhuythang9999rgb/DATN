package main

import (
	"fmt"
	"shoe_shop_server/common/utils"
	"time"
)

func main() {
	fmt.Println(utils.ConvertTimestampToDateTime(1725728400))
}

func GenerateTimestamp() int64 {
	timeNow := time.Now()
	// Cộng thêm 1 năm vào thời gian hiện tại
	timeNextYear := timeNow.AddDate(1, 0, 0)
	return timeNextYear.Unix()
}
