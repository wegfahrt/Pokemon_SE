export class Pokemon {
    pdx_num: number
    name: string
    ability: Ability | null
    abilitys: Ability[]
    lvl = 100
    gender = "Male"
    nature = "Hardy"
    shiny = false
    types: string[]
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
    stats: Stats[]
    moves: Moves[]
    moveset: (Moves | null)[] = [null, null, null, null]
    sprite: string
    sprite_back: string

    constructor(
        pdx_num: number,
        name: string,
        ability: Ability | null,
        abilitys: Ability[],
        lvl: number,
        gender: string,
        nature: string,
        shiny: boolean,
        types: string[],
        ivs: Ivs[],
        evs: Evs[],
        stats: Stats[],
        moves: Moves[],
        moveset: (Moves | null)[],
        sprite_back: string,
        sprite: string,
    ) {
        this.pdx_num = pdx_num
        this.name = name
        this.ability = ability
        this.abilitys = abilitys
        if (lvl < 1 || lvl > 100) {
            throw new Error(`Invalid level: ${lvl}`)
        }
        this.lvl = lvl
        this.gender = gender
        if (!Object.values(Natures).includes(nature as Natures)) {
            throw new Error(`Invalid Nature: ${nature}`)
        }
        this.nature = nature
        this.shiny = shiny
        this.types = types
        this.stats = stats
        this.ivs = ivs
        this.evs = evs
        this.moves = moves
        this.moveset = [...moveset]
        this.sprite = sprite
        this.sprite_back = sprite_back
    }

    /*Getter*/
    getPdx_num(): number {
        return this.pdx_num
    }

    getName(): string {
        return this.name
    }

    getAbility(): Ability | null {
        return this.ability
    }

    getAbilitys(): Ability[] {
        return this.abilitys
    }
    getLvl(): number {
        return this.lvl
    }

    getGender(): string {
        return this.gender
    }

    getNature(): string {
        return this.nature
    }

    getShiny(): boolean {
        return this.shiny
    }

    getTypes(): string[] {
        return this.types
    }

    getStats(): Stats[] {
        return this.stats
    }

    getMoves(): Moves[] {
        return this.moves
    }

    getMoveset(): (Moves | null)[] {
        return [...this.moveset]
    }

    getSprite(): string {
        return this.sprite
    }

    getSprite_back(): string {
        return this.sprite_back

    }

    /*Setter*/
    setAbility(ability: Ability) {
        this.ability = ability
    }
    setLvl(lvl: number) {
        if (lvl < 1 || lvl > 100) {
            throw new Error(`Invalid level: ${lvl}`)
        }
        this.lvl = lvl
    }
    setGender(gender: string) {
        this.gender = gender
    }
    setNature(nature: string) {
        if (!Object.values(Natures).includes(nature as Natures)) {
            throw new Error(`Invalid Nature: ${nature}`)
        }
        this.nature = nature
    }
    setShiny(shiny: boolean) {
        this.shiny = shiny
    }
    setStats(stats: Stats[]) {
        for (let i = 0; i < 6; i++) {
            if (stats[i].basestat < 0) {
                throw new Error(`Invalid stat: ${stats[i]}`)
            }
            this.stats[i].basestat = stats[i].basestat + this.ivs[i].value + this.evs[i].value / 4
        }
    }
    setMoveset(index: number, move: Moves | null) {
        if (index >= 0 && index < 4) {
            this.moveset[index] = move
        }
    }
    clone(): Pokemon {
        // Deep copy von Ability (null-safe)
        const clonedAbility = this.ability ? new Ability(this.ability.name, this.ability.effect) : null

        // Deep copy der Abilitys
        const clonedAbilitys = this.abilitys.map((ab) => new Ability(ab.name, ab.effect))

        // Deep copy IVs
        const clonedIvs = this.ivs.map((iv) => new Ivs(iv.name, iv.value))

        // Deep copy EVs
        const clonedEvs = this.evs.map((ev) => new Evs(ev.name, ev.value))

        // Deep copy Stats
        const clonedStats = this.stats.map((stat) => new Stats(stat.name, stat.basestat))

        // Deep copy Moves
        const clonedMoves = this.moves.map(
            (move) => new Moves(move.name, move.type, move.power, move.accuracy, move.pp, move.damageClass),
        )

        // Deep copy Moveset (null-safe)
        const clonedMoveset = this.moveset.map((move) =>
            move ? new Moves(move.name, move.type, move.power, move.accuracy, move.pp, move.damageClass) : null,
        )

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
            this.sprite,
            this.sprite_back,
        )
    }

    makeBattleReady(): Pokemon_in_battle {
        return new Pokemon_in_battle(
            this.getPdx_num(),
            this.getName(),
            this.getAbility(),
            this.getLvl(),
            this.getGender(),
            this.getNature(),
            this.getTypes(),
            this.getStats().find(stat => stat.getName() === "hp")?.getBasestat() || 0,
            this.getStats().find(stat => stat.getName() === "hp")?.getBasestat() || 0,
            this.getStats().find(stat => stat.getName() === "attack")?.getBasestat() || 0,
            this.getStats().find(stat => stat.getName() === "defense")?.getBasestat() || 0,
            this.getStats().find(stat => stat.getName() === "special-attack")?.getBasestat() || 0,
            this.getStats().find(stat => stat.getName() === "special-defense")?.getBasestat() || 0,
            this.getStats().find(stat => stat.getName() === "speed")?.getBasestat() || 0,
            this.getMoveset().filter(move => move !== null) as Moves[],
            this.getSprite(),
            this.getSprite_back(),
        )
    }
}

