import './App.css';
import {
    Panel,
    PanelGroup,
    PanelResizeHandle,
} from "react-resizable-panels";
// import axios from 'axios';
// import { ReactNode } from "react";
// import {useState} from "react";


class Pokemon {
    pdx_num: number;
    name: string;
    types: string[];
    stats: Stats[];
    moves: Moves[];
    image_front: string;
    image_back: string;
    image_pixel: string;
    imagesize_W = "75px";
    imagesize_H = "75px";

    constructor(pdx_num: number, name: string, types: string[], stats: Stats[], moves: Moves[], image_front: string, image_back: string, image_pixel: string) {
        this.pdx_num = pdx_num;
        this.name = name;
        this.types = types;
        this.stats = stats;
        this.moves = moves;
        this.image_front = image_front;
        this.image_back = image_back;
        this.image_pixel = image_pixel;
    }
}

class Stats {
    name: string;
    basestat: number;

    constructor(name: string, basestat: number) {
        this.name = name;
        this.basestat = basestat;
    }
}

class Moves {
    name: string;
    type: string;
    power: number;
    accuracy: number;
    pp: number;
    damageclass: string

    constructor(name: string, type: string, power: number, accuracy: number, pp: number, damageclass: string) {
        this.name = name;
        this.type = type;
        this.power = power;
        this.accuracy = accuracy;
        this.pp = pp;
        this.damageclass = damageclass;
    }
}

// axios.get("https://localhost:7250/PokemonApi/Pokemon?limit=151&page=0").then((response: { data: any }) => {
//     console.log(response.data);
// });

const ditto = new Pokemon(
    132,
    "ditto",
    ["normal"],
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
    "",
    "",
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/132.png",
);

function Team({pos, onSquareClick, pokemon}: { pos: number, onSquareClick: () => void, pokemon: Pokemon | null }) {
    if (pokemon === null) {
        return (
            <div className="team-square-container"
                 style={{
                     background: "white",
                     marginRight: "10px",
                     marginTop: "10px",
                     width: "75px",
                     height: "75px",
                     display: "flex",
                     justifyContent: "center",
                     alignItems: "center",
                     overflow: "hidden",
                     borderRadius: "10px"
                 }}/>
        )
    }
    return (
        <div className="team-square-container"
             style={{
                 background: "white",
                 marginRight: "10px",
                 marginTop: "10px",
                 width: pokemon.imagesize_W,
                 height: pokemon.imagesize_H,
                 display: "flex",
                 justifyContent: "center",
                 alignItems: "center",
                 overflow: "hidden",
                 borderRadius: "10px"
             }}>
            <img
                className="team-square"
                onClick={onSquareClick}
                src={pokemon.image_pixel}
                alt={pos.toString()}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    transition: "all 0.3s ease",
                }}
            />
        </div>
    )
}

function P_List({pokemon}: { pokemon: Pokemon[] }) {
    const list = pokemon.map(pokemon => {
        return (
            <li
                key={pokemon.pdx_num}
                style={{
                    marginRight: "10px",
                    marginTop: "10px",
                    width: "50px",
                    height: "50px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                }}>
                <img
                    className="team-square"
                    src={pokemon.image_pixel}
                    alt={pokemon.pdx_num.toString()}
                    onClick={() => {
                        console.log("clicked")
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",

                    }}/>
            </li>
        );
    });
    return (
        <ul style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
        }}>
            {list}
        </ul>
    )
}

function Main() {
    const team: (Pokemon | null)[] = new Array(6).fill(null);
    return (
        <div className="App" style={{
            height: "100vh",
            width: "100vw",
        }}>
            <PanelGroup direction="horizontal">
                <Panel
                    defaultSize={50}
                    minSize={20}
                    maxSize={80}>
                    <div style={{
                        height: "100%",
                        backgroundColor: "darkgrey",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingTop: "25px",
                    }}>
                        <h1 style={{
                            color: "white",
                            fontSize: "25px",
                            fontWeight: "bold",
                            fontFamily: "Arial",
                        }}>Team Builder</h1>
                        <h2 style={{
                            alignItems: "center",
                            paddingTop: "25px",
                            paddingInline: "10px",
                            display: "flex",
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "center",
                        }}>
                            <Team pos={0}
                                  onSquareClick={() => {
                                      console.log("1")
                                  }}
                                  pokemon={ditto}/>
                            <Team
                                pos={1}
                                onSquareClick={() => {
                                    console.log("2")
                                }}
                                pokemon={team[1]}/>
                            <Team
                                pos={2}
                                onSquareClick={() => {
                                    console.log("3")
                                }}
                                pokemon={team[2]}/>
                            <Team
                                pos={3}
                                onSquareClick={() => {
                                    console.log("4")
                                }}
                                pokemon={team[3]}/>
                            <Team
                                pos={4}
                                onSquareClick={() => {
                                    console.log("5")
                                }}
                                pokemon={team[4]}/>
                            <Team
                                pos={5}
                                onSquareClick={() => {
                                    console.log("6")
                                }}
                                pokemon={team[5]}/>
                        </h2>
                        <h3 style={{
                            marginTop: window.innerHeight / 6,
                        }}>
                            <P_List pokemon={[ditto,ditto]}/>
                        </h3>

                    </div>
                </Panel>

                <PanelResizeHandle style={{background: "#ccc", width: "5px", cursor: "col-resize"}}/>
                <Panel>
                    <div style={{
                        background: "grey",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        flexDirection: "column",
                        paddingTop: "25px",
                    }}>
                        <h1 style={{
                            color: "white",
                            fontSize: "25px",
                            fontWeight: "bold",
                            fontFamily: "Arial",
                        }}>Information</h1>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
}

export default Main
