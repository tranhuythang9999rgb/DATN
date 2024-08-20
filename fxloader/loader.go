package fxloader

import (
	"shoe_shop_server/api/controllers"
	"shoe_shop_server/api/routers"
	"shoe_shop_server/assets/infrastructure"
	"shoe_shop_server/assets/services"
	"shoe_shop_server/core/adapter"
	"shoe_shop_server/core/adapter/repository"
	"shoe_shop_server/core/events/caching"
	"shoe_shop_server/core/events/caching/cache"
	"shoe_shop_server/core/usecase"

	"github.com/go-playground/validator/v10"
	"go.uber.org/fx"
)

func Load() []fx.Option {
	return []fx.Option{
		fx.Options(loadAdapter()...),
		fx.Options(loadUseCase()...),
		fx.Options(loadValidator()...),
		fx.Options(loadEngine()...),
	}
}
func loadUseCase() []fx.Option {
	return []fx.Option{
		fx.Provide(services.NewServiceAddress),
		fx.Provide(usecase.NewUseCaseUse),
		fx.Provide(cache.NewCache),
		fx.Provide(usecase.NewUploadBookUseCase),
		fx.Provide(usecase.NewFileStoragesUseCase),
	}
}

func loadValidator() []fx.Option {
	return []fx.Option{
		fx.Provide(validator.New),
	}
}
func loadEngine() []fx.Option {
	return []fx.Option{
		fx.Provide(routers.NewApiRouter),
		fx.Provide(controllers.NewBaseController),
		fx.Provide(controllers.NewControllersUser),
		fx.Provide(controllers.NewControllerAddress),
		fx.Provide(controllers.NewControllersUploadBooks),
		fx.Provide(controllers.NewControllerFileLc),
	}
}
func loadAdapter() []fx.Option {
	return []fx.Option{
		fx.Provide(adapter.NewpostgreDb),
		fx.Provide(infrastructure.NewCollectionAddress),
		fx.Provide(repository.NewConllectionUser),
		fx.Provide(caching.NewRedisDb),
		fx.Provide(repository.NewCollectionBook),
		fx.Provide(repository.NewConllectionFileStore),
		fx.Provide(repository.NewTransaction),
	}
}
