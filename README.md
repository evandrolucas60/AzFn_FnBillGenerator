# FnBillGeneration

Projeto de geração e validação de códigos de barras utilizando **Azure Functions** e **Azure Service Bus**.

## Visão Geral

Este repositório contém duas Azure Functions:

- **FnBillGeneration**: Gera códigos de barras a partir de dados fornecidos (valor e data de vencimento), armazena a imagem gerada e envia os dados para uma fila do Azure Service Bus.
- **FnBillValidation**: Valida códigos de barras recebidos, verificando seu formato e data de vencimento.

Também está incluída uma **interface web simples** para interação com essas funções.

## Estrutura do Projeto

```
FnBillGeneration/
│
├── FnBillGeneration/         # Azure Function para geração de códigos de barras
│   ├── Function1.cs
│   ├── Program.cs
│   └── ...
│
├── FnBillValidation/         # Azure Function para validação de códigos de barras
│   ├── Function1.cs
│   ├── Program.cs
│   └── ...
│
├── front/                    # Interface web (HTML, CSS, JS)
│   ├── index.html
│   ├── script.js
│   └── style.css
│
└── FnBillGeneration.sln      # Solução do Visual Studio
```

## Tecnologias Utilizadas

- [.NET 8](https://dotnet.microsoft.com/)
- [Azure Functions (Isolated Worker Model)](https://learn.microsoft.com/azure/azure-functions/dotnet-isolated-process-guide)
- [Azure Service Bus](https://learn.microsoft.com/azure/service-bus-messaging/)
- [BarcodeLib](https://www.nuget.org/packages/BarcodeLib) / [BarcodeStandard](https://www.nuget.org/packages/BarcodeStandard)
- [SkiaSharp](https://github.com/mono/SkiaSharp) — para geração de imagens
- [Application Insights](https://learn.microsoft.com/azure/azure-monitor/app/app-insights-overview) (opcional)
- [Service Bus Explorer](https://github.com/paolosalvatori/ServiceBusExplorer) — ferramenta para testes e monitoramento

## Como Executar Localmente

1. **Pré-requisitos**
   - [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
   - [Azure Functions Core Tools](https://learn.microsoft.com/azure/azure-functions/functions-run-local)
   - Conta de Armazenamento no Azure (ou emulador)
   - Azure Service Bus (com namespace e fila criados)
   - Service Bus Explorer (opcional)

2. **Configuração**
   - Configure as `ConnectionStrings` no arquivo `local.settings.json` de cada Azure Function.
   - Verifique se a fila `generator-barcode` está criada no Service Bus.

3. **Build e Execução**
   - Abra a solução `FnBillGeneration.sln` no Visual Studio ou VS Code.
   - Execute ambas as Functions (`FnBillGeneration` e `FnBillValidation`).
   - Abra o arquivo `front/index.html` em um navegador para testar a interface.

4. **Testes**
   - Gere um código de barras via interface web.
   - Valide o código gerado.
   - Verifique a mensagem enviada no Service Bus com o Service Bus Explorer.

## Observações

- O projeto usa o modelo **isolado** do Azure Functions, oferecendo maior flexibilidade e controle.
- A comunicação entre os serviços é feita de forma assíncrona via Azure Service Bus.
- O monitoramento pode ser integrado com o Application Insights.

## Licença

Este projeto está licenciado sob os termos da licença [MIT](LICENSE).

---

Desenvolvido por **[Evandro Lucas]**
