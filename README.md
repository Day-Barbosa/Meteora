# 🌤️ Meteora

Meteora é uma aplicação web de previsão do tempo desenvolvida com **HTML, CSS e JavaScript puro**, utilizando a API do **Open-Meteo** para obter dados meteorológicos em tempo real.

O projeto possui uma interface inspirada em glassmorphism e tema escuro automático.

---

## ✨ Funcionalidades

* 🔍 Pesquisa de cidades.
* 🌡️ Temperatura atual.
* 🥵 Sensação térmica.
* 💧 Umidade do ar.
* 🌧️ Probabilidade de chuva.
* ⏰ Previsão das próximas 24 horas.
* 📅 Previsão para os próximos 7 dias.
* 🌙 Modo escuro automático (19h às 6h).
* 🎨 Fundo com gradientes dinâmicos conforme as condições climáticas.
* 🐱 Ilustrações diferentes para cada tipo de clima.

---

## 📁 Estrutura do Projeto

```
Meteora/
│
├── css/
│   └── style.css
│
├── js/
│   └── app.js
│
├── index.html
├── rainy.png
├── snowy.png
├── sunny.png
└── windy.png
```

---

## 🚀 Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript
* Open-Meteo Geocoding API
* Open-Meteo Forecast API
* Google Fonts

---

## 🖼️ Imagens

As imagens exibidas variam conforme a condição climática:

| Condição           | Imagem      |
| ------------------ | ----------- |
| ☀️ Ensolarado      | `sunny.png` |
| 🌧️ Chuvoso        | `rainy.png` |
| ❄️ Neve            | `snowy.png` |
| 🌬️ Ventos/Nublado | `windy.png` |

---

## ⚙️ Como executar

1. Clone este repositório:

```bash
git clone https://github.com/seu-usuario/Meteora.git
```

2. Entre na pasta do projeto:

```bash
cd Meteora
```

3. Abra o arquivo:

```text
index.html
```

em qualquer navegador moderno.

---

## 📸 Interface

* Cartões com efeito glassmorphism.
* Fundo dinâmico de acordo com o clima.
* Layout responsivo.
* Tema escuro automático.
* Elementos inspirados em gatos 🐾.

---

## 🌐 APIs utilizadas

### Geocodificação

```
https://geocoding-api.open-meteo.com/v1/search
```

### Previsão do tempo

```
https://api.open-meteo.com/v1/forecast
```

---

## 📌 Melhorias futuras

* 📍 Utilizar localização atual do usuário.
* 🌅 Exibir nascer e pôr do sol.
* 🎞️ Ícones animados com Lottie.
* ⭐ Favoritar cidades.
* 📱 Transformar em PWA.

---

Projeto desenvolvido para fins de estudo e prática de desenvolvimento web.
