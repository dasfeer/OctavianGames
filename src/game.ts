import * as PIXI from 'pixi.js';

interface IReel {
    position?: number;
    blur: PIXI.Graphics | object[];
    Container: PIXI.Container;
    previousPosition: number;
    symbols: PIXI.Texture;
}

interface ITween {
    object: IReel;
    property?: number;
    complete: Function;
    start: number;
    time: Date;
}

export class Game {
    private app: PIXI.Application;
    private reelContainer: PIXI.Container;
    private running: boolean;
    private reels: IReel[] = [];
    private tweening: ITween[] = [];
    private slotTextures: object[];

    constructor(width: number, height: number) {
        this.app = new PIXI.Application({ width, height });
        this.reelContainer = new PIXI.Container();
        this.running = false;
        this.slotTextures = [
            PIXI.Texture.from('../images/eggHead.png'),
            PIXI.Texture.from('../images/flowerTop.png'),
            PIXI.Texture.from('../images/helmlok.png'),
            PIXI.Texture.from('../images/skully.png'),
        ];
        this.init();
    }

    private init(): void {
        this.imageStartLoad();
        this.app.ticker.add(() => this.animateUpdate());
        this.app.ticker.add(() => this.animateStart());
    }

    /**
     * Получаем ссылку на текущий App
     */
    public getApp(): PIXI.Application {
        return this.app;
    }

    /**
     * Создаем холст изображения
     */
    public createCanvas(): void {
        this.app.renderer.backgroundColor = 0x260559;
        document.getElementById('canvasWrapper').append(this.app.view);
    }

    /**
     * Грузим текстуры
     */
    private imageStartLoad(): void {
        this.app.loader
            .add('eggHead', '../images/eggHead.png')
            .add('flowerTop', '../images/flowerTop.png')
            .add('helmlok', '../images/helmlok.png')
            .add('skully', '../images/skully.png')
            .load(this.imageEndLoad.bind(this));
    }

    /**
     * После загрузки текстур строим катушки
     */
    private imageEndLoad(): void {
        const slotTextures = this.slotTextures;
        
        for (let i = 0; i < 5; i++) {
            const rc = new PIXI.Container();
            rc.x = i * 160;
            this.reelContainer.addChild(rc);

            const reel = {
                container: rc,
                symbols: [],
                position: 0,
                previousPosition: 0,
                blur: new PIXI.filters.BlurFilter(),
            };
            reel.blur.blurX = 0;
            reel.blur.blurY = 0;
            rc.filters = [reel.blur];

            for (let j = 0; j < 4; j++) {
                const symbol = new PIXI.Sprite(slotTextures[Math.floor(Math.random() * slotTextures.length)]);
                symbol.y = j * 150;
                symbol.scale.x = symbol.scale.y = Math.min(150 / symbol.width, 150 / symbol.height);
                symbol.x = Math.round((150 - symbol.width) / 2);
                reel.symbols.push(symbol);
                rc.addChild(symbol);
            }
            this.reels.push(reel);
        }
        this.app.stage.addChild(this.reelContainer);
        this.buildReelContainer();
    }

    /**
     * Позиционируем катушки
     */
    private buildReelContainer(): void {
        const margin = (this.app.screen.height - 150 * 3) / 2;
        this.reelContainer.y = margin + 0;
        this.reelContainer.x = Math.round(this.app.screen.width - 160 * 5) - 100;
    }

    /**
     * Добавляем обработку клика Start
     */
    public startPlay(): void {
        if (this.running) return;
        this.running = true;

        for (let i = 0; i < this.reels.length; i++) {
            const r = this.reels[i];
            const extra = Math.floor(Math.random() * 3);
            const target = r.position + 10 + i * 5 + extra;
            const time = 2500 + i * 600 + extra * 600;
            this.tweenTo(r, 'position', target, time, this.backout(0.5), null, i === this.reels.length - 1 ? this.reelsComplete : null);
        }
    }

    /**
     * По завершению анимации меняем флаг на false,
     * защита от многократного нажатия кнопки Start
     */
    private reelsComplete(): void {
        this.running = false;
    }

    /**
     * 
     */
    private tweenTo (
        object: object[], 
        property: string, 
        target: object, 
        time: number, 
        easing: Function, 
        onchange: Function, 
        oncomplete: boolean): void {
        const tween = {
            object,
            property,
            propertyBeginValue: object[property],
            target,
            easing,
            time,
            change: onchange,
            complete: oncomplete,
            start: Date.now(),
        };

        this.tweening.push(tween);
    }

    private backout(amount: number) {
        return (t: number) => (--t * t * ((amount + 1) * t + amount) + 1);
    }

    /**
     * Функция линейной интерполяции
     */
    private lerp(a1: number, a2: number, t: number): number {
        return a1 * (1 - t) + a2 * t;
    }

    /**
     * Слушаем анимацию
     */
    private animateUpdate(): void {
        const now = Date.now();
        const remove = [];

        for (let i = 0; i < this.tweening.length; i++) {
            const t = this.tweening[i];
            const phase = Math.min(1, (now - t.start) / t.time);

            t.object[t.property] = this.lerp(t.propertyBeginValue, t.target, t.easing(phase));
            if (t.change) t.change(t);
            if (phase === 1) {
                t.object[t.property] = t.target;
                if (t.complete) t.complete.call(this);
                remove.push(t);
            }
        }
        for (let i = 0; i < remove.length; i++) {
            this.tweening.splice(this.tweening.indexOf(remove[i]), 1);
        }
    }

    /**
     * Слушаем анимацию
     */
    private animateStart(): void {
        const slotTextures = this.slotTextures;

        for (let i = 0; i < this.reels.length; i++) {
            const r = this.reels[i];
            // Обновляем фильтр размытия в зависимости от скорости
            r.blur.blurY = (r.position - r.previousPosition) * 15;
            r.previousPosition = r.position;

            // Обновляем позицию катушки
            for (let j = 0; j < r.symbols.length; j++) {
                const s = r.symbols[j];
                const prevy = s.y;
                s.y = ((r.position + j) % r.symbols.length) * 150 - 150;
                if (s.y < 0 && prevy > 150) {
                    s.texture = slotTextures[Math.floor(Math.random() * slotTextures.length)];
                    s.scale.x = s.scale.y = Math.min(150 / s.texture.width, 150 / s.texture.height);
                    s.x = Math.round((150 - s.width) / 2);
                }
            }
        }
    }
}
