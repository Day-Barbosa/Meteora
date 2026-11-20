<div align="center">

# 🌤️ Meteora

Previsão do tempo em **HTML, CSS e JavaScript puro**, com dados em tempo real da API Open-Meteo, visual *glassmorphism* e tema escuro automático.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES2020-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Open-Meteo](https://img.shields.io/badge/API-Open--Meteo-0A84FF?style=for-the-badge)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)

![Status](https://img.shields.io/badge/status-no_ar-success)
![Licença](https://img.shields.io/badge/licença-MIT-blue)

**[🌐 Abrir o Meteora](https://day-barbosa.github.io/Meteora/)**

</div>

---

<!-- 📸 MÍDIA: grave um GIF (~10 s) buscando duas cidades com climas diferentes (ex.: "Salvador" e "Gramado") para mostrar a troca de gradiente e do gatinho. Salve em docs/demo.gif e troque este comentário por:
<p align="center"><img src="docs/demo.gif" alt="Meteora em uso" width="800"></p>
-->

## 💡 Sobre o projeto

Uma consulta rápida de clima, **sem framework e sem chave de API**: a pessoa digita uma cidade e vê a condição atual, as próximas 24 horas e os próximos 7 dias. O fundo e a ilustração de gatinho mudam conforme o clima, e o tema escuro liga sozinho à noite. O objetivo foi praticar consumo de APIs REST com `fetch`/`async-await` e manipulação do DOM sem bibliotecas.

## 🏗️ Arquitetura e decisões técnicas

```mermaid
sequenceDiagram
    actor U as Usuário
    participant UI as index.html + app.js
    participant GEO as Open-Meteo Geocoding
    participant FC as Open-Meteo Forecast

    U->>UI: digita a cidade (Enter ou botão)
    UI->>GEO: GET /v1/search?name=cidade
    GEO-->>UI: latitude, longitude, país
    UI->>FC: GET /v1/forecast (current, hourly, daily)
    FC-->>UI: temperatura, umidade, chuva, weather_code
    UI->>UI: código WMO → condição → gradiente + gatinho + emojis
    UI-->>U: cards de agora, próximas horas e 7 dias
```

| Decisão | Por quê |
|---|---|
| **JavaScript puro** | Foco nos fundamentos: `fetch`, `async/await`, `URLSearchParams` e DOM, sem framework. |
| **Open-Meteo** | API gratuita e sem chave, então o projeto roda direto no navegador e no GitHub Pages sem expor segredos. |
| **Duas chamadas encadeadas** | A geocodificação transforma o nome da cidade em coordenadas, e a previsão usa essas coordenadas. |
| **Tabela de códigos WMO** | Um só mapeamento converte o `weather_code` em condição (sol, chuva, neve, vento), emoji, gradiente e imagem. |
| **Tema escuro por horário** | Entre 19h e 6h, a classe `dark` é aplicada automaticamente. |

## ✨ Funcionalidades

- 🔍 Busca de cidades pelo nome
- 🌡️ Temperatura atual e sensação térmica
- 💧 Umidade do ar e 🌧️ probabilidade de chuva
- ⏰ Previsão das próximas 24 horas
- 📅 Previsão dos próximos 7 dias (máxima, mínima e chuva)
- 🎨 Gradiente de fundo dinâmico conforme o clima
- 🐱 Ilustração de gatinho para cada condição
- 🌙 Tema escuro automático (19h às 6h)
- ⏳ Indicador de carregamento e mensagens de erro (ex.: cidade não encontrada)

## 🚀 Como rodar localmente

Não precisa instalar nada.

```bash
git clone https://github.com/Day-Barbosa/Meteora.git
cd Meteora
```

Abra o `index.html` no navegador. Se preferir um servidor local: `npx serve .` ou a extensão *Live Server* do VS Code.

## 📁 Estrutura

```text
Meteora/
├── assets/img/   # Ilustrações por condição: sunny, rainy, snowy, windy
├── css/
│   └── style.css # Glassmorphism, gradientes e tema escuro
├── js/
│   └── app.js    # Chamadas à API, mapeamento WMO e renderização
└── index.html
```

## 🗺️ Próximos passos

- [ ] 📍 Usar a localização atual do navegador
- [ ] 🌅 Exibir nascer e pôr do sol
- [ ] ⭐ Favoritar cidades (localStorage)
- [ ] 📱 Transformar em PWA

## 👩‍💻 Autora

**Dayana Barbosa** · [LinkedIn](https://www.linkedin.com/in/dayanabarbosa-devjava/) · [GitHub](https://github.com/Day-Barbosa)

---

<sub>Dados meteorológicos: [Open-Meteo](https://open-meteo.com/). Distribuído sob a licença MIT. Veja [`LICENSE`](LICENSE).</sub>
