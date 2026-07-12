"use strict";


/* ==========================================================
   CONFIGURAÇÕES
========================================================== */

const TOTAL_PAIRS = 10;

const CARD_BACK_ID = "capa";


/* ==========================================================
   CAMINHOS DAS IMAGENS

   Todos os arquivos ficam na mesma pasta dos códigos.
========================================================== */

const IMAGE_SOURCES = Object.fromEntries([
    ...Array.from(
        {
            length: 20
        },

        (_, index) => {
            const number = String(
                index + 1
            ).padStart(
                2,
                "0"
            );


            return [
                `img${number}`,
                `img${number}.jpg`
            ];
        }
    ),

    [
        CARD_BACK_ID,
        "capa.jpg"
    ]
]);


/* ==========================================================
   ORGANIZAÇÃO DOS DEZ PARES
========================================================== */

const THEMES = [
    {
        firstImage: "img01",
        secondImage: "img02",

        name: "Ira",

        englishName: "Wrath",

        description:
            "É a raiva intensa que pode conduzir a atitudes impulsivas. " +
            "Compreender as próprias emoções e criar tempo para refletir " +
            "ajuda a transformar a ira em ação responsável."
    },

    {
        firstImage: "img03",
        secondImage: "img04",

        name: "Preguiça",

        englishName: "Sloth",

        description:
            "Representa a falta de disposição para agir diante das " +
            "responsabilidades. Pequenas ações, realizadas com constância, " +
            "podem superar a imobilidade e recuperar a motivação."
    },

    {
        firstImage: "img05",
        secondImage: "img06",

        name: "Inveja",

        englishName: "Envy",

        description:
            "Surge da comparação constante com as conquistas de outras " +
            "pessoas. Reconhecer o próprio valor ajuda a substituir a " +
            "inveja pelo aprendizado e pela admiração."
    },

    {
        firstImage: "img07",
        secondImage: "img08",

        name: "Ganância",

        englishName: "Greed",

        description:
            "É o desejo exagerado de possuir riquezas, poder ou vantagens. " +
            "A busca sem limites pode fazer com que necessidades humanas, " +
            "relações e responsabilidades sejam esquecidas."
    },

    {
        firstImage: "img09",
        secondImage: "img10",

        name: "Gula",

        englishName: "Gluttony",

        description:
            "Simboliza o excesso e a dificuldade de reconhecer limites. " +
            "Pode estar relacionada ao consumo de alimentos, bens, " +
            "informações ou experiências de maneira descontrolada."
    },

    {
        firstImage: "img11",
        secondImage: "img12",

        name: "Orgulho",

        englishName: "Pride",

        description:
            "Representa a valorização excessiva de si mesmo. " +
            "Quando o orgulho domina as escolhas, pode dificultar " +
            "o reconhecimento dos próprios limites e afastar as pessoas."
    },

    {
        firstImage: "img13",
        secondImage: "img14",

        name: "Luxúria",

        englishName: "Lust",

        description:
            "Representa o desejo intenso quando ele ultrapassa o respeito, " +
            "o equilíbrio e a responsabilidade. O autocontrole permite " +
            "transformar impulsos em escolhas conscientes."
    },

    {
        firstImage: "img15",
        secondImage: "img16",

        name: "Coragem e covardia",

        englishName: "Courage and Cowardice",

        description:
            "A coragem não significa ausência de medo, mas a capacidade " +
            "de agir com responsabilidade mesmo diante da insegurança. " +
            "A covardia surge quando o medo impede a defesa do que é justo " +
            "ou transfere para outras pessoas a responsabilidade por uma escolha."
    },

    {
        firstImage: "img17",
        secondImage: "img18",

        name: "Cura e enfermidade",

        englishName: "Healing and Illness",

        description:
            "A enfermidade revela a fragilidade da vida e a necessidade " +
            "de cuidado, apoio e compreensão. A cura pode envolver o corpo, " +
            "as emoções e as relações, exigindo tempo, acolhimento, " +
            "tratamento e participação de outras pessoas."
    },

    {
        firstImage: "img19",
        secondImage: "img20",

        name: "Amizade e indiferença",

        englishName: "Friendship and Indifference",

        description:
            "A amizade é construída por meio de confiança, presença, " +
            "respeito e cuidado mútuo. A indiferença acontece quando " +
            "as necessidades e os sentimentos de outras pessoas são ignorados, " +
            "enfraquecendo os vínculos e a convivência."
    }
];


/* ==========================================================
   PRODUÇÃO DAS 20 CARTAS

   img01 + img02 = par 1
   img03 + img04 = par 2
   ...
   img19 + img20 = par 10
========================================================== */

const CARDS = THEMES.flatMap(
    (theme, index) => [
        {
            id: theme.firstImage,

            pair: index + 1,

            type: "symbol",

            alt:
                `${theme.name}: primeira imagem`
        },

        {
            id: theme.secondImage,

            pair: index + 1,

            type: "illustration",

            alt:
                `${theme.name}: segunda imagem`
        }
    ]
);


/* ==========================================================
   RECURSOS QUE SERÃO CARREGADOS
========================================================== */

const RESOURCES = [
    ...CARDS.map(
        (card) => ({
            id: card.id,

            src:
                IMAGE_SOURCES[
                    card.id
                ],

            alt: card.alt
        })
    ),

    {
        id: CARD_BACK_ID,

        src:
            IMAGE_SOURCES[
                CARD_BACK_ID
            ],

        alt:
            "Imagem de capa das cartas"
    }
];


/* ==========================================================
   ELEMENTOS
========================================================== */

const $ = (id) =>
    document.getElementById(id);


const initialScreen =
    $("initialScreen");

const gameScreen =
    $("gameScreen");

const loreScreen =
    $("loreScreen");

const resultModal =
    $("resultModal");


const screens = [
    initialScreen,
    gameScreen,
    loreScreen
];


const previewImages = [
    $("previewImage1"),
    $("previewImage2"),
    $("previewImage3")
];


const previewCards = [
    ...document.querySelectorAll(
        ".preview-card"
    )
];


const imageCache =
    new Map();


/* ==========================================================
   ESTADO DO JOGO
========================================================== */

let resourcesReady = false;

let missingFilesCount = 0;

let firstCard = null;

let secondCard = null;

let boardLocked = false;

let moves = 0;

let matchedPairs = 0;

let elapsedSeconds = 0;

let timerInterval = null;

let timerStarted = false;

let loreRendered = false;

let pendingTurnTimeout = null;

let pendingResultTimeout = null;

let currentGameSession = 0;


/* ==========================================================
   IMAGEM PROVISÓRIA DE SEGURANÇA
========================================================== */

