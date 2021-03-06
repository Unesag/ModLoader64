import { IMupen, EmuState, CoreEvent } from './IMupen';
import IMemory from 'modloader64_api/IMemory';
import IConsole from 'modloader64_api/IConsole';
import { IRomMemory } from 'modloader64_api/IRomMemory';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { N64Header } from './N64Header';
import { ILogger, ModLoaderEvents } from 'modloader64_api/IModLoaderAPI';
import IUtils from 'modloader64_api/IUtils';
import ISaveState from 'modloader64_api/ISaveState';
import path from 'path';
import { StartInfoImpl } from './StartInfoImpl';
import fs from 'fs';
import { IImGui } from 'modloader64_api/Sylvain/ImGui';
import { SDL } from 'modloader64_api/Sylvain/SDL';
import { Gfx } from 'modloader64_api/Sylvain/Gfx';
import { Input } from 'modloader64_api/Sylvain/Input';
import { bus } from 'modloader64_api/EventHandler';
import { IYaz0 } from 'modloader64_api/Sylvain/Yaz0';
import { internal_event_bus } from '../../modloader64';
import { vec2, xy } from 'modloader64_api/Sylvain/vec';

class N64 implements IConsole {
    rawModule: any;
    mupen: IMupen;
    rom_size: number;
    logger: ILogger;
    lobby: string;
    isPaused: boolean = false;

    constructor(rom: string, logger: ILogger, lobby: string) {
        this.logger = logger;
        this.lobby = lobby;
        this.rawModule = require('@emulator/ml64_emu_addon.node');
        this.mupen = this.rawModule as IMupen;

        //let section = this.mupen.M64p.Config.openSection('Video-General');
        //let size: vec2 = xy(section.getInt("ScreenWidth"), section.getInt("ScreenHeight"));
        let size: vec2 = xy(800, 600);

        let emu_dir: string = global["module-alias"]["moduleAliases"]["@emulator"];
        this.mupen.Frontend.startup(new StartInfoImpl("ModLoader64", size.x, size.y, emu_dir + "/mupen64plus", emu_dir + "/mupen64plus-rsp-hle", emu_dir + "/mupen64plus-video-gliden64", emu_dir + "/mupen64plus-audio-sdl", emu_dir + "/mupen64plus-input-sdl", emu_dir, emu_dir));
        let doEvents = setInterval(() => this.mupen.Frontend.doEvents(), 10);
        const _64_MB = 64 * 1024 * 1024;

        let section = this.mupen.M64p.Config.openSection("Core");
        let screenshot_dir: string = path.resolve("./", "screenshots");
        if (!fs.existsSync(screenshot_dir)){
            fs.mkdirSync(screenshot_dir);
        }
        section.setString("ScreenshotPath", screenshot_dir);
        this.mupen.M64p.Config.saveFile();

        this.mupen.Frontend.on('window-closing', () => {
            if (this.mupen.M64p.getEmuState() === EmuState.Paused) {
                this.mupen.M64p.resume();
            }
            if (this.mupen.M64p.getEmuState() === EmuState.Running){
                this.mupen.Frontend.stop();
            }
            internal_event_bus.emit('SHUTDOWN_EVERYTHING', {});
            process.exit(0);
        });
        this.mupen.Frontend.on('core-stopped', () => {
            clearInterval(doEvents);
            this.mupen.Frontend.shutdown();
        });
        this.mupen.Frontend.on('core-event', (event: CoreEvent, data: number) => {
            if (event == CoreEvent.SoftReset) {
                this.logger.info("Soft reset detected. Sending alert to plugins.");
                bus.emit(ModLoaderEvents.ON_SOFT_RESET_PRE, {});
                this.logger.info("Letting the reset go through...");
                this.softReset();
                internal_event_bus.emit("CoreEvent.SoftReset", {});
            }else if (event == CoreEvent.TakeNextScreenshot){
                this.mupen.Frontend.takeNextScreenshot();
            }else if (event == CoreEvent.VolumeUp){
                this.mupen.M64p.setAudioVolume(this.mupen.M64p.getAudioVolume() + 1);
            }else if (event == CoreEvent.VolumeDown){
                this.mupen.M64p.setAudioVolume(this.mupen.M64p.getAudioVolume() - 1);
            }else if (event == CoreEvent.VolumeMute){
                this.mupen.M64p.setAudioMuted(!this.mupen.M64p.isAudioMuted());
            }else if (event == CoreEvent.SetFastForward){
                this.mupen.M64p.setSpeedFactor(300);
            }else if (event == CoreEvent.UnsetFastForward){
                this.mupen.M64p.setSpeedFactor(100);
            }else if (event == CoreEvent.SpeedUp){
                this.mupen.M64p.setSpeedFactor(this.mupen.M64p.getSpeedFactor() + 1);
            }else if (event == CoreEvent.SpeedDown){
                this.mupen.M64p.setSpeedFactor(this.mupen.M64p.getSpeedFactor() - 1);
            }else if (event == CoreEvent.TogglePause){
                if (!this.isPaused){
                    this.mupen.M64p.pause();
                    this.isPaused = true;
                }else{
                    this.mupen.M64p.resume();
                    this.isPaused = false;
                }   
            }else if (event == CoreEvent.Stop){
                internal_event_bus.emit("SHUTDOWN_EVERYTHING", {});
                setTimeout(()=>{
                    process.exit(0);
                }, 3000);
            }else if (event == CoreEvent.ChangeWindow){
                this.mupen.Frontend.toggleFullScreen();
            }
        });
        logger.info("Loading rom: " + rom + ".");
        let _rom: Buffer = fs.readFileSync(rom);
        this.mupen.M64p.openRomFromMemory(_rom, _64_MB);
        this.rom_size = _rom.byteLength;
        bus.on('openInputConfig', () => {
            this.mupen.Frontend.openInputConfig();
        });
        bus.on('openMemViewer', () => {
            this.mupen.Frontend.openMemViewer();
        });
        bus.on('openCheatConfig', () => {
            this.mupen.Frontend.openCheatConfig();
        });
        bus.on('toggleFullScreen', () =>{
            this.mupen.Frontend.toggleFullScreen();
        });
    }

