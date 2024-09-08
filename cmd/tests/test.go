package main

import (
	"fmt"
	"shoe_shop_server/common/utils"
	"time"
)

func main() {
	//1725774521
	fmt.Println(utils.ConvertTimestampToDateTime(1725814799))
}

func GenerateTimestamp() int64 {
	timeNow := time.Now()
	// Cộng thêm 2 ngày vào thời gian hiện tại
	timeInTwoDays := timeNow.Add(72 * time.Hour) // 48 hours = 2 days
	return timeInTwoDays.Unix()
}
