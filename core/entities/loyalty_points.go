package entities

type LoyaltyPoints struct {
	UserID int64 `form:"user_id"`
	Points int   `form:"points"`
}
