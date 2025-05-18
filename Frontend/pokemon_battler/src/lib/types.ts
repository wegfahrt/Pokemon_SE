export class Pokemon {
    pdx_num: number;
    name: string;
    ability: Ability | null;
    abilitys: Ability[];
    lvl: number = 100;
    gender: string = "Male";
    nature: string = "Hardy";
    shiny: boolean = false;
    types: string[];
    ivs: Ivs[] = [
        new Ivs("hp", 31),
        new Ivs("attack", 31),
        new Ivs("defense", 31),
        new Ivs("special-attack", 31),
        new Ivs("special-defense", 31),
        new Ivs("speed", 31),
    ]

    evs: Evs[] = [
        new Evs("hp", 0),
        new Evs("attack", 0),
        new Evs("defense", 0),
        new Evs("special-attack", 0),
        new Evs("special-defense", 0),
        new Evs("speed", 0),
    ]
    stats: Stats[];
    moves: Moves[];
    moveset: (Moves | null)[] = [null, null, null, null];
    image_front: string;
    image_back: string;
    sprite: string;

    constructor(pdx_num: number, name: string, ability: Ability | null, abilitys: Ability[],
        lvl: number, gender: string, nature: string, shiny: boolean,
        types: string[], ivs: Ivs[], evs: Evs[], stats: Stats[], moves: Moves[], moveset: (Moves | null)[],
        image_front: string, image_back: string, sprite: string) {
        this.pdx_num = pdx_num;
        this.name = name;
        this.ability = ability;
        this.abilitys = abilitys;
        if (lvl < 1 || lvl > 100) {
            throw new Error(`Invalid level: ${lvl}`);
        }
        this.lvl = lvl;
        this.gender = gender;
        if (!Object.values(Natures).includes(nature as Natures)) {
            throw new Error(`Invalid Nature: ${nature}`);
        }
        this.nature = nature;
        this.shiny = shiny;
        this.types = types;
        this.stats = stats;
        this.ivs = ivs;
        this.evs = evs;
        this.moves = moves;
        this.moveset = [...moveset];
        this.image_front = image_front;
        this.image_back = image_back;
        this.sprite = sprite;
    }

    /*Getter*/
    getPdx_num(): number {
        return this.pdx_num;
    }

    getName(): string {
        return this.name;
    }

    getAbility(): Ability | null {
        return this.ability;
    }

    getAbilitys(): Ability[] {
        return this.abilitys;
    }
    getLvl(): number {
        return this.lvl;
    }

    getGender(): string {
        return this.gender;
    }

    getNature(): string {
        return this.nature;
    }

    getShiny(): boolean {
        return this.shiny;
    }

    getTypes(): string[] {
        return this.types;
    }

    getStats(): Stats[] {
        return this.stats;
    }

    getMoves(): Moves[] {
        return this.moves;
    }

    getMoveset(): (Moves | null)[] {
        return [...this.moveset];
    }

    getImage_front(): string {
        return this.image_front;
    }

    getImage_back(): string {
        return this.image_back;
    }

    getImage_pixel(): string {
        return this.sprite;
    }

    /*Setter*/
    setAbility(ability: Ability) {
        this.ability = ability;
    }
    setLvl(lvl: number) {
        if (lvl < 1 || lvl > 100) {
            throw new Error(`Invalid level: ${lvl}`);
        }
        this.lvl = lvl;
    }
    setGender(gender: string) {
        this.gender = gender;
    }
    setNature(nature: string) {
        if (!Object.values(Natures).includes(nature as Natures)) {
            throw new Error(`Invalid Nature: ${nature}`);
        }
        this.nature = nature;
    }
    setShiny(shiny: boolean) {
        this.shiny = shiny;
    }
    setStats(stats: Stats[]) {
        for (let i = 0; i < 6; i++) {
            if (stats[i].basestat < 0) {
                throw new Error(`Invalid stat: ${stats[i]}`);
            }
            this.stats[i].basestat = stats[i].basestat + this.ivs[i].value + this.evs[i].value / 4;
        }
    }
    setMoveset(index: number, move: Moves | null) {
        if (index >= 0 && index < 4) {
            this.moveset[index] = move;
        }
    }
    clone(): Pokemon {
        // Deep copy von Ability (null-safe)
        const clonedAbility = this.ability
            ? new Ability(this.ability.name, this.ability.effect)
            : null;

        // Deep copy der Abilitys
        const clonedAbilitys = this.abilitys.map(
            (ab) => new Ability(ab.name, ab.effect)
        );

        // Deep copy IVs
        const clonedIvs = this.ivs.map(iv => new Ivs(iv.name, iv.value));

        // Deep copy EVs
        const clonedEvs = this.evs.map(ev => new Evs(ev.name, ev.value));

        // Deep copy Stats
        const clonedStats = this.stats.map(stat => new Stats(stat.name, stat.basestat));

        // Deep copy Moves
        const clonedMoves = this.moves.map(
            (move) =>
                new Moves(move.name, move.type, move.power, move.accuracy, move.pp, move.damageClass)
        );

        // Deep copy Moveset (null-safe)
        const clonedMoveset = this.moveset.map(
            (move) =>
                move
                    ? new Moves(move.name, move.type, move.power, move.accuracy, move.pp, move.damageClass)
                    : null
        );

        // Rückgabe eines neuen Pokemon-Objekts mit denselben Werten
        return new Pokemon(
            this.pdx_num,
            this.name,
            clonedAbility,
            clonedAbilitys,
            this.lvl,
            this.gender,
            this.nature,
            this.shiny,
            [...this.types],
            clonedIvs,
            clonedEvs,
            clonedStats,
            clonedMoves,
            clonedMoveset,
            this.image_front,
            this.image_back,
            this.sprite
        );
    }
}

