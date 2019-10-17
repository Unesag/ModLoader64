import { EventHandler, EventsClient } from 'modloader64_api/EventHandler';
import {
  IModLoaderAPI,
  ICore,
  ModLoaderEvents,
} from 'modloader64_api/IModLoaderAPI';
import { IRomHeader } from 'modloader64_api/IRomHeader';
import { VersionHandler } from './DK64/VersionHandler';
import IMemory from 'modloader64_api/IMemory';
import * as API from 'modloader64_api/DK64/Imports';

// ##################################################################
// ##  Sub-Classes
// ##################################################################

// export class GameFlags extends API.BufferObj implements API.IBuffered {
//   constructor(emu: IMemory) {
//     super(emu, global.ModLoader[API.AddressType.SAVE_GAME_FLAGS], 0x013b);
//   }
// }

export class Banana extends API.BaseObj implements API.IBanana {
  private instance: number;
  private jungle_japes_addr: number = this.instance + 0x00;
  private angry_aztec_addr: number = this.instance + 0x02;
  private frantic_factory_addr: number = this.instance + 0x04;
  private gloomy_galleon_addr: number = this.instance + 0x06;
  private fungi_forest_addr: number = this.instance + 0x08;
  private crystal_caves_addr: number = this.instance + 0x0A;
  private creepy_castle_addr: number = this.instance + 0x0C;
  private dk_isles_addr: number = this.instance + 0x0E;
  private hideout_helm_addr: number = this.instance + 0x10;
  private unknown_1_addr: number = this.instance + 0x12;
  private unknown_2_addr: number = this.instance + 0x14;
  private unknown_3_addr: number = this.instance + 0x16;
  private unknown_4_addr: number = this.instance + 0x18;
  private null_addr: number = this.instance + 0x1A;

  constructor(emu: IMemory, instance: number) {
    super(emu);
    this.instance = instance;
  }
  
  get array(): Buffer { return this.emulator.rdramReadBuffer(this.instance, 0x1C); }
  set array(value: Buffer) { this.emulator.rdramWriteBuffer(this.instance, value); }

  get jungle_japes(): number { return this.emulator.rdramRead16(this.jungle_japes_addr); }
  set jungle_japes(value: number) { this.emulator.rdramWrite16(this.jungle_japes_addr, value); }
  
  get angry_aztec(): number { return this.emulator.rdramRead16(this.angry_aztec_addr); }
  set angry_aztec(value: number) { this.emulator.rdramWrite16(this.angry_aztec_addr, value); }
  
  get frantic_factory(): number { return this.emulator.rdramRead16(this.frantic_factory_addr); }
  set frantic_factory(value: number) { this.emulator.rdramWrite16(this.frantic_factory_addr, value); }
  
  get gloomy_galleon(): number { return this.emulator.rdramRead16(this.gloomy_galleon_addr); }
  set gloomy_galleon(value: number) { this.emulator.rdramWrite16(this.gloomy_galleon_addr, value); }
  
  get fungi_forest(): number { return this.emulator.rdramRead16(this.fungi_forest_addr); }
  set fungi_forest(value: number) { this.emulator.rdramWrite16(this.fungi_forest_addr, value); }
  
  get crystal_cave(): number { return this.emulator.rdramRead16(this.crystal_caves_addr); }
  set crystal_cave(value: number) { this.emulator.rdramWrite16(this.crystal_caves_addr, value); }
  
  get creepy_castle(): number { return this.emulator.rdramRead16(this.creepy_castle_addr); }
  set creepy_castle(value: number) { this.emulator.rdramWrite16(this.creepy_castle_addr, value); }
  
  get dk_isles(): number { return this.emulator.rdramRead16(this.dk_isles_addr); }
  set dk_isles(value: number) { this.emulator.rdramWrite16(this.dk_isles_addr, value); }
  
  get hideout_helm(): number { return this.emulator.rdramRead16(this.hideout_helm_addr); }
  set hideout_helm(value: number) { this.emulator.rdramWrite16(this.hideout_helm_addr, value); }
  
  get unknown_1(): number { return this.emulator.rdramRead16(this.unknown_1_addr); }
  set unknown_1(value: number) { this.emulator.rdramWrite16(this.unknown_1_addr, value); }
  
  get unknown_2(): number { return this.emulator.rdramRead16(this.unknown_2_addr); }
  set unknown_2(value: number) { this.emulator.rdramWrite16(this.unknown_2_addr, value); }
  
  get unknown_3(): number { return this.emulator.rdramRead16(this.unknown_3_addr); }
  set unknown_3(value: number) { this.emulator.rdramWrite16(this.unknown_3_addr, value); }
  
  get unknown_4(): number { return this.emulator.rdramRead16(this.unknown_4_addr); }
  set unknown_4(value: number) { this.emulator.rdramWrite16(this.unknown_4_addr, value); }
  
  get null(): number { return this.emulator.rdramRead16(this.null_addr); }
  set null(value: number) { this.emulator.rdramWrite16(this.null_addr, value); }
}