export class Pokemon_in_battle {
    id: string = crypto.randomUUID()
    pdx_num: number
    name: string
    ability: Ability | null
    lvl = 100
    gender = "Male"
    nature = "Hardy"
    types: string[]
    currentHP: number;
    maxHP: number;
    attack: number;
    defense: number;
    special_attack: number;
    special_defense: number;
    speed: number;
    moveset: Moves[] = [];
    sprite: string;
    sprite_back: string;
    constructor(
        pdx_num: number,
        name: string,
        ability: Ability | null,
        lvl: number,
        gender: string,
        nature: string,
        types: string[],
        currentHP: number,
        maxHP: number,
        attack: number,
        defense: number,
        special_attack: number,
        special_defense: number,
        speed: number,
        moveset: (Moves)[],
        sprite: string,
        sprite_back: string,
    ) {
        this.pdx_num = pdx_num
        this.name = name
        this.ability = ability
        this.lvl = lvl
        this.gender = gender
        this.nature = nature
        this.types = types
        this.currentHP = currentHP
        this.maxHP = maxHP
        this.attack = attack
        this.defense = defense
        this.special_attack = special_attack
        this.special_defense = special_defense
        this.speed = speed
        this.moveset = moveset
        this.sprite = sprite
        this.sprite_back = sprite_back

    }
    getPdx_num(): number {
        return this.pdx_num
    }
    getName(): string {
        return this.name
    }
    getAbility(): Ability | null {
        return this.ability
    }
    getLvl(): number {
        return this.lvl
    }
    getGender(): string {
        return this.gender
    }
    getNature(): string {
        return this.nature
    }
    getTypes(): string[] {
        return this.types
    }
    getCurrentHP(): number {
        return this.currentHP
    }
    getMaxHP(): number {
        return this.maxHP
    }
    getAttack(): number {
        return this.attack
    }
    getDefense(): number {
        return this.defense
    }
    getSpecialAttack(): number {
        return this.special_attack
    }
    getSpecialDefense(): number {
        return this.special_defense
    }
    getSpeed(): number {
        return this.speed
    }
    getMoveset(): Moves[] {
        return this.moveset
    }
    getSprite(): string {
        return this.sprite
    }
    getSprite_back(): string {
        return this.sprite_back

    }
    setCurrentHP(currentHP: number) {
        if (currentHP < 0 || currentHP > this.maxHP) {
            throw new Error(`Invalid current HP: ${currentHP}`)
        }
        this.currentHP = currentHP
    }
    setCurrentPP(moveName: string, pp: number) {
        const move = this.moveset.find(m => m.name === moveName)
        if (move) {
            move.current_pp = pp
        }
    }
    getCurrentPP(moveName: string): number {
        const move = this.moveset.find(m => m.name === moveName)
        if (move) {
            return move.current_pp
        }
        throw new Error(`Move not found: ${moveName}`)
    }

    clone(): Pokemon_in_battle {
        // Deep copy von Ability (null-safe)
        const clonedAbility = this.ability ? new Ability(this.ability.name, this.ability.effect) : null

        // Deep copy Moves
        const clonedMoveset = this.moveset.map(
            (move) => new Moves(move.name, move.type, move.power, move.accuracy, move.pp, move.damageClass, move.current_pp),
        )

        // Rückgabe eines neuen Pokemon_in_battle-Objekts mit denselben Werten
        return new Pokemon_in_battle(
            this.pdx_num,
            this.name,
            clonedAbility,
            this.lvl,
            this.gender,
            this.nature,
            this.types,
            this.currentHP,
            this.maxHP,
            this.attack,
            this.defense,
            this.special_attack,
            this.special_defense,
            this.speed,
            clonedMoveset,
            this.sprite,
            this.sprite_back,
        )
    }
}

export class Ability {
    name: string
    effect: string

    constructor(name: string, effect: string) {
        this.name = name
        this.effect = effect
    }

    getName(): string {
        return this.name
    }

    getEffect(): string {
        return this.effect
    }
}

export class Stats {
    name: string
    basestat: number

    constructor(name: string, basestat: number) {
        this.name = name
        this.basestat = basestat
    }

    getName(): string {
        return this.name
    }

    getBasestat(): number {
        return this.basestat
    }
}

export class Ivs {
    name: string
    value: number
    constructor(name: string, value: number) {
        this.name = name
        this.value = value
    }
    getName(): string {
        return this.name
    }
    getValue(): number {
        return this.value
    }
    setValue(value: number) {
        if (value < 0 || value > 31) {
            throw new Error(`Invalid IV: ${value}`)
        }
        this.value = value
    }
}

export class Evs {
    name: string
    value: number
    constructor(name: string, value: number) {
        this.name = name
        this.value = value
    }
    getName(): string {
        return this.name
    }
    getValue(): number {
        return this.value
    }
    setValue(value: number) {
        if (value < 0 || value > 252) {
            throw new Error(`Invalid EV: ${value}`)
        }
        this.value = value
    }
}

export class Moves {
    name: string
    type: string
    power: number
    accuracy: number
    current_pp: number
    pp: number
    damageClass: string

    constructor(name: string, type: string, power: number, accuracy: number, pp: number, damageClass: string, current_pp: number = pp) {
        this.name = name
        this.type = type
        this.power = power
        this.accuracy = accuracy
        this.pp = pp
        this.current_pp = current_pp ? current_pp : pp
        this.damageClass = damageClass
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
} as const

export type Natures = (typeof Natures)[keyof typeof Natures]