export class Ability {
    name: string;
    effect: string;

    constructor(name: string, effect: string) {
        this.name = name;
        this.effect = effect;
    }

    getName(): string {
        return this.name;
    }

    getEffect(): string {
        return this.effect;
    }
}

export class Stats {
    name: string;
    basestat: number;

    constructor(name: string, basestat: number) {
        this.name = name;
        this.basestat = basestat;
    }

    getName(): string {
        return this.name;
    }

    getBasestat(): number {
        return this.basestat;
    }
}
export class Ivs {
    name: string;
    value: number;
    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
    getName(): string {
        return this.name;
    }
    getValue(): number {
        return this.value;
    }
    setValue(value: number) {
        if (value < 0 || value > 31) {
            throw new Error(`Invalid IV: ${value}`);
        }
        this.value = value;
    }
}

export class Evs {
    name: string;
    value: number;
    constructor(name: string, value: number) {
        this.name = name;
        this.value = value;
    }
    getName(): string {
        return this.name;
    }
    getValue(): number {
        return this.value;
    }
    setValue(value: number) {
        if (value < 0 || value > 252) {
            throw new Error(`Invalid EV: ${value}`);
        }
        this.value = value;
    }
}
export class Moves {
    name: string;
    type: string;
    power: number;
    accuracy: number;
    pp: number;
    damageClass: string

    constructor(name: string, type: string, power: number, accuracy: number, pp: number, damageClass: string) {
        this.name = name;
        this.type = type;
        this.power = power;
        this.accuracy = accuracy;
        this.pp = pp;
        this.damageClass = damageClass;
    }
}
export const Natures = {
    hardy: "Hardy",
    lonely: "Lonely",
    brave: "Brave",
    adamant: "Adamant",
    naughty: "Naughty",
    bold: "Bold",
    relaxed: "Relaxed",
    impish: "Impish",
    lax: "Lax",
    timid: "Timid",
    hasty: "Hasty",
    jolly: "Jolly",
    naive: "Naive",
    modest: "Modest",
    mild: "Mild",
    quiet: "Quiet",
    rash: "Rash",
    calm: "Calm",
    gentle: "Gentle",
    sassy: "Sassy",
} as const;

type Natures = typeof Natures[keyof typeof Natures];