import './App.css';
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from "react-resizable-panels";
import Dropdown from "./components/Dropdown/Dropdown.tsx";
import DropdownItem from "./components/DropdownItem/DropdownItem.tsx";
import { useState } from "react";
import Chart, {
    Series,
    ArgumentAxis,
    ValueAxis,
    CommonSeriesSettings,
    Label,
    Tooltip,
    Title
} from 'devextreme-react/chart';

function capitalize(str?: string): string {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
}

class Pokemon {
    pdx_num: number;
    name: string;
    ability: Ability | null;
    abilitys: Ability[];
    lvl: number = 100;
    gender: string = "Male";
    nature: string = "Hardy";
    shiny: boolean = false;
    types: string[];
    stats: Stats[];
    moves: Moves[];
    moveset: Moves[] | null = new Array(4).fill(null);
    image_front: string;
    image_back: string;
    image_pixel: string;

    constructor(pdx_num: number, name: string, ability: Ability | null, abilitys: Ability[],
        lvl: number, gender: string, nature: string, shiny: boolean,
        types: string[], stats: Stats[], moves: Moves[], moveset: Moves[] | null,
        image_front: string, image_back: string, image_pixel: string) {
        this.pdx_num = pdx_num;
        this.name = name;
        this.ability = ability;
        this.abilitys = abilitys;
        if (lvl < 1 || lvl > 100) {
            throw new Error("Invalid level: ${ lvl }");
        }
        this.lvl = lvl;
        this.gender = gender;
        if (!Object.values(Natures).includes(nature as Natures)) {
            throw new Error("Invalid Nature: ${ nature }");
        }
        this.nature = nature;
        this.shiny = shiny;
        this.types = types;
        this.stats = stats;
        this.moves = moves;
        this.moveset = moveset;
        this.image_front = image_front;
        this.image_back = image_back;
        this.image_pixel = image_pixel;
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

    getMoveset(): Moves[] | null {
        return this.moveset;
    }

    getImage_front(): string {
        return this.image_front;
    }

    getImage_back(): string {
        return this.image_back;
    }

    getImage_pixel(): string {
        return this.image_pixel;
    }

    /*Setter*/
    setPdx_num(pdx_num: number) {
        this.pdx_num = pdx_num;
    }

    setName(name: string) {
        this.name = name;
    }
    setAbility(ability: Ability) {
        this.ability = ability;
    }
    setLvl(lvl: number) {
        if (lvl < 1 || lvl > 100) {
            throw new Error("Invalid level: ${ lvl }");
        }
        this.lvl = lvl;
    }

    setGender(gender: string) {
        this.gender = gender;
    }

    setNature(nature: string) {
        if (!Object.values(Natures).includes(nature as Natures)) {
            throw new Error("Invalid Nature: ${ nature }");
        }
        this.nature = nature;
    }

    setShiny(shiny: boolean) {
        this.shiny = shiny;
    }

    setStats(stats: Stats[]) {
        this.stats = stats;
    }

    setMoveset(index: number, move: Moves) {
        if (index >= 0 && index < 4 && this.moveset !== null) {
            this.moveset[index] = move;
        }
    }

    setImage_front(image_front: string) {
        this.image_front = image_front;
    }

    setImage_back(image_back: string) {
        this.image_back = image_back;
    }

    setImage_pixel(image_pixel: string) {
        this.image_pixel = image_pixel;
    }
}

class Ability {
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
class Stats {
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

class Moves {
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

// axios.get("https://localhost:7250/PokemonApi/Pokemon?limit=151&page=0").then((response: { data: any }) => {
//     console.log(response.data);
// });

enum Natures {
    hardy = "Hardy",
    lonely = "Lonely",
    brave = "Brave",
    adamant = "Adamant",
    naughty = "Naughty",
    bold = "Bold",
    relaxed = "Relaxed",
    impish = "Impish",
    lax = "Lax",
    timid = "Timid",
    hasty = "Hasty",
    jolly = "Jolly",
    naive = "Naive",
    modest = "Modest",
    mild = "Mild",
    quiet = "Quiet",
    rash = "Rash",
    calm = "Calm",
    gentle = "Gentle",
    sassy = "Sassy",
}

const allNatures = Object.values(Natures);

const ditto = new Pokemon(
    132,
    "Ditto",
    null,
    [new Ability("none", "No special ability")],
    100,
    "none",
    "Hardy",
    false,
    ["Normal",],
    [
        new Stats("hp", 60),
        new Stats("attack", 48),
        new Stats("defense", 18),
        new Stats("special-attack", 120),
        new Stats("special-defense", 20),
        new Stats("speed", 48),
    ],
    [
        new Moves("transform", "normal", 0, 100, 10, "status"),
    ],
    null,
    "",
    "",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
);

const test = new Pokemon(
    1,
    "DEINEE MAMMI",
    null,
    [new Ability("none", "No special ability")],
    100,
    "none",
    "Hardy",
    false,
    ["Normal",],
    [
        new Stats("hp", 48),
        new Stats("attack", 48),
        new Stats("defense", 48),
        new Stats("special-attack", 48),
        new Stats("special-defense", 48),
        new Stats("speed", 48),
    ],
    [
        new Moves("transform", "normal", 0, 100, 10, "status"),
    ],
    null,
    "",
    "",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
);

function Team({ pos, onClick, pokemon }: { pos: number, onClick: () => void, pokemon: Pokemon | null }) {
    if (pokemon === null) {
        return (
            <div className="team-square-container" />
        )
    }
    return (
        <div className="team-square-container">
            <img
                className="team-square"
                onClick={onClick}
                src={pokemon.image_pixel}
                alt={pos.toString()} />
        </div>
    )
}

function Pokedex({ pokemon, onSelect }: { pokemon: Pokemon[], onSelect: (pokemon: Pokemon) => void }) {
    const list = pokemon.map(pokemon => {
        return (
            <li
                className="pokedex-item"
                key={pokemon.pdx_num}>
                <img
                    className="team-square"
                    src={pokemon.image_pixel}
                    alt={pokemon.pdx_num.toString()}
                    onClick={() => {
                        onSelect(pokemon);
                    }} />
            </li>
        );
    });
    return (
        <ul className={"pokedex-list"}>
            {list}
        </ul>
    )
}

function Pokemon_info({ pokemon, setPokemon }: { pokemon: Pokemon, setPokemon: (pokemon: Pokemon) => void }) {
    const update = (updateFn: (p: Pokemon) => void) => {
        const clone = new Pokemon(
            pokemon.pdx_num, pokemon.name, pokemon.ability, pokemon.abilitys, pokemon.lvl, pokemon.gender, pokemon.nature, pokemon.shiny,
            [...pokemon.types], [...pokemon.stats], [...pokemon.moves], pokemon.moveset ? [...pokemon.moveset] : new Array(4).fill(null),
            pokemon.image_front, pokemon.image_back, pokemon.image_pixel
        );
        updateFn(clone);
        setPokemon(clone);
    };
    return (
        <div className="pokemon-info-container">
            <div className="pokemon-image-wrapper">
                <div className="pokemon-name">{pokemon.name}</div>
                <div className="pokemon-background">
                    <img
                        className="pokemon-info-image"
                        src={pokemon.image_pixel}
                        alt={pokemon.pdx_num.toString()} />
                </div>
                <div className="pokemon-types">
                    {pokemon.types.map((type, index) => (
                        <span key={type} style={{
                            paddingLeft: "5px",
                            paddingRight: "5px",
                            borderLeft: index > 0 ? "1px solid black" : "none",
                        }}>{type}</span>
                    ))}
                </div>
            </div>
            <div className="pokemon-general-info">
                <div className='pokemon-info-row'>
                    <div className="info-title">Ability</div>
                    <div className="info-title">Level</div>
                    <div className="info-title">Gender</div>
                    <div className="info-title">Nature</div>
                    <div className="info-title">Shiny</div>
                    <Dropdown buttontext={pokemon.ability ? capitalize(pokemon.ability.name) : "No Ability"} content={[
                        <DropdownItem
                            key="none"
                            onClick={() => {
                                update(p => {
                                    p.setAbility(null as any);
                                });
                            }}>
                            — None —
                        </DropdownItem>,
                        ...pokemon.abilitys
                            .filter(ability => ability.name !== pokemon.ability?.name)
                            .map((ability) => (
                                <DropdownItem
                                    key={ability.name}
                                    onClick={() => {
                                        update(p => {
                                            p.setAbility(ability);
                                        });
                                    }}>
                                    {capitalize(ability.name)}
                                </DropdownItem>
                            ))]
                    } />
                    <Dropdown buttontext={pokemon.lvl.toString()} content={
                        Array.from({ length: 100 }, (_, i) => i + 1).map(i => (
                            <DropdownItem
                                key={i}
                                onClick={() => {
                                    update(p => {
                                        p.setLvl(i);
                                    })
                                }}>
                                {i}
                            </DropdownItem>
                        ))
                    } />
                    <Dropdown buttontext={pokemon.gender} content={
                        ["None", "Male", "Female"].map(gender => (
                            <DropdownItem
                                key={gender}
                                onClick={() => {
                                    update(p => {
                                        p.setGender(gender);
                                    })
                                }}>
                                {gender}
                            </DropdownItem>
                        ))
                    } />
                    <Dropdown buttontext={pokemon.nature} content={
                        allNatures.map(nature => (
                            <DropdownItem
                                key={nature}
                                onClick={() => {
                                    update(p => {
                                        p.setNature(nature);
                                    })
                                }}>
                                {nature}
                            </DropdownItem>
                        ))
                    } />
                    <Dropdown buttontext={pokemon.shiny ? "Yes" : "No"} content={
                        ["Yes", "No"].map(shiny => (
                            <DropdownItem
                                key={shiny}
                                onClick={() => {
                                    update(p => {
                                        p.setShiny(shiny === "Yes");
                                    })
                                }}>
                                {shiny}
                            </DropdownItem>
                        ))
                    } />
                </div>
                <div className="pokemon-moveset">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Dropdown
                            key={index}
                            buttontext={
                                pokemon.getMoveset()?.[index]?.name
                                    ? capitalize(pokemon.getMoveset()![index]!.name)
                                    : `Move ${index + 1}`
                            }
                            content={[
                                <DropdownItem
                                    key="none"
                                    onClick={() => {
                                        update(p => {
                                            if (p.getMoveset()) {
                                                p.setMoveset(index, null as any);
                                            }
                                        });
                                    }}>
                                    — None —
                                </DropdownItem>,
                                ...pokemon.moves.filter(move => {
                                    return !pokemon.getMoveset()?.some((m, i) => m?.name === move.name && i !== index);
                                }).map((move) => (
                                    <DropdownItem
                                        key={move.name}
                                        onClick={() =>
                                            update(p => {
                                                p.setMoveset(index, move);
                                            })
                                        }>
                                        {capitalize(move.name)}
                                    </DropdownItem>
                                ))
                            ]}
                        />
                    ))}
                </div>
                <div className="pokemon-stats">
                    <Chart
                        dataSource={pokemon.stats}
                        rotated={true}
                        height={200}
                        width="100%">
                        <Series
                            valueField="basestat"
                            argumentField="name"
                            type="bar"
                            color="#009688" />
                        <ArgumentAxis>
                            <Label customizeText={(arg) => capitalize(String(arg.value))} />
                        </ArgumentAxis>
                        <ValueAxis />
                        <Title text="Base Stats" />
                        <Tooltip enabled={true} />
                    </Chart>
                </div>
            </div>
        </div>
    )
}

function Main() {
    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
    const [team, setTeam] = useState<(Pokemon | null)[]>(new Array(6).fill(null));

    return (
        <div className="App">
            <PanelGroup direction="horizontal">
                <Panel
                    defaultSize={50}
                    minSize={20}
                    maxSize={65}>
                    <div className="team-builder">
                        <h1 className="team-builder-title">Team Builder</h1>
                        <h2 className="team-builder-team-container">
                            {team.map((poke, index) => (
                                <Team
                                    key={index}
                                    pos={index}
                                    onClick={() => {
                                        if (poke !== null) {
                                            const clonedPokemon = new Pokemon(
                                                poke.pdx_num,
                                                poke.name,
                                                poke.ability,
                                                poke.abilitys,
                                                poke.lvl,
                                                poke.gender,
                                                poke.nature,
                                                poke.shiny,
                                                [...poke.types],
                                                [...poke.stats],
                                                [...poke.moves],
                                                poke.moveset ? [...poke.moveset] : new Array(4).fill(null),
                                                poke.image_front,
                                                poke.image_back,
                                                poke.image_pixel
                                            );
                                            setSelectedPokemon(clonedPokemon);
                                        }
                                    }}
                                    pokemon={poke}
                                />))}
                        </h2>
                        <h3 className="pokedex">
                            <Pokedex pokemon={[ditto, test]} onSelect={(pokemon: Pokemon) => {
                                const clonedPokemon = new Pokemon(
                                    pokemon.pdx_num,
                                    pokemon.name,
                                    pokemon.ability,
                                    pokemon.abilitys,
                                    pokemon.lvl,
                                    pokemon.gender,
                                    pokemon.nature,
                                    pokemon.shiny,
                                    [...pokemon.types],
                                    [...pokemon.stats],
                                    [...pokemon.moves],
                                    pokemon.moveset ? [...pokemon.moveset] : new Array(4).fill(null),
                                    pokemon.image_front,
                                    pokemon.image_back,
                                    pokemon.image_pixel,
                                )
                                setSelectedPokemon(clonedPokemon);
                            }} />
                        </h3>

                    </div>
                </Panel>

                <PanelResizeHandle className="resize-handle" />

                <Panel>
                    <div className="pokemon-info">
                        <h1 className="pokemon-info-title">Information</h1>
                        {selectedPokemon && <Pokemon_info pokemon={selectedPokemon} setPokemon={setSelectedPokemon} />}
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}

export default Main 