    getYaz0Encoder(): IYaz0 {
        return this.mupen.Yaz0;
    }

    getInputAccess(): Input {
        return this.mupen.M64p.Input;
    }

    getGfxAccess(): Gfx {
        return this.mupen.Gfx;
    }

    getSDLAccess(): SDL {
        return this.mupen.SDL;
    }

    getImGuiAccess(): IImGui {
        return this.mupen.ImGui;
    }

    on(which: string, callback: any): void {
        this.mupen.Frontend.on(which, callback);
    }

    startEmulator(preStartCallback: Function): IMemory {
        let rom_r = ((this.mupen.M64p.Memory as unknown) as IRomMemory);
        let buf: Buffer = preStartCallback();
        if (buf !== undefined || buf !== null){
            rom_r.romWriteBuffer(0x0, buf);
        }
        this.setSaveDir(path.relative(path.resolve(global["module-alias"]["moduleAliases"]["@emulator"]), path.resolve(global["module-alias"]["moduleAliases"]["@emulator"], "saves", this.lobby)));
        this.fixSoundLag();
        this.mupen.Frontend.execute();
        return this.mupen.M64p.Memory as IMemory;
    }

    stopEmulator(): void {
        this.mupen.Frontend.stop();
    }

    finishInjects(): void {
        this.mupen.M64p.Memory.invalidateCachedCode();
    }

    isEmulatorReady(): boolean {
        return this.mupen.M64p.getEmuState() === EmuState.Running;
    }

    getLoadedRom(): Buffer {
        let rom_r = ((this.mupen.M64p.Memory as unknown) as IRomMemory);
        const _64_MB = 64 * 1024 * 1024;
        let buf: Buffer = rom_r.romReadBuffer(0x0, _64_MB);
        return buf;
    }

    getRomOriginalSize(): number{
        return this.rom_size;
    }

    getFrameCount(): number {
        return this.mupen.M64p.getNumElapsedFrames();
    }

    setFrameCount(num: number): void {
    }

    pauseEmulator(): void {
        this.mupen.M64p.pause();
    }

    resumeEmulator(): void {
        this.mupen.M64p.resume();
    }

    getRomHeader(): IRomHeader {
        let raw = ((this.mupen.M64p.Memory as unknown) as IRomMemory).romReadBuffer(0x0, 0x50);
        return new N64Header(raw);
    }

    getMemoryAccess(): IMemory {
        return this.mupen.M64p.Memory;
    }

    softReset(): void {
        this.mupen.M64p.softReset();
    }

    hardReset(): void {
        this.mupen.M64p.hardReset();
    }

    saveState(file: string): void {
        this.mupen.M64p.saveStateToFile(file);
    }

    loadState(file: string): void {
        this.mupen.M64p.loadStateFromFile(file);
    }

    setSaveDir(path: string): void {
        let section = this.mupen.M64p.Config.openSection('Core');
        section.setString('SaveSRAMPath', path);
        section.save();
    }

    getUtils(): IUtils {
        return (this.mupen.Yaz0 as unknown) as IUtils;
    }

    getSaveStateManager(): ISaveState {
        return this.mupen.M64p as ISaveState;
    }

    private fixSoundLag(){
        let section = this.mupen.M64p.Config.openSection('Audio-SDL');
        section.setString('RESAMPLE', 'trivial');
        section.save();
    }
}

export default N64;
