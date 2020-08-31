import * as PIXI from 'pixi.js';

export class InfoFPS extends PIXI.Container {
    private static readonly DEFAULT_FONT_SIZE: number = 14;
    private static readonly DEFAULT_FONT_COLOR: number = 0xff0000;
    protected fpsText: PIXI.Text;

    constructor(positionX: number, positionY: number) {
        super();
        this.setFPSInfo(positionX, positionY);
    }

    /**
     * Получаем FPS
     * @param style - кастомный стиль оформления
     */
    private setFPSInfo(positionX: number, positionY: number): void {
        const defaultStyle = new PIXI.TextStyle({
            fontSize: InfoFPS.DEFAULT_FONT_SIZE,
            fill: InfoFPS.DEFAULT_FONT_COLOR,
        });
        const fpsText = new PIXI.Text('', {...defaultStyle} as PIXI.TextStyle);
        fpsText.y = positionY;
        fpsText.x = positionX;
        const fpsTicker = new PIXI.Ticker();
        fpsTicker.add(() => {
            fpsText.text = 'FPS: ' + fpsTicker.FPS.toFixed(2);
        });
        fpsTicker.start();
        this.addChild(fpsText);
    }
}