import IMemory from "./IMemory";

interface IConsole{

    startEmulator(preStartCallback: Function): IMemory
    
    stopEmulator(): void

    finishInjects(): void

    isEmulatorReady(): boolean

    getLoadedRom(): Buffer

    setFrameCallback(fn: Function): void

}

export default IConsole