export class Kong extends API.BaseObj implements API.IKong {
  private instance: number;
  private moves_addr: number = this.instance + 0x00;
  private simian_slam_addr: number = this.instance + 0x01;
  private weapon_addr: number = this.instance + 0x02;
  private ammo_belt_addr: number = this.instance + 0x03;
  private instrument_addr: number = this.instance + 0x04
  private coins_addr: number = this.instance + 0x06;
  private instrument_energy_addr: number = this.instance + 0x08;

  // Abstraction
  colored_bananas: API.IBanana;
  troff_scoff_bananas: API.IBanana;
  golden_bananas: API.IBanana;

  constructor(emu: IMemory, index: number) {
    super(emu);

    let addr = global.ModLoader[API.AddressType.KONG_BASE];
    this.instance = addr + (index * 0x5E);

    this.colored_bananas = new Banana(emu, this.instance + 0x0A);
    this.troff_scoff_bananas = new Banana(emu, this.instance + 0x26);
    this.golden_bananas = new Banana(emu, this.instance + 0x42);
  }

  get moves(): number { return this.emulator.rdramRead8(this.moves_addr); }
  set moves(value: number) { this.emulator.rdramWrite8(this.moves_addr, value); }

  get simian_slam(): number { return this.emulator.rdramRead8(this.simian_slam_addr); }
  set simian_slam(value: number) { this.emulator.rdramWrite8(this.simian_slam_addr, value); }

  get weapon(): number { return this.emulator.rdramRead8(this.weapon_addr); }
  set weapon(value: number) { this.emulator.rdramWrite8(this.weapon_addr, value); }

  get ammo_belt(): number { return this.emulator.rdramRead8(this.ammo_belt_addr); }
  set ammo_belt(value: number) { this.emulator.rdramWrite8(this.ammo_belt_addr, value); }

  get instrument(): number { return this.emulator.rdramRead8(this.instrument_addr); }
  set instrument(value: number) { this.emulator.rdramWrite8(this.instrument_addr, value); }

  get coins(): number { return this.emulator.rdramRead16(this.coins_addr); }
  set coins(value: number) { this.emulator.rdramWrite16(this.coins_addr, value); }
  
  get instrument_energy(): number { return this.emulator.rdramRead16(this.instrument_energy_addr); }
  set instrument_energy(value: number) { this.emulator.rdramWrite16(this.instrument_energy_addr, value); }  
}

// ##################################################################
// ##  Primary-Classes
// ##################################################################

export class Player extends API.BaseObj implements API.IPlayer {
  private character_addr: number = global.ModLoader[API.AddressType.CHARACTER];
  private shared_consumables_addr: number = global.ModLoader[API.AddressType.SHARED_COLLECTABLES];

  // Abstraction
  kong: API.IKong[] = new Array<API.IKong>();
  
  constructor(emu: IMemory) {
    super(emu);

    let i: number;
    for (i = 0; i < 6; i++)
      this.kong.push(new Kong(emu, i));
  }
  
  get dk(): API.IKong { return this.kong[0]; }
  set dk(val: API.IKong) { this.kong[0] = val; }
  get diddy(): API.IKong { return this.kong[1]; }
  set diddy(val: API.IKong) { this.kong[1] = val; }
  get lanky(): API.IKong { return this.kong[2]; }
  set lanky(val: API.IKong) { this.kong[2] = val; }
  get tiny(): API.IKong { return this.kong[3]; }
  set tiny(val: API.IKong) { this.kong[3] = val; }
  get chunky(): API.IKong { return this.kong[4]; }
  set chunky(val: API.IKong) { this.kong[4] = val; }
  get krusha(): API.IKong { return this.kong[5]; }
  set krusha(val: API.IKong) { this.kong[5] = val; }

  get current_kong(): number { return this.emulator.rdramRead8(this.character_addr); }
  set current_kong(value: number) { this.emulator.rdramWrite8(this.character_addr, value); }

  get_max_standard_ammo(): number {
    // let ammo_Belt = this.emulator.rdramRead8(this.kong_base_addr + (this.get_current_kong() * this.kong_size) + API.KongDataType.AMMO_BELT)
    // return ((2 ^ ammo_Belt) * 100) / 2;
    return 100;
  }

  get standard_ammo(): number {
    return this.emulator.rdramRead16(this.shared_consumables_addr + API.InventoryType.STANDARD_AMMO);
  }

  set standard_ammo(val: number) {
    if (val < 0) {
      val = 0;
    } else if (val > this.get_max_standard_ammo()) {
      val = this.get_max_standard_ammo();
    }

    this.emulator.rdramWrite16(this.shared_consumables_addr + API.InventoryType.STANDARD_AMMO, val);
  }

  get homing_ammo(): number {
    return this.emulator.rdramRead16(this.shared_consumables_addr + API.InventoryType.HOMING_AMMO);
  }

