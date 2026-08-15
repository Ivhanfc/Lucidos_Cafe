```mermaid
flowchart TD
    root["LucidosCafe"]
    root --> go["go.mod"]
    root --> cmd["cmd/"]
    root --> internal["internal/"]

    cmd --> api["api/"]
    api --> main["main.go"]

    internal --> app["application/"]
    internal --> domain["domain/"]
    internal --> ports["ports/"]
    internal --> infrastructure["infrastructure/"]

    infrastructure --> http["http/"]
    infrastructure --> persistence["persistence/"]
    infrastructure --> websocket["websocket/"]

    http --> router["router.go"]
    http --> authFolder["auth/"]
    authFolder --> goth["goth.go"]
    http --> dtoFolder["dto/"]
    dtoFolder --> orderDto["order_dto.go"]
    http --> handlerFolder["handler/"]
    handlerFolder --> authHandler["auth_handler.go"]
    handlerFolder --> orderHandler["order_handler.go"]

    persistence --> memoryFolder["memory/"]
    memoryFolder --> orderMemory["order_memory.go"]
    memoryFolder --> userMemory["user_repository.go"]

    ports --> orderRepositoryPort["order_repository.go"]
    ports --> notifierPort["realtime_notifier.go"]
    ports --> userRepositoryPort["user_repository.go"]

    domain --> order["order/"]
    order --> orderGo["order.go"]
    order --> orderStatus["status.go"]
    order --> orderErr["errors.go"]

    domain --> product["product/"]
    product --> productGo["product.go"]
    product --> categoryGo["category.go"]
    product --> productErr["errors.go"]

    domain --> user["user/"]
    user --> userGo["user.go"]
    user --> userErr["errors.go"]

    %% Flujo de inyección y dependencias
    main --> authFolder
    main --> handlerFolder
    main --> memoryFolder
    main --> router
    router --> handlerFolder
    handlerFolder --> app
    handlerFolder -. usa interfaces .-> ports
    memoryFolder -. implementa .-> ports
    app --> domain
    infrastructure -. implementa .-> ports
    app --> ports

    classDef entry fill:#e3f2fd,stroke:#1e88e5,stroke-width:1px;
    classDef layer fill:#e8f5e9,stroke:#43a047,stroke-width:1px;
    classDef infra fill:#fff3e0,stroke:#fb8c00,stroke-width:1px;
    classDef domain fill:#f3e5f5,stroke:#8e24aa,stroke-width:1px;

    class root,main,go,cmd,internal entry;
    class api,app,domain,ports,infrastructure layer;
    class http,persistence,websocket,authFolder,dtoFolder,handlerFolder,memoryFolder,router infra;
    class order,product,user,orderGo,orderStatus,orderErr,productGo,categoryGo,productErr,userGo,userErr,orderDto,authHandler,orderHandler,orderMemory,userMemory,orderRepositoryPort,notifierPort,userRepositoryPort domain;
```