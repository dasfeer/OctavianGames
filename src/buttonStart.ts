import * as PIXI from 'pixi.js';

export class ButtonStart extends PIXI.Container {
    private button: PIXI.Graphics;
    private colorIndex: number;
    private colors: number[];

    constructor() {
        super();
        this.button = new PIXI.Graphics();
        this.button.interactive = true;
        this.button.buttonMode = true;
        this.init();
    }

    /**
     * Получаем ссылку на текущую кнопку 
     */
    public getButton(): PIXI.Graphics {
        return this.button;
    }

    private init(): void {
        this.button.beginFill(0, 1);
        this.button.lineStyle(4, 0x000000);
        this.button.drawCircle(865, 205, 30);
        this.setText();
        this.addChild(this.button);
        this.colors = [0x00FFFF, 0xFF0000, 0x00FF00, 0x0000FF];
        setInterval(this.animateButton.bind(this), 500);
    }

    private setText(): void {
        const style = new PIXI.TextStyle({
            fontSize: 16,
            fill: ['#ffffff'],
            wordWrap: true,
            stroke: '#4a1850',
            wordWrapWidth: 440,
            strokeThickness: 5
        });
        const playText = new PIXI.Text('Start', style);
        playText.x = 845;
        playText.y = 193;
        this.button.addChild(playText);
    }

    private animateButton(): void {
        if (!this.colorIndex) {
            this.colorIndex = 0;
        }

        this.colorIndex++;

        if (this.colorIndex === this.colors.length) {
            this.colorIndex = 0;
        }

        this.button.clear();
        this.button.lineStyle(4, 0xffffff);
        this.button.beginFill(this.colors[this.colorIndex], 1);
        this.button.drawCircle(865, 205, 30);
    }
}