  set homing_ammo(val: number) {
    if (val < 0) {
      val = 0;
    } else if (val > this.get_max_standard_ammo()) {
      val = this.get_max_standard_ammo();
    }

    this.emulator.rdramWrite16(this.shared_consumables_addr + API.InventoryType.HOMING_AMMO, val);
  }

  get oranges(): number {
    return this.emulator.rdramRead16(this.shared_consumables_addr + API.InventoryType.ORANGES);
  }

  set oranges(val: number) {
    if (val < 0) {
      val = 0;
    } else if (val > 20) {
      val = 20;
    }

    this.emulator.rdramWrite16(this.shared_consumables_addr + API.InventoryType.ORANGES, val);
  }

  get crystals(): number {
    return this.emulator.rdramRead16(this.shared_consumables_addr + API.InventoryType.CRYSTALS);
  }

  set crystals(val: number) {
    if (val < 0) {
      val = 0;
    } else if (val > 50) {
      val = 50;
    }

    this.emulator.rdramWrite16(this.shared_consumables_addr + API.InventoryType.CRYSTALS, val);
  }

  get film(): number {
    return this.emulator.rdramRead16(this.shared_consumables_addr + API.InventoryType.FILM);
  }

  set film(val: number) {
    if (val < 0) {
      val = 0;
    } else if (val > 10) {
      val = 10;
    }

    this.emulator.rdramWrite16(this.shared_consumables_addr + API.InventoryType.FILM, val);
  }

  get health(): number {
    return this.emulator.rdramReadS8(this.shared_consumables_addr + API.InventoryType.HEALTH);
  }

  set health(val: number) {
    this.emulator.rdramWrite8(this.shared_consumables_addr + API.InventoryType.HEALTH, val);
  }

  get melons(): number {
    return this.emulator.rdramRead8(this.shared_consumables_addr + API.InventoryType.MELONS);
  }

  set melons(val: number) {
    this.emulator.rdramWrite8(this.shared_consumables_addr + API.InventoryType.MELONS, val);
  }
}

export class Runtime extends API.BaseObj implements API.IRuntime {
  private cur_profile_addr: number =
    global.ModLoader[API.AddressType.RT_CUR_PROFILE];
  private game_mode_addr: number =
    global.ModLoader[API.AddressType.RT_GAME_MODE];

  get_current_profile(): API.ProfileType {
    return this.emulator.rdramRead8(this.cur_profile_addr) as API.ProfileType;
  }

  get_game_mode(): API.GameModeType {
    return this.emulator.rdramRead8(this.game_mode_addr) as API.GameModeType;
  }
}

export class SaveContext extends API.BaseObj implements API.ISaveContext {
  private copy_addr: number = global.ModLoader[API.AddressType.ER_COPY_BASE];
  private file_map_addr: number = global.ModLoader[API.AddressType.ER_FILE_MAP];

  get_slot_address(profile: number): number {
    let map = this.emulator.rdramReadBuffer(this.file_map_addr, 4);
    let offset = 0;
    let i: number;

    for (i = 0; i < 4; i++) {
      if (map[i] === profile) offset = i;
    }

    return this.copy_addr + offset * 0x1ac;
  }

  get_slot(addr: number): Buffer {
    return this.emulator.rdramReadBuffer(addr, 0x13b);
  }

  set_slot(addr: number, value: number) {
    this.emulator.rdramWrite8(addr, value);
  }
}

export class DonkeyKong64 implements ICore, API.IDK64Core {
  header = 'DONKEY KONG 64';
  ModLoader: IModLoaderAPI = {} as IModLoaderAPI;
  eventTicks: Map<string, Function> = new Map<string, Function>();
  rom_header!: IRomHeader;

  player!: API.IPlayer;
  runtime!: API.IRuntime;
  save!: API.ISaveContext;
  version!: API.GameVersion;

  isPlaying(): boolean {
    return this.runtime.get_game_mode() === API.GameModeType.ADVENTURE;
  }

  preinit(): void {
    switch (this.rom_header.country_code) {
      case 'J':
        this.version = API.GameVersion.JP_1_0;
        VersionHandler.load_jp_1_0();
        break;
      case 'P':
        this.version = API.GameVersion.PAL_1_0;
        VersionHandler.load_pal_1_0();
        break;
      case 'E':
        this.version = API.GameVersion.USA_1_0;
        VersionHandler.load_usa_1_0();
        break;
    }
  }

  init(): void {}

  postinit(): void {
    this.player = new Player(this.ModLoader.emulator);
    this.runtime = new Runtime(this.ModLoader.emulator);
    this.save = new SaveContext(this.ModLoader.emulator);
  }

  onTick(): void {
    this.eventTicks.forEach((value: Function, key: string) => {
      value();
    });
  }

  @EventHandler(ModLoaderEvents.ON_ROM_HEADER_PARSED)
  onModLoader_RomHeaderParsed(header: Buffer) {}

  @EventHandler(EventsClient.ON_INJECT_FINISHED)
  onCore_InjectFinished(evt: any) {}
}

export default DonkeyKong64;
