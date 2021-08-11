declare class TimeEvolutionController {
    canvasTimeData: {
        id: string;
        timeEvolutionActive: boolean;
    }[];
    globalLoopActive: boolean;
    startTimestamp: number;
    offsetTimestamp: number;
    startAll(): void;
    pauseAll(): void;
    stopAll(): void;
    updateObjects(currentTimestamp: number): void;
    addObject(id: string, sync?: boolean): void;
}
export declare const Time: TimeEvolutionController;
export {};