function createFallbackImage(
    resourceId,
    isCardBack = false
) {
    const mainText = isCardBack
        ? "◆"
        : resourceId
            .replace(
                "img",
                ""
            )
            .toUpperCase();


    const footerText = isCardBack
        ? "SEVEN SINS"
        : resourceId.toUpperCase();


    const svg = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="960"
            height="540"
            viewBox="0 0 960 540"
        >
            <defs>
                <linearGradient
                    id="gradient"
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                >
                    <stop
                        offset="0%"
                        stop-color="#160b21"
                    />

                    <stop
                        offset="52%"
                        stop-color="#62152b"
                    />

                    <stop
                        offset="100%"
                        stop-color="#d87b32"
                    />
                </linearGradient>
            </defs>

            <rect
                width="960"
                height="540"
                rx="38"
                fill="url(#gradient)"
            />

            <rect
                x="22"
                y="22"
                width="916"
                height="496"
                rx="28"
                fill="none"
                stroke="#e6bd5a"
                stroke-width="7"
            />

            <circle
                cx="480"
                cy="255"
                r="150"
                fill="#09070d"
                fill-opacity="0.55"
                stroke="#ffe7a4"
                stroke-width="8"
            />

            <text
                x="480"
                y="310"
                text-anchor="middle"
                font-family="Georgia, serif"
                font-size="${isCardBack ? 130 : 150}"
                font-weight="900"
                fill="#fff3cb"
            >
                ${mainText}
            </text>

            <rect
                x="310"
                y="430"
                width="340"
                height="58"
                rx="29"
                fill="#09070d"
                fill-opacity="0.62"
            />

            <text
                x="480"
                y="468"
                text-anchor="middle"
                font-family="Arial, sans-serif"
                font-size="24"
                font-weight="800"
                letter-spacing="5"
                fill="#fff3cb"
            >
                ${footerText}
            </text>
        </svg>
    `;


    return (
        "data:image/svg+xml;charset=UTF-8," +
        encodeURIComponent(svg)
    );
}


/* ==========================================================
   CARREGAR UMA IMAGEM
========================================================== */

function loadImageResource(resource) {
    return new Promise(
        (resolve) => {
            const image =
                new Image();


            image.alt =
                resource.alt;


            image.decoding =
                "async";


            image.onload =
                () => {
                    imageCache.set(
                        resource.id,
                        resource.src
                    );


                    resolve(false);
                };


            image.onerror =
                () => {
                    missingFilesCount += 1;


                    imageCache.set(
                        resource.id,

                        createFallbackImage(
                            resource.id,

                            resource.id ===
                                CARD_BACK_ID
                        )
                    );


                    resolve(true);
                };


            image.src =
                resource.src;
        }
    );
}


/* ==========================================================
   PRÉ-CARREGAR AS 21 IMAGENS
========================================================== */

async function preloadAllResources() {
    resourcesReady = false;

    missingFilesCount = 0;

    imageCache.clear();


    $("startButton").hidden = true;

    $("startButton").disabled = true;


    let completed = 0;


    updateLoadingProgress(
        completed
    );


    await Promise.all(
        RESOURCES.map(
            async (resource) => {
                $("loadingText").textContent =
                    resource.id ===
                    CARD_BACK_ID

                        ? "Preparando capa.jpg..."

                        : `Preparando ${resource.src}...`;


                await loadImageResource(
                    resource
                );


                completed += 1;


                updateLoadingProgress(
                    completed
                );
            }
        )
    );


    resourcesReady = true;


    finishLoading();
}


/* ==========================================================
   PROGRESSO DO CARREGAMENTO
========================================================== */

function updateLoadingProgress(completed) {
    const percentage =
        Math.round(
            (
                completed /
                RESOURCES.length
            ) * 100
        );


    $("loadingPercentage").textContent =
        `${percentage}%`;


    $("loadingCounter").textContent =
        `${completed} de ` +
        `${RESOURCES.length} recursos preparados`;


    $("loadingBar").style.width =
        `${percentage}%`;


    $("loadingTrack").setAttribute(
        "aria-valuenow",
        String(completed)
    );
}


/* ==========================================================
   FINALIZAR CARREGAMENTO
========================================================== */

function finishLoading() {
    $("loadingPercentage").textContent =
        "100%";


    $("loadingBar").style.width =
        "100%";


    if (missingFilesCount === 0) {
        $("loadingText").textContent =
            "Todas as imagens estão prontas.";


        $("fileInformation").innerHTML = `
            <span aria-hidden="true">✓</span>

            <p>
                <strong>img01.jpg</strong> até
                <strong>img20.jpg</strong> e
                <strong>capa.jpg</strong>
                foram encontrados corretamente.
            </p>
        `;

    } else {
        $("loadingText").textContent =
            "O jogo está pronto com imagens provisórias.";


        $("fileInformation").innerHTML = `
            <span aria-hidden="true">!</span>

            <p>
                ${missingFilesCount}
                arquivo(s) não foram encontrados.
                Verifique os nomes e a extensão
                <strong>.jpg</strong>.
            </p>
        `;
    }


    refreshInitialPreview(
        false
    );


    $("startButton").hidden =
        false;


    $("startButton").disabled =
        false;
}


/* ==========================================================
   EMBARALHAR
========================================================== */

function shuffle(items) {
    const result =
        [...items];


    for (
        let index =
            result.length - 1;

        index > 0;

        index -= 1
    ) {
        const randomIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );


        [
            result[index],
            result[randomIndex]
        ] = [
            result[randomIndex],
            result[index]
        ];
    }


    return result;
}


/* ==========================================================
   CRIAR ELEMENTO DE IMAGEM
========================================================== */

function createImage(
    resourceId,
    altText
) {
    const image =
        document.createElement(
            "img"
        );


    image.src =
        imageCache.get(
            resourceId
        ) ||
        IMAGE_SOURCES[
            resourceId
        ];


    image.alt =
        altText;


    image.draggable =
        false;


    image.loading =
        "eager";


    return image;
}


/* ==========================================================
   PRÉVIA INICIAL
========================================================== */

function refreshInitialPreview(
    animate = true
) {
    if (!resourcesReady) {
        return;
    }


    const selectedCards =
        shuffle(
            CARDS.filter(
                (card) =>
                    card.type ===
                    "illustration"
            )
        ).slice(
            0,
            3
        );


    if (animate) {
        previewCards.forEach(
            (card) => {
                card.classList.add(
                    "preview-changing"
                );
            }
        );
    }


    window.setTimeout(
        () => {
            selectedCards.forEach(
                (card, index) => {
                    previewImages[
                        index
                    ].src =
                        imageCache.get(
                            card.id
                        ) ||
                        IMAGE_SOURCES[
                            card.id
                        ];


                    previewImages[
                        index
                    ].alt =
                        card.alt;
                }
            );


            previewCards.forEach(
                (card) => {
                    card.classList.remove(
                        "preview-changing"
                    );
                }
            );
        },

        animate
            ? 250
            : 0
    );
}


/* ==========================================================
   PASSAGEM DE TELAS
========================================================== */

function showOnlyScreen(targetScreen) {
    screens.forEach(
        (screen) => {
            const isTarget =
                screen ===
                targetScreen;


            screen.hidden =
                !isTarget;


            screen.setAttribute(
                "aria-hidden",

                isTarget
                    ? "false"
                    : "true"
            );


            screen.classList.remove(
                "is-visible"
            );
        }
    );


    if (
        targetScreen !==
        initialScreen
    ) {
        window.requestAnimationFrame(
            () => {
                targetScreen.classList.add(
                    "is-visible"
                );
            }
        );
    }


    document.body.classList.toggle(
        "page-locked",

        targetScreen ===
        initialScreen
    );
}


/* ==========================================================
   NAVEGAÇÃO
========================================================== */

function openGameScreen() {
    if (!resourcesReady) {
        return;
    }


    closeResultModal();

    resetGameState();

    createBoard();

    showOnlyScreen(
        gameScreen
    );


    window.scrollTo({
        top: 0,
        behavior: "auto"
    });
}


function returnToInitialScreen() {
    resetGameState();

    closeResultModal();

    refreshInitialPreview(
        true
    );

    showOnlyScreen(
        initialScreen
    );


    $("loadingText").textContent =
        "As imagens continuam preparadas para uma nova partida.";


    window.scrollTo({
        top: 0,
        behavior: "auto"
    });
}


function openLoreScreen() {
    closeResultModal();

    renderLoreScreen();

    showOnlyScreen(
        loreScreen
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


function backToCompletedGame() {
    showOnlyScreen(
        gameScreen
    );


    window.setTimeout(
        () => {
            $("completionPanel")
                .scrollIntoView({
                    behavior:
                        "smooth",

                    block:
                        "center"
                });
        },

        100
    );
}


/* ==========================================================
   CRIAR TABULEIRO
========================================================== */

function createBoard() {
    const grid =
        $("memoryGrid");


    grid.innerHTML =
        "";


    const fragment =
        document.createDocumentFragment();


    shuffle(CARDS).forEach(
        (cardData, index) => {
            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                `memory-card ${cardData.type}-card`;


            button.dataset.id =
                cardData.id;


            button.dataset.pair =
                String(
                    cardData.pair
                );


            button.dataset.position =
                String(
                    index + 1
                );


            button.setAttribute(
                "aria-label",

                `Carta ${index + 1}, fechada`
            );


            const inner =
                document.createElement(
                    "span"
                );


            inner.className =
                "memory-card-inner";


            /*
                FACE FECHADA:
                capa.jpg
            */

            const back =
                document.createElement(
                    "span"
                );


            back.className =
                "memory-card-face memory-card-back";


            back.setAttribute(
                "aria-hidden",
                "true"
            );


            back.appendChild(
                createImage(
                    CARD_BACK_ID,
                    ""
                )
            );


            /*
                FACE ABERTA:
                img01.jpg até img20.jpg
            */

            const front =
                document.createElement(
                    "span"
                );


            front.className =
                "memory-card-face memory-card-front";


            front.appendChild(
                createImage(
                    cardData.id,
                    cardData.alt
                )
            );


            inner.append(
                back,
                front
            );


            button.appendChild(
                inner
            );


            button.addEventListener(
                "click",

                () => {
                    flipCard(
                        button
                    );
                }
            );


            fragment.appendChild(
                button
            );
        }
    );


    grid.appendChild(
        fragment
    );
}


/* ==========================================================
   VIRAR CARTA
========================================================== */

function flipCard(card) {
    if (
        boardLocked ||
        card.classList.contains(
            "is-flipped"
        ) ||
        card.classList.contains(
            "is-matched"
        )
    ) {
        return;
    }


    startTimer();


    card.classList.add(
        "is-flipped"
    );


    card.setAttribute(
        "aria-label",

        `Carta aberta: ${card.dataset.id}`
    );


    if (!firstCard) {
        firstCard =
            card;


        $("gameInstruction").textContent =
            "Agora selecione a segunda carta.";


        return;
    }


    secondCard =
        card;


    moves += 1;


    updateGameStatus();


    if (
        firstCard.dataset.pair ===
        secondCard.dataset.pair
    ) {
        registerMatchedPair();

    } else {
        hideIncorrectCards();
    }
}


/* ==========================================================
   PAR ENCONTRADO
========================================================== */

function registerMatchedPair() {
    boardLocked =
        true;


    const session =
        currentGameSession;


    const matchedCards = [
        firstCard,
        secondCard
    ];


    matchedCards.forEach(
        (card) => {
            card.classList.add(
                "is-matched"
            );


            card.disabled =
                true;


            card.setAttribute(
                "aria-label",
                "Carta encontrada"
            );
        }
    );


    matchedPairs += 1;


    updateGameStatus();


    $("gameInstruction").textContent =
        "Combinação encontrada!";


    clearPendingTurnTimeout();


    pendingTurnTimeout =
        window.setTimeout(
            () => {
                if (
                    session !==
                    currentGameSession
                ) {
                    return;
                }


                firstCard =
                    null;


                secondCard =
                    null;


                boardLocked =
                    false;


                if (
                    matchedPairs ===
                    TOTAL_PAIRS
                ) {
                    finishGame();

                } else {
                    $("gameInstruction").textContent =
                        "Continue procurando os pares restantes.";
                }
            },

            650
        );
}


/* ==========================================================
   PAR INCORRETO
========================================================== */

function hideIncorrectCards() {
    boardLocked =
        true;


    const session =
        currentGameSession;


    const incorrectCards = [
        firstCard,
        secondCard
    ];


    incorrectCards.forEach(
        (card) => {
            card.classList.add(
                "is-wrong"
            );
        }
    );


    $("gameInstruction").textContent =
        "Essas imagens não formam uma combinação.";


    clearPendingTurnTimeout();


    pendingTurnTimeout =
        window.setTimeout(
            () => {
                if (
                    session !==
                    currentGameSession
                ) {
                    return;
                }


                incorrectCards.forEach(
                    (card) => {
                        card.classList.remove(
                            "is-flipped",
                            "is-wrong"
                        );


                        card.setAttribute(
                            "aria-label",

                            `Carta ${card.dataset.position}, fechada`
                        );
                    }
                );


                firstCard =
                    null;


                secondCard =
                    null;


                boardLocked =
                    false;


                $("gameInstruction").textContent =
                    "Selecione duas novas cartas.";
            },

            1000
        );
}


/* ==========================================================
   CRONÔMETRO
========================================================== */

function startTimer() {
    if (timerStarted) {
        return;
    }


    timerStarted =
        true;


    timerInterval =
        window.setInterval(
            () => {
                elapsedSeconds += 1;


                $("timer").textContent =
                    formatTime(
                        elapsedSeconds
                    );
            },

            1000
        );
}


function stopTimer() {
    if (
        timerInterval !==
        null
    ) {
        window.clearInterval(
            timerInterval
        );
    }


    timerInterval =
        null;


    timerStarted =
        false;
}


function formatTime(totalSeconds) {
    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    return (
        `${String(minutes).padStart(2, "0")}:` +
        `${String(seconds).padStart(2, "0")}`
    );
}


/* ==========================================================
   STATUS DA PARTIDA
========================================================== */

function updateGameStatus() {
    $("movesCounter").textContent =
        String(moves);


    $("pairsCounter").textContent =
        String(matchedPairs);


    $("pairsProgressBar").style.width =
        `${
            (
                matchedPairs /
                TOTAL_PAIRS
            ) * 100
        }%`;


    $("pairsProgress").setAttribute(
        "aria-valuenow",

        String(matchedPairs)
    );
}


/* ==========================================================
   CANCELAR ESPERAS PENDENTES
========================================================== */

function clearPendingTurnTimeout() {
    if (
        pendingTurnTimeout !==
        null
    ) {
        window.clearTimeout(
            pendingTurnTimeout
        );
    }


    pendingTurnTimeout =
        null;
}


function clearPendingResultTimeout() {
    if (
        pendingResultTimeout !==
        null
    ) {
        window.clearTimeout(
            pendingResultTimeout
        );
    }


    pendingResultTimeout =
        null;
}


/* ==========================================================
   REDEFINIR JOGO
========================================================== */

function resetGameState() {
    currentGameSession += 1;


    stopTimer();

    clearPendingTurnTimeout();

    clearPendingResultTimeout();


    firstCard =
        null;


    secondCard =
        null;


    boardLocked =
        false;


    moves =
        0;


    matchedPairs =
        0;


    elapsedSeconds =
        0;


    $("movesCounter").textContent =
        "0";


    $("timer").textContent =
        "00:00";


    $("pairsCounter").textContent =
        "0";


    $("pairsProgressBar").style.width =
        "0%";


    $("pairsProgress").setAttribute(
        "aria-valuenow",
        "0"
    );


    $("gameInstruction").textContent =
        "Selecione duas cartas para encontrar uma combinação.";


    $("completionPanel").hidden =
        true;
}


/* ==========================================================
   REINICIAR
========================================================== */

function restartGame() {
    closeResultModal();

    resetGameState();

    createBoard();

    showOnlyScreen(
        gameScreen
    );


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ==========================================================
   FINALIZAR PARTIDA
========================================================== */

function finishGame() {
    stopTimer();


    $("finalMoves").textContent =
        String(moves);


    $("finalTime").textContent =
        formatTime(
            elapsedSeconds
        );


    $("gameInstruction").textContent =
        "Vitória! Todos os pares foram encontrados.";


    $("completionPanel").hidden =
        false;


    clearPendingResultTimeout();


    const session =
        currentGameSession;


    pendingResultTimeout =
        window.setTimeout(
            () => {
                if (
                    session ===
                    currentGameSession
                ) {
                    openResultModal();
                }
            },

            500
        );
}


/* ==========================================================
   MODAL
========================================================== */

function openResultModal() {
    resultModal.hidden =
        false;


    resultModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "page-locked"
    );


    window.setTimeout(
        () => {
            $("modalLoreButton").focus();
        },

        70
    );
}


function closeResultModal() {
    clearPendingResultTimeout();


    resultModal.hidden =
        true;


    resultModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.toggle(
        "page-locked",

        !initialScreen.hidden
    );
}


/* ==========================================================
   TELA DE SIGNIFICADOS
========================================================== */

function renderLoreScreen() {
    if (loreRendered) {
        return;
    }


    loreRendered =
        true;


    const grid =
        $("loreGrid");


    grid.innerHTML =
        "";


    const fragment =
        document.createDocumentFragment();


    THEMES.forEach(
        (theme, index) => {
            const article =
                document.createElement(
                    "article"
                );


            article.className =
                "lore-card";


            const images =
                document.createElement(
                    "div"
                );


            images.className =
                "lore-images";


            images.append(
                createLoreFigure(
                    theme.firstImage,

                    `${theme.name}: primeira imagem`,

                    "IMAGEM 1",

                    true
                ),

                createLoreFigure(
                    theme.secondImage,

                    `${theme.name}: segunda imagem`,

                    "IMAGEM 2",

                    false
                )
            );


            const content =
                document.createElement(
                    "div"
                );


            content.className =
                "lore-content";


            const number =
                document.createElement(
                    "p"
                );


            number.className =
                "lore-number";


            number.textContent =
                `CONCEITO ${String(
                    index + 1
                ).padStart(
                    2,
                    "0"
                )}`;


            const title =
                document.createElement(
                    "h3"
                );


            title.textContent =
                theme.name;


            const translation =
                document.createElement(
                    "p"
                );


            translation.className =
                "lore-translation";


            translation.textContent =
                theme.englishName;


            const description =
                document.createElement(
                    "p"
                );


            description.className =
                "lore-description";


            description.textContent =
                theme.description;


            content.append(
                number,
                title,
                translation,
                description
            );


            article.append(
                images,
                content
            );


            fragment.appendChild(
                article
            );
        }
    );


    grid.appendChild(
        fragment
    );
}


/* ==========================================================
   FIGURAS DOS SIGNIFICADOS
========================================================== */

function createLoreFigure(
    imageId,
    altText,
    labelText,
    isSymbol
) {
    const figure =
        document.createElement(
            "figure"
        );


    figure.className =
        isSymbol
            ? "lore-figure symbol"
            : "lore-figure";


    const caption =
        document.createElement(
            "figcaption"
        );


    caption.className =
        "lore-label";


    caption.textContent =
        labelText;


    figure.append(
        createImage(
            imageId,
            altText
        ),

        caption
    );


    return figure;
}


/* ==========================================================
   EVENTOS DOS BOTÕES
========================================================== */

$("startButton").addEventListener(
    "click",
    openGameScreen
);


$("restartButton").addEventListener(
    "click",
    restartGame
);


$("homeButton").addEventListener(
    "click",
    returnToInitialScreen
);


$("accessLoreButton").addEventListener(
    "click",
    openLoreScreen
);


$("modalLoreButton").addEventListener(
    "click",
    openLoreScreen
);


$("playAgainButton").addEventListener(
    "click",
    restartGame
);


$("modalHomeButton").addEventListener(
    "click",
    returnToInitialScreen
);


$("backToGameButton").addEventListener(
    "click",
    backToCompletedGame
);


$("loreHomeButton").addEventListener(
    "click",
    returnToInitialScreen
);


$("lorePlayAgainButton").addEventListener(
    "click",
    restartGame
);


$("modalOverlay").addEventListener(
    "click",
    closeResultModal
);


document.addEventListener(
    "keydown",

    (event) => {
        if (
            event.key ===
                "Escape" &&

            !resultModal.hidden
        ) {
            closeResultModal();
        }
    }
);


/* ==========================================================
   INICIALIZAÇÃO
========================================================== */

preloadAllResources();
