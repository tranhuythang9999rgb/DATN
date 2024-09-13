package main

import (
	"fmt"
	"time"
)

func main() {

	// t := time.Unix(1726216202, 0)
	// startOfDay := time.Date(t.Year(), t.Month(), t.Day(), 0, 0, 0, 0, time.UTC)
	// endOfDay := startOfDay.Add(24 * time.Hour).Add(-time.Nanosecond)
	// fmt.Println(startOfDay.Unix())
	// fmt.Println(reflect.ValueOf(startOfDay).Type())
	// fmt.Println(reflect.ValueOf(endOfDay).Type())
	fmt.Println(GenerateTimestamp())
}

func GenerateTimestamp() int64 {
	timeNow := time.Now()
	// Cộng thêm 2 ngày vào thời gian hiện tại
	timeInTwoDays := timeNow.Add(1 * time.Hour) // 48 hours = 2 days
	return timeInTwoDays.Unix()
}
