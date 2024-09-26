package main

import (
	"fmt"
	"regexp"
)

// extractBookName extracts the book name from a given sentence.
func extractBookName(data string) string {
	// Define the regex pattern to capture the book name between "cuốn sách" and "có giá"
	re := regexp.MustCompile(`(?i)cuốn sách (.+?) có giá`)

	// Find the match
	match := re.FindStringSubmatch(data)

	// Check if a match was found
	if len(match) > 1 {
		return match[1] // Return the captured group (book name)
	}

	// Return an error if no book name is found
	return ""
}

func main() {
	data := "cuốn Sách Những người cùng sướng có giá bao nhiêu"
	bookName := extractBookName(data)
	fmt.Println("Tên sách:", bookName)
}
