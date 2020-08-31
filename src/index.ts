import { Game } from './game';
import { ButtonStart } from './buttonStart';
import { InfoFPS } from './infoFPS';

// Ширина и высота основного приложения
const WIDTH_CANVAS = 900;
const HEIGHT_CANVAS = 450;

// Создаем игру с нужной шириной
const game = new Game(WIDTH_CANVAS, HEIGHT_CANVAS);
const app = game.getApp();
const stage = app.stage;

// Блок с FPS
const fps = new InfoFPS(820, 428);

// Блок с кнопкой СТАРТ
const buttonStart = new ButtonStart();
const button = buttonStart.getButton();
button.addListener('pointerdown', () => game.startPlay());

// Добавление блока с игрой в DOM
game.createCanvas();

// Добавление блоков FPS и кнопки Start в холст с игрой
stage.addChild(buttonStart);
stage.addChild(fps);