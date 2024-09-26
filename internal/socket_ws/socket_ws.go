package socketws

import (
	"context"
	"log"
	"net/http"
	"shoe_shop_server/internal/protos"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"google.golang.org/grpc"
)

var upgrade = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Event struct {
	Content string `json:"content"`
}

func WsHandler(c *gin.Context) {
	conn, err := upgrade.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("Error upgrading to websocket:", err)
		return
	}
	defer conn.Close()

	grpcConn, err := grpc.Dial("localhost:50051", grpc.WithInsecure())
	if err != nil {
		log.Fatalf("Failed to connect to gRPC server: %v", err)
	}
	defer grpcConn.Close()

	grpcClient := protos.NewAIServiceClient(grpcConn)

	for {
		var event Event
		err := conn.ReadJSON(&event)
		if err != nil {
			log.Println("Error reading json:", err)
			break
		}

		log.Printf("Received event: %+v\n", event)

		grpcRequest := &protos.AIRequest{
			InputData: event.Content,
		}
		response, err := grpcClient.ProcessAIRequest(context.Background(), grpcRequest)
		if err != nil {
			log.Println("Error calling gRPC server:", err)
			break
		}

		log.Printf("gRPC response: %+v\n", response)

		err = conn.WriteJSON(response)
		if err != nil {
			log.Println("Error writing json:", err)
			break
		}
	}
}
