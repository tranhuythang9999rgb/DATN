package repository

import (
	"context"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/domain"

	"errors"

	"gorm.io/gorm"
)

type TransactionService struct {
	transaction *gorm.DB
}

func NewTransaction(trans *adapter.PostGresql) domain.RepositoryTransaction {
	return &TransactionService{
		transaction: trans.CreateCollection(),
	}
}

func (s *TransactionService) BeginTransaction(ctx context.Context) (*gorm.DB, error) {
	if s.transaction == nil {
		return nil, errors.New("transaction is nil")
	}

	tx := s.transaction.Begin()
	if tx.Error != nil {
		return nil, tx.Error
	}

	return tx, nil
}
