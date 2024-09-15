package domain

import (
	"context"
	"time"
)

type LoyaltyPoints struct {
	LoyaltyID   int64 `json:"loyalty_id"`
	UserID      int64 `json:"user_id"`
	Points      int   `json:"points"`
	LastUpdated int64 `json:"last_updated"`
}

// GetLastUpdatedTime returns the last updated time as a time.Time
func (lp *LoyaltyPoints) GetLastUpdatedTime() time.Time {
	return time.Unix(lp.LastUpdated, 0)
}

// SetLastUpdatedTime sets the LastUpdated field using a time.Time
func (lp *LoyaltyPoints) SetLastUpdatedTime(t time.Time) {
	lp.LastUpdated = t.Unix()
}

type RepositoryLoyaltyPoints interface {
	AddLoyaltyPoints(ctx context.Context, req *LoyaltyPoints) error
	GetLoyaltyPointsByUserid(ctx context.Context, userId int64) (*LoyaltyPoints, error)
	GetListPoint(ctx context.Context) ([]*LoyaltyPoints, error)